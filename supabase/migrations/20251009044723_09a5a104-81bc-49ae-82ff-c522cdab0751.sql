-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student', 'parent');

-- Create enum for attendance status
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

-- Create enum for assignment/submission status
CREATE TYPE public.assignment_status AS ENUM ('draft', 'published', 'closed');
CREATE TYPE public.submission_status AS ENUM ('pending', 'submitted', 'graded', 'late');

-- 1. Profiles table (extended user information)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. User roles table (CRITICAL: separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- 3. Schools table (for future multi-school support)
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  theme_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Academic years
CREATE TABLE public.academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  school_id UUID REFERENCES public.schools(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Classes (grade levels)
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  level INTEGER,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Sections (class divisions)
CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  section_name TEXT NOT NULL,
  max_students INTEGER DEFAULT 30,
  teacher_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(class_id, section_name)
);

-- 7. Subjects
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  description TEXT,
  credit_hours INTEGER DEFAULT 3,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 8. Enrollments (student-to-section assignments)
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  academic_year_id UUID REFERENCES public.academic_years(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(student_id, section_id, academic_year_id)
);

-- 9. Assignments
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id),
  teacher_id UUID REFERENCES auth.users(id) NOT NULL,
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ,
  max_points INTEGER DEFAULT 100,
  assignment_type TEXT DEFAULT 'homework',
  attachments JSONB DEFAULT '[]'::jsonb,
  status assignment_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 10. Submissions
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  status submission_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(assignment_id, student_id)
);

-- 11. Grades
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL UNIQUE,
  points_earned DECIMAL(5,2),
  feedback TEXT,
  graded_by UUID REFERENCES auth.users(id),
  graded_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 12. Learning materials
CREATE TABLE public.learning_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  material_type TEXT CHECK (material_type IN ('pdf', 'video', 'document', 'link', 'other')),
  file_url TEXT,
  subject_id UUID REFERENCES public.subjects(id),
  section_id UUID REFERENCES public.sections(id),
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 13. Attendance
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE NOT NULL,
  attendance_date DATE NOT NULL,
  status attendance_status DEFAULT 'present',
  marked_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(student_id, section_id, attendance_date)
);

-- 14. Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  thread_id UUID,
  read_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 15. Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 16. Timetables
CREATE TABLE public.timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) NOT NULL,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 17. Exams
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id),
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
  exam_date TIMESTAMPTZ,
  duration_minutes INTEGER,
  total_marks INTEGER DEFAULT 100,
  questions JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 18. Exam attempts
CREATE TABLE public.exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  answers JSONB DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ,
  score DECIMAL(5,2),
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(exam_id, student_id)
);

-- Security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_roles (CRITICAL - only admins can manage)
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for schools
CREATE POLICY "Everyone can view schools" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Admins can manage schools" ON public.schools FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for academic_years
CREATE POLICY "Everyone can view academic years" ON public.academic_years FOR SELECT USING (true);
CREATE POLICY "Admins can manage academic years" ON public.academic_years FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for classes
CREATE POLICY "Everyone can view classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for sections
CREATE POLICY "Everyone can view sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Admins can manage sections" ON public.sections FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can update their sections" ON public.sections FOR UPDATE USING (teacher_id = auth.uid());

-- RLS Policies for subjects
CREATE POLICY "Everyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for enrollments
CREATE POLICY "Students can view own enrollments" ON public.enrollments FOR SELECT USING (
  student_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher')
);
CREATE POLICY "Admins can manage enrollments" ON public.enrollments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for assignments
CREATE POLICY "Students can view published assignments in their sections" ON public.assignments FOR SELECT USING (
  status = 'published' AND (
    section_id IN (SELECT section_id FROM public.enrollments WHERE student_id = auth.uid())
    OR public.has_role(auth.uid(), 'teacher')
    OR public.has_role(auth.uid(), 'admin')
  )
);
CREATE POLICY "Teachers can manage own assignments" ON public.assignments FOR ALL USING (
  teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for submissions
CREATE POLICY "Students can view own submissions" ON public.submissions FOR SELECT USING (
  student_id = auth.uid() OR 
  assignment_id IN (SELECT id FROM public.assignments WHERE teacher_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Students can insert own submissions" ON public.submissions FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update own submissions" ON public.submissions FOR UPDATE USING (
  student_id = auth.uid() AND status = 'pending'
);

-- RLS Policies for grades
CREATE POLICY "Students can view own grades" ON public.grades FOR SELECT USING (
  submission_id IN (SELECT id FROM public.submissions WHERE student_id = auth.uid()) OR
  public.has_role(auth.uid(), 'teacher') OR
  public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Teachers can manage grades" ON public.grades FOR ALL USING (
  public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for learning_materials
CREATE POLICY "Students can view materials for their sections" ON public.learning_materials FOR SELECT USING (
  section_id IN (SELECT section_id FROM public.enrollments WHERE student_id = auth.uid()) OR
  public.has_role(auth.uid(), 'teacher') OR
  public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Teachers can manage learning materials" ON public.learning_materials FOR ALL USING (
  public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for attendance
CREATE POLICY "Students can view own attendance" ON public.attendance FOR SELECT USING (
  student_id = auth.uid() OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Teachers can manage attendance" ON public.attendance FOR ALL USING (
  public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for messages
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- RLS Policies for timetables
CREATE POLICY "Students can view timetables for their sections" ON public.timetables FOR SELECT USING (
  section_id IN (SELECT section_id FROM public.enrollments WHERE student_id = auth.uid()) OR
  teacher_id = auth.uid() OR
  public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Admins can manage timetables" ON public.timetables FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for exams
CREATE POLICY "Students can view published exams for their sections" ON public.exams FOR SELECT USING (
  section_id IN (SELECT section_id FROM public.enrollments WHERE student_id = auth.uid()) OR
  public.has_role(auth.uid(), 'teacher') OR
  public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Teachers can manage exams" ON public.exams FOR ALL USING (
  public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for exam_attempts
CREATE POLICY "Students can view own exam attempts" ON public.exam_attempts FOR SELECT USING (
  student_id = auth.uid() OR
  exam_id IN (SELECT id FROM public.exams WHERE created_by = auth.uid()) OR
  public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Students can create own exam attempts" ON public.exam_attempts FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update own pending attempts" ON public.exam_attempts FOR UPDATE USING (
  student_id = auth.uid() AND submitted_at IS NULL
);
CREATE POLICY "Teachers can grade exam attempts" ON public.exam_attempts FOR UPDATE USING (
  public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin')
);