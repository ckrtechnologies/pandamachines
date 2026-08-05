import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import axios from 'axios';

import { useFocusEffect } from '@react-navigation/native';

import AppLoader from '../common/AppLoader';

import EditProfileModal from '../../components/profile/EditProfileModal';

import { API_BASE_URL } from '../../utils/basicInfo';

import { useAuth } from '../../context/AuthContext';

const Profile = ({ navigation }) => {
  const {
    user,
    isLoggedIn,
    logout,
  } = useAuth();

  const [userData, setUserData] = useState(user || null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const fetchProfileData = useCallback(async () => {
    try {
      setError(null);

      if (!isLoggedIn || !user) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const userId = user._id || user.data?._id;

      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/customers/get-user-by-id/${userId}`,
        {
          timeout: 10000,
        },
      );

      if (response.data?.success && response.data?.data) {
        setUserData(response.data.data);
      } else if (response.data?.data) {
        setUserData(response.data.data);
      } else {
        setUserData(response.data);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to load profile';

      setError(errorMessage);

      setLoading(false);

      Alert.alert('Error', errorMessage);
    }
  }, [isLoggedIn, user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setUserData(null);

      fetchProfileData();
    }, [fetchProfileData]),
  );

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchProfileData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleEditProfileSuccess = () => {
    fetchProfileData();
  };

  const getGenderIcon = () => {
    return 'account-circle';
  };

  const getInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    }

    return 'U';
  };

  const menuItems = [
    {
      label: 'Saved Addresses',
      icon: 'location-on',
      route: 'AddressListScreen',
      action: null,
    },
    {
      label: 'Wishlist',
      icon: 'favorite',
      route: 'WishlistScreen',
      action: null,
    },
    {
      label: 'My Orders',
      icon: 'shopping-bag',
      route: 'UserOrdersScreen',
      action: null,
    },
    {
      label: 'Become a Seller',
      icon: 'store',
      route: 'SellerApply',
      action: null,
    },
    {
      label: 'Online Consultation',
      icon: 'support-agent',
      route: 'OnlineConsultation',
      action: null,
    },
    {
      label: 'Inquiries',
      icon: 'help-outline',
      route: 'Inquiry',
      action: null,
    },
  ];

  const handleMenuItemPress = item => {
    if (item.action) {
      item.action();
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();

            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'HomeStack',
                },
              ],
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  const MenuSettingItem = ({ item, isLast }) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isLast && styles.menuItemLast,
      ]}
      onPress={() => handleMenuItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <MaterialIcons
          name={item.icon}
          size={24}
          color="#00365f"
        />

        <Text style={styles.menuLabel}>
          {item.label}
        </Text>
      </View>

      <MaterialIcons
        name="chevron-right"
        size={24}
        color="#BDBDBD"
      />
    </TouchableOpacity>
  );

  if (loading || refreshing) {
    return <AppLoader size={100} />;
  }

  if (error && !userData) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons
          name="error-outline"
          size={48}
          color="#00365f"
        />

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            fetchProfileData();
          }}
        >
          <Text style={styles.retryButtonText}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            {userData?.imageUrl ? (
              <Image
                source={{ uri: userData.imageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <>
                <MaterialIcons
                  name={getGenderIcon()}
                  size={80}
                  color="#00365f"
                />

                <View style={styles.initialsOverlay}>
                  <Text style={styles.initials}>
                    {getInitials()}
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.fullName}>
              {userData?.firstName} {userData?.lastName}
            </Text>

            <Text style={styles.email}>
              {userData?.email || 'No email added'}
            </Text>

            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <MaterialIcons
                  name="verified-user"
                  size={14}
                  color="#00365f"
                />

                <Text style={styles.badgeText}>
                  Verified Member
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="edit"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>
            Account Settings
          </Text>

          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <MenuSettingItem
                key={index}
                item={item}
                isLast={
                  index === menuItems.length - 1
                }
              />
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialIcons
              name="logout"
              size={22}
              color="#fff"
            />

            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditProfileModal
        visible={modalVisible}
        userData={userData}
        onClose={() => setModalVisible(false)}
        onSuccess={handleEditProfileSuccess}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },

  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#00365f',
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: '#00365f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  avatarContainer: {
    position: 'relative',
    marginRight: 16,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#00365f',
  },

  initialsOverlay: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#00365f',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  headerInfo: {
    flex: 1,
  },

  fullName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#37474F',
  },

  email: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },

  badgeContainer: {
    marginTop: 8,
  },

  badge: {
    flexDirection: 'row',
    backgroundColor: '#b9d6ecff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  badgeText: {
    fontSize: 11,
    color: '#00365f',
    fontWeight: '600',
    marginLeft: 4,
  },

  editButton: {
    backgroundColor: '#00365f',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  settingsSection: {
    marginHorizontal: 12,
    marginVertical: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 12,
  },

  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  menuItemLast: {
    borderBottomWidth: 0,
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#37474F',
    marginLeft: 16,
  },

  logoutContainer: {
    marginHorizontal: 12,
    marginVertical: 20,
  },

  logoutButton: {
    backgroundColor: '#d9534f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },

  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Profile;
// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   RefreshControl,
// } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useFocusEffect } from '@react-navigation/native';
// import AppLoader from '../common/AppLoader';
// import EditProfileModal from '../../components/profile/EditProfileModal';
// import { API_BASE_URL } from '../../utils/basicInfo';

// const Profile = ({ navigation }) => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const fetchProfileData = useCallback(async () => {
//     try {
//       setError(null);

//       const storedData = await AsyncStorage.getItem('pm-user-data');

//       if (!storedData) {
//         setError('User not logged in');
//         setLoading(false);
//         return;
//       }

//       let parsedData;
//       try {
//         parsedData = JSON.parse(storedData);
//       } catch (parseErr) {
//         console.error('Error parsing stored data:', parseErr);
//         setError('Invalid user data');
//         setLoading(false);
//         return;
//       }

//       const userId = parsedData._id || parsedData.data?._id;

//       if (!userId) {
//         setError('User ID not found');
//         setLoading(false);
//         return;
//       }

//       const config = {
//         method: 'get',
//         maxBodyLength: Infinity,
//         url: `${API_BASE_URL}/customers/get-user-by-id/${userId}`,
//         headers: {},
//         timeout: 10000,
//       };

//       const response = await axios.request(config);

//       if (response.data?.success && response.data?.data) {
//         setUserData(response.data.data);
//       } else if (response.data?.data) {
//         setUserData(response.data.data);
//       } else {
//         setUserData(response.data);
//       }
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching profile:', err);
//       const errorMessage =
//         err.response?.data?.message || err.message || 'Failed to load profile';
//       setError(errorMessage);
//       setLoading(false);
//       Alert.alert('Error', errorMessage);
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       setLoading(true);
//       setUserData(null);
//       fetchProfileData();
//     }, [fetchProfileData]),
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     try {
//       await fetchProfileData();
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleEditProfileSuccess = () => {
//     fetchProfileData();
//   };

//   const getGenderIcon = () => {
//     return 'account-circle';
//   };

//   const getInitials = () => {
//     if (userData?.firstName && userData?.lastName) {
//       return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
//     }
//     return 'U';
//   };

//   // Menu items
//   const menuItems = [
//     {
//       label: 'Saved Addresses',
//       icon: 'location-on',
//       route: 'AddressListScreen',
//       action: null,
//     },
//     {
//       label: 'Wishlist',
//       icon: 'favorite',
//       route: 'WishlistScreen',
//       action: null,
//     },
//     {
//       label: 'My Orders',
//       icon: 'shopping-bag',
//       route: 'UserOrdersScreen',
//       action: null,
//     },
//     {
//       label: 'Become a Seller',
//       icon: 'store',
//       route: 'SellerApply',
//       action: null,
//     },
//     {
//       label: 'Online Consultation',
//       icon: 'support-agent',
//       route: 'OnlineConsultation',
//       action: null,
//     },
//     {
//       label: 'Inquiries',
//       icon: 'help-outline',
//       route: 'Inquiry',
//       action: null,
//     },
//   ];

//   const handleMenuItemPress = item => {
//     if (item.action) {
//       item.action();
//     } else if (item.route) {
//       navigation.navigate(item.route);
//     }
//   };

//   const MenuSettingItem = ({ item, isLast }) => (
//     <TouchableOpacity
//       style={[styles.menuItem, isLast && styles.menuItemLast]}
//       onPress={() => handleMenuItemPress(item)}
//       activeOpacity={0.7}
//     >
//       <View style={styles.menuItemLeft}>
//         <MaterialIcons name={item.icon} size={24} color="#00365f" />
//         <Text style={styles.menuLabel}>{item.label}</Text>
//       </View>
//       <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
//     </TouchableOpacity>
//   );

//   if (loading || refreshing) {
//     return <AppLoader size={100} />;
//   }

//   if (error && !userData) {
//     return (
//       <View style={styles.centerContainer}>
//         <MaterialIcons name="error-outline" size={48} color="#00365f" />
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={() => {
//             setLoading(true);
//             fetchProfileData();
//           }}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <>
//       <ScrollView
//         style={styles.container}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Profile Header Card */}
//         <View style={styles.profileHeaderCard}>
//           <View style={styles.avatarContainer}>
//             <MaterialIcons name={getGenderIcon()} size={80} color="#00365f" />
//             <View style={styles.initialsOverlay}>
//               <Text style={styles.initials}>{getInitials()}</Text>
//             </View>
//           </View>

//           <View style={styles.headerInfo}>
//             <Text style={styles.fullName}>
//               {userData?.firstName} {userData?.lastName}
//             </Text>
//             <Text style={styles.email}>{userData?.email}</Text>
//             <View style={styles.badgeContainer}>
//               <View style={styles.badge}>
//                 <MaterialIcons name="verified-user" size={14} color="#00365f" />
//                 <Text style={styles.badgeText}>Verified Member</Text>
//               </View>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={styles.editButton}
//             onPress={() => setModalVisible(true)}
//             activeOpacity={0.7}
//           >
//             <MaterialIcons name="edit" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Account Settings Section */}
//         <View style={styles.settingsSection}>
//           <Text style={styles.sectionTitle}>Account Settings</Text>
//           <View style={styles.menuContainer}>
//             {menuItems.map((item, index) => (
//               <MenuSettingItem
//                 key={index}
//                 item={item}
//                 isLast={index === menuItems.length - 1}
//               />
//             ))}
//           </View>
//         </View>

//         {/* Logout Button */}
//         <View style={styles.logoutContainer}>
//           <TouchableOpacity
//             style={styles.logoutButton}
//             onPress={async () => {
//               Alert.alert(
//                 'Logout',
//                 'Are you sure you want to logout?',
//                 [
//                   { text: 'Cancel', style: 'cancel' },
//                   {
//                     text: 'Logout',
//                     onPress: async () => {
//                       await AsyncStorage.removeItem('pm-user-data');
//                       navigation.reset({
//                         index: 0,
//                         routes: [{ name: 'HomeStack' }],
//                       });
//                     },
//                   },
//                 ],
//                 { cancelable: true },
//               );
//             }}
//           >
//             <MaterialIcons name="logout" size={22} color="#fff" />
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Edit Profile Modal */}
//       <EditProfileModal
//         visible={modalVisible}
//         userData={userData}
//         onClose={() => setModalVisible(false)}
//         onSuccess={handleEditProfileSuccess}
//       />
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F8F8',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8F8F8',
//   },
//   errorText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#00365f',
//     textAlign: 'center',
//   },
//   retryButton: {
//     marginTop: 20,
//     backgroundColor: '#00365f',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   profileHeaderCard: {
//     backgroundColor: '#FFFFFF',
//     margin: 12,
//     borderRadius: 16,
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginRight: 16,
//   },
//   initialsOverlay: {
//     position: 'absolute',
//     bottom: -8,
//     right: -8,
//     backgroundColor: '#00365f',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   initials: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//     fontSize: 14,
//   },
//   headerInfo: {
//     flex: 1,
//   },
//   fullName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#37474F',
//   },
//   email: {
//     fontSize: 12,
//     color: '#9E9E9E',
//     marginTop: 4,
//   },
//   badgeContainer: {
//     marginTop: 8,
//   },
//   badge: {
//     flexDirection: 'row',
//     backgroundColor: '#b9d6ecff',
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 12,
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//   },
//   badgeText: {
//     fontSize: 11,
//     color: '#00365f',
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   editButton: {
//     backgroundColor: '#00365f',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 12,
//   },
//   settingsSection: {
//     marginHorizontal: 12,
//     marginVertical: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#37474F',
//     marginBottom: 12,
//   },
//   menuContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   menuItemLast: {
//     borderBottomWidth: 0,
//   },
//   menuItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   menuLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#37474F',
//     marginLeft: 16,
//   },
//   logoutContainer: {
//     marginHorizontal: 12,
//     marginVertical: 20,
//   },
//   logoutButton: {
//     backgroundColor: '#d9534f',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 10,
//   },
//   logoutText: {
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
// });

// export default Profile;
