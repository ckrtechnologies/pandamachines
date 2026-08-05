import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../../../src/context/CartContext.js';
import { useNavigation, useRoute } from '@react-navigation/native';

const SideScreenNavbar = ({ pageName }) => {
  const { cartCount } = useCart();
  const navigation = useNavigation();
  const route = useRoute();

  const isCartPage = route.name === 'Cart';


  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCartPress = () => {
    navigation.navigate('MainTabs', { screen: 'Cart' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.navContent}>
        {/* Left: Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <View style={styles.backIconWrapper}>
            <MaterialIcons name="arrow-back" size={20} color="#00569e" />
          </View>
        </TouchableOpacity>

        {/* Center: Page Name */}
        <View style={styles.centerSection}>
          <Text style={styles.pageTitle} numberOfLines={1}>
            {pageName}
          </Text>
        </View>

        {/* Right: Cart Icon */}


        {!isCartPage ? (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={handleCartPress}
            activeOpacity={0.7}
          >
            <View style={styles.cartIconWrapper}>
              <MaterialIcons
                name="shopping-cart"
                size={22}
                color="#00569e"
              />

              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 34 }} />
        )}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5EEF7',
  },

  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
  },

  backButton: {
    width: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F2F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerSection: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },

  pageTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#004680',
    textAlign: 'left',
    letterSpacing: 0.2,
  },

  cartButton: {
    width: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartIconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});

export default SideScreenNavbar;