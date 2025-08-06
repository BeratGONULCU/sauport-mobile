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
  Image
} from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
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
  const { user,logout } = useAuth();


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

  const handlePressLogin = () => {
    if (isOpen) toggleMenu();
    if (!user) router.push('/(tabs)');
  };

  const handlePressLogout = () => {
    if (isOpen) toggleMenu();
    if (user){
      logout();
      router.push('/');
    }
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

        {/* saulogo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/saulogo.png')} // yol senin proje yapına göre değişebilir
          style={styles.logo}
          resizeMode="contain"
        />
      </View>


        {/* Giriş */}
        <TouchableOpacity style={styles.link} onPress={ handlePressLogin } activeOpacity={0.6}>
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

      {/* kapatmak için arrow tuşu */}
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
          <AntDesign name="arrowright" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

        {/* Çıkış Yap */}
        <TouchableOpacity style={styles.linkOut} onPress={ handlePressLogout } activeOpacity={0.6}>
          <Text style={styles.menuItemOut}>Çıkış Yap</Text>
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
    width: Dimensions.get('window').width * 0.6,
    height: '90.5%',
    backgroundColor: '#060c24ff',
    paddingTop: 80,
    paddingHorizontal: 10,
    zIndex: 99,
  },
  menuItem: {
    color: '#ffffffcc',
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
  link: {
    marginLeft:-5
  },
  linkOut: {
    marginLeft:30,
    marginTop:300,
    width:'65%',
    backgroundColor:'#0f1b48ff',
    borderRadius:15,
  },
  menuItemOut: {
    color: '#ffffffcc',
    marginVertical: 20,
    fontFamily: 'arial',
    fontSize: 15,
    marginLeft: 35,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
  menuRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginVertical: 0,
  marginLeft: 0,
  marginRight: 40,
},
icon: {
  marginLeft: 10,
},
logoContainer: {
  alignItems: 'flex-start',
  paddingHorizontal: 20,
  paddingTop: 0,
  paddingBottom: 20,
},
logo: {
  width: 120,
  height: 40,
},
closeButtonContainer: {
  position: 'absolute',
  top: 75,
  right: 16,
  zIndex: 6,
  padding: 1,
  backgroundColor: 'rgba(64, 64, 64, 0.4)', 
  borderRadius: 20,
},

closeButton: {
  padding: 8,
},
});

export default SideMenu;
