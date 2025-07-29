import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useMenu } from '../context/MenuContext';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const SideMenu = () => {
  const { isOpen, toggleMenu } = useMenu();
  const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width * 0.6)).current;
  const [isVisible, setIsVisible] = useState(false); // render kontrolü
  const [showEducation, setShowEducation] = useState(false); // açılır menü: Eğitim
  const [showContact, setShowContact] = useState(false);     // açılır menü: İletişim

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      if (!isVisible) setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get('window').width * 0.6,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
        setShowEducation(false);
        setShowContact(false);
      });
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handlePress = () => {
    if (isOpen) toggleMenu();
    if (!user) router.push('/(tabs)');
  };

  const handlePressCourse = () => {
    setShowEducation(!showEducation); // aç/kapa
  };

  const handlePressInfo = () => {
    setShowContact(!showContact); // aç/kapa
  };

  const routerCourse = () => {
    if(isOpen) toggleMenu();
    if(user) router.push('/(tabs)/Courses');
    // else{
    //   Alert.alert("Uyarı", "Giriş yapılmadı");

    //   setTimeout(() => {
    //     router.push('/(tabs)');
    //   }, 500); // yarım saniye sonra yönlendir
    //   return; // giriş yapılmadıysa login ekranı gösterilir
    // }
  };

  const routerInfo = () => {
    if(isOpen) toggleMenu();
    if(user) router.push('/(tabs)/iletisim');
    // else{
    //   Alert.alert("Uyarı", "Giriş yapılmadı");

    //   setTimeout(() => {
    //     router.push('/(tabs)');
    //   }, 500); // yarım saniye sonra yönlendir
    //   return; // giriş yapılmadıysa login ekranı gösterilir
    // }
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={toggleMenu}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* Giriş */}
        <TouchableOpacity style={styles.link} onPress={ handlePress } activeOpacity={0.6}>
          <Text style={styles.menuItem}>Giriş Yap</Text>
        </TouchableOpacity>

        {/* Eğitim */}
        <TouchableOpacity style={styles.link} onPress={ handlePressCourse } activeOpacity={0.6}>
          <View style={styles.menuRow}>
            <Text style={styles.menuItem}>Eğitim</Text>
            <AntDesign
              name={showEducation ? 'up' : 'down'}
              size={14}
              color="#fff"
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
        {showEducation && (
          <View style={styles.subMenu}>
            <TouchableOpacity onPress={ routerCourse }>
              <Text style={styles.subMenuItem}>Derslerim</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* İletişim */}
        <TouchableOpacity style={styles.link} onPress={ handlePressInfo } activeOpacity={0.6}>
          <View style={styles.menuRow}>
            <Text style={styles.menuItem}>İletişim</Text>
            <AntDesign
              name={showEducation ? 'up' : 'down'}
              size={14}
              color="#fff"
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
        {showContact && (
          <View style={styles.subMenu}>
            <TouchableOpacity onPress={ routerInfo }>
              <Text style={styles.subMenuItem}>Duyurular</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width * 0.6,
    height: '100%',
    backgroundColor: '#060c24ff',
    paddingTop: 80,
    paddingHorizontal: 10,
    zIndex: 99,
  },
  menuItem: {
    color: '#fff',
    marginVertical: 20,
    fontFamily: 'arial',
    fontSize: 15,
    marginLeft: 35,
  },
  subMenu: {
    marginLeft: 40,
    marginBottom: 10,
  },
  subMenuItem: {
    color: '#ccc',
    fontSize: 14,
    marginVertical: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 90,
  },
  link: {},
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  menuRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginVertical: 0,
  marginLeft: 0,
  marginRight: 30,
},
icon: {
  marginLeft: 10,
},
});

export default SideMenu;
