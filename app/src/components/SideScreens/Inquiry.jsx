import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_BASE_URL } from '../../utils/basicInfo';
import SideScreenNavbar from '../Navbar/SideScreenNavbar';

const Inquiry = ({ navigation }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const showToastMessage = message => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.phone.trim()) {
      showToastMessage('Phone number is required!');
      return;
    }

    setIsSubmitting(true);

    try {
      const apiData = {
        phone: formData.phone.trim(),
      };

      if (formData.name.trim()) {
        apiData.name = formData.name.trim();
      }
      if (formData.email.trim()) {
        apiData.email = formData.email.trim();
      }

      const response = await fetch(`${API_BASE_URL}/inquiry/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
        timeout: 8000,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      setShowSuccess(true);
      setFormData({ name: '', email: '', phone: '' });

      setTimeout(() => {
        navigation.goBack();
      }, 5000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      showToastMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setShowSuccess(false);
    setFormData({ name: '', email: '', phone: '' });
    navigation.goBack();
  };

  return (
    <>
      <SideScreenNavbar pageName={'Make Inquiry'} navigation={navigation} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {showSuccess ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <MaterialIcons
                    name="check-circle"
                    size={80}
                    color="#16A34A"
                  />
                </View>
                <Text style={styles.successTitle}>Thank You!</Text>
                <Text style={styles.successMessage}>
                  Your inquiry has been submitted successfully. You'll receive a
                  call from our team soon.
                </Text>
              </View>
            ) : (
              <View style={styles.formContainer}>
                {/* Name Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name (optional)"
                    placeholderTextColor="#9CA3AF"
                    value={formData.name}
                    onChangeText={value => handleInputChange('name', value)}
                  />
                </View>

                {/* Email Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email address (optional)"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={value => handleInputChange('email', value)}
                  />
                </View>

                {/* Phone Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Phone Number <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={value => handleInputChange('phone', value)}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          {!showSuccess && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleBack}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator
                    color="#FFF"
                    size="small"
                    style={styles.spinner}
                  />
                ) : null}
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Toast Notification */}
          {showToast && (
            <View style={styles.toastContainer}>
              <MaterialIcons
                name="error-outline"
                size={20}
                color="#FFF"
                style={styles.toastIcon}
              />
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#E53935',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#00569e',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  spinner: {
    marginRight: 4,
  },
  toastContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#E53935',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 50,
  },
  toastIcon: {
    marginRight: 4,
  },
  toastText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
});

export default Inquiry;
