-- Temporary: Disable RLS on cars table to test if that's the issue
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'cars';
