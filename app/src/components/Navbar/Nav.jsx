import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Sidebar from '../../screens/common/Sidebar';
import { useCart } from '../../../src/context/CartContext.js';
import { useAuth } from '../../../src/context/AuthContext';
import SearchBar from '../common/SearchBar.jsx';
import BackgroundImage from '../../assets/Image/imageLogo.png';

const Nav = () => {
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const searchBarRef = useRef(null);

  const { cartCount } = useCart();
  const { user, isLoggedIn, initialLoading } = useAuth();

  // Called by SearchBar when user submits or voice finishes
  const handleSearch = (query) => {
    if (!query.trim()) return;
    navigation.navigate('ProductSearch', { searchQuery: query.trim() });
    // SearchBar clears itself in "home" mode automatically
  };

  const greeting = useMemo(() => {
    if (!user) return '';
    const prefix = user.gender === 'Female' ? 'Mrs.' : user.gender === 'Male' ? 'Mr.' : '';
    return `${prefix} ${user.firstName || ''}`.trim();
  }, [user]);

  const initials = useMemo(() => {
    if (!user) return '';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  }, [user]);

  return (
    <>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} navigation={navigation} />

      <View style={styles.container}>
        {/* ── Top row ── */}
        <View style={styles.navContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.menuButton} onPress={() => setMenuOpen(p => !p)}>
              <MaterialIcons name={menuOpen ? 'close' : 'menu'} size={28} color="#37474F" />
            </TouchableOpacity>
            <Image source={BackgroundImage} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.rightIcons}>
            {initialLoading ? (
              <ActivityIndicator size="small" color="#E53935" />
            ) : isLoggedIn ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Profile')}
                style={styles.userSection}
              >
                {user?.imageUrl ? (
                  <Image source={{ uri: user.imageUrl }} style={styles.userImage} />
                ) : (
                  <View style={styles.initialsContainer}>
                    <Text style={styles.initialsText}>{initials}</Text>
                  </View>
                )}
                <View style={styles.userTextContainer}>
                  <Text style={styles.welcomeLabel} numberOfLines={1}>Welcome</Text>
                  <Text style={styles.welcomeText} numberOfLines={1}>{greeting}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('AuthPage')}
              >
                <MaterialIcons name="person-outline" size={18} color="#E53935" />
                <Text style={styles.loginText}>LOGIN</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cartButtonContainer}
              onPress={() => navigation.navigate('Cart')}
            >
              <MaterialIcons name="shopping-cart" size={26} color="#37474F" />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Search bar (home mode → navigates on submit/voice) ── */}
        <SearchBar
          ref={searchBarRef}
          mode="home"
          placeholder="Search Products…"
          onSearch={handleSearch}
          style={styles.searchBar}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#e7dbdbff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 2,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  menuButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -4,
  },
  logo: { height: 32, width: 80 },
  rightIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEAEA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  loginText: { color: '#E53935', fontWeight: '700', fontSize: 13 },
  userSection: { flexDirection: 'row', alignItems: 'center', maxWidth: 170 },
  userImage: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: '#E53935' },
  initialsContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  userTextContainer: { marginLeft: 8, maxWidth: 110 },
  welcomeLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  welcomeText: { color: '#E53935', fontWeight: '700', fontSize: 13 },
  cartButtonContainer: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  searchBar: {
    marginTop: 14,
  },
});

export default Nav;