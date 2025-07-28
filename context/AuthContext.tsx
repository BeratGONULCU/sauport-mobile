import React, { createContext, useState, useContext, ReactNode } from 'react';

// Kullanıcı ve kurs tiplerini tanımlayabilirsin
type Student = {
  student_id: string;
  name: string;
  surname: string;
  number: string;
  email: string;
  program: string;
  password: string;
};

type CourseDetail = {
  course_id: string;
  course_detail_id: string;
  name: ReactNode;
  program: ReactNode;
  course_detail:string;
  code: string;
  file_name: string;
  file_type: string;
  url: string;
  type:string;
  date_start: string;
  date_end: string;
};


type Announcements = {
  announcement_id: string;
  course_id: string;
  explanation: string;
  explanation_detail: string;
  publisher?: string;
  date: string;
  type: string;
  is_important:boolean;
};


// Context tipi
interface AuthContextType {
  user: Student | null;
  setUser: React.Dispatch<React.SetStateAction<Student | null>>;
  courses: CourseDetail[];
  setCourses: React.Dispatch<React.SetStateAction<CourseDetail[]>>;
  announces: Announcements[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcements[]>>
}

// Context oluştur (başlangıçta null)
const AuthContext = createContext<AuthContextType | null>(null);

// Provider bileşeni
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Student | null>(null);
  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const [announces, setAnnouncements] = useState<Announcements[]>([]);

  return (
    <AuthContext.Provider value={{ user, setUser, courses, setCourses , announces , setAnnouncements }}>
      {children}
    </AuthContext.Provider>
  );
};

// Kolay erişim için özel hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
