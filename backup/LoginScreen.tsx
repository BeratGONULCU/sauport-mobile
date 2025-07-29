import { router } from 'expo-router';
import students from '../data/student.json'; 
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';


export default function LoginPage(){
const [username , setUsername] = useState('');
const [password , setPassword] = useState('');

const handleLogin = () => {
  const matched = students.student.find(
    s => s.name === username && s.password === password
  );

  if(matched)
  {
    alert("giriş başarılı");
    router.push(
      {
        pathname: '/Courses',
        params: {student_id : matched.student_id} // burada giriş yapan öğrencinin id'si Courses sayfasına gönderildi. (dersleri listelenecek.)
       }
    );
  }
  else
  {
    alert("giriş hatalı");
  }
}

return(
    <View style={styles.container}>
    <Text style={styles.title}>SAÜPORT</Text>

    <TextInput
      style={styles.input}
      placeholder="Kullanıcı Adı"
      value={username}
      onChangeText={setUsername}
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

    <Text style={styles.footer}>© 2025 Sakarya Üniversitesi</Text>
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
    height:'50%',
  },
  title: {
    fontSize: 32,
    marginBottom: 80,
    fontWeight: 'bold',
    color: '#2E5CFF',
  },
    centerTitle: {
    fontSize: 24,
    marginBottom: 80,
    fontWeight: 'bold',
    color: '#2E5CFF',
    textAlign: 'center',    
    alignSelf: 'center',  
    width:'100%',
  
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
    backgroundColor: '#2E5CFF',
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
  buttonCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});