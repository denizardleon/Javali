-- Estrutura do banco de dados Javali

-- Tabela de configurações do usuário
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  daily_goal INTEGER NOT NULL DEFAULT 2000,
  selected_pet TEXT NOT NULL DEFAULT 'capybara',
  cup_volume INTEGER NOT NULL DEFAULT 250,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Tabela de entradas de água
CREATE TABLE water_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_amount CHECK (amount > 0)
);

-- Índices para melhor performance
CREATE INDEX water_entries_user_id_date_idx ON water_entries(user_id, date);
CREATE INDEX user_settings_user_id_idx ON user_settings(user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Políticas de segurança (RLS)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_entries ENABLE ROW LEVEL SECURITY;

-- Políticas para user_settings
CREATE POLICY "Users can view their own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para water_entries
CREATE POLICY "Users can view their own water entries"
  ON water_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water entries"
  ON water_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water entries"
  ON water_entries FOR UPDATE
  USING (auth.uid() = user_id);
