import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { ChevronLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { AuthError } from '../components/AuthError'
import { LoadingButton } from '../components/LoadingButton'

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    weight: '',
    password: '',
    confirmPassword: ''
  })
  const setUser = useAuthStore((state) => state.setUser)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (isRegister) {
      if (!formData.name?.trim()) {
        setError('Nome é obrigatório')
        return false
      }
      if (!formData.email?.trim()) {
        setError('Email é obrigatório')
        return false
      }
      if (!formData.password?.trim()) {
        setError('Senha é obrigatória')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem')
        return false
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setLoading(true)
    setError('')

    try {
      if (isRegister) {
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
        })

        if (signUpError) throw signUpError

        if (signUpData.user) {
          const { error: settingsError } = await supabase
            .from('user_settings')
            .insert([
              { 
                user_id: signUpData.user.id,
                daily_goal: 2000,
                selected_pet: 'capybara'
              }
            ])

          if (settingsError) throw settingsError
          setUser(signUpData.user)
        }
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (signInError) throw signInError
        
        if (signInData.user) {
          setUser(signInData.user)
        }
      }
    } catch (error: any) {
      console.error('Error:', error)
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos'
          : 'Ocorreu um erro. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6">
      {isRegister ? (
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => {
                setIsRegister(false)
                setError('')
              }} 
              className="text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white ml-4">CADASTRAR</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthError message={error} />
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="NOME"
                className="glass-input bg-white"
                required
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-MAIL"
                className="glass-input"
                required
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                placeholder="DATA DE NASCIMENTO"
                className="glass-input bg-white"
                required
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="SEU PESO (KG)"
                className="glass-input bg-white"
                required
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="SENHA"
                className="glass-input bg-white"
                required
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="REPITA A SENHA"
                className="glass-input bg-white"
                required
                disabled={loading}
              />
            </div>
            <LoadingButton
              type="submit"
              loading={loading}
              text="CRIAR CONTA"
              className="mt-6"
            />
          </form>
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center">
          <div className="mb-12">
            <img 
              src="src/img/logo.png" 
              alt="Java-li" 
              className="w-24 h-24 mx-auto mb-8"
            />
            <h1 className="text-3xl font-bold text-white mb-8">BEM-VINDO DE VOLTA</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthError message={error} />
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-MAIL"
                className="glass-input bg-white"
                required
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="SENHA"
                className="glass-input bg-white"
                required
                disabled={loading}
              />
            </div>
            <LoadingButton
              type="submit"
              loading={loading}
              text="LOGAR"
              className="mt-6"
            />
          </form>
          <div className="mt-4">
            <button
              onClick={() => {
                setIsRegister(true)
                setError('')
              }}
              className="text-white hover:underline"
              disabled={loading}
            >
              CRIAR CONTA
            </button>
          </div>
        </div>
      )}
    </div>
  )
}