import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useWindowDimensions,
  Platform,
} from 'react-native';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import constants from "expo-constants";

import courseStudents from '../../data/student_courses.json';
import course from '../../data/courses.json';
import courseDetails from '../../data/course_details.json';
import Announcements from '../../data/announcements.json';

import { useAuth } from '../../context/AuthContext';

/*
        TAMAMLANANLAR

    - login ekranında json veriden kontrol yaparak giriş sağlanacak. --> **
    - giriş yapan öğrencinin id ' si ile dersleri bu sayfada listelenecek. --> ** 
    - listelenen derslerin detayları yazacak. --> **
    - courses sayfasındaki yapıda telefonda her satırda bir , pc'de her satırda 2 ders olacak şekilde güncellenecek. **
    - sidemenu içerisine buttonlar açılır yapılacak. **
    - git repo açılacak. **
    - addStudent sayfası ya kapatılacak ya da iletişim sayfasına dönüştürülecek. **

*/

/*       BU SAYFADA YAPILACAKLAR

    Bu sayfada ilgili öğrencinin dersleri listelenecek.
    yapılacaklar;
    - okul api'si alınabilir mi sor?
    - giriş yapan kullanıcı için ayarlamalar yapılmalı (jwt , token , auth , async fln)
    - derslere tıklanacak ve yeni sayfa açılacak (ders içeriği ve detayları)  (ÖNEMLi)
    - her dersin altında o ders için kaç adet kaynak,sanal-sınıf,ödev,sınav olduğu yazacak.
    - sidemenu açılma hatası düzelecek.

    önemli not: listelemeden önce güvenlik için ekstra bir şey yapmak gerekir mi? 
*/

type CourseDetail = {
  course_detail_id: string;
  course_id: string;
  course_detail:string;
  code: string;
  file_name: string;
  file_type: string;
  type: string;
  url:string;
  date_start: string;
  date_end: string;
};

type Announce = {
  announcement_id:string;
  course_id:string;
  explanation:string;
  explanation_detail:string;
  publisher:string;
  date:string;
  type:string;
  is_important:boolean;
};

// Bildirim gönderme fonksiyonu
async function sendPushNotification(expoPushToken: string, message: string) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title: 'Yeni Duyuru',
      body: message,
    }),
  });
}


export default function CoursesPage() {
  const { user, setCourses } = useAuth();
  const { width } = useWindowDimensions();
  const numColumns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.titleFail}>Giriş yapılmamış</Text>
      </View>
    );
  }

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
  }, [user.student_id]);

  // 🔄 Dersleri Auth'a at
  useEffect(() => {
    setCourses(mergedCourseList);
  }, [mergedCourseList]);

  // Push token alma
  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          console.log('Expo Push Token:', token);
          // TODO: istersen token'ı sunucuya gönder
        }
      });
    }
  }, [user]);

  useEffect(() => {
  registerForPushNotificationsAsync().then(token => {
    if (token) {
      const important = Announcements.announcements.find(
          d => d.is_important === true
      );

      if (important) {
        sendPushNotification(token, important.explanation);
      }
    }
  });
}, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>DERSLER</Text>

      <FlatList
        data={mergedCourseList}
        keyExtractor={(item, index) => item.course_id || index.toString()}
        numColumns={numColumns}
        key={numColumns}
        renderItem={({ item }) => (
          <View style={styles.titleItem}>
            <Text style={styles.titleCode}>{item.code || '-'}</Text>
            <Text style={styles.courseTitle}>{item.name}</Text>
            <Text style={styles.courseTitlePr}>{item.program}</Text>
            <Text style={styles.courseSubtitle}>{item.file_type || '-'}</Text>
          </View>
        )}
      />
    </View>
  );
}

//Bildirim izin/token fonksiyonu
async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Bildirim izni verilmedi.');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log("token:",tokenData.data);
    return tokenData.data;
  } else {
    alert('Gerçek cihazda test etmelisin.');
    return null;
  }
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
    fontWeight: 'bold',
    color: '#00000fbf',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#20389a16',
    paddingBottom: 16,
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
    paddingTop: 8,
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
});