import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../src/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

// ─── Tab items ────────────────────────────────────────────────────────────────
const SingleTabItem = ({ item, handleMenuItemPress }) => (
  <TouchableOpacity
    style={styles.singleTabItem}
    onPress={() => handleMenuItemPress(item.route)}
    activeOpacity={0.7}
  >
    <MaterialIcons name={item.icon} size={20} color="#555" />
    <Text style={styles.tabLabel}>{item.label}</Text>
    {/* <MaterialIcons name="chevron-right" size={18} color="#ccc" /> */}
  </TouchableOpacity>
);

const CollapsibleTab = ({ title, items, tabName, icon, toggleTab, expandedTab, handleMenuItemPress }) => {
  const isOpen = expandedTab === tabName;

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => toggleTab(tabName)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <MaterialIcons name={icon} size={20} color="#555" />
          <Text style={styles.collapsibleTitle}>{title}</Text>
        </View>
        <MaterialIcons
          name={isOpen ? 'expand-less' : 'expand-more'}
          size={20}
          color="#ccc"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.collapsibleContent}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.nestedItem}
              onPress={() => handleMenuItemPress(item.route)}
              activeOpacity={0.7}
            >
              <MaterialIcons name={item.icon} size={17} color="#777" />
              <Text style={styles.nestedLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, onClose }) => {
  const navigation = useNavigation();
  const [expandedTab, setExpandedTab] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // ✅ Use AuthContext — no AsyncStorage read on open
  const { user, isLoggedIn, logout } = useAuth();

  // Slide value — starts off-screen
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      // Show modal first, THEN animate — avoids blank flash
      setModalVisible(true);
    } else {
      // Animate out, THEN hide modal
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
        slideAnim.setValue(-SIDEBAR_WIDTH);
      });
    }
  }, [isOpen]);

  // Called once modal is actually visible on screen → animate in
  const handleModalShow = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ── Nav data ──────────────────────────────────────────────────────────────
  const singleTabs = [
    { label: 'Home', icon: 'home', route: 'HomeStack' },
    { label: 'Categories', icon: 'category', route: 'CategoriesStack' },
  ];

  const shoppingItems = [
    { label: 'Saved Addresses', icon: 'location-on', route: 'AddressListScreen' },
    { label: 'Wishlist', icon: 'favorite', route: 'WishlistScreen' },
    { label: 'My Orders', icon: 'shopping-bag', route: 'UserOrdersScreen' },
    { label: 'Cart', icon: 'shopping-cart', route: 'Cart' },
  ];

  const discoverItems = [
    { label: 'Blogs', icon: 'article', route: 'BlogScreen' },
    { label: 'Offers', icon: 'sell', route: 'OffersScreen' },
  ];

  const otherTabs = [
    { label: 'Become a Seller', icon: 'store', route: 'SellerApply' },
    { label: 'Online Consultation', icon: 'support-agent', route: 'OnlineConsultation' },
    { label: 'Request Quotation', icon: 'sim-card-download', route: 'Quotation' },
    { label: 'Inquiries', icon: 'help-outline', route: 'Inquiry' },
  ];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleMenuItemPress = (route) => {
    if (route) navigation.navigate(route);
    onClose();
  };

  const toggleTab = (tabName) => {
    setExpandedTab(prev => prev === tabName ? null : tabName);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'HomeStack' }] });
          onClose();
        },
      },
    ]);
  };

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '';

  return (
    <SafeAreaView>
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={onClose}
        onShow={handleModalShow}   // ← animate in here, not in useEffect
      >
        {/* Overlay */}
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        </Animated.View>

        {/* Sidebar panel */}
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContent}
            bounces={false}
          >
            {/* User card */}
            {isLoggedIn && user ? (
              <TouchableOpacity
                style={styles.userCard}
                onPress={() => { navigation.navigate('Profile'); onClose(); }}
                activeOpacity={0.85}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {user.email}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>
            ) : (
              <View style={styles.guestHeader}>
                <Text style={styles.guestTitle}>Menu</Text>
              </View>
            )}

            {/* Nav sections */}
            <View style={styles.section}>
              {singleTabs.map((item, i) => (
                <SingleTabItem key={i} item={item} handleMenuItemPress={handleMenuItemPress} />
              ))}
            </View>

            {isLoggedIn && (
              <View style={styles.section}>
                <CollapsibleTab
                  title="Shopping"
                  items={shoppingItems}
                  tabName="shopping"
                  icon="shopping-bag"
                  expandedTab={expandedTab}
                  toggleTab={toggleTab}
                  handleMenuItemPress={handleMenuItemPress}
                />
              </View>
            )}

            <View style={styles.section}>
              <CollapsibleTab
                title="Discover"
                items={discoverItems}
                tabName="discover"
                icon="library-books"
                expandedTab={expandedTab}
                toggleTab={toggleTab}
                handleMenuItemPress={handleMenuItemPress}
              />
            </View>

            <View style={styles.section}>
              {otherTabs.map((item, i) => (
                <SingleTabItem key={i} item={item} handleMenuItemPress={handleMenuItemPress} />
              ))}
            </View>
          </ScrollView>

          {/* Bottom auth */}
          <View style={styles.bottomSection}>
            {isLoggedIn ? (
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
                <MaterialIcons name="logout" size={18} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => { navigation.navigate('AuthPage'); onClose(); }}
                activeOpacity={0.85}
              >
                <MaterialIcons name="login" size={18} color="#fff" />
                <Text style={styles.loginText}>Sign In</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.footerText}>PANDA MACHINES PVT LTD</Text>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 12,
    flexDirection: 'column',
  },
  scrollContent: {
    flex: 1,
  },

  // ── User card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  userEmail: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },

  // ── Guest header
  guestHeader: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  guestTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  // ── Sections
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  singleTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  tabLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 13,
  },

  // ── Collapsible
  collapsibleContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  collapsibleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 13,
  },
  collapsibleContent: {
    backgroundColor: '#fafafa',
    paddingVertical: 2,
  },
  nestedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
    paddingLeft: 44,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  nestedLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 11,
    fontWeight: '500',
  },

  // ── Bottom
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 12,
    gap: 10,
  },
  loginBtn: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#ef4444',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  footerText: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default Sidebar;