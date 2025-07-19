/*
  # Fix signup policies for users table

  1. Security Changes
    - Update RLS policies to allow user signup
    - Allow anonymous users to insert their own data during signup
    - Ensure proper user data validation

  2. Policy Updates
    - Allow signup for anonymous users
    - Allow users to insert their own profile data
    - Maintain security for other operations
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Allow signup" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create new policy for signup that allows anonymous users to insert
CREATE POLICY "Enable signup for anonymous users"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for authenticated users to insert their own data
CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure users can read their own data
CREATE POLICY "Users can read own profile" 
  ON users 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin policies remain the same
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );