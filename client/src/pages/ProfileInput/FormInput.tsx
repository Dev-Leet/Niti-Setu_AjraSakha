/* import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@store/hooks';
import { createProfile } from '@store/slices/profileSlice';
import { checkEligibility } from '@store/slices/eligibilitySlice';
import { profileSchema, ProfileInput as ProfileData } from '@utils/validators';
import { Input } from '@components/common/Input/Input';
import { Button } from '@components/common/Button/Button';
import styles from './ProfileInput.module.css';
 
export const FormInput: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileData) => {
    const profilePayload = {
      ...data,
      landholding: {
        totalArea: data.totalArea,
        ownershipType: 'owned',
      },
    };
    const profileResult = await dispatch(createProfile(profilePayload));
    if (createProfile.fulfilled.match(profileResult)) {
      await dispatch(checkEligibility(profileResult.payload.id));
      navigate('/results');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        label="Full Name"
        placeholder="Enter your name"
        error={errors.fullName?.message}
        {...register('fullName')}
        fullWidth
      />

      <div className={styles.row}>
        <Input
          label="State"
          placeholder="Select state"
          error={errors.state?.message}
          {...register('state')}
          fullWidth
        />
        <Input
          label="District"
          placeholder="Select district"
          error={errors.district?.message}
          {...register('district')}
          fullWidth
        />
      </div>

      <div className={styles.row}>
        <Input
          label="Pincode"
          placeholder="123456"
          error={errors.pincode?.message}
          {...register('pincode')}
          fullWidth
        />
        <Input
          label="Total Land (acres)"
          type="number"
          step="0.01"
          placeholder="5.5"
          error={errors.totalArea?.message}
          {...register('totalArea', { valueAsNumber: true })}
          fullWidth
        />
      </div>

      <div className={styles.field}>
        <label>Crop Types</label>
        <select {...register('cropTypes')} multiple className={styles.select}>
          <option value="rice">Rice</option>
          <option value="wheat">Wheat</option>
          <option value="cotton">Cotton</option>
          <option value="sugarcane">Sugarcane</option>
          <option value="maize">Maize</option>
        </select>
        {errors.cropTypes && <span className={styles.error}>{errors.cropTypes.message}</span>}
      </div>

      <div className={styles.field}>
        <label>Social Category</label>
        <select {...register('socialCategory')} className={styles.select}>
          <option value="General">General</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="OBC">OBC</option>
        </select>
        {errors.socialCategory && (
          <span className={styles.error}>{errors.socialCategory.message}</span>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
        Check Eligibility
      </Button>
    </form>
  );
}; */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button/Button';
import { useAppDispatch } from '@store/hooks';
import { checkEligibility } from '@store/slices/eligibilitySlice';

export const FormInput = () => {
  const [profile, setProfile] = useState({
    state: '',
    district: '',
    landholding: 0,
    cropTypes: [] as string[],
    socialCategory: '',
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const schemeIds = ['scheme-1', 'scheme-2'];

    const result = await dispatch(checkEligibility({
      schemeIds,
      profile,
    }));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/results');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="profile-state" className="block text-sm font-medium mb-1">State</label>
<input
id="profile-state"
name="state"
type="text"
placeholder="e.g., Karnataka"
value={profile.state}
onChange={(e) => setProfile({ ...profile, state: e.target.value })}
className="w-full px-3 py-2 border rounded"
required
/>
      </div>

      <div>
        <label htmlFor="profile-district" className="block text-sm font-medium mb-1">District</label>
<input
id="profile-district"
name="district"
type="text"
placeholder="e.g., Bengaluru Rural"
value={profile.district}
onChange={(e) => setProfile({ ...profile, district: e.target.value })}
className="w-full px-3 py-2 border rounded"
required
/>
      </div>

      <div>
        <label htmlFor="profile-landholding" className="block text-sm font-medium mb-1">Land Holding (acres)</label>
<input
id="profile-landholding"
name="landholding"
type="number"
placeholder="e.g., 5.5"
value={profile.landholding}
onChange={(e) => setProfile({ ...profile, landholding: Number(e.target.value) })}
className="w-full px-3 py-2 border rounded"
required
/>
      </div>

      <div>
        <label htmlFor="profile-socialCategory" className="block text-sm font-medium mb-1">Social Category</label>
<select
id="profile-socialCategory"
name="socialCategory"
value={profile.socialCategory}
onChange={(e) => setProfile({ ...profile, socialCategory: e.target.value })}
className="w-full px-3 py-2 border rounded"
required
        >
          <option value="">Select Category</option>
          <option value="General">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>
      </div>

      <Button type="submit">Check Eligibility</Button>
    </form>
  );
};