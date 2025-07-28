import { v4 as uuidv4 } from 'uuid';
import * as FileSystem from 'expo-file-system';

// Öğrenci tipi
export interface Student {
  student_id?: string;
  name: string;
  surname: string;
  number: string;
  email: string;
  program: string;
  password: string;
}

const path = '../data/student.json'; // → gerçek dosya yolu

// ✅ Öğrenci ekleme
export const addStudent = async (newStudentData: Omit<Student, 'student_id'>): Promise<boolean> => {
  try {
    // Dosya içeriğini oku
    const file = await FileSystem.readAsStringAsync(path).catch(() => '[]');
    const students: Student[] = JSON.parse(file);

    const newStudent: Student = {
      ...newStudentData,
      student_id: uuidv4(),
    };

    students.push(newStudent);

    // Dosyaya yaz
    await FileSystem.writeAsStringAsync(path, JSON.stringify(students, null, 2));

    console.log('✅ Öğrenci başarıyla eklendi:', newStudent);
    return true;
  } catch (error) {
    console.error('❌ Öğrenci eklenirken hata:', error);
    return false;
  }
};

// 🔍 Öğrenci listesini oku
export const getStudents = async (): Promise<Student[]> => {
  try {
    const file = await FileSystem.readAsStringAsync(path).catch(() => '[]');
    return JSON.parse(file);
  } catch (error) {
    console.error('❌ Öğrenciler okunamadı:', error);
    return [];
  }
};

// 📁 Dosya yolunu logla (debug amaçlı)
export const logFilePath = () => {
  console.log('📂 Dosya konumu:', path);
};
