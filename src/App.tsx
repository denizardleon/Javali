import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { supabase } from './lib/supabase';

export default function App() {
  const { user, setUser, setSession, loadUserSettings } = useAuthStore();

  useEffect(() => {
    let isInitializing = false;

    const initializeAuth = async () => {
      if (isInitializing) return;
      isInitializing = true;
      
      try {
        console.log('Inicializando autenticação...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          return;
        }

        console.log('Sessão atual:', session);
        
        if (session?.user) {
          console.log('Usuário autenticado:', session.user);
          setSession(session);
          await setUser(session.user);
        } else {
          console.log('Nenhum usuário autenticado');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
      } finally {
        isInitializing = false;
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isInitializing) return;
      console.log('Mudança no estado de autenticação:', event, session);
      
      if (session?.user) {
        setSession(session);
        await setUser(session.user);
      } else {
        setSession(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Home />} 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/settings" 
          element={user ? <Settings /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}