import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { register as registerUser } from '@store/slices/authSlice';
import { registerSchema, RegisterInput } from '@utils/validators';
import { Input } from '@components/common/Input/Input';
import { Button } from '@components/common/Button/Button';
import styles from './Auth.module.css';
 
export const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      navigate('/profile');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>
        <p className={styles.subtitle}>Create your account to get started</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="farmer@example.com"
            error={errors.email?.message}
            {...register('email')}
            fullWidth
          />

          <Input
            label="Phone (Optional)"
            type="tel"
            placeholder="9876543210"
            error={errors.phone?.message}
            {...register('phone')}
            fullWidth
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
            fullWidth
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
            fullWidth
          />

          {error && <div className={styles.error}>{error}</div>}

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Register
          </Button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};