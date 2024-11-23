-- Criar tabela para histórico de consumo de água
create table if not exists water_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  amount int not null,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint amount_positive check (amount > 0)
);

-- Criar tabela para configurações do usuário
create table if not exists user_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null unique,
  daily_goal int not null default 2000,
  selected_pet text not null default 'capybara',
  cup_volume int not null default 250,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint daily_goal_positive check (daily_goal > 0),
  constraint cup_volume_positive check (cup_volume > 0),
  constraint valid_pet check (selected_pet in ('capybara', 'cat'))
);

-- Habilitar RLS
alter table water_entries enable row level security;
alter table user_settings enable row level security;

-- Políticas de segurança para water_entries
create policy "Users can insert own water entries"
  on water_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can view own water entries"
  on water_entries for select
  using (auth.uid() = user_id);

-- Políticas de segurança para user_settings
create policy "Users can view own settings"
  on user_settings for select
  using (auth.uid() = user_id);

create policy "Users can update own settings"
  on user_settings for update
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on user_settings for insert
  with check (auth.uid() = user_id);

-- Índices para melhor performance
create index water_entries_user_id_idx on water_entries(user_id);
create index water_entries_date_idx on water_entries(date);

-- Trigger para atualizar updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_user_settings_updated_at
  before update on user_settings
  for each row
  execute function update_updated_at_column();