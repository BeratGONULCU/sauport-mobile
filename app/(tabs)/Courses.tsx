import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  FlatList,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import constants from "expo-constants";
import { FontAwesome, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';


import courseStudents from '../../data/student_courses.json';
import course from '../../data/courses.json';
import rawGroupedCourseDetails from '../../data/grouped_courses.json';
import Announcements from '../../data/announcements.json';

import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';

/*
        TAMAMLANANLAR

    - login ekranında json veriden kontrol yaparak giriş sağlanacak. --> **
    - giriş yapan öğrencinin id ' si ile dersleri bu sayfada listelenecek. --> ** 
    - listelenen derslerin detayları yazacak. --> **
    - courses sayfasındaki yapıda telefonda her satırda bir , pc'de her satırda 2 ders olacak şekilde güncellenecek. **
    - sidemenu içerisine buttonlar açılır yapılacak. **
    - git repo açılacak. **
    - addStudent sayfası ya kapatılacak ya da iletişim sayfasına dönüştürülecek. **
    - derslere tıklanacak ve yeni sayfa açılacak (ders içeriği ve detayları)  (ÖNEMLi) **
    - her dersin altında o ders için kaç adet kaynak,sanal-sınıf,ödev,sınav olduğu yazacak. **

*/

/*       BU SAYFADA YAPILACAKLAR

    Bu sayfada ilgili öğrencinin dersleri listelenecek.
    yapılacaklar;
    - okul api'si alınabilir mi sor?
    - giriş yapan kullanıcı için ayarlamalar yapılmalı (jwt , token , auth , async fln)
    - sidemenu açılma hatası düzelecek. (bilgisayar için)

    önemli not: listelemeden önce güvenlik için ekstra bir şey yapmak gerekir mi? 
*/

type CourseDetail = {
  course_detail_id: string;
  course_id: string;
  academican_id:string;
  course_detail:string;
  code: string;
  file_name: string;
  file_type: string;
  type: string;
  url:string;
  week:string;
  date_start: string;
  date_end: string;
};

export default function CoursesPage() {
  const { user, setCourses } = useAuth();
  const { setSelectedCourse } = useAuth();

  const { width } = useWindowDimensions();
  const numColumns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
  const groupedCourseDetails: Record<string, CourseDetail[]> = rawGroupedCourseDetails.grouped_courses;

  const mergedCourseList = useMemo(() => {
    const courseStudent = courseStudents.student_courses.filter(
      cs => cs.student_id === user?.student_id
    );

    const courseMap = new Map();
    course.courses.forEach(course => {
      courseMap.set(course.course_id, course);
    });

    const courselist = courseStudent
      .map(sc => courseMap.get(sc.course_id))
      .filter(Boolean);

    return courselist.map(course => {
      const details = groupedCourseDetails[course.course_id] || [];
      const kaynakCount = details.filter(d => d.type === "kaynak").length;
      const odevCount = details.filter(d => d.type === "odev").length;
      const sinavCount = details.filter(d => d.type === "sinav").length;
      const sanalCount = details.filter(d => d.type === "sanal-sinif").length;
      name:course.name;

      return {
        ...course,
        name: course.name,
        code:details[0].code,
        kaynakCount,
        odevCount,
        sinavCount,
        sanalCount,
        details,
        type:details[0].type,
        course_detail_id:details[0].course_detail_id,
        academician_id:details[0].academican_id,
        file_name:details[0].file_name,
        file_type:details[0].file_type,
        week:details[0].week,
        date_start:details[0].date_start,
        date_end:details[0].date_end,
      };
    });
  }, [user?.student_id]);

  useEffect(() => {
    if(user)
    {
      setCourses(mergedCourseList);
    }
  }, [mergedCourseList]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.titleFail}>Giriş yapılmamış</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>Giriş Yapmak İçin</Text>
          <FontAwesome name="arrow-right" size={16} color="#fff" />
      </TouchableOpacity>

      </View>
    );
  }

  return (
<View style={styles.container}>
  <FlatList
    data={mergedCourseList}
    keyExtractor={(item, index) => item.course_id || index.toString()}
    numColumns={numColumns}
    key={numColumns}
    ListHeaderComponent={() => (
      <Text style={styles.title}>DERSLER</Text>
    )}
    contentContainerStyle={{ paddingBottom: 30 }} // alt boşluk
    renderItem={({ item }) => (
      // <TouchableOpacity onPress={
      //   () => {
      //       console.log("Tıklanan ders:", item);
      //   setSelectedCourse(item); // tıklanan kursun bilgileri useAuth ile kullanıcı üzerine yazılır.
      //   router.push('/(tabs)/DersDetay')
      //   }}
      // >
<View style={styles.titleItem}>

  <Text
    style={styles.titleCode}
    onPress={() => {
      setSelectedCourse(item);
      router.push('/(tabs)/DersDetay');
    }}
  >
    {item.code || '-'}
  </Text>

  <Text
    style={styles.courseTitle}
    onPress={() => {
      setSelectedCourse(item);
      router.push('/(tabs)/DersDetay');
    }}
  >
    {item.name}
  </Text>

  <Text style={styles.courseTitlePr}>{item.program}</Text>

  <Text style={styles.courseSubtitle}>{"   "} 
    <FontAwesome name="book" size={14} color="#2563eb" /> {item.kaynakCount} {"      |        "}
    <MaterialCommunityIcons name="puzzle-outline" size={14} color="#010101ff" /> {item.odevCount} {"        |        "}
    <MaterialCommunityIcons name="pencil-outline" size={14} color="#f59e0b" /> {item.sinavCount} {"        |        "}
    <FontAwesome name="video-camera" size={14} color="#10b981" /> {item.sanalCount}
  </Text>
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
    fontSize: 14,
    color: '#060c24ff',
    marginBottom: 25,
    marginLeft: 5,
    textAlign: 'left',
    borderBottomColor: '#20389a4a',
    paddingBottom: 0,
  },
  titleFail: {
    fontSize: 20,
    color: '#060c24ff',
    marginBottom: 25,
    marginTop: 250,
    textAlign: 'center',
    borderBottomColor: '#20389a4a',
    paddingBottom: 0,
  },
  titleCode: {
    fontSize: 18,
    color: '#2f2f36bf',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#20389a16',
    paddingBottom: 12,
    // width:'20%',
  },
  titleItem: {
    flex: 1,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    gap:5,
    marginRight: 7,
    overflow: 'hidden',
  },
  courseTitle: {
    fontSize: 18,
    color: '#256bb2',
    paddingTop: 4,
  },
  courseTitlePr: {
    fontSize: 14,
    color: '#0000007b',
    borderBottomWidth: 1,
    borderBottomColor: '#20389a16',
    paddingBottom: 16,
    paddingTop: 8,
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#05154f71',
    paddingTop: 8,
  },
  button: {
    width: '50%',
    backgroundColor: '#101e53ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center', // yatayda ortalamak için
    marginTop: 75,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  }
});
