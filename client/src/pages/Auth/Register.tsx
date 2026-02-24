import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register, clearError } from '@/store/slices/authSlice';

import styles from './Auth.module.css';
interface RegisterProps {
  onToggle: () => void;
}

export default function Register({ onToggle }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(register({ email, password, phone }));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <h2 className={styles.title}>Register</h2>
      <p className={styles.subtitle}>Create your account to check scheme eligibility</p>
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="register-email" className={styles.label}>
            Email
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div>
          <label htmlFor="register-password" className={styles.label}>
            Password
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            minLength={8}
          />
        </div>

        <div>
          <label htmlFor="register-phone" className={styles.label}>
            Phone (Optional)
          </label>
          <input
            id="register-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className={styles.footer}>
        Already have an account?{' '}
        <button type="button" onClick={onToggle}>
          Login
        </button>
      </p>
    </>
  );
}
