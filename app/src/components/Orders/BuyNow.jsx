import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../utils/basicInfo';
import SideScreenNavbar from '../Navbar/SideScreenNavbar';
import AppLoader from '../../screens/common/AppLoader';
import RazorpayPaymentRN from '../../utils/RazorpayPaymentRN';

const BuyNow = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchProduct();
  }, [productId]);

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('pm-user-data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser._id);
        setUserData(parsedUser);
        fetchAddresses(parsedUser._id);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/products/get-product-by-id/${productId}`,
      );
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async id => {
    try {
      const response = await axios.get(`${API_BASE_URL}/address/user/${id}`, {
        timeout: 8000,
      });

      if (response.data.success && response.data.data) {
        setAddresses(response.data.data);
        const defaultAddr = response.data.data.find(addr => addr.isDefault);
        setSelectedAddress(defaultAddr || response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleSelectAddress = address => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  // Calculate totals
  const calculatedTotals = useMemo(() => {
    if (!product)
      return { subtotal: 0, shipping: 0, gst: 0, extraTax: 0, total: 0 };

    const subtotal = product.price * quantity;
    const shipping = (product.shippingCharge || 0) * quantity;
    const gst = (subtotal * (product.gstPercentage || 0)) / 100;
    const extraTax = (subtotal * (product.extraTaxPercentage || 0)) / 100;
    const total = subtotal + shipping + gst + extraTax;

    return {
      subtotal,
      shipping,
      gst,
      extraTax,
      total,
    };
  }, [product, quantity]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    if (!product) {
      Alert.alert('Error', 'Product details not loaded');
      return;
    }

    // Show payment method modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async paymentData => {
    try {
      setOrderLoading(true);

      // Prepare order data based on payment method
      const orderPayload = {
        userId,
        shippingAddress: selectedAddress._id,
        products: [
          {
            product: product._id,
            quantity: quantity,
            size: 'N/A',
          },
        ],
      };

      // Add Razorpay details if online payment
      if (paymentData.type === 'razorpay') {
        orderPayload.paymentId = paymentData.paymentId;
        orderPayload.razorpayOrderId = paymentData.orderId;
        orderPayload.razorpaySignature = paymentData.signature;
      }

      console.log('Placing order with payload:', orderPayload);

      const response = await axios.post(
        `${API_BASE_URL}/orders/place-order`,
        orderPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      console.log('Order placed successfully:', response.data);

      setShowPaymentModal(false);

      Alert.alert('Success', 'Order placed successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('MainTabs', { screen: 'HomeStack' });
          },
        },
      ]);
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to place order. Please try again.',
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const handlePaymentFailure = error => {
    console.error('Payment failed:', error);
    Alert.alert('Payment Failed', error.message || 'Please try again');
  };

  const renderAddressItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.addressOption,
        selectedAddress?._id === item._id && styles.addressOptionSelected,
      ]}
      onPress={() => handleSelectAddress(item)}
    >
      <View style={styles.addressItemContent}>
        <View style={styles.addressTypeTag}>
          <Text style={styles.addressTypeText}>{item.addressType}</Text>
        </View>
        <Text style={styles.addressName}>{item.fullName}</Text>
        <Text style={styles.addressDetail} numberOfLines={1}>
          {item.addressLine1}, {item.addressLine2}
        </Text>
        <Text style={styles.addressDetail} numberOfLines={1}>
          {item.city}, {item.state} {item.postalCode}
        </Text>
        {item.landmark && (
          <Text style={styles.landmark}>📍 {item.landmark}</Text>
        )}
        <Text style={styles.phone}>📞 {item.phone}</Text>
      </View>
      {selectedAddress?._id === item._id && (
        <MaterialIcons name="check-circle" size={24} color="#00569e" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return <AppLoader size={100} />;
  }

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="error-outline" size={80} color="#cccccc" />
        <Text style={styles.emptyTitle}>Product Not Found</Text>
        <TouchableOpacity
          style={styles.continueShopping}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.continueShoppingText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <SideScreenNavbar pageName={'Order Summary'} navigation={navigation} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Address Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Deliver to:</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(true)}>
                <Text style={styles.changeButton}>Change</Text>
              </TouchableOpacity>
            </View>

            {selectedAddress && (
              <View style={styles.selectedAddressCard}>
                <View style={styles.addressTypeTagSelected}>
                  <Text style={styles.addressTypeTextSelected}>
                    {selectedAddress.addressType}
                  </Text>
                </View>
                <Text style={styles.selectedAddressName}>
                  {selectedAddress.fullName}
                </Text>
                <Text style={styles.selectedAddressDetail}>
                  {selectedAddress.addressLine1}, {selectedAddress.addressLine2}
                </Text>
                <Text style={styles.selectedAddressDetail}>
                  {selectedAddress.city}, {selectedAddress.state}{' '}
                  {selectedAddress.postalCode}
                </Text>
                {selectedAddress.landmark && (
                  <Text style={styles.selectedAddressDetail}>
                    {selectedAddress.landmark}
                  </Text>
                )}
                <Text style={styles.selectedPhone}>
                  {selectedAddress.phone}
                </Text>
              </View>
            )}
          </View>

          {/* Product Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Item</Text>
            <View style={styles.productRow}>
              <View style={styles.productImageContainer}>
                <Image
                  source={{ uri: product.images?.[0] }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                {/* <Text style={styles.productBrand}>{product.brand}</Text> */}
                <Text style={styles.productQty}>Qty: {quantity}</Text>
              </View>
              <View style={styles.productPriceContainer}>
                <Text style={styles.productSubtotal}>
                  ₹
                  {(product.price * quantity).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>

            {/* Quantity Selector */}
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Price Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>
                ₹
                {calculatedTotals.subtotal.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping Charge</Text>
              <Text style={styles.priceValue}>
                ₹
                {calculatedTotals.shipping.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                GST ({product.gstPercentage || 0}%)
              </Text>
              <Text style={styles.priceValue}>
                ₹
                {calculatedTotals.gst.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Extra Tax ({product.extraTaxPercentage || 0}%)
              </Text>
              <Text style={styles.priceValue}>
                ₹
                {calculatedTotals.extraTax.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>
                ₹
                {calculatedTotals.total.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Total and Button */}
        <View style={styles.fixedBottomContainer}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>
              ₹
              {calculatedTotals.total.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
            disabled={orderLoading}
          >
            {orderLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.placeOrderText}>Place Order</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Address Selection Modal */}
        <Modal
          visible={showAddressModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddressModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Delivery Address</Text>
                <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                  <MaterialIcons name="close" size={24} color="#1F2937" />
                </TouchableOpacity>
              </View>

              {addresses.length > 0 ? (
                <FlatList
                  data={addresses}
                  renderItem={renderAddressItem}
                  keyExtractor={item => item._id}
                  contentContainerStyle={styles.addressListContent}
                />
              ) : (
                <View style={styles.noAddressContainer}>
                  <Text style={styles.noAddressText}>
                    No addresses found. Please add an address first.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Payment Method Modal */}
        <RazorpayPaymentRN
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          amount={calculatedTotals.total}
          orderId={`${userId}_${Date.now()}`}
          userData={userData}
        />
      </View>
    </>
  );
};

export default BuyNow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  continueShopping: {
    backgroundColor: '#00569e',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 24,
  },
  continueShoppingText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  changeButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00569e',
  },
  selectedAddressCard: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00569e',
  },
  addressTypeTagSelected: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  addressTypeTextSelected: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00569e',
  },
  selectedAddressName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedAddressDetail: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  selectedPhone: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
  },
  productRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },
  productImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  productBrand: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  productQty: {
    fontSize: 12,
    color: '#6B7280',
  },
  productPriceContainer: {
    alignItems: 'flex-end',
  },
  productSubtotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    marginHorizontal: -16,
    marginBottom: -16,
    paddingBottom: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  priceLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00569e',
  },
  fixedBottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeOrderButton: {
    backgroundColor: '#00569e',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  addressListContent: {
    padding: 12,
  },
  addressOption: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressOptionSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#00569e',
    borderWidth: 2,
  },
  addressItemContent: {
    flex: 1,
    marginRight: 10,
  },
  addressTypeTag: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  addressTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#856404',
  },
  addressName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  landmark: {
    fontSize: 12,
    color: '#059669',
    marginTop: 4,
  },
  phone: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
  },
  noAddressContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noAddressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
