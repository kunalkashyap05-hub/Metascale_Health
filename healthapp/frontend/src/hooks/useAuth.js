import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth — Metascale Global Identity Hook.
 * Separated to src/hooks/ to satisfy Vite's React-Refresh constraints.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
