-- Migration: Ajout de la table sponsors pour le système de sponsoring
-- Date: 2025-11-03
-- Description: Crée la table sponsors avec gestion des abonnements Stripe

-- Vérifier si la table existe déjà
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sponsors') THEN
        -- Table pour les sponsors
        CREATE TABLE public.sponsors (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) NOT NULL,
            stripe_customer_id VARCHAR(255) UNIQUE,
            stripe_subscription_id VARCHAR(255) UNIQUE,
            website_url TEXT,
            company_name VARCHAR(255),
            description TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            payment_date TIMESTAMP WITH TIME ZONE,
            expires_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Index pour optimiser les requêtes sponsors
        CREATE INDEX idx_sponsors_status ON public.sponsors(status);
        CREATE INDEX idx_sponsors_expires_at ON public.sponsors(expires_at);
        CREATE INDEX idx_sponsors_stripe_subscription_id ON public.sponsors(stripe_subscription_id);

        -- Enable Row Level Security pour sponsors
        ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

        -- Policy pour permettre à tout le monde de lire les sponsors actifs
        CREATE POLICY "Active sponsors are viewable by everyone" 
            ON public.sponsors
            FOR SELECT
            USING (status = 'active');

        -- Policy pour permettre l'insertion et la mise à jour (par le système via service role)
        CREATE POLICY "Service can manage sponsors"
            ON public.sponsors
            FOR ALL
            USING (true)
            WITH CHECK (true);

        RAISE NOTICE 'Table sponsors créée avec succès';
    ELSE
        RAISE NOTICE 'Table sponsors existe déjà, migration ignorée';
    END IF;
END $$;

-- Ajouter des commentaires pour documenter la table
COMMENT ON TABLE public.sponsors IS 'Table pour gérer les sponsors avec abonnements Stripe mensuels';
COMMENT ON COLUMN public.sponsors.id IS 'Identifiant unique du sponsor';
COMMENT ON COLUMN public.sponsors.email IS 'Email du sponsor pour contact';
COMMENT ON COLUMN public.sponsors.stripe_customer_id IS 'ID du customer Stripe';
COMMENT ON COLUMN public.sponsors.stripe_subscription_id IS 'ID de l''abonnement Stripe';
COMMENT ON COLUMN public.sponsors.website_url IS 'URL du site web du sponsor';
COMMENT ON COLUMN public.sponsors.company_name IS 'Nom de l''entreprise sponsor';
COMMENT ON COLUMN public.sponsors.description IS 'Description courte du produit/service';
COMMENT ON COLUMN public.sponsors.status IS 'Statut: pending, active, cancelled, expired';
COMMENT ON COLUMN public.sponsors.payment_date IS 'Date du dernier paiement';
COMMENT ON COLUMN public.sponsors.expires_at IS 'Date d''expiration de l''abonnement';
COMMENT ON COLUMN public.sponsors.created_at IS 'Date de création de l''entrée';
COMMENT ON COLUMN public.sponsors.updated_at IS 'Date de dernière mise à jour';

