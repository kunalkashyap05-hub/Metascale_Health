import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// ─── LAZY PAGE IMPORTS ────────────────────────────────────────────────────────
// Prevents a single module's minification issue from crashing the entire app.

const LandingPage        = lazy(() => import('./pages/LandingPage'));
const LoginPage          = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage       = lazy(() => import('./pages/auth/RegisterPage'));

const PatientDashboard    = lazy(() => import('./pages/patient/PatientDashboard'));
const ScreeningPortal     = lazy(() => import('./pages/patient/ScreeningPortal'));
const LiverScreening      = lazy(() => import('./pages/patient/LiverScreening'));
const DiabetesScreening   = lazy(() => import('./pages/patient/DiabetesScreening'));
const PredictionResult    = lazy(() => import('./pages/patient/PredictionResult'));
const HistoryPage         = lazy(() => import('./pages/patient/HistoryPage'));
const PatientAppointments = lazy(() => import('./pages/patient/PatientAppointments'));
const ProfilePage         = lazy(() => import('./pages/patient/ProfilePage'));

const DoctorDashboard    = lazy(() => import('./pages/doctor/DoctorDashboard'));
const PatientList        = lazy(() => import('./pages/doctor/PatientList'));
const PatientDetail      = lazy(() => import('./pages/doctor/PatientDetail'));
const DoctorAppointments = lazy(() => import('./pages/doctor/DoctorAppointments'));

const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));
const DoctorManagement = lazy(() => import('./pages/admin/DoctorManagement'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 rounded-full border-4 border-saffron border-t-transparent animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="/patient/dashboard" element={<AppLayout><PatientDashboard /></AppLayout>} />
              <Route path="/patient/screening" element={<AppLayout><ScreeningPortal /></AppLayout>} />
              <Route path="/patient/screening/liver" element={<AppLayout><LiverScreening /></AppLayout>} />
              <Route path="/patient/screening/diabetes" element={<AppLayout><DiabetesScreening /></AppLayout>} />
              <Route path="/patient/screening/result" element={<AppLayout><PredictionResult /></AppLayout>} />
              <Route path="/patient/history" element={<AppLayout><HistoryPage /></AppLayout>} />
              <Route path="/patient/history/detail/:type/:id" element={<AppLayout><PredictionResult /></AppLayout>} />
              <Route path="/patient/appointments" element={<AppLayout><PatientAppointments /></AppLayout>} />
              <Route path="/patient/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
              <Route path="/doctor/dashboard" element={<AppLayout><DoctorDashboard /></AppLayout>} />
              <Route path="/doctor/patients" element={<AppLayout><PatientList /></AppLayout>} />
              <Route path="/doctor/patients/:id" element={<AppLayout><PatientDetail /></AppLayout>} />
              <Route path="/doctor/appointments" element={<AppLayout><DoctorAppointments /></AppLayout>} />
              <Route path="/doctor/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AppLayout><AdminDashboard /></AppLayout>} />
              <Route path="/admin/doctors" element={<AppLayout><DoctorManagement /></AppLayout>} />
              <Route path="/admin/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
