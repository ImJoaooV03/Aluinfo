-- Remove the problematic security definer views
DROP VIEW IF EXISTS public.foundries_secure;
DROP VIEW IF EXISTS public.suppliers_secure;

-- Instead, update the frontend to use the existing secure functions
-- Let's verify the issue is properly resolved by testing direct access

-- Test direct table access (this should show the vulnerability if it exists)
-- This is just for verification - the real fix is in the application layer