import React, { useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import LoginCard from './ui/LoginCard';
import LoadingSpinner from './ui/LoadingSpinner';

interface User {
  name: string;
  email: string;
  picture: string;
}

const CLIENT_ID = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID";

export default function AuthContainer() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('irisUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if (window.location.pathname === '/') {
        window.location.href = '/dashboard';
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('irisUser', JSON.stringify(user));
      if (window.location.pathname === '/') {
        window.location.href = '/dashboard';
      }
    } else {
      localStorage.removeItem('irisUser');
      if (window.location.pathname === '/dashboard') {
        window.location.href = '/';
      }
    }
  }, [user]);

  const handleLoginSuccess = (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      
      if (!decoded.email.endsWith('@alumnos.uneatlantico.es')) {
        setError('El acceso está restringido exclusivamente a cuentas @alumnos.uneatlantico.es');
        googleLogout();
        setUser(null);
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      };
      setUser(newUser);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al procesar la autenticación.');
      setIsLoading(false);
    }
  };

  const handleLoginError = () => {
    setError('Falló el inicio de sesión con Google. Inténtalo de nuevo.');
    setIsLoading(false);
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user && window.location.pathname === '/') {
    return (
        <LoginCard 
            error={error} 
            clientId={CLIENT_ID} 
            onSuccess={handleLoginSuccess} 
            onError={handleLoginError} 
        />
    );
  }
  
  return null;
}