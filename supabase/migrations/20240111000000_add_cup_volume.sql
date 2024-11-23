-- Add cup_volume column to user_settings
ALTER TABLE user_settings 
ADD COLUMN cup_volume INTEGER NOT NULL DEFAULT 250;

-- Update existing rows to have the default cup volume
UPDATE user_settings 
SET cup_volume = 250 
WHERE cup_volume IS NULL;
