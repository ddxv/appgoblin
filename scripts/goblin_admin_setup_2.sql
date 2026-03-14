-- ============================================================================
-- USER TRACKING / QUICK ACCESS TABLES
-- ============================================================================
-- These tables store user-specific follows/favorites and scan requests.
-- Keywords are intentionally user-scoped (not globally shared) so users only
-- see their own tracked keyword sets for each app.

CREATE TABLE public.user_followed_apps (
    id bigserial PRIMARY KEY,
    user_id int4 NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    store_id varchar NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT user_followed_apps_user_store_unique UNIQUE (user_id, store_id)
);

CREATE INDEX idx_user_followed_apps_user_created
ON public.user_followed_apps (user_id, created_at DESC);

CREATE INDEX idx_user_followed_apps_store
ON public.user_followed_apps (store_id);


CREATE TABLE public.user_followed_companies (
    id bigserial PRIMARY KEY,
    user_id int4 NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    company_id int8 NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT user_followed_companies_user_company_unique UNIQUE (
        user_id,
        company_id
    )
);

CREATE INDEX idx_user_followed_companies_user_created
ON public.user_followed_companies (user_id, created_at DESC);

CREATE INDEX idx_user_followed_companies_company
ON public.user_followed_companies (company_id);


CREATE TABLE public.user_tracked_keywords (
    id bigserial PRIMARY KEY,
    user_id int4 NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    store_id varchar NOT NULL,
    keyword_text text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT user_tracked_keywords_keyword_nonempty CHECK (
        length(btrim(keyword_text)) > 0
    )
);

CREATE UNIQUE INDEX idx_user_tracked_keywords_unique_user_app_keyword
ON public.user_tracked_keywords (
    user_id,
    store_id,
    lower(btrim(keyword_text))
);

CREATE INDEX idx_user_tracked_keywords_user_store_created
ON public.user_tracked_keywords (user_id, store_id, created_at DESC);
