import { Routes, Route, Navigate } from "react-router-dom";
import { StudentLayout } from "@/components/student/StudentLayout";
import { StudentCourses } from "@/components/student/StudentCourses";
import { StudentAssignments } from "@/components/student/StudentAssignments";
import { StudentGrades } from "@/components/student/StudentGrades";
import { StudentSchedule } from "@/components/student/StudentSchedule";
import { StudentMaterials } from "@/components/student/StudentMaterials";
import { MessagesPage } from "@/components/shared/MessagesPage";
import { ProfilePage } from "@/components/shared/ProfilePage";

export default function StudentDashboard() {
  return (
    <StudentLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/student/courses" replace />} />
        <Route path="/courses" element={<StudentCourses />} />
        <Route path="/assignments" element={<StudentAssignments />} />
        <Route path="/grades" element={<StudentGrades />} />
        <Route path="/schedule" element={<StudentSchedule />} />
        <Route path="/materials" element={<StudentMaterials />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </StudentLayout>
  );
}