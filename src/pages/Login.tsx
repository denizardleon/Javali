import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { AuthError } from '../components/molecules/Error/AuthError';
import Button from '../components/atoms/Button/Button';
import { Input } from '../components/atoms/Input/Input';
import { Capy } from '../components/atoms/Images/Images';

// Componente responsável pela tela de login dos usuários
export const Login: React.FC = () => {
  // Hook de navegação para redirecionamento após autenticação
  const navigate = useNavigate();
  
  // Estados para controle de erros e loading durante a autenticação
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dados do formulário de login
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Função do Zustand para atualizar o usuário no estado global
  const setUser = useAuthStore((state) => state.setUser);

  // Atualiza os campos do formulário e limpa mensagens de erro
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Processa o envio do formulário e realiza a autenticação
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ativa indicador de carregamento e limpa erros anteriores
    setLoading(true);
    setError('');

    try {
      // Tenta autenticar o usuário usando o Supabase
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) throw signInError;
      
      // Se autenticação bem sucedida, atualiza estado e redireciona
      if (signInData.user) {
        setUser(signInData.user);
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Tratamento de erros de autenticação com mensagens personalizadas
      console.error('Error:', error);
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos'
          : 'Ocorreu um erro. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Interface do formulário de login
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#01b4c5] to-[#D9D9D9]">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/')} 
            className="text-black"
          >
            <ChevronLeft size={24} />
          </button>
          
        </div>

        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bevan text-black mb-8">BEM-VINDO DE VOLTA</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthError message={error} />
          
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="E-MAIL"
            required
            disabled={loading}
          />

          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="SENHA"
            required
            disabled={loading}
          />
          <div className="mt-4 text-center">
            <button 
              type="button" 
              onClick={() => {/* Implementar recuperação de senha */}} 
              className="font-inder text-black hover:underline"
            >
              ESQUECI A SENHA
            </button>
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              type="submit"
              className="w-[80%]"
              variant="primary"
            >
              LOGAR
            </Button>
          </div>     

        </form>

        <div className="mt-12 text-center">
        <Capy />
        </div>
      </div>
    </div>
  );
};

export default Login;