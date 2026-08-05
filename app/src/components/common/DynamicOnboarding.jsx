import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import img1 from '../../assets/Image/onBoardingPageImage.png';
import {HEIGHT} from '../../utils/basicInfo';

const DynamicOnboarding = ({
  title,
  subtitle,
  navigation,
  nextScreen,
  foregroundImage,
  btn,
  backgroundColorfrom,
  backgroundColorto,
  currentPage,
  totalPages,
  statusbar,
}) => {
  return (
    <LinearGradient
      colors={[backgroundColorfrom, backgroundColorto]}
      style={styles.safeArea}>
      <StatusBar backgroundColor={statusbar} barStyle="dark-content" />
      {/* Illustration Container */}
      <View style={styles.illustrationContainer}>
        <Image
          source={foregroundImage}
          style={styles.foregroundImage}
          resizeMode="contain"
        />
      </View>

      {/* Content Container with Background Image */}
      <ImageBackground
        source={img1}
        style={styles.contentContainer}
        imageStyle={styles.contentBackgroundImage}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate(nextScreen)}
          style={styles.nextButton}>
          <Image
            source={btn}
            style={styles.nextButtonIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('StartScreen')}
          style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.blacklinemainDiv}>
        <View style={styles.blackLine}></View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  illustrationContainer: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    // backgroundColor: 'white',
  },
  foregroundImage: {
    width: '80%',
    height: '60%',
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1.1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 22,
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center',

    fontFamily:'Lato-Bold',
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily:'Lato-Regular',
    latterSpacing: 1,
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  skipButton: {
    marginTop: 5,
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily:'Lato-Regular',
    letterSpacing: 1,
  },
  blackLine: {
    height: 5,
    backgroundColor: 'black',
    marginTop: 10,
    width: 100,
    borderRadius: 20,
    marginBottom: 5,
  },
  blacklinemainDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonIcon: {
    height: 60,
    // backgroundColor: '#4169E1',
    // borderRadius: 40,
  },
});

export default DynamicOnboarding;
