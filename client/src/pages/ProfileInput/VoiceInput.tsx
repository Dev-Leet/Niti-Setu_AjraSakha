/* import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceRecorder } from '@components/features/VoiceRecorder/VoiceRecorder';
import { voiceService } from '@services/voice.service';
import { useAppDispatch } from '@store/hooks';
import { createProfile } from '@store/slices/profileSlice';
import { checkEligibility } from '@store/slices/eligibilitySlice';
import { Button } from '@components/common/Button/Button';
import { Input } from '@components/common/Input/Input';
import type { ExtractedProfileData } from './types';
import styles from './ProfileInput.module.css';
 
export const VoiceInput: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [extractedData, setExtractedData] = useState<ExtractedProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTranscript = async (transcript: string) => {
    setLoading(true);
    try {
      const data = await voiceService.extractProfile(transcript);
      setExtractedData(data);
    } catch (error) {
      console.error('Extraction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!extractedData) return;
    
    setLoading(true);
    const profilePayload = {
      fullName: extractedData.fullName || '',
      state: extractedData.state || '',
      district: extractedData.district || '',
      pincode: extractedData.pincode || '',
      landholding: {
        totalArea: extractedData.landholding || 0,
        ownershipType: 'owned',
      },
      cropTypes: extractedData.cropTypes || [],
      socialCategory: extractedData.socialCategory || 'General',
    };
    
    const profileResult = await dispatch(createProfile(profilePayload));
    if (createProfile.fulfilled.match(profileResult)) {
      await dispatch(checkEligibility(profileResult.payload.id));
      navigate('/results');
    }
    setLoading(false);
  };

  return (
    <div className={styles.voiceContainer}>
      <VoiceRecorder onTranscript={handleTranscript} />

      {extractedData && (
        <div className={styles.confirmation}>
          <h3>Please confirm your details:</h3>
          <div className={styles.confirmGrid}>
            <Input
              label="Name"
              value={extractedData.fullName || ''}
              onChange={(e) => setExtractedData({ ...extractedData, fullName: e.target.value })}
              fullWidth
            />
            <Input
              label="State"
              value={extractedData.state || ''}
              onChange={(e) => setExtractedData({ ...extractedData, state: e.target.value })}
              fullWidth
            />
            <Input
              label="District"
              value={extractedData.district || ''}
              onChange={(e) => setExtractedData({ ...extractedData, district: e.target.value })}
              fullWidth
            />
            <Input
              label="Land (acres)"
              type="number"
              value={extractedData.landholding || ''}
              onChange={(e) => setExtractedData({ ...extractedData, landholding: parseFloat(e.target.value) })}
              fullWidth
            />
          </div>
          
          <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} loading={loading}>
            Confirm & Check Eligibility
          </Button>
        </div>
      )}
    </div>
  );
};  */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceRecorder } from '@/components/features/VoiceRecorder/VoiceRecorder';
import { Button } from '@/components/common/Button/Button';
import { useAppDispatch } from '@store/hooks';
import { checkEligibility } from '@store/slices/eligibilitySlice';
import type { VoiceProfile, ValidationResult } from '@/types/api.types';

interface ExtractedProfileData {
  profile: VoiceProfile;
  validation: ValidationResult;
}

export const VoiceInput = () => {
  const [extractedData, setExtractedData] = useState<ExtractedProfileData | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleTranscript = (data: { profile: VoiceProfile; validation: ValidationResult }) => {
    setExtractedData(data);
  };

  const handleSubmit = async () => {
    if (!extractedData?.profile) return;

    const schemeIds = ['scheme-1', 'scheme-2'];

    const result = await dispatch(checkEligibility({
      schemeIds,
      profile: extractedData.profile,
      
    }));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/results');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Voice Input</h2>
        <VoiceRecorder onTranscript={handleTranscript} />
      </div>

      {extractedData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Extracted Profile</h3>
          <dl className="space-y-2">
            {Object.entries(extractedData.profile).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <dt className="font-medium">{key}:</dt>
                <dd>{JSON.stringify(value)}</dd>
              </div>
            ))}
          </dl>

          {extractedData.validation && !extractedData.validation.isValid && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded">
              <p className="font-medium">Validation Issues:</p>
              <ul className="list-disc list-inside">
                {extractedData.validation.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={handleSubmit} className="mt-6">
            Check Eligibility
          </Button>
        </div>
      )}
    </div>
  );
};