-- Drop existing policy first
DROP POLICY IF EXISTS "Allow admins to view all links" ON public.links;

-- Add is_admin column to auth.users if it doesn't exist
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.get_users();
DROP FUNCTION IF EXISTS public.get_user_count();
DROP FUNCTION IF EXISTS public.toggle_user_status(user_id uuid);

-- Create the admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT COALESCE(
        (SELECT is_admin FROM auth.users WHERE id = auth.uid()),
        false
    );
$$;

-- Create function to get user count (admin only)
CREATE OR REPLACE FUNCTION public.get_user_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (SELECT public.is_admin()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  RETURN (SELECT COUNT(*) FROM auth.users);
END;
$$;

-- Create function to get users list (admin only)
CREATE OR REPLACE FUNCTION public.get_users()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  is_admin boolean,
  last_sign_in_at timestamptz,
  active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (SELECT public.is_admin()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.created_at,
    u.is_admin,
    u.last_sign_in_at,
    u.active
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$;

-- Create function to toggle user status (admin only)
CREATE OR REPLACE FUNCTION public.toggle_user_status(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (SELECT public.is_admin()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE auth.users
  SET active = NOT active
  WHERE id = user_id
  AND NOT is_admin; -- Prevent toggling admin users
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_user_status(uuid) TO authenticated;

-- Set admin email (make sure this only runs if not already admin)
UPDATE auth.users
SET is_admin = true
WHERE email = 'deanfieldz@protonmail.com'
AND (is_admin IS NULL OR is_admin = false);

-- Create policy
CREATE POLICY "Allow admins to view all links"
ON public.links
FOR SELECT
TO authenticated
USING (
    (SELECT public.is_admin()) OR user_id = auth.uid()
); 