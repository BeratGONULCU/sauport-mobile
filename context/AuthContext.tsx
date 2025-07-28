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
  name: ReactNode;
  program: ReactNode;
  course_detail_id: string;
  course_id: string;
  code: string;
  file_name: string;
  file_type: string;
  type:string;
  date_start: string;
  date_end: string;
};

// Context tipi
interface AuthContextType {
  user: Student | null;
  setUser: React.Dispatch<React.SetStateAction<Student | null>>;
  courses: CourseDetail[];
  setCourses: React.Dispatch<React.SetStateAction<CourseDetail[]>>;
}

// Context oluştur (başlangıçta null)
const AuthContext = createContext<AuthContextType | null>(null);

// Provider bileşeni
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Student | null>(null);
  const [courses, setCourses] = useState<CourseDetail[]>([]);

  return (
    <AuthContext.Provider value={{ user, setUser, courses, setCourses }}>
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
