import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { Image } from 'react-native-elements';
import BackgroundImage from '../../assets/Image/splash1.png';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Always navigate to MainTabs
      navigation.replace('MainTabs');
    }, 2000); // 2 second splash duration

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <>
      <ImageBackground
        source={BackgroundImage}
        style={styles.background}
        resizeMode="stretch"
      >
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        {/* <View style={styles.container}>
          <Image
            source={Logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View> */}
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
});

export default Splash;

// import React, { useEffect } from 'react';
// import { View, StyleSheet, ImageBackground, StatusBar } from 'react-native';
// import { Image } from 'react-native-elements';
// import BackgroundImage from '../../assets/Image/splash1.png';
// // import Logo from '../../assets/Img/Logo.png';
// import { useNavigation } from '@react-navigation/native';

// const Splash = () => {
//   let Navigation = useNavigation();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       Navigation.navigate('MainTabs'); // Changed from HomeStack to MainTabs
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, [Navigation]);

//   return (
//     <>
//       <ImageBackground
//         source={BackgroundImage}
//         style={styles.background}
//         resizeMode="stretch"
//       >
//         <StatusBar backgroundColor="white" barStyle="dark-content" />
//         {/* <View style={styles.container}>
//           <Image
//             source={Logo}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </View> */}
//       </ImageBackground>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     width: 150,
//     height: 150,
//   },
// });

// export default Splash;
