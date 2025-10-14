-- Create storage bucket for assignment files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assignments', 'assignments', false)
ON CONFLICT (id) DO NOTHING;

-- Create policies for assignment file uploads
CREATE POLICY "Users can upload their own assignment files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assignments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own assignment files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignments' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR
   has_role(auth.uid(), 'teacher') OR
   has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Teachers and admins can view all assignment files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignments' AND
  (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'))
);

-- Enable realtime for notifications
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;