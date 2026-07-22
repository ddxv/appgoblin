CREATE TABLE public.tiers (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,          -- 'b2b_sdk', 'b2b_premium'
    name TEXT NOT NULL,                 -- 'B2B Analytics SDK', 'B2B Premium Portal'   
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.tier_prices (
    id SERIAL PRIMARY KEY,
    tier_id INT NOT NULL REFERENCES public.tiers(id),
    provider_name TEXT NOT NULL REFERENCES public.providers(name),
    provider_product_id TEXT NOT NULL, 
    provider_price_id TEXT NOT NULL UNIQUE, -- (Stripe price ID or 'local_trial' if provider_name is 'local')
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly',  'manual')),
    is_current BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Ensure only one price is current per product, cycle, and provider
CREATE UNIQUE INDEX idx_single_current_price_per_product ON public.tier_prices (tier_id, billing_cycle, provider_name) WHERE (is_current = TRUE);



ALTER TABLE public.subscriptions ADD COLUMN tier_price_id INT;




ALTER TABLE public.subscriptions ALTER COLUMN tier_price_id SET NOT NULL;


ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_tier_price_id_fkey 
    FOREIGN KEY (tier_price_id) REFERENCES public.tier_prices(id);


ALTER TABLE public.subscriptions DROP CONSTRAINT subscriptions_provider_name_fkey;

ALTER TABLE public.subscriptions DROP COLUMN provider_name;
ALTER TABLE public.subscriptions DROP COLUMN provider_product_id;
ALTER TABLE public.subscriptions DROP COLUMN provider_price_id;

ALTER TABLE public.subscriptions ALTER COLUMN provider_subscription_id DROP NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN provider_customer_id DROP NOT NULL;

DROP INDEX IF EXISTS public.subscriptions_one_active_org_per_product;
DROP INDEX IF EXISTS public.subscriptions_one_active_user_per_product;
DROP INDEX IF EXISTS public.subscriptions_provider_subscription_unique;

CREATE UNIQUE INDEX subscriptions_one_active_org_per_tier 
ON public.subscriptions (organization_id, tier_price_id) 
WHERE (organization_id IS NOT NULL AND status = 'active');

CREATE UNIQUE INDEX subscriptions_one_active_user_per_tier 
ON public.subscriptions (user_id, tier_price_id) 
WHERE (user_id IS NOT NULL AND status = 'active');

CREATE UNIQUE INDEX subscriptions_provider_subscription_id_key ON subscriptions
  USING btree (provider_subscription_id);

		

ALTER TABLE subscriptions DROP COLUMN trial_end;
