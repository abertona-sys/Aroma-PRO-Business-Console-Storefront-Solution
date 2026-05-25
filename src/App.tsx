import { HashRouter, Routes, Route } from 'react-router-dom';
import PublicCatalog from './pages/PublicCatalog';
import AdminDashboard from './pages/AdminDashboard';
import Landing from './pages/Landing';
import { AuthProvider } from './lib/AuthContext';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/store/:storeId" element={<PublicCatalog />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </HashRouter>
      <Toaster />
    </AuthProvider>
  );
}
