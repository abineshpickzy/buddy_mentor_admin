import './App.css'
import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from '@/store'
import { bootstrapApp } from '@/features/app/appThunk'
import Toast from '@/components/ui/Toast'
import Loader from '@/components/ui/Loader'
import Login from '@/pages/login/Login'
import Dashboard from '@/pages/dashboard/Dashboard';
import Admin from '@/pages/admin/Admin';
import AccountFP from './pages/accountfp/AccountFP';
import ProtectedRoute from './routes/ProtectedRoute'
import {addToast} from '@/features/toast/toastSlice'
import ScrollToTop from '@/components/ScrollToTop'

function AppContent() {
  const dispatch = useDispatch();
  const { isBootstrapped, isBootstrapping, bootstrapFailed } = useSelector(
    (state) => state.app
  );
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) return;
    if (!isBootstrapped && !isBootstrapping && !bootstrapFailed) {
      hasBootstrapped.current = true;
      dispatch(bootstrapApp());
    }
  }, [isBootstrapped, isBootstrapping, bootstrapFailed, dispatch]);

  useEffect(() => {
    if (bootstrapFailed) {
      dispatch(addToast({ type: "error", message: "Failed to bootstrap app"}));
    }
  }, [bootstrapFailed, dispatch]);


  // prevent context menu 

  //  useEffect(() => {
  //   const handleContextMenu = (e) => {
  //     e.preventDefault();
  //   };

  //   const handleKeyDown = (e) => {
  //     if (
  //       e.key === "F12" ||
  //       (e.ctrlKey && e.shiftKey && e.key === "I") ||
  //       (e.ctrlKey && e.key === "u")
  //     ) {
  //       e.preventDefault();
  //     }
  //   };

  //   document.addEventListener("contextmenu", handleContextMenu);
  //   document.addEventListener("keydown", handleKeyDown);

  //   // Cleanup (VERY IMPORTANT)
  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  return (
    <>
      <ScrollToTop />
      <Toast />
      <Loader />
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
