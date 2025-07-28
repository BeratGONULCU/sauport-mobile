import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useWindowDimensions,
} from 'react-native';

import courseStudents from '../../data/student_courses.json';
import course from '../../data/courses.json';
import courseDetails from '../../data/course_details.json';

import { useAuth } from '../../context/AuthContext';

type CourseDetail = {
  course_detail_id: string;
  course_id: string;
  code: string;
  file_name: string;
  file_type: string;
  type: string;
  date_start: string;
  date_end: string;
};

export default function CoursesPage() {
  const { user, setCourses } = useAuth();
  const { width } = useWindowDimensions();
  const numColumns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Giriş yapılmamış</Text>
      </View>
    );
  }

  // 🧠 useMemo ile sabit course listesi oluştur
  const mergedCourseList = useMemo(() => {
    const courseStudent = courseStudents.student_courses.filter(
      cs => cs.student_id === user.student_id
    );

    const courseMap = new Map();
    course.courses.forEach(course => {
      courseMap.set(course.course_id, course);
    });

    const courselist = courseStudent
      .map(sc => courseMap.get(sc.course_id))
      .filter(Boolean);

    const detailMap = new Map();
    courseDetails.course_details.forEach((detail: CourseDetail) => {
      detailMap.set(detail.course_id, detail);
    });

    return courselist.map(course => {
      const detail = detailMap.get(course.course_id);
      return {
        ...course,
        ...detail,
        name: course.name,
      };
    });
  }, [user.student_id]); // sadece kullanıcı değişirse yeniden hesapla

  // 🔁 setCourses sonsuz döngüye girmesin diye burada tek sefer çalışır
  useEffect(() => {
    setCourses(mergedCourseList);
  }, [mergedCourseList]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hoşgeldin, {user.name} {user.surname}
      </Text>

      <FlatList
        data={mergedCourseList}
        keyExtractor={(item, index) => item.course_id || index.toString()}
        numColumns={numColumns}
        key={numColumns}
        renderItem={({ item }) => (
          <View style={styles.titleItem}>
            <Text style={styles.titleCode}>{item.code || '-'}</Text>
            <Text style={styles.courseTitle}>{item.name}</Text>
            <Text style={styles.courseSubtitle}>{item.file_type || '-'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3fa',
    paddingHorizontal: 20,
    paddingTop: 20,
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#060c24ff',
    marginBottom: 25,
    textAlign: 'center',
    borderBottomWidth: 0.1,
    borderBottomColor: '#20389a4a',
    paddingBottom: 5,
  },
  titleCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00000fbf',
    marginBottom: 10,
    borderBottomWidth: 0.1,
    borderBottomColor: '#20389a4a',
  },
  titleItem: {
    flex: 1,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    minWidth: 385,
    maxWidth: '75%',
    marginRight: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#256bb2',
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#05154f71',
    marginTop: 4,
  },
});
