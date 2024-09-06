import React from 'react';
import FlightList from './pages/FlightList';
import Login from './pages/Login';
import CreateFlight from './pages/CreateFlight';
import Register from './pages/Register';
import {BrowserRouter,Navigate,Route,Routes} from "react-router-dom";
import ProtectedRoute from './utils/ProtectedRoute';
import BadRequest from './pages/ErrorPage';

const App: React.FC = () => {

  return (
    <BrowserRouter>
    <Routes>
      
        <Route path="/bad-request" element={<BadRequest />} />

        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        <Route path="/" element={<Navigate to="/flights" />} />   {/* default path */}
        <Route path="/flights" element={
          <ProtectedRoute>
            <FlightList/>
          </ProtectedRoute>
        }/>
        <Route path="/flights/create" element={
          <ProtectedRoute>
            <CreateFlight />
          </ProtectedRoute>
        }/>
    </Routes>
    </BrowserRouter>
  );
};

export default App;

