# Java-li 🌊

App moderno para acompanhamento do consumo diário de água, com um companheiro virtual que te ajuda a manter o hábito de hidratação.

## 🌟 Funcionalidades

- **Acompanhamento de Água**
  - Registro fácil do consumo de água
  - Visualização do progresso diário
  - Meta diária personalizável
  - Volume do copo personalizável
  - Histórico de consumo


- **Pet Virtual**
  - Escolha entre Capivara ou Gato como seu companheiro
  - Sistema de status dinâmico baseado no consumo de água
  - Animações e interações personalizadas
  - Feedback visual do progresso

- **Interface Moderna**
  - Design responsivo e intuitivo
  - Animações suaves 
  - Tema com gradientes em tons de azul
  - Componentes reutilizáveis


## 🛠️ Tecnologias

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide Icons & React Icons
  - Date-fns para manipulação de datas
  - Zustand para gerenciamento de estado
  - React Router para navegação

- **Mobile**
  - Capacitor para build nativo
  - Suporte para Android IOS


- **Backend & Infraestrutura**
  - Supabase
    - Autenticação de usuários
    - Banco de dados PostgreSQL
    - Armazenamento em tempo real
  - Vite como bundler

## 📁 Estrutura do Projeto

```
src/
├── assets/         # Recursos estáticos (imagens, ícones)
├── components/     # Componentes React
│   ├── atoms/     # Componentes básicos (botões, inputs)
│   ├── molecules/ # Composições de atoms
│   └── organisms/ # Composições complexas
├── pages/         # Componentes de página
│   ├── Dashboard/ # Página principal do app
│   ├── Home/      # Página inicial
│   ├── Login/     # Autenticação
│   ├── Register/  # Cadastro
│   └── Settings/  # Configurações
├── store/         # Estados globais com Zustand
├── lib/           # Configurações e utilitários
└── types/         # Definições de tipos TypeScript
```

## 🎨 Design System

- **Cores**
  - Primary: #00a5b4
  - Primary Dark: #2CC1B3
  - Secondary: #FFFFFF
  - Background: Gradiente do primary para #87CEEB

- **Tipografia**
  - Títulos: Bevan
  - Texto: Inder

- **Componentes**
  - Modais responsivos
  - Botões com feedback tátil
  - Inputs validados
  - Barras de Progresso animadas
  - Animações de água fluidas

## 🚀 Como Executar

1. Clone o repositório
```bash
git clone https://github.com/denizardleon/Javali.git
cd javali
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Adicione suas credenciais do Supabase no arquivo .env
```

4. Execute o projeto
```bash
# Desenvolvimento web
npm run dev

# Build Android
npm run ionic:build
npx cap sync android
npx cap open android
```

## 👥 Sistema de Usuários

- **Autenticação Completa**
  - Login com email/senha
  - Registro com validações
  - Recuperação de senha
  - Persistência de sessão

- **Perfil do Usuário**
  - Nome 
  - Email 
  - Data de Nascimento
  - Peso para cálculo da meta
  - Preferências salvas

## ⚙️ Configurações Personalizáveis

- Meta diária de água calculada
- Volume do copo padrão
- Seleção e personalização do pet
- Idiomas (em desenvolvimento)

## 🔄 Gerenciamento de Estado

- **Zustand**
  - Estado global da aplicação
  - Estado de autenticação
  - Configurações do usuário
  - Progresso diário

- **Supabase**
  - Persistência em tempo real
  - Cache offline
  - Sincronização automática
