
import './App.css';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AuthProvider from './context/auth';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="app">
      <div className="app-container">
        <AuthProvider>
          <Navbar />
            <div className="app-body">
              <Routes>
                <Route exact path='*' element={<PrivateRoute />}>
                  <Route exact path='*' element={<Home />}/>
                </Route>
                  <Route exact path='/profile' element={<PrivateRoute />}>
                    <Route exact path='/profile' element={<Profile />}/>
                  </Route>
                  <Route exact path='/register' element={<Register/>}/>
                  <Route exact path='/login' element={<Login/>}/>
              </Routes>
            </div>
          </AuthProvider>
      </div>
    </div>
  );
}

export default App;
