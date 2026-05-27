/*
  # Fix Verses RLS Policy for Public Insert

  1. Changes
    - Drop existing INSERT policy that requires authentication
    - Create new INSERT policy allowing public inserts
    - This allows the admin panel to add verses without authentication
  
  2. Security Notes
    - SELECT remains public (already working)
    - INSERT is now public (allows admin panel to work)
    - For production, consider adding authentication to the admin panel
*/

-- Drop the old authenticated-only INSERT policy
DROP POLICY IF EXISTS "Authenticated users can add verses" ON verses;

-- Create new public INSERT policy
CREATE POLICY "Public can add verses"
  ON verses FOR INSERT
  TO public
  WITH CHECK (true);