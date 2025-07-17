/*
  # إنشاء قاعدة البيانات الأساسية للمنصة التعليمية

  1. الجداول الجديدة
    - `profiles` - ملفات المستخدمين الشخصية
    - `classes` - الصفوف الدراسية
    - `videos` - الفيديوهات التعليمية
    - `announcements` - الإعلانات
    - `enrollments` - تسجيل الطلاب في الصفوف

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات الأمان المناسبة لكل دور

  3. البيانات الأولية
    - إضافة الصفوف الدراسية الأساسية
    - إضافة بعض الإعلانات التجريبية
*/

-- إنشاء enum للأدوار
CREATE TYPE user_role AS ENUM ('student', 'trainer', 'admin');

-- إنشاء enum للصفوف الدراسية
CREATE TYPE class_type AS ENUM ('first-general', 'second-water', 'second-sewage', 'third-water', 'third-sewage');

-- جدول الملفات الشخصية
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  student_code text UNIQUE,
  phone text UNIQUE,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  class class_type,
  class_name text,
  specialization text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- جدول الصفوف الدراسية
CREATE TABLE IF NOT EXISTS classes (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  students_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- جدول الفيديوهات
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  class_id text REFERENCES classes(id) ON DELETE CASCADE,
  trainer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  trainer_name text NOT NULL,
  duration text NOT NULL,
  video_url text,
  file_name text,
  upload_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- جدول الإعلانات
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- جدول تسجيل الطلاب في الصفوف
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  class_id text REFERENCES classes(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE(student_id, class_id)
);

-- تفعيل RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للملفات الشخصية
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الأمان للصفوف
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
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الأمان للفيديوهات
CREATE POLICY "Everyone can read videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Trainers can manage their videos"
  ON videos
  FOR ALL
  TO authenticated
  USING (
    trainer_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('trainer', 'admin')
    )
  );

CREATE POLICY "Admins can manage all videos"
  ON videos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الأمان للإعلانات
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
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الأمان للتسجيلات
CREATE POLICY "Students can read own enrollments"
  ON enrollments
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage enrollments"
  ON enrollments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- إدراج البيانات الأولية للصفوف
INSERT INTO classes (id, name, description, students_count) VALUES
  ('first-general', 'الصف الأول - تخصص عام', 'المبادئ الأساسية في هندسة المياه والصرف الصحي', 0),
  ('second-water', 'الصف الثاني - تخصص مياه شرب', 'تقنيات معالجة وتوزيع مياه الشرب', 0),
  ('second-sewage', 'الصف الثاني - تخصص صرف صحي', 'أنظمة جمع ومعالجة مياه الصرف الصحي', 0),
  ('third-water', 'الصف الثالث - تخصص مياه شرب', 'تخصص مياه شرب - المستوى المتقدم', 0),
  ('third-sewage', 'الصف الثالث - تخصص صرف صحي', 'تخصص صرف صحي - المستوى المتقدم', 0);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_videos_class_id ON videos(class_id);
CREATE INDEX IF NOT EXISTS idx_videos_trainer_id ON videos(trainer_id);
CREATE INDEX IF NOT EXISTS idx_announcements_date ON announcements(date DESC);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments(class_id);

-- إنشاء دالة لتحديث عدد الطلاب في الصف
CREATE OR REPLACE FUNCTION update_class_students_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE classes 
    SET students_count = students_count + 1 
    WHERE id = NEW.class_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE classes 
    SET students_count = students_count - 1 
    WHERE id = OLD.class_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- إنشاء trigger لتحديث عدد الطلاب تلقائياً
CREATE TRIGGER trigger_update_class_students_count
  AFTER INSERT OR DELETE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_class_students_count();

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إضافة triggers لتحديث updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();