import React from 'react'
import { Navigate } from 'react-router-dom';
import { getCookie } from '../lib/helper';

function RouteProtection({ children }: { children: React.ReactNode }) {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
        return <Navigate to="/" />;
    }
    return (
        <>
            {children}
        </>
    )
}

export default RouteProtection
