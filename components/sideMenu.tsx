import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useMenu } from '../context/MenuContext';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const SideMenu = () => {
  const { isOpen, toggleMenu } = useMenu();
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width * 0.6)).current;
  const [isVisible, setIsVisible] = useState(false); // render kontrolü
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
  console.log("🔄 isOpen:", isOpen); // ekle

    if (isOpen) {
      if(!isVisible) setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Kapanma animasyonu + sonra gizle
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get('window').width * 0.6,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false); // animasyon bitince component gizlenir
      });
    }
  }, [isOpen]);

  if (!isVisible) return null;

  
  const handlePress = () => {
    if(isOpen) toggleMenu();
    if(!user) router.push('/');
  }

  const handlePressCourse = () => {
    if(isOpen) toggleMenu();
    if(user) router.push('/(tabs)/Courses');
  }

    const handlePressInfo = () => {
    if(isOpen) toggleMenu();
    if(user) router.push('/(tabs)/iletisim');
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Dışa tıklanınca kapat */}
      <TouchableWithoutFeedback onPress={toggleMenu}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* Menü */}
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <TouchableOpacity style={styles.link} onPress={handlePress} activeOpacity={0.6}>
          <Text style={styles.menuItem}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={handlePressCourse} activeOpacity={0.6}>
          <Text style={styles.menuItem}>Eğitim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={handlePressInfo} activeOpacity={0.6}>
          <Text style={styles.menuItem}>İletişim</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};



const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width * 0.6, // ekranın %10'u
    height: '100%',
    backgroundColor: '#060c24ff',
    paddingTop: 80,
    paddingHorizontal: 10,
    zIndex: 99,
  },
  menuItem: {
    color: '#fff',
    marginVertical: 20,
    fontWeight: 'bold',
    fontFamily:'arial',
    fontSize:15,
    marginLeft: 25,

  },
  link: {

  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.3)', // yarı saydam arka plan (opsiyonel)
  zIndex: 90,
  },

});

export default SideMenu;
