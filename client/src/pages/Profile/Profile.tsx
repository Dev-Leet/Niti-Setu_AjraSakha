import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchProfile, updateProfile } from '@store/slices/profileSlice';
import { profileSchema, ProfileInput } from '@utils/validators';
import { Input } from '@components/common/Input/Input';
import { Button } from '@components/common/Button/Button';
import { Card } from '@components/common/Card/Card';
import { Loader } from '@components/common/Loader/Loader';
import styles from './Profile.module.css';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.profile);
 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        state: profile.state,
        district: profile.district,
        pincode: profile.pincode,
        totalArea: profile.landholding.totalArea,
        cropTypes: profile.cropTypes,
        socialCategory: profile.socialCategory as 'General' | 'SC' | 'ST' | 'OBC',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileInput) => {
    await dispatch(updateProfile(data));
    navigate('/dashboard');
  };

  if (loading && !profile) {
    return <Loader fullScreen />;
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1>Edit Profile</h1>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
        </div>

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
              <option value="pulses">Pulses</option>
              <option value="oilseeds">Oilseeds</option>
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

          <div className={styles.actions}>
            <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};