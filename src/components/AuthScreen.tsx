import React, { useState } from 'react'; // Updated Auth Component
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import logo from '../assets/logo.png';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card glass-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="auth-header">
          <img src={logo} alt="ProInvoice" className="auth-logo" />
          <h1>ProInvoice</h1>
          <p>{isLogin ? 'Welcome back! Please login to your account.' : 'Create your account to get started.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            type="submit" 
            className="btn-primary auth-submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            <ArrowRight size={18} />
          </motion.button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <motion.button 
          className="btn-google"
          onClick={handleGoogleSignIn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Globe size={18} /> Continue with Google
        </motion.button>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </motion.div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-main);
          padding: 20px;
        }
        .auth-card {
          max-width: 400px;
          width: 100%;
          padding: 40px;
          background: var(--white);
          border-radius: 24px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .auth-logo {
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
        }
        .auth-header h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 8px;
        }
        .auth-header p {
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .input-group {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .input-group input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border-radius: 12px;
          border: 1px solid var(--border);
          font-size: 0.875rem;
        }
        .input-group input:focus {
          border-color: var(--primary);
          outline: none;
          box-shadow: 0 0 0 3px var(--secondary);
        }
        .error-message {
          background: #fee2e2;
          color: #ef4444;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          text-align: center;
        }
        .auth-submit {
          width: 100%;
          justify-content: center;
          padding: 14px;
          margin-top: 8px;
        }
        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: var(--text-muted);
          font-size: 0.75rem;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .divider span {
          padding: 0 12px;
        }
        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--white);
          color: var(--text-main);
          font-weight: 600;
          font-size: 0.875rem;
        }
        .btn-google:hover {
          background: var(--bg-subtle);
        }
        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .auth-footer button {
          background: none;
          color: var(--primary);
          font-weight: 600;
          padding: 0 4px;
        }
        .auth-footer button:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
