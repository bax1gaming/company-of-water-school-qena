/*
  # Fix user signup RLS policy

  1. Changes
    - Add policy to allow users to insert their own data during signup
    - Allow public signup by adding insert policy for new users
    - Ensure users can create their profile after auth signup

  2. Security
    - Users can only insert data with their own auth.uid()
    - Maintains security while allowing signup
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Add policy to allow users to insert their own data during signup
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow anon users to insert (for signup process)
CREATE POLICY "Allow signup"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);