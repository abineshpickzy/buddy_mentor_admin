import './App.css'

import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@/store'
import Login from '@/pages/login/Login'
import Dashboard from '@/pages/dashboard/Dashboard';
import Admin from '@/pages/admin/Admin';
import AccountFP from './pages/accountfp/AccountFP';

function App() {

 
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
             <Route path="/dashboard/*" element={<Dashboard />} />
             <Route path='/admin/*' element={<Admin />} />
             <Route path="/account/*" element={<AccountFP />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
