
import React from 'react';
import SignIn from './components/signin';
import './style.css';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Contribute from './components/Contribute';
import SearchPage from './components/SearchPage';
import UserProfile from './components/UserProfile';
import Home from './components/Home';
import NoPage from './components/NoPage';
import Contact from './components/contact';
import ObservationFiles from './components/files/Files.tsx';
import { AuthProvider } from '../apis/AuthContext.js';
import PrivateRoute from '../apis/privateRoute.js';

function App() {
  
  return (
    <>
    
    
    <AuthProvider>
      <BrowserRouter>
      
      <Routes>
      
        <Route
       path="/authenticate" element={<div className="app" ><SignIn /></div>} />
      <Route path="/" element={<Navigate to="/authenticate" />} />
          <Route
            path="/authenticate/*"
            element={
              <React.Fragment>
                <Navbar />
                <PrivateRoute path="/home" element={<Home />} />
                <PrivateRoute path="contribute" element={<Contribute  />} />
                <PrivateRoute path="contact" element={<Contact />} />
                <PrivateRoute path="no-page" element={<NoPage />} />
                <PrivateRoute path="search-page" element={<SearchPage />} />
                <PrivateRoute path="user-profile/" element={<UserProfile />} />
                <PrivateRoute path="caves/:id" element={<ObservationFiles />} />
              </React.Fragment>
            }
          />
      <Route path="*" element={<NoPage/> }/>
          
          
        
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    
    </>
  );
}

export default App;
