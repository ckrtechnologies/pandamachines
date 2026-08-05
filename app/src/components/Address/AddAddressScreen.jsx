import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../../utils/basicInfo';

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isEditMode = route.params?.addressId ? true : false;
  const addressToEdit = route.params?.address || null;

  const addressId = route.params?.addressId;
  console.log('//////////////////////////addressId////////////', addressId);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    landmark: '',
    addressType: 'Home',
  });

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    fetchUserData();
    if (isEditMode && addressToEdit) {
      populateFormData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('pm-user-data');
      if (data) {
        const parsedData = JSON.parse(data);
        const userInfo = parsedData.data || parsedData;
        setUserData(userInfo);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const populateFormData = () => {
    if (addressToEdit) {
      setFormData({
        fullName: addressToEdit.fullName || '',
        phone: addressToEdit.phone || '',
        addressLine1: addressToEdit.addressLine1 || '',
        addressLine2: addressToEdit.addressLine2 || '',
        city: addressToEdit.city || '',
        state: addressToEdit.state || '',
        postalCode: addressToEdit.postalCode || '',
        country: addressToEdit.country || 'India',
        landmark: addressToEdit.landmark || '',
        addressType: addressToEdit.addressType || 'Home',
      });
      setIsDefault(addressToEdit.isDefault || false);
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter full name');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }
    if (!formData.addressLine1.trim()) {
      Alert.alert('Error', 'Please enter address line 1');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Error', 'Please enter city');
      return false;
    }
    if (!formData.state.trim()) {
      Alert.alert('Error', 'Please enter state');
      return false;
    }
    if (!formData.postalCode.trim()) {
      Alert.alert('Error', 'Please enter postal code');
      return false;
    }
    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      return;
    }

    if (!userData) {
      Alert.alert('Error', 'User data not found. Please login again.');
      return;
    }

    setLoading(true);
    try {
      const addressData = {
        fullName: formData.fullName,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        landmark: formData.landmark,
        addressType: formData.addressType,
        user: userData._id || userData.id,
      };

      let response;
      if (isEditMode) {
        // Update existing address
        response = await axios.put(
          `${API_BASE_URL}/address/update-address/${route.params.addressId}`,
          addressData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        Alert.alert('Success', 'Address updated successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        // Create new address
        addressData.isDefault = isDefault;
        response = await axios.post(
          `${API_BASE_URL}/address/create-address`,
          addressData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        Alert.alert('Success', 'Address added successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to save address';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Edit Address' : 'Add New Address'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Full Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={val => updateFormData('fullName', val)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Phone */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={val => updateFormData('phone', val)}
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Address Line 1 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address Line 1 *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              value={formData.addressLine1}
              onChangeText={val => updateFormData('addressLine1', val)}
              placeholderTextColor="#9CA3AF"
              multiline
            />
          </View>

          {/* Address Line 2 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              style={styles.input}
              placeholder="Apartment, floor, etc (optional)"
              value={formData.addressLine2}
              onChangeText={val => updateFormData('addressLine2', val)}
              placeholderTextColor="#9CA3AF"
              multiline
            />
          </View>

          {/* City */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter city"
              value={formData.city}
              onChangeText={val => updateFormData('city', val)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* State */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter state"
              value={formData.state}
              onChangeText={val => updateFormData('state', val)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Postal Code */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Postal Code *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter postal code"
              value={formData.postalCode}
              onChangeText={val => updateFormData('postalCode', val)}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Country */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter country"
              value={formData.country}
              onChangeText={val => updateFormData('country', val)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Landmark */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Landmark</Text>
            <TextInput
              style={styles.input}
              placeholder="Nearby landmark (optional)"
              value={formData.landmark}
              onChangeText={val => updateFormData('landmark', val)}
              placeholderTextColor="#9CA3AF"
              multiline
            />
          </View>

          {/* Address Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address Type *</Text>
            <View style={styles.addressTypeContainer}>
              {['Home', 'Work'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.addressTypeButton,
                    formData.addressType === type &&
                      styles.addressTypeButtonActive,
                  ]}
                  onPress={() => updateFormData('addressType', type)}
                >
                  <MaterialIcons
                    name={type === 'Home' ? 'home' : 'work'}
                    size={20}
                    color={
                      formData.addressType === type ? '#FFFFFF' : '#6B7280'
                    }
                  />
                  <Text
                    style={[
                      styles.addressTypeLabel,
                      formData.addressType === type &&
                        styles.addressTypeLabelActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Set as Default */}
          {!isEditMode && (
            <View style={styles.formGroup}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsDefault(!isDefault)}
              >
                <MaterialIcons
                  name={isDefault ? 'check-box' : 'check-box-outline-blank'}
                  size={24}
                  color={isDefault ? '#004680' : '#D1D5DB'}
                />
                <Text style={styles.checkboxLabel}>Set as default address</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveAddress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditMode ? 'Update Address' : 'Add Address'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addressTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  addressTypeButtonActive: {
    backgroundColor: '#004680',
    borderColor: '#004680',
  },
  addressTypeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  addressTypeLabelActive: {
    color: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AddAddressScreen;
