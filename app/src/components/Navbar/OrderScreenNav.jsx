import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../../../src/context/CartContext.js';
import { useNavigation } from '@react-navigation/native';

const OrderScreenNav = pageName => {
  const navigation = useNavigation();
  const { cartCount } = useCart();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCartPress = () => {
    navigation.goBack();
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
          <View style={styles.iconWrapper}>
            <MaterialIcons name="arrow-back" size={22} color="#00569e" />
          </View>
        </TouchableOpacity>

        {/* Center: Page Name */}
        <View style={styles.centerSection}>
          <Text style={styles.pageTitle} numberOfLines={1}>
            Order Summary
          </Text>
        </View>

        {/* Right: Cart Icon with Badge */}
        <TouchableOpacity
          style={styles.cartButton}
          onPress={handleCartPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <MaterialIcons name="shopping-cart" size={22} color="#00569e" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#a6c9e9',
    shadowColor: '#00569e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f0f7fc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a6c9e9',
    position: 'relative',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#004680',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  cartButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default OrderScreenNav;
