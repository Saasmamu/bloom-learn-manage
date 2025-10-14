import { Routes, Route, Navigate } from "react-router-dom";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { TeacherClasses } from "@/components/teacher/TeacherClasses";
import { TeacherAssignments } from "@/components/teacher/TeacherAssignments";
import { TeacherGrading } from "@/components/teacher/TeacherGrading";
import { TeacherAttendance } from "@/components/teacher/TeacherAttendance";

export default function TeacherDashboard() {
  return (
    <TeacherLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/teacher/classes" replace />} />
        <Route path="/classes" element={<TeacherClasses />} />
        <Route path="/assignments" element={<TeacherAssignments />} />
        <Route path="/grading" element={<TeacherGrading />} />
        <Route path="/attendance" element={<TeacherAttendance />} />
        <Route path="/materials" element={<div>Materials coming soon</div>} />
        <Route path="/students" element={<div>Students coming soon</div>} />
      </Routes>
    </TeacherLayout>
  );
}
