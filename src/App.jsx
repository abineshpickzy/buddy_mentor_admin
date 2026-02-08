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
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import {addToast} from '@/features/toast/toastSlice'

function AppContent() {
  const dispatch = useDispatch();
  const { isBootstrapped, isBootstrapping, bootstrapFailed } = useSelector(
    (state) => state.app
  );

  useEffect(() => {
    if (!isBootstrapped && !isBootstrapping && !bootstrapFailed) {
      dispatch(bootstrapApp());
    }
  }, [isBootstrapped, isBootstrapping, bootstrapFailed, dispatch]);

  useEffect(() => {
    if (bootstrapFailed) {
      dispatch(addToast({ type: "error", message: "Failed to bootstrap app"}));
    }
  }, [bootstrapFailed, dispatch]);

  if (isBootstrapping) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Toast />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/*"
          element={
            <ProtectedRoute>
              <AccountFP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/no-access"
          element={
            <div className="p-4 text-gray-500 flex items-center justify-center h-screen">
              Access Denied
            </div>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
