import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import '../styles/login.css';

const isPasswordStrong = (password) => {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
};

function ResetPassword() {
  const [token, setToken] = useState('');
  const [serverMsg, setServerMsg] = useState('');
  const [serverStatus, setServerStatus] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get('token');

    if (t) {
      setToken(t);
    } else {
      setServerMsg('Missing reset token.');
      setServerStatus('error');
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields }
  } = useForm({
    mode: 'onChange'
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    if (!token) return;

    try {
      const res = await fetch('/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: data.password }),
      });

      const result = await res.json();
      setServerMsg(result.message);
      setServerStatus(res.ok ? 'success' : 'error');
    } catch (err) {
      console.error(err);
      setServerMsg('Server error. Please try again.');
      setServerStatus('error');
    }
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="brand-pill">Bidme</div>

        <h1>
          Set a new
          <br />
          password.
        </h1>

        <p>
          Choose a strong password with at least 8 characters, including a
          letter, a number, and a special character.
        </p>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
          <div className="login-card-header">
            <h2>Reset Password</h2>
            <p>Create a secure password for your account</p>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className={
                touchedFields.password
                  ? errors.password
                    ? 'input-error'
                    : 'input-valid'
                  : ''
              }
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Must be at least 8 characters'
                },
                validate: (val) =>
                  (/[A-Za-z]/.test(val) &&
                    /\d/.test(val) &&
                    /[@$!%*?&]/.test(val)) ||
                  'Must include a letter, number, and special character'
              })}
            />

            {errors.password && (
              <p className="input-hint">{errors.password.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter new password"
              className={
                touchedFields.confirm
                  ? errors.confirm
                    ? 'input-error'
                    : 'input-valid'
                  : ''
              }
              {...register('confirm', {
                required: 'Please confirm your password',
                validate: (val) => {
                  if (val !== password) return 'Passwords do not match';
                  if (!isPasswordStrong(password)) return 'Password is not strong enough';
                  return true;
                }
              })}
            />

            {errors.confirm && (
              <p className="input-hint">{errors.confirm.message}</p>
            )}
          </div>

          <button type="submit" className="login-button" disabled={!token}>
            Reset Password
          </button>

          {serverMsg && (
            <p className={`login-message ${serverStatus}`}>
              {serverMsg}
            </p>
          )}

          <div className="signup-row">
            <span>Remember your password?</span>
            <Link to="/login">Back to Sign In</Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ResetPassword;