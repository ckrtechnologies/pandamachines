import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SideScreenNavbar from '../../components/Navbar/SideScreenNavbar';
import { API_BASE_URL } from '../../utils/basicInfo';

const AddressListScreen = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, []),
  );

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('pm-user-data');
      if (data) {
        const parsedData = JSON.parse(data);
        const userInfo = parsedData.data || parsedData;
        setUserData(userInfo);
        if (userInfo._id || userInfo.id) {
          fetchAddresses(userInfo._id || userInfo.id);
        }
      } else {
        setAddresses([]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const fetchAddresses = async userId => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/address/user/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data && response.data.data) {
        setAddresses(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setAddresses(response.data);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async addressId => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', onPress: () => { }, style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            setActionLoading(prev => ({ ...prev, [addressId]: true }));
            try {
              await axios.delete(
                `${API_BASE_URL}/address/delete-address/${addressId}`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              );
              setAddresses(prev =>
                prev.filter(address => address._id !== addressId),
              );
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              console.error('Error deleting address:', error);
              const errorMsg =
                error.response?.data?.message || 'Failed to delete address';
              Alert.alert('Error', errorMsg);
            } finally {
              setActionLoading(prev => ({ ...prev, [addressId]: false }));
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleSetDefault = async addressId => {
    setActionLoading(prev => ({ ...prev, [`default-${addressId}`]: true }));
    try {
      await axios.put(
        `${API_BASE_URL}/address/set-default-address/${addressId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Update local state
      setAddresses(prev =>
        prev.map(address => ({
          ...address,
          isDefault: address._id === addressId,
        })),
      );
      Alert.alert('Success', 'Default address updated');
    } catch (error) {
      console.error('Error setting default address:', error);
      const errorMsg =
        error.response?.data?.message || 'Failed to set default address';
      Alert.alert('Error', errorMsg);
    } finally {
      setActionLoading(prev => ({ ...prev, [`default-${addressId}`]: false }));
    }
  };

  const handleEditAddress = item => {
    navigation.navigate('AddAddress', { addressId: item._id, address: item });
  };

  const renderAddressCard = ({ item }) => {
    const isDeleting = actionLoading[item._id];
    const isSettingDefault = actionLoading[`default-${item._id}`];

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <View
              style={[
                styles.addressTypeBadge,
                item.addressType === 'Home'
                  ? styles.homeBadge
                  : styles.workBadge,
              ]}
            >
              <Text style={styles.addressTypeText}>{item.addressType}</Text>
            </View>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteAddress(item._id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#ce321dff" />
            ) : (
              <MaterialIcons name="delete" size={20} color="#ce321dff" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.nameText}>{item.fullName}</Text>
          <Text style={styles.phoneText}>{item.phone}</Text>

          <View style={styles.addressContainer}>
            <MaterialIcons name="location-on" size={16} color="#6B7280" />
            <View style={styles.addressText}>
              <Text style={styles.addressLine} numberOfLines={2}>
                {item.addressLine1}
              </Text>
              {item.addressLine2 && (
                <Text style={styles.addressLine}>{item.addressLine2}</Text>
              )}
              <Text style={styles.cityText}>
                {item.city}, {item.state} {item.postalCode}
              </Text>
              <Text style={styles.countryText}>{item.country}</Text>
              {item.landmark && (
                <Text style={styles.landmarkText}>📍 {item.landmark}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          {!item.isDefault && (
            <TouchableOpacity
              style={styles.setDefaultButton}
              onPress={() => handleSetDefault(item._id)}
              disabled={isSettingDefault}
            >
              {isSettingDefault ? (
                <ActivityIndicator size="small" color="#004680" />
              ) : (
                <>
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#004680"
                  />
                  <Text style={styles.setDefaultText}>Set Default</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditAddress(item)}
          >
            <MaterialIcons name="edit" size={16} color="#FFFFFF" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <SideScreenNavbar
          pageName="Saved Addresses"
          navigation={navigation}
        />
        <AddressListSkeleton />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <SideScreenNavbar pageName="Saved Addresses" navigation={navigation} />
        <View style={styles.emptyContainer}>
          <MaterialIcons name="location-on" size={60} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Not Logged In</Text>
          <Text style={styles.emptySubtitle}>
            Please login to view your addresses
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('AuthPage')}
          >
            <Text style={styles.loginButtonText}>Login Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SideScreenNavbar pageName="Saved Addresses" navigation={navigation} />

      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="add-location" size={60} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Addresses Yet</Text>
          <Text style={styles.emptySubtitle}>
            Add your first address to get started
          </Text>
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => navigation.navigate('AddAddress')}
          >
            <MaterialIcons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addNewText}>Add Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.pageHeader}>
            <Text style={styles.pageHeaderTitle}>
              My Addresses ({addresses.length})
            </Text>

            <TouchableOpacity
              style={styles.addButtonHeader}
              onPress={() => navigation.navigate('AddAddress')}
            >
              <MaterialIcons name="add" size={24} color="#004680" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={addresses}
            renderItem={renderAddressCard}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};
const AddressListSkeleton = () => {
  const cards = [1, 2];

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={skeletonStyles.pageHeader}>
        <View style={skeletonStyles.title} />
        <View style={skeletonStyles.circle} />
      </View>

      <FlatList
        data={cards}
        keyExtractor={item => item.toString()}
        contentContainerStyle={{ padding: 12 }}
        renderItem={() => (
          <View style={skeletonStyles.card}>
            {/* Top */}
            <View style={skeletonStyles.cardHeader}>
              <View style={{ flexDirection: 'row' }}>
                <View style={skeletonStyles.badge} />
                <View
                  style={[
                    skeletonStyles.badge,
                    { width: 70, marginLeft: 8 },
                  ]}
                />
              </View>

              <View style={skeletonStyles.deleteIcon} />
            </View>

            {/* Content */}
            <View style={skeletonStyles.content}>
              <View style={skeletonStyles.name} />
              <View style={skeletonStyles.phone} />

              <View style={skeletonStyles.lineFull} />
              <View style={skeletonStyles.line90} />
              <View style={skeletonStyles.line80} />
              <View style={skeletonStyles.line40} />
            </View>

            {/* Button */}
            <View style={skeletonStyles.button} />
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  content: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  pageHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  addButtonHeader: {
    padding: 8,
  },
  listContent: {
    padding: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  homeBadge: {
    backgroundColor: '#E0F2FE',
  },
  workBadge: {
    backgroundColor: '#FEF3C7',
  },
  addressTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  defaultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#DCFCE7',
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addressText: {
    flex: 1,
  },
  addressLine: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 2,
    lineHeight: 16,
  },
  cityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  countryText: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  landmarkText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  setDefaultButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#004680',
    gap: 6,
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#004680',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
    gap: 6,
  },
  editText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 24,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addNewButton: {
    marginTop: 24,
    backgroundColor: '#004680',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addNewText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddressListScreen;

const skeletonStyles = StyleSheet.create({
  pageHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  title: {
    width: 180,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },

  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  badge: {
    width: 60,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },

  deleteIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },

  content: {
    marginBottom: 16,
  },

  name: {
    width: 140,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginBottom: 10,
  },

  phone: {
    width: 100,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },

  lineFull: {
    width: '100%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },

  line90: {
    width: '90%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },

  line80: {
    width: '80%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },

  line40: {
    width: '40%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },

  button: {
    width: '100%',
    height: 46,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
});