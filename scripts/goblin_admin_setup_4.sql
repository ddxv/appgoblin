-- ============================================================================
-- USER SIGNUP REFERRAL SOURCE
-- ============================================================================
-- Tracks where users heard about AppGoblin. This is optional and collected
-- during signup. AppGoblin does not use 3rd-party analytics — this data
-- helps us understand which channels bring new users.
-- ============================================================================

CREATE TABLE public.user_signup_sources (
    id serial4 NOT NULL,
    user_id int4 NOT NULL,
    referral_source text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,

    CONSTRAINT user_signup_sources_pkey PRIMARY KEY (id),
    CONSTRAINT user_signup_sources_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) ON DELETE CASCADE
);
