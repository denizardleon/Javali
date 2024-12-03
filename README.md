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
  - Acompanha seu progresso e muda o status de acordo com o consumo de água

- **Interface Moderna**
  - Design responsivo e intuitivo
  - Animações suaves
  - Tema com gradientes em tons de azul
  - Componentes reutilizáveis

## 🛠️ Tecnologias

- **Frontend**
  - React
  - TypeScript
  - Tailwind CSS
  - Lucide Icons
  - Date-fns

- **Backend**
  - Supabase (Autenticação e Banco de Dados)

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── atoms/       # Componentes básicos (botões, inputs, etc)
│   ├── molecules/   # Composições de atoms
│   └── organisms/   # Composições complexas
├── pages/           # Páginas da aplicação
├── store/           # Gerenciamento de estado
├── lib/            # Configurações e utilitários
└── types/          # Definições de tipos TypeScript
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
  - Modais
  - Botões
  - Inputs
  - Barras de Progresso
  - Animações de Água

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
npm run dev
```

## 👥 Autenticação e Usuários

- Sistema completo de autenticação com Supabase
- Registro com:
  - Nome
  - Email
  - Data de Nascimento
  - Peso
- Login com email e senha
- Recuperação de senha

## ⚙️ Configurações do Usuário

- Meta diária de água
- Volume do copo padrão
- Seleção de pet virtual
- Preferências de notificação (em desenvolvimento)
- Idiomas (em desenvolvimento)

## 🔄 Estado da Aplicação

O estado é gerenciado usando:
- Zustand para estado global
- Supabase para persistência de dados
- Estados locais com React hooks