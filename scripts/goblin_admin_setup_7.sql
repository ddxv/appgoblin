CREATE TABLE IF NOT EXISTS public.organization_invitations (
    id BIGSERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES public.organizations (
        id
    ) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    invited_by_user_id INT NOT NULL REFERENCES public.users (id),
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ NULL,
    accepted_by_user_id INT NULL REFERENCES public.users (id),
    revoked_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS organization_invitations_organization_idx
ON public.organization_invitations (organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS organization_invitations_email_idx
ON public.organization_invitations (LOWER(email), expires_at);

DO $$
DECLARE
    user_row RECORD;
    personal_organization_id INT;
    base_slug TEXT;
BEGIN
    FOR user_row IN SELECT id, username, email FROM public.users LOOP
        SELECT om.organization_id INTO personal_organization_id
        FROM public.organization_members om
        WHERE om.user_id = user_row.id
        ORDER BY om.created_at ASC, om.id ASC
        LIMIT 1;

        IF personal_organization_id IS NULL THEN
            base_slug := regexp_replace(lower(coalesce(nullif(user_row.username, ''), split_part(user_row.email, '@', 1))), '[^a-z0-9]+', '-', 'g');
            base_slug := trim(both '-' from base_slug);
            IF base_slug = '' THEN
                base_slug := 'account';
            END IF;

            INSERT INTO public.organizations (name, slug)
            VALUES (coalesce(nullif(user_row.username, ''), user_row.email) || '''s account', base_slug || '-' || user_row.id)
            RETURNING id INTO personal_organization_id;

            INSERT INTO public.organization_members (organization_id, user_id, role)
            VALUES (personal_organization_id, user_row.id, 'owner');
        END IF;

        UPDATE public.subscriptions
        SET organization_id = personal_organization_id,
            user_id = NULL,
            seats_total = GREATEST(seats_total, 3),
            updated_at = NOW()
        WHERE user_id = user_row.id
          AND organization_id IS NULL;
    END LOOP;
END $$;

ALTER TABLE public.subscriptions
ALTER COLUMN seats_total SET DEFAULT 3;
