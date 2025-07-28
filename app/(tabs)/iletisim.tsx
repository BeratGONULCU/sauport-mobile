import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import announcements from '../../data/announcements.json';

export default function IletisimPage() {
  const { user, courses } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Duyurular</Text>

      {courses.map((course, i) => {
        const related = announcements.announcements.filter(
          a => a.course_id === course.course_id
        );

        return related.map((a, j) => (
          <TouchableOpacity
            key={`${i}-${j}`}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedAnnouncement({ ...a, courseName: course.name });
              setModalVisible(true);
            }}
          >
            <View style={styles.row}>
              <Text style={styles.title}>{a.explanation}</Text>
              <Text style={[styles.status, { color: '#4CAF50' }]}>✓ Okundu</Text>
            </View>

            <Text style={styles.courseName}>{course.name}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.date}>{a.date}</Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      a.type === 'Sınıfa Özel' ? '#00bfa5' : '#256bb2',
                  },
                ]}
              >
                <Text style={styles.badgeText}>{a.type}</Text>
              </View>
              <Text style={styles.publisher}>👤 {a.publisher || 'Sistem'}</Text>
              <Text style={styles.view}>👁️</Text>
            </View>
          </TouchableOpacity>
        ));
      })}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Duyuru Detayı</Text>
            <Text style={styles.modalText}>
              {selectedAnnouncement?.explanation}
            </Text>
            <Text style={styles.modalCourse}>
              Ders: {selectedAnnouncement?.courseName}
            </Text>
            <Text style={styles.modalDate}>
              Tarih: {selectedAnnouncement?.date}
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f4f6f8',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#060c24ff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  status: {
    fontWeight: 'bold',
  },
  courseName: {
    fontSize: 14,
    color: '#256bb2',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: '#555',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
  },
  publisher: {
    fontSize: 12,
    marginLeft: 5,
  },
  view: {
    fontSize: 14,
    marginLeft: 'auto',
  },

  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  modalCourse: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  modalDate: {
    fontSize: 13,
    marginBottom: 20,
    color: '#777',
  },
  closeButton: {
    backgroundColor: '#256bb2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
