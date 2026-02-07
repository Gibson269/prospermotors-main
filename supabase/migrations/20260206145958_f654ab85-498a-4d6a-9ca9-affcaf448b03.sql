-- Fix function search path for handle_updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- The "Anyone can create orders" policy is intentionally permissive to allow guest checkout
-- This is a business requirement - customers should be able to place orders without authentication
-- The policy is appropriate for this use case as it only allows INSERT, not UPDATE or DELETE