/*
  # إصلاح التكرار اللانهائي في سياسات RLS

  1. حذف السياسات القديمة
  2. إنشاء سياسات جديدة بدون تكرار
  3. السماح للمستخدمين المجهولين بإنشاء حسابات
  4. السماح للمستخدمين المصادق عليهم بقراءة وتحديث بياناتهم
*/

-- حذف جميع السياسات الموجودة
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Allow signup" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON users;

-- إنشاء سياسات جديدة بسيطة وآمنة

-- السماح للجميع بإنشاء حسابات جديدة (للتسجيل)
CREATE POLICY "Allow public signup"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- السماح للمستخدمين المصادق عليهم بقراءة بياناتهم الخاصة
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- السماح للمستخدمين المصادق عليهم بتحديث بياناتهم الخاصة
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- السماح للإداريين بقراءة جميع المستخدمين (بدون استعلام فرعي)
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- السماح للإداريين بتحديث جميع المستخدمين
CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );