/*
  # Create users and platform tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `student_code` (text, unique, nullable)
      - `phone` (text, unique, nullable)
      - `email` (text, unique, nullable)
      - `name` (text)
      - `role` (text, default 'student')
      - `class_id` (text, nullable)
      - `class_name` (text, nullable)
      - `specialization` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `announcements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `classes`
      - `id` (text, primary key)
      - `name` (text)
      - `description` (text)
      - `students_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `duration` (text)
      - `trainer` (text)
      - `class_id` (text, foreign key)
      - `video_url` (text, nullable)
      - `file_name` (text, nullable)
      - `upload_date` (date, default today)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for admins to manage all data
    - Add policies for trainers to manage videos and view students
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  student_code text UNIQUE,
  phone text UNIQUE,
  email text UNIQUE,
  name text NOT NULL,
  role text DEFAULT 'student' CHECK (role IN ('student', 'trainer', 'admin')),
  class_id text,
  class_name text,
  specialization text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  students_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  duration text NOT NULL,
  trainer text NOT NULL,
  class_id text NOT NULL REFERENCES classes(id),
  video_url text,
  file_name text,
  upload_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default classes
INSERT INTO classes (id, name, description) VALUES
  ('first-general', 'الصف الأول - تخصص عام', 'المبادئ الأساسية في هندسة المياه والصرف الصحي'),
  ('second-water', 'الصف الثاني - تخصص مياه شرب', 'تقنيات معالجة وتوزيع مياه الشرب'),
  ('second-sewage', 'الصف الثاني - تخصص صرف صحي', 'أنظمة جمع ومعالجة مياه الصرف الصحي'),
  ('third-water', 'الصف الثالث - تخصص مياه شرب', 'تخصص مياه شرب - المستوى المتقدم'),
  ('third-sewage', 'الصف الثالث - تخصص صرف صحي', 'تخصص صرف صحي - المستوى المتقدم')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Announcements policies
CREATE POLICY "Everyone can read announcements"
  ON announcements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Classes policies
CREATE POLICY "Everyone can read classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage classes"
  ON classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Videos policies
CREATE POLICY "Everyone can read videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Trainers and admins can manage videos"
  ON videos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('trainer', 'admin')
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();