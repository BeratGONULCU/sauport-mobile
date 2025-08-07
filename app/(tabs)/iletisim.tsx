import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import announcements from '../../data/announcements.json';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

/*  
    EKSİKLER;
      - tüm duyurular tek bir div içerisinde toplanmalı
      - duyurular başlığı yanına ders adı ile filtreleme
      - eğer belirli bir sayıdan fazla duyuru varsa 2. sayfa olmalı 
      - tarih abd tarzından türkiye tarzına dönmeli gün-ay-yıl 
      - giriş - çıkış işlemi tamamlanmalı

*/

export default function IletisimPage() {
  const { user, courses , announces } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

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
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>DUYURULAR</Text>

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
              {/* <Text style={[styles.status, { color: '#4CAF50' }]}>✓ Okundu</Text> */}
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
              <Text style={styles.publisher}>            {a.publisher || 'Sistem'}</Text>
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
    flex: 1,
    backgroundColor: '#f3f3f3fa',
    paddingHorizontal: 20,
    paddingTop: 20,
    width: '100%',
  },
  pageTitle: {
    fontSize: 14,
    color: '#060c24ff',
    marginBottom: 25,
    textAlign: 'left',
    marginLeft: 5,
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
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#256cb2de',
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
