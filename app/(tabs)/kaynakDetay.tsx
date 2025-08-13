import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { List, PaperProvider } from "react-native-paper";
import { Video, ResizeMode } from "expo-av";
import { WebView } from "react-native-webview";
import Pdf from "react-native-pdf";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import constants from "expo-constants";

import courseStudents from "../../data/student_courses.json";
import course from "../../data/courses.json";
import groupedCourses from "../../data/grouped_courses.json";
import Announcements from "../../data/announcements.json";
import academicians from "../../data/academician.json";
import FileViewerWeb  from "../../components/fileViewer.web";
import FileViewerNative  from "../../components/FileViewer.native";

import { useAuth } from "../../context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";

type CourseDetail = {
  course_detail_id: string;
  course_id: string;
  academician_id: string;
  course_detail: string;
  code: string;
  file_name: string;
  file_type: string;
  type: string;
  url: string;
  week: string;
  date_start: string;
  date_end: string;
};

type Announce = {
  announcement_id: string;
  course_id: string;
  explanation: string;
  explanation_detail: string;
  publisher: string;
  date: string;
  type: string;
  is_important: boolean;
};

type groupedCourses = {
  grouped_courses: Record<string, CourseDetail[]>;
};

export default function kaynakDetailPage() {
  const { user, setCourses, selectedCourse, selectedDetail } = useAuth(); // seçilen ders için useAuth üzerinden bilgi selectedCourse ile fetch edilecek.
  const [expandedID, setExpandedID] = useState<number | null>(null);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const courseDetailID = id;

  //useAuth();  course set edilecek. gelince dizi halinde
  const { width } = useWindowDimensions();
  const numColumns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;

  const mergedCourseList = useMemo(() => {
    if (!user) return [];
    const courseStudent = courseStudents.student_courses.filter(
      (cs) => cs.student_id === user.student_id
    );

    const courseMap = new Map();
    course.courses.forEach((course) => {
      courseMap.set(course.course_id, course);
    });

    const courselist = courseStudent
      .map((sc) => courseMap.get(sc.course_id))
      .filter(Boolean);

    const detailMap = new Map();
    Object.entries(groupedCourses.grouped_courses).forEach(
      ([course_id, details]) => {
        detailMap.set(course_id, details);
      }
    );
    // courseDetails.grouped_courses.forEach((detail: CourseDetail) => {
    //   detailMap.set(detail.course_id, detail);
    // });

    return courselist.map((course) => {
      const detail = detailMap.get(course.course_id);
      return {
        ...course,
        ...detail,
        name: course.name,
      };
    });
  }, [user?.student_id]);

  // Dersleri Auth'a at

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.titleFail}>Giriş yapılmamış</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/")}
        >
          <Text style={styles.buttonText}>Giriş Yapmak İçin</Text>
          <FontAwesome name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  const handlePress = (id: number) => {
    setExpandedID((prev) => (prev === id ? null : id)); // accordionlist içerisinde id değeri ile bir tane açık kalacak
  };

  // accordionList (false = closed)

  const groupedCoursesData = groupedCourses as unknown as groupedCourses;

  const courseID = selectedCourse?.course_id;

  return (
    <PaperProvider>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.detailText}>
              {selectedCourse?.code} - {selectedCourse?.name}
            </Text>
          </View>

          {/* kaynaklar Bilgisi */}
          {/* 
      Bu kısımda courseDetailID verisi ile seçilen kaynağın detayları gösterilecek.
      yazdırılabilecek,filtrelenebilecek,açılabilecek
     */}

          {/* farklı kaynakların dinamik olarak gösterileceği kısım */}
          <View style={styles.card}>
            <Text style={styles.title}>Kaynak Detayları</Text>
            <FileViewerWeb fileUrl={selectedDetail?.url} fileType={selectedDetail?.file_type}/>
          </View>

          {/* kaynak Detayları */}
          <View style={styles.card}>
            <Text style={styles.title}>Aktivite Bilgileri</Text>

            <Text style={styles.detailLabel}>Hafta</Text>
            <Text style={styles.detailText}>
              {selectedDetail?.week}.hafta/ 14.hafta
            </Text>
          </View>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f2f8",
    paddingHorizontal: 20,
    paddingTop: 20,
    width: "100%",
  },
  title: {
    fontSize: 15,
    color: "#060c24ff",
    marginBottom: 15,
    marginLeft: 0,
    textAlign: "left",
    borderBottomWidth: 1,
    borderBottomColor: "#20389a23",
    paddingBottom: 10,
  },
  titleFail: {
    fontSize: 20,
    color: "#060c24ff",
    marginBottom: 25,
    marginTop: 250,
    textAlign: "center",
    borderBottomColor: "#20389a4a",
    paddingBottom: 0,
  },
  titleCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00000fbf",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#20389a16",
    paddingBottom: 16,
  },
  titleItem: {
    flex: 1,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    gap: 5,
    marginRight: 7,
    overflow: "hidden",
  },
  courseTitle: {
    fontSize: 18,
    color: "#256bb2",
    paddingTop: 8,
  },
  courseTitlePr: {
    fontSize: 14,
    color: "#0000007b",
    borderBottomWidth: 1,
    borderBottomColor: "#20389a16",
    paddingBottom: 16,
    paddingTop: 8,
  },
  courseSubtitle: {
    fontSize: 14,
    color: "#05154f71",
    paddingTop: 8,
  },
  button: {
    width: "50%",
    backgroundColor: "#101e53ff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center", // yatayda ortalamak için
    marginTop: 75,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardRow: {
    backgroundColor: "#efefef42",
    padding: 15,
    marginBottom: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    fontFamily: Platform.OS === "ios" ? "Helvetica" : "sans-serif",
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#256bb2",
    marginBottom: 10,
  },
  assignmentStatus: {
    fontSize: 15,
    color: "#374151d5",
    marginBottom: 10,
    backgroundColor: "#ffffffff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#c4c4c4a2",
    padding: 10,
    marginTop: 5,
  },
  assignmentInfo: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 3,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#256bb2",
    marginBottom: 7,
  },
  detailLabelRight: {
    fontSize: 13,
    fontWeight: "500",
    color: "#256bb2",
    marginBottom: 7,
    alignSelf: "flex-end",
  },
  detailText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 5,
  },
});
