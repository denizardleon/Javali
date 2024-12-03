import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { AuthError } from '../components/molecules/Error/AuthError';
import Button from '../components/atoms/Button/Button';
import { Input } from '../components/atoms/Input/Input';
import { DateInput } from '../components/atoms/Input/DateInput';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    weight: '',
    password: '',
    confirmPassword: ''
  });
  const { setUser, loadUserSettings } = useAuthStore();

  // Gerencia mudanças nos campos do formulário, limpando mensagens de erro anteriores
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gerencia especificamente mudanças no campo de data de nascimento
  const handleDateChange = (value: string) => {
    setError('');
    setFormData(prev => ({
      ...prev,
      birthDate: value
    }));
  };

  // Realiza validação completa do formulário antes do envio
  // Retorna false e exibe erro se algum campo estiver inválido
  const validateForm = () => {
    // Validação do nome: não pode estar vazio após remover espaços
    if (!formData.name?.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    // Validação do email: campo obrigatório
    if (!formData.email?.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    // Validação da senha: campo obrigatório
    if (!formData.password?.trim()) {
      setError('Senha é obrigatória');
      return false;
    }
    // Confirma se as senhas digitadas são iguais
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    // Verifica comprimento mínimo da senha por segurança
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  // Processa o envio do formulário de registro
  // Cria a conta do usuário e configura suas preferências iniciais
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      // Registra o usuário no Supabase com seus dados básicos
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            birth_date: formData.birthDate,
            weight: formData.weight
          }
        }
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        const weight = Number(formData.weight) || null;
        // Define meta diária de água: 35ml por kg de peso ou 2L se peso não informado
        const recommendedGoal = weight ? weight * 35 : 2000;
        
        // Insere configurações padrão do usuário no banco
        // Inclui meta diária, pet inicial e volume do copo padrão
        const { error: settingsError } = await supabase
          .from('user_settings')
          .insert([
            { 
              user_id: signUpData.user.id,
              daily_goal: recommendedGoal,
              selected_pet: 'capybara',
              cup_volume: 250,
              weight: weight
            }
          ]);

        if (settingsError) throw settingsError;
        
        // Atualiza o contexto da aplicação com os dados do novo usuário
        setUser(signUpData.user);
        await loadUserSettings(); 
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError('Ocorreu um erro ao criar a conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#01b4c5] to-[#D9D9D9]">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/')} 
            className="text-white"
          >
            <ChevronLeft size={24} />
          </button>
          
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthError message={error} />
          <div>
            <h2 className="text-2xl font-bevan text-black mb-8 text-center">CADASTRAR</h2>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              label="NOME"
              required
              disabled={loading}
            />
          </div>

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

          <DateInput
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleDateChange}
            label="DATA DE NASCIMENTO"
            required
            disabled={loading}
          />

          <Input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            label="SEU PESO (KG)"
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

          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            label="REPITA A SENHA"
            required
            disabled={loading}
          />

          <div className="mt-20 flex justify-center">
            <Button
              type="submit"
              className="w-[80%]"
              variant="primary"
            >
              CRIAR CONTA
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
