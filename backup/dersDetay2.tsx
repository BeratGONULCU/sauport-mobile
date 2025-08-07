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

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import constants from "expo-constants";

import courseStudents from "../data/student_courses.json";
import course from "../data/courses.json";
import groupedCourses from "../data/grouped_courses.json";
import Announcements from "../data/announcements.json";
import academicians from "../data/academician.json";

import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
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

export default function CoursesPage() {
  const { user, setCourses, selectedCourse } = useAuth(); // seçilen ders için useAuth üzerinden bilgi selectedCourse ile fetch edilecek.
  const [activeTab, setActiveTab] = useState("Aktiviteler");
  const [expandedID, setExpandedID] = useState<number | null>(null);

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
  useEffect(() => {
    setCourses(mergedCourseList);
  }, [mergedCourseList]);

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

  const matchedAcademicans = academicians.academician.find(
    (a) => a.academician_id === selectedCourse?.academician_id
  );

  const handlePress = (id: number) => {
    setExpandedID((prev) => (prev === id ? null : id));
  };

  // accordionList (false = closed)

  return (
    <PaperProvider>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.detailLabel}>
              Ders Adı: {selectedCourse?.name}
            </Text>
            <Text style={styles.detailText}>
              Program: {selectedCourse?.program}
            </Text>
          </View>

          {/* kaynaklar Bilgisi */}
          {/* 
      Bu kısımda döngü ile her haftanın kaynakları gösterilecek.
      yazdırılabilecek,filtrelenebilecek,açılabilecek, 
     */}

          {/* Sekmeli Ders Kartı */}
          <View style={styles.card}>
            <Text style={styles.title}>Ders İçeriği</Text>

            {/* Sekmeler */}
            <View style={styles.tabHeader}>
              {["Aktiviteler", "Kaynak", "Sanal Sınıf", "Sınav", "Ödev"].map(
                (tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tabButton,
                      activeTab === tab && styles.activeTabButton,
                    ]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === tab && styles.activeTabText,
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            {/* Sekme İçeriği */}
            <View style={styles.tabContent}>
              {activeTab === "Aktiviteler" && (
                <View style={styles.cardRow}>
                  <Text style={styles.assignmentInfo}>
                    Dosya Adı: {selectedCourse?.file_name}
                  </Text>
                  <Text style={styles.assignmentInfo}>
                    Son Teslim: {selectedCourse?.date_start}
                  </Text>
                  <Text style={styles.assignmentInfo}>
                    Açıklama: {selectedCourse?.date_end}
                  </Text>
                  <Text style={styles.assignmentInfo}>
                    Hafta: {selectedCourse?.week}
                  </Text>
                </View>
              )}
              {activeTab === "Kaynak" && (
                <View style={styles.cardRow}>
                  <List.Section style={{backgroundColor: '#000'}} >
                    <List.Accordion
                      title="Hafta 1"
                      titleStyle={{ color: '#333' }} 
                      style={{ backgroundColor: '#f0f0f0', marginBottom: 0.3, shadowColor:'#fff',borderRadius:5 }} // dış kutu
                      theme={{ colors: { background: '#f0f0f0' } }}
                      left={(props) => <List.Icon {...props} icon="folder" />}
                      expanded={expandedID === 1}
                      onPress={() => handlePress(1)}
                    >
                      <List.Item 
                        title="First item" 
                        titleStyle={{ color: 'gray', fontSize: 14 }}
                        style={{ backgroundColor: '#fff', paddingVertical: 6 }}
                      />
                      <List.Item 
                        title="Second item" 
                        titleStyle={{ color: 'gray', fontSize: 14 }}
                        style={{ backgroundColor: '#fff', paddingVertical: 6 }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      title="Hafta 2"
                      titleStyle={{ color: '#333' }} 
                      style={{ backgroundColor: '#f0f0f0', marginBottom: 0.3 }} // dış kutu
                      theme={{ colors: { background: '#f0f0f0' } }}
                      left={(props) => <List.Icon {...props} icon="folder" />}
                      expanded={expandedID === 2}
                      onPress={() => handlePress(2)}
                    >
                      <List.Item 
                        title="First item" 
                        titleStyle={{ color: 'gray', fontSize: 14 }}
                        style={{ backgroundColor: '#fff', paddingVertical: 6 }} 
                      />
                      <List.Item 
                        title="Second item" 
                        titleStyle={{ color: 'gray', fontSize: 14 }}
                        style={{ backgroundColor: '#fff', paddingVertical: 6 }} 
                      />                    
                    </List.Accordion>

                    <List.Accordion
                      title="Hafta 3"
                      titleStyle={{ color: '#333' }} 
                      style={{ backgroundColor: '#f0f0f0', marginBottom: 0.3 }} // dış kutu
                      theme={{ colors: { background: '#f0f0f0' } }}
                      left={(props) => <List.Icon {...props} icon="folder" />}
                      expanded={expandedID === 3}
                      onPress={() => handlePress(3)}
                    >
                      <List.Item 
                        title="First item" 
                        titleStyle={{ color: 'gray', fontSize: 14, marginLeft: -40 }}
                        style={{ backgroundColor: '#fff', paddingVertical: 6 }} 
                      />
                      <List.Item 
                        title="First item" 
                        titleStyle={{ color: 'gray', fontSize: 14 }}
                        style={{ backgroundColor: '#fff', paddingVertical: 6 }} 
                      />                    
                    </List.Accordion>
                  </List.Section>
                </View>
              )}
              {activeTab === "Sanal Sınıf" && (
                <View style={styles.cardRow}>
                  <Text style={styles.assignmentInfo}>
                    Henüz bilgi eklenmedi.
                  </Text>
                </View>
              )}
              {activeTab === "Sınav" && (
                <View style={styles.cardRow}>
                  <Text style={styles.assignmentInfo}>
                    Henüz bilgi eklenmedi.
                  </Text>
                </View>
              )}
              {activeTab === "Ödev" && (
                <View style={styles.cardRow}>
                  <Text style={styles.assignmentInfo}>
                    Henüz bilgi eklenmedi.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Ders Detayları */}
          <View style={styles.card}>
            <Text style={styles.title}>Ders Detayları</Text>

            <Text style={styles.detailLabel}>Program:</Text>
            <Text style={styles.detailText}>{selectedCourse?.program}</Text>

            <Text style={styles.detailLabel}>Ders Kodu:</Text>
            <Text style={styles.detailText}>{selectedCourse?.code}</Text>

            <Text style={styles.detailLabel}>Ders Adı:</Text>
            <Text style={styles.detailText}>{selectedCourse?.name}</Text>

            <Text style={styles.detailLabel}>Dönem:</Text>
            <Text style={styles.detailText}>18.02.2025 - 31.08.2025</Text>

            <Text style={styles.detailLabel}>Öğretim Üyesi:</Text>
            <Text style={styles.assignmentStatus}>
              {matchedAcademicans?.name} {matchedAcademicans?.surname}{" "}
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
    backgroundColor: "#f3f3f3fa",
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
    fontSize: 12,
    color: "#26b089ff",
    marginBottom: 10,
    backgroundColor: "#d3f4ee",
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    borderRadius: 5,
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
    fontSize: 13,
    color: "#374151",
    marginBottom: 5,
  },
  tabHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 15,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#256bb280",
    margin: 2,
    minWidth: 75,
    alignItems: "center",
    width: 97,
  },
  activeTabButton: {
    borderBottomWidth: 1,
    borderColor: "#256bb2",
  },
  tabText: {
    fontSize: 13,
    color: "#374151d5",
  },
  activeTabText: {
    color: "#256bb2",
  },
  tabContent: {
    marginTop: 10,
  },
});
