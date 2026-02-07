-- Fix RLS policies for cars table
-- Drop existing policies that might be failing
DROP POLICY IF EXISTS "Anyone can view cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can insert cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can update cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can delete cars" ON public.cars;

-- Disable RLS temporarily to ensure data is accessible
ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Create simple policies
-- Allow everyone to read cars
CREATE POLICY "cars_select_policy" ON public.cars
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow only admins to insert
CREATE POLICY "cars_insert_policy" ON public.cars
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow only admins to update
CREATE POLICY "cars_update_policy" ON public.cars
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow only admins to delete
CREATE POLICY "cars_delete_policy" ON public.cars
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Verify policies are created
SELECT tablename, policyname FROM pg_policies WHERE tablename = 'cars';
