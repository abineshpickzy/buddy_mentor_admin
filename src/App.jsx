import './App.css'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from '@/store'
import { bootstrapApp } from '@/features/app/appThunk'
import Toast from '@/components/ui/Toast'
import Login from '@/pages/login/Login'
import Dashboard from '@/pages/dashboard/Dashboard';
import Admin from '@/pages/admin/Admin';
import AccountFP from './pages/accountfp/AccountFP';
import ProtectedRoute from './routes/ProtectedRoute'
import {addToast} from "@/features/toast/toastSlice";

function AppContent() {
  const dispatch = useDispatch();
  const { isBootstrapped, isBootstrapping } = useSelector((state) => state.app);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isBootstrapped && !isBootstrapping) {
      dispatch(bootstrapApp());
    }
  }, [dispatch]);

  if (isBootstrapping) {
    return (
      <div className="p-4 text-gray-500 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Toast />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/admin/*' element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/account/*" element={<ProtectedRoute><AccountFP /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
