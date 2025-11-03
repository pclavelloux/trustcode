-- Script pour réinitialiser complètement la base de données Supabase
-- ATTENTION: Ce script supprime TOUTES les données ! Utilisez avec précaution.

-- 1. Supprimer toutes les données de la table profiles
TRUNCATE TABLE public.profiles CASCADE;

-- 2. Supprimer tous les utilisateurs authentifiés (auth.users)
-- Note: Cela supprime aussi automatiquement les profils via CASCADE
DELETE FROM auth.users;

-- 3. Supprimer les triggers et fonctions si nécessaire
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 4. Supprimer la vue si elle existe
DROP VIEW IF EXISTS public.profiles_with_rank;

-- 5. (Optionnel) Supprimer complètement la table pour tout recréer
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- 6. Recréer la structure complète (exécutez ensuite supabase-schema.sql)
-- Ou réexécutez simplement supabase-schema.sql qui recréera tout proprement

-- Après exécution de ce script, réexécutez supabase-schema.sql pour recréer la structure

