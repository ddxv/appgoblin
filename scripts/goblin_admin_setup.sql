DROP TABLE public.users CASCADE;
DROP TABLE public.sessions CASCADE;
DROP TABLE public.email_verification_requests CASCADE;
DROP TABLE public.password_reset_sessions CASCADE;

CREATE TABLE public.users (
    id serial4 NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    email_verified bool DEFAULT false NOT NULL,
    totp_key bytea NULL,
    recovery_code bytea NOT NULL,
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE INDEX email_index ON public.users USING btree (email);


CREATE TABLE public.sessions (
    id text NOT NULL,
    user_id int4 NOT NULL,
    expires_at timestamptz NOT NULL,
    two_factor_verified bool DEFAULT false NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (id),
    CONSTRAINT sessions_user_id_fkey FOREIGN KEY (
        user_id
    ) REFERENCES public.users (id)
);

CREATE TABLE public.email_verification_requests (
    id text NOT NULL,
    user_id int4 NOT NULL,
    email text NOT NULL,
    code text NOT NULL,
    expires_at timestamptz NOT NULL,
    CONSTRAINT email_verification_requests_pkey PRIMARY KEY (id),
    CONSTRAINT email_verification_requests_user_id_fkey FOREIGN KEY (
        user_id
    ) REFERENCES public.users (id)
);


CREATE TABLE public.password_reset_sessions (
    id text NOT NULL,
    user_id int4 NOT NULL,
    email text NOT NULL,
    code text NOT NULL,
    expires_at timestamptz NOT NULL,
    email_verified bool DEFAULT false NOT NULL,
    two_factor_verified bool DEFAULT false NOT NULL,
    CONSTRAINT password_reset_sessions_pkey PRIMARY KEY (id),
    CONSTRAINT password_reset_sessions_user_id_fkey FOREIGN KEY (
        user_id
    ) REFERENCES public.users (id)
);
