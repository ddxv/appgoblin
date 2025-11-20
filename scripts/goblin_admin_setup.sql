-- allow connecting to the DB
GRANT CONNECT ON DATABASE goblinadmin TO frontend;

-- allow using the public schema
GRANT USAGE ON SCHEMA public TO frontend;

-- grant read/write on all current tables in public
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO frontend;

-- grant usage/select on sequences (needed if you use serials/identity columns)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO frontend;

-- ensure future tables/sequences created in public are also accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT,
INSERT,
UPDATE,
DELETE ON TABLES TO frontend;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE,
SELECT ON SEQUENCES TO frontend;

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
