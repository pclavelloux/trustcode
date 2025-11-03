-- Si vous avez déjà la table profiles, exécutez ceci pour ajouter la colonne github_token
-- Sinon, utilisez directement supabase-schema.sql

-- Ajouter la colonne github_token si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'github_token'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN github_token TEXT;
    RAISE NOTICE 'Column github_token added successfully';
  ELSE
    RAISE NOTICE 'Column github_token already exists';
  END IF;
END $$;

