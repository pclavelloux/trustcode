-- IMPORTANT: Exécutez ce script APRÈS avoir configuré GitHub OAuth dans Supabase Dashboard

-- Supprimer la vue si elle existe (doit être fait avant de modifier la table)
DROP VIEW IF EXISTS public.profiles_with_rank CASCADE;

-- Table pour les profils utilisateurs (extension de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  github_username VARCHAR(255) UNIQUE NOT NULL,
  github_id VARCHAR(255) UNIQUE NOT NULL,
  display_username VARCHAR(255),
  website_url TEXT,
  avatar_url TEXT,
  github_token TEXT, -- Token GitHub personnel (chiffré côté app)
  total_contributions INTEGER DEFAULT 0,
  contributions_data JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_profiles_github_username ON public.profiles(github_username);
CREATE INDEX IF NOT EXISTS idx_profiles_total_contributions ON public.profiles(total_contributions DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_github_id ON public.profiles(github_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Supprimer les policies existantes si elles existent
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Policy pour permettre à tout le monde de lire les profils publics
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles
  FOR SELECT
  USING (true);

-- Policy pour permettre aux utilisateurs de créer leur propre profil
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy pour permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy pour permettre aux utilisateurs de supprimer leur propre profil
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, github_username, github_id, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'preferred_username', 'unknown'),
    NEW.raw_user_meta_data->>'provider_id',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour appeler la fonction lors de la création d'un utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Vue pour faciliter les requêtes (optionnel mais pratique)
CREATE OR REPLACE VIEW public.profiles_with_rank AS
SELECT 
  p.*,
  RANK() OVER (ORDER BY p.total_contributions DESC) as rank
FROM public.profiles p
ORDER BY p.total_contributions DESC;
