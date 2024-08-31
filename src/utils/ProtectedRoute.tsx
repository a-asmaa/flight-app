import React from 'react'
import {Navigate, useLocation} from "react-router-dom"
import { getToken } from './storage';

const ProtectedRoute = ({children}: {children: any}) => {
    let location = useLocation();

    const loggedUser = getToken(); 

    if(!loggedUser) {
        return <Navigate to="/login" state={{ from: location}} replace />
    }

    return children;
};

export default ProtectedRoute;