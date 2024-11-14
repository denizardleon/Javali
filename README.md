# Water Tracking App

Um aplicativo para acompanhamento de ingestão de água com pet virtual.

## Requisitos

- Node.js 18+
- NPM 9+
- Conta no Supabase

## Dependências Principais

- React 18.3.1
- React Router DOM 6.22.2
- Supabase JS 2.39.7
- Zustand 4.5.2
- Date-fns 3.3.1
- Lucide React 0.344.0

## Dependências de Desenvolvimento

- Vite 5.4.2
- TypeScript 5.5.3
- Tailwind CSS 3.4.1
- PostCSS 8.4.35
- Autoprefixer 10.4.18

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter

## Estrutura do Banco de Dados (Supabase)

### Tabelas Necessárias

1. `water_history`
   - id (uuid, primary key)
   - user_id (uuid, foreign key)
   - amount (integer)
   - date (date)
   - created_at (timestamp)

2. `user_settings`
   - user_id (uuid, primary key)
   - daily_goal (integer)
   - selected_pet (text)