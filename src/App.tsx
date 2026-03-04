import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import InMemoriam from './pages/InMemoriam';
import Gala from './pages/Gala';
import AlumniTracker from './pages/AlumniTracker';
import Secretariat from './pages/Secretariat';
import Program from './pages/Program';
import Finance from './pages/Finance';
import Venue from './pages/Venue';
import FunRun from './pages/FunRun';
import TShirts from './pages/TShirts';
import Inventory from './pages/Inventory';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import DashboardHome from './pages/DashboardHome';

import MemoryAlbum from './pages/MemoryAlbum';

function ProtectedRoute({ children, requireOnboarding = true }: { children: React.ReactNode, requireOnboarding?: boolean }) {
  const { user, loading, userData } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-anniversary-gold">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requireOnboarding && !userData?.onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="memoriam" element={<InMemoriam />} />
            <Route path="gala" element={<Gala />} />
            <Route path="program" element={<Program />} />
            <Route path="funrun" element={<FunRun />} />
            <Route path="album" element={<MemoryAlbum />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="onboarding" element={
              <ProtectedRoute requireOnboarding={false}>
                <OnboardingPage />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="dashboard" element={
              <ProtectedRoute>
                <div className="contents">
                  <Outlet />
                </div>
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="alumni" element={<AlumniTracker />} />
              <Route path="secretariat" element={<Secretariat />} />
              <Route path="finance" element={<Finance />} />
              <Route path="venue" element={<Venue />} />
              <Route path="tshirts" element={<TShirts />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="*" element={<div className="text-center py-20 text-2xl text-gray-500">Not Found</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
