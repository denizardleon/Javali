-- Criar tabela para histórico de consumo de água
create table if not exists water_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  amount int not null,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint amount_positive check (amount > 0)
);

-- Habilitar RLS
alter table water_history enable row level security;

-- Políticas de segurança para water_history
create policy "Users can insert own water history"
  on water_history for insert
  with check (auth.uid() = user_id);

create policy "Users can view own water history"
  on water_history for select
  using (auth.uid() = user_id);

-- Índices para melhor performance
create index water_history_user_id_idx on water_history(user_id);
create index water_history_date_idx on water_history(date);