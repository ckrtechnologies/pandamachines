import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import { API_BASE_URL, kREACT_APP_RAZORPAY_KEY_ID } from '../utils/basicInfo';

const RazorpayPayment = ({
  visible,
  onClose,
  onSuccess,
  onFailure,
  bookingData,
  customerData,
  amount,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const createOrder = async () => {
    try {
      if (!customerData || !amount) {
        throw new Error('Missing customer data or amount');
      }

      const orderData = {
        amount: amount * 100, // Convert to paise
        name: customerData.fullName,
        email: customerData.email,
        number: customerData.mobileNumber,
        address: customerData.address || 'Not provided',
        product: customerData.product || 'Guidance Consultation',
        profile_name: customerData.fullName.toLowerCase().replace(/\s+/g, '_'),
      };

      console.log('Creating order with data:', orderData);

      const response = await axios.post(
        `${API_BASE_URL}/razorpay/create-order`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      console.log('Order created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Error creating order:',
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  const createBooking = async paymentResponse => {
    try {
      if (!bookingData) {
        throw new Error('Booking data is missing');
      }

      const bookingPayload = {
        ...bookingData,
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id,
        paymentStatus: 'completed',
      };

      console.log('Creating booking with data:', bookingPayload);

      const bookingResponse = await axios.post(
        `${API_BASE_URL}/guidance-booking/book`,
        bookingPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      console.log('Booking created successfully:', bookingResponse.data);
      return bookingResponse.data;
    } catch (error) {
      console.error('Error creating booking:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  };

  const initiateRazorpayPayment = async () => {
    if (!customerData || !amount || !bookingData) {
      Alert.alert(
        'Error',
        'Missing required data. Please go back and fill the form again.',
      );
      return;
    }

    setLoading(true);

    try {
      // Create order on backend
      const orderData = await createOrder();

      const razorpayOptions = {
        description: 'Guidance Consultation Payment',
        image: 'https://your-logo-url.com/logo.png',
        currency: 'INR',
        key_id: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        order_id: orderData.id,
        name: 'Panda Machines',
        prefill: {
          email: customerData.email,
          contact: customerData.mobileNumber,
          name: customerData.fullName,
        },
        theme: { color: '#F97316' },
      };

      console.log('Opening Razorpay with options:', razorpayOptions);

      RazorpayCheckout.open(razorpayOptions)
        .then(response => {
          console.log('Payment successful with response:', response);

          // Create booking after successful payment
          createBooking(response)
            .then(bookingResult => {
              console.log('Booking created successfully');
              setLoading(false);
              setPaymentMethod(null);

              Alert.alert(
                'Success',
                'Payment successful and booking confirmed!',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      onSuccess({
                        type: 'razorpay',
                        bookingData: bookingResult,
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                      });
                      onClose();
                    },
                  },
                ],
              );
            })
            .catch(bookingError => {
              console.error('Booking creation failed:', bookingError);
              setLoading(false);
              setPaymentMethod(null);

              Alert.alert(
                'Warning',
                'Payment successful but booking creation failed. Please contact support.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      onClose();
                    },
                  },
                ],
              );
            });
        })
        .catch(error => {
          console.error('Razorpay error:', error);
          setLoading(false);
          setPaymentMethod(null);

          let errorMessage = 'Payment failed';
          if (error.code === 'CANCELLED') {
            errorMessage = 'Payment cancelled by user';
          } else if (error.description) {
            errorMessage = error.description;
          }

          Alert.alert('Payment Failed', errorMessage, [
            {
              text: 'Retry',
              onPress: () => initiateRazorpayPayment(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]);
        });
    } catch (error) {
      console.error('Payment initiation error:', error);
      setLoading(false);
      setPaymentMethod(null);

      Alert.alert('Error', error.message || 'Failed to initiate payment');
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      setLoading(true);
      setPaymentMethod('cod');

      if (!bookingData) {
        throw new Error('Booking data is missing');
      }

      const bookingPayload = {
        ...bookingData,
        paymentStatus: 'pending',
        paymentMethod: 'cash_on_delivery',
      };

      console.log('Creating COD booking with data:', bookingPayload);

      const bookingResponse = await axios.post(
        `${API_BASE_URL}/guidance-booking/book`,
        bookingPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      console.log('COD Booking created successfully:', bookingResponse.data);
      setLoading(false);
      setPaymentMethod(null);

      Alert.alert('Success', 'Booking confirmed with Cash on Delivery!', [
        {
          text: 'OK',
          onPress: () => {
            onSuccess({
              type: 'cod',
              bookingData: bookingResponse.data,
              paymentMethod: 'cash_on_delivery',
            });
            onClose();
          },
        },
      ]);
    } catch (error) {
      console.error('COD booking error:', error);
      setLoading(false);
      setPaymentMethod(null);

      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to create booking. Please try again.',
      );
    }
  };

  const handlePaymentMethodSelection = method => {
    if (method === 'cod') {
      handleCashOnDelivery();
    } else if (method === 'razorpay') {
      setPaymentMethod('razorpay');
      initiateRazorpayPayment();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Payment Method</Text>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <MaterialIcons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F97316" />
              <Text style={styles.loadingText}>
                {paymentMethod === 'razorpay'
                  ? 'Processing Payment...'
                  : 'Creating Booking...'}
              </Text>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {/* Cash on Delivery Option */}
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  paymentMethod === 'cod' && styles.optionButtonSelected,
                ]}
                onPress={() => handlePaymentMethodSelection('cod')}
                disabled={loading}
              >
                <View style={styles.optionIcon}>
                  <MaterialIcons
                    name="local-shipping"
                    size={32}
                    color="#059669"
                  />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Cash on Delivery</Text>
                  <Text style={styles.optionDescription}>
                    Pay when service is provided
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
              </TouchableOpacity>

              {/* Razorpay Payment Option */}
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  paymentMethod === 'razorpay' && styles.optionButtonSelected,
                ]}
                onPress={() => handlePaymentMethodSelection('razorpay')}
                disabled={loading}
              >
                <View style={styles.optionIcon}>
                  <MaterialIcons name="credit-card" size={32} color="#F97316" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Pay Now</Text>
                  <Text style={styles.optionDescription}>
                    Secure payment via Razorpay
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountText}>
              ₹{amount?.toLocaleString('en-IN')}
            </Text>
          </View>

          {!loading && (
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#F97316',
    borderWidth: 2,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});

export default RazorpayPayment;
