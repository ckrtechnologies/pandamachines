import { NavigationContainer } from '@react-navigation/native';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext.js';
import { CartProvider } from './src/context/CartContext.js';
import { WishlistProvider } from './src/context/WishlistContext.js';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from "./src/theme/colors.js";
import { navigationRef } from "./src/utils/navigationService";
import { CheckoutProvider } from './src/context/CheckoutContext.js';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <>
      {/* Configure StatusBar based on platform */}
      <StatusBar
        backgroundColor={
          Platform.OS === 'android' ? COLORS.background : undefined
        }
        barStyle="dark-content"
        translucent={Platform.OS === 'android' ? false : true}
      />
      <SafeAreaView style={styles.container}>
        <AuthProvider>
          <CheckoutProvider>
            <CartProvider>
              <WishlistProvider>
                <NavigationContainer ref={navigationRef}>
                  <AppNavigator />
                </NavigationContainer>
                <Toast />
              </WishlistProvider>
            </CartProvider>
          </CheckoutProvider>
        </AuthProvider>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,    // paddingTop: HEIGHT * 0.05,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});

export default App;
