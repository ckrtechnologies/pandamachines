import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import { API_BASE_URL, RAZORPAY_KEY_ID } from '../utils/basicInfo';

const RazorpayPaymentRN = ({
  visible,
  onClose,
  onSuccess,
  onFailure,
  amount,
  orderId,
  userData,
}) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    try {
      const orderData = {
        amount: amount,
        name: userData?.firstName + userData?.lastName,
        email: userData?.email || '',
        number: userData?.phone || '',
        address: userData?.address || 'Not provided',
        product: 'Product Order',
        profile_name: (userData?.fullName || 'customer')
          .toLowerCase()
          .replace(/\s+/g, '_'),
      };

      console.log('Creating order with data:', orderData);
      console.log('Amount in rupees:', amount);

      const response = await axios.post(
        `${API_BASE_URL}/razorpay/create-order`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 8000,
        },
      );

      console.log('Order created successfully:', response.data);
      console.log('Order amount from backend:', response.data.amount);
      console.log('Order ID from backend:', response.data.id);

      if (!response.data.amount) {
        console.error("Backend didn't return amount!");
      }

      return response.data;
    } catch (error) {
      console.error(
        'Error creating order:',
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  const initiateRazorpayPayment = async () => {
    try {
      console.log('Environment check:', {
        hasRazorpayKey: !!RAZORPAY_KEY_ID,
        razorpayKey: RAZORPAY_KEY_ID?.substring(0, 10) + '...',
        hasApiUrl: !!API_BASE_URL,
        apiUrl: API_BASE_URL,
      });

      const orderData = await createOrder();

      const razorpayKey = RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          'Razorpay key not found. Please check your environment variables.',
        );
      }

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Panda Machines',
        description: 'Product Order Payment',
        order_id: orderData.id,
        prefill: {
          name: userData?.fullName || '',
          email: userData?.email || '',
          contact: userData?.phone || '',
        },
        notes: {
          order_type: 'product_order',
          category: 'e-commerce',
        },
        theme: {
          color: '#F97316',
        },
      };

      console.log('Opening Razorpay with options:', options);

      RazorpayCheckout.open(options)
        .then(data => {
          console.log('Payment successful with response:', data);
          console.log('Original order data:', orderData);
          handlePaymentSuccess(data, orderData);
        })
        .catch(error => {
          console.log('Payment failed:', error);
          handlePaymentFailure(error);
        });
    } catch (error) {
      console.error('Payment initiation error:', error);
      onFailure({
        type: 'initiation_failed',
        message: error.message || 'Failed to initiate payment',
        error: error,
      });
      setLoading(false);
      setPaymentMethod(null);
    }
  };

  const handlePaymentSuccess = async (paymentData, orderData) => {
    try {
      console.log('Payment Response Details:', {
        payment_id: paymentData.razorpay_payment_id,
        order_id: paymentData.razorpay_order_id,
        signature: paymentData.razorpay_signature,
        original_order_id: orderData.id,
      });

      console.log('Payment successful, returning payment data...');

      onSuccess({
        type: 'razorpay',
        paymentData: paymentData,
        orderData: orderData,
        paymentId: paymentData.razorpay_payment_id,
        orderId: paymentData.razorpay_order_id,
        signature: paymentData.razorpay_signature,
      });

      Alert.alert('Success', 'Payment completed successfully!');
      onClose();
    } catch (error) {
      console.error('Error in payment success handler:', error);
      onFailure({
        type: 'success_handler_failed',
        message: 'Payment successful but processing failed',
        error: error,
        paymentData: paymentData,
      });
    } finally {
      setLoading(false);
      setPaymentMethod(null);
    }
  };

  const handlePaymentFailure = error => {
    console.error('Razorpay payment failed:', error);

    setLoading(false);
    setPaymentMethod(null);

    onFailure({
      type: 'payment_failed',
      message: error.message || 'Payment failed',
      error: error,
    });

    Alert.alert('Payment Failed', 'Please try again');
  };

  const handlePaymentMethodSelection = async method => {
    if (method === 'cod') {
      // Cash on Delivery selected
      setPaymentMethod(null);
      onSuccess({
        type: 'cod',
        paymentMethod: 'cash_on_delivery',
        message: 'Order placed with Cash on Delivery',
      });
      onClose();
    } else if (method === 'razorpay') {
      // Razorpay Payment
      setPaymentMethod('razorpay');
      setLoading(true);
      await initiateRazorpayPayment();
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
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F97316" />
              <Text style={styles.loadingText}>Processing Payment...</Text>
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
                    Pay when you receive your order
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
              ₹
              {amount.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
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

export default RazorpayPaymentRN;

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
