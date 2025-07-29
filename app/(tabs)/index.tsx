import { router } from 'expo-router';
import students from '../../data/student.json';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard
} from 'react-native';
import { AuthProvider, useAuth } from '../../context/AuthContext'; // Context'i çek
import {showMessage} from 'react-native-flash-message';

/* BU SAYFADAKİ EKSİKLER */
/*
  - kullanıcı adı girişinde (ali ) sonunda boşluklu yazarsa bunu hatalı kabul ediyor, düzeltilecek.
  - klayve kapama tuşu eklenmeli
  - giriş yapıldığında alert ile verilen mesaj yeşil tik işareti olsun ve 1.5 saniyede kapansın.

   
*/

export default function LoginPage() {
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth(); // kullanıcı bilgisini setlemek için

const handleLogin = () => {
  const matched = students.student.find(
    s => s.number.toUpperCase() === number.trim().toUpperCase() && s.password === password.trim()
  );

  if (matched) {
    setUser(matched);
    showMessage({
      message: "Giriş başarılı!",
      type: "success",
      duration: 1200,
      icon: "success",
    });

    setTimeout(() => {
      router.push('/Courses');
    }, 1000);
  } else {
    showMessage({
      message: "Hatalı giriş!",
      type: "danger",
      icon: "danger",
    });
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>SAÜPORT</Text>

      <TextInput
        style={styles.input}
        placeholder="Öğrenci No"
        value={number}
        onChangeText={setNumber}
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>© {new Date().getFullYear()} Sakarya Üniversitesi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: '50%',
  },
  title: {
    fontSize: 32,
    marginBottom: 80,
    fontWeight: 'bold',
    color: '#172c79ff',
  },
  input: {
    width: '80%',
    height: 60,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  button: {
    width: '80%',
    backgroundColor: '#101e53ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    marginTop: 40,
    fontSize: 12,
    color: '#999',
  },
});
