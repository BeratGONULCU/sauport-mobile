import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import { useAuth } from '../../context/AuthContext';
import announcements from '../../data/announcements.json';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const PAGE_SIZE = 5;

export default function IletisimPage() {
  const { user, courses } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const [courseId, setCourseId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const listRef = useRef<FlatList<any>>(null);

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

  // Tek listede tüm duyurular 
  const allItems = useMemo(() => {
    const arr = courses.flatMap(course =>
      (announcements.announcements || [])
        .filter(a => a.course_id === course.course_id)
        .map(a => ({ ...a, courseName: course.name }))
    );
    return arr.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  }, [courses]);

  // Filtre
  const filtered = useMemo(
    () => (!courseId ? allItems : allItems.filter(a => a.course_id === courseId)),
    [allItems, courseId]
  );

  // Sayfalama
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => { setPage(1); }, [courseId]);
  useEffect(() => { listRef.current?.scrollToOffset({ offset: 0, animated: true }); }, [page, courseId]);

  const open = useCallback((item:any) => { setSelectedAnnouncement(item); setModalVisible(true); }, []);

  const renderItem = useCallback(({ item }: { item:any }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => open(item)}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>{item.explanation}</Text>
      </View>
      <Text style={styles.courseName}>{item.courseName}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.date}>{toTR(item.date)}</Text>
        <View style={[styles.badge, { backgroundColor: item.type === 'Sınıfa Özel' ? '#00bfa5' : '#256bb2' }]}>
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>
        <Text style={styles.publisher}>{item.publisher || 'Sistem'}</Text>
      </View>
    </TouchableOpacity>
  ), [open]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={pageItems}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <Text style={styles.pageTitle}>DUYURULAR</Text>
            <FilterBar
              courses={courses}
              value={courseId}
              onChange={setCourseId}
              total={filtered.length}
            />
          </View>
        }
        ListEmptyComponent={<Text>Gösterilecek duyuru yok.</Text>}
        contentContainerStyle={{ paddingBottom: 12 }}
        initialNumToRender={20}
        windowSize={5}
        removeClippedSubviews
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage(p => Math.max(1, p - 1))}
        onNext={() => setPage(p => Math.min(totalPages, p + 1))}
        onGoto={(n) => setPage(n)}
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Duyuru Detayı</Text>
            <Text style={styles.modalText}>{selectedAnnouncement?.explanation}</Text>
            <Text style={styles.modalCourse}>Ders: {selectedAnnouncement?.courseName}</Text>
            <Text style={styles.modalDate}>Tarih: {toTR(selectedAnnouncement?.date)}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function toTR(d?: string) {
  if (!d) return '';
  const x = dayjs(d);
  return x.isValid() ? x.locale('tr').format('DD.MM.YYYY') : String(d);
}

/*  Filtre  */
function FilterBar({
  courses, value, onChange, total,
}: {
  courses: { course_id: string; name: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
  total: number;
}) {
  return (
    <View style={styles.filterBar}>
      <Chip label={`Tümü (${total})`} active={!value} onPress={() => onChange(null)} />
      {courses.map(c => (
        <Chip key={c.course_id} label={c.name} active={value === c.course_id} onPress={() => onChange(c.course_id)} />
      ))}
    </View>
  );
}
function Chip({ label, active, onPress }:{ label:string; active?:boolean; onPress:()=>void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

/*Sayfalama */
function Pagination({
  page, totalPages, onPrev, onNext, onGoto,
}: {
  page:number; totalPages:number;
  onPrev:()=>void; onNext:()=>void; onGoto:(n:number)=>void;
}) {
  const pages = useMemo(() => compactPages(page, totalPages), [page, totalPages]);
  return (
    <View style={styles.pagination}>
      <PageBtn text="‹ Önceki" disabled={page===1} onPress={onPrev} />
      {pages.map((p, i) =>
        p === '...' ? <Text key={`e-${i}`} style={{ paddingHorizontal: 6 }}>…</Text>
        : <PageBtn key={p} text={String(p)} active={p===page} onPress={() => onGoto(p as number)} />
      )}
      <PageBtn text="Sonraki ›" disabled={page===totalPages} onPress={onNext} />
    </View>
  );
}
function PageBtn({ text, onPress, disabled, active }:{
  text:string; onPress:()=>void; disabled?:boolean; active?:boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.pageBtn,
        active && styles.pageBtnActive,
        disabled && { opacity: 0.5 },
      ]}
    >
      <Text style={[styles.pageBtnText, active && { color:'#fff' }]}>{text}</Text>
    </TouchableOpacity>
  );
}
function compactPages(current:number, total:number){
  const set = new Set<number>();
  [1,2,total-1,total,current-1,current,current+1].forEach(n => { if(n>=1 && n<=total) set.add(n); });
  const arr = Array.from(set).sort((a,b)=>a-b);
  const out:(number|'...')[] = [];
  for(let i=0;i<arr.length;i++){
    out.push(arr[i]);
    if(i < arr.length-1 && arr[i+1]-arr[i] > 1) out.push('...');
  }
  return out;
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
  },
    filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    marginLeft: 5,
  },
  chip: {
    backgroundColor: '#eef2ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#20389a4a',
  },
  chipActive: {
    backgroundColor: '#256bb2',
    borderColor: '#256bb2',
  },
  chipText: { color: '#060c24ff' },
  chipTextActive: { color: '#fff', fontWeight: '700' },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  pageBtn: {
    backgroundColor: '#f0f2f7',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#20389a4a',
  },
  pageBtnActive: {
    backgroundColor: '#256bb2',
    borderColor: '#256bb2',
  },
  pageBtnText: {
    color: '#060c24ff',
    fontWeight: '600',
  },

});
