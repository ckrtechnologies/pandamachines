import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SideScreenNavbar from '../../components/Navbar/SideScreenNavbar';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, RAZORPAY_KEY_ID } from '../../utils/basicInfo';

const GST_RATE = 0.18;

const DISCUSSION_OPTIONS = [
  { time: '30 mins', fee: 2000 },
  { time: '60 mins', fee: 5000 },
  { time: 'Full Day', fee: 10000 },
  { time: 'Until Project Completion', fee: 20000 },
];

const INVESTMENT_OPTIONS = [
  '0-5 Lakh',
  '5-10 Lakh',
  '10-20 Lakh',
  '20-30 Lakh',
  '30-40 Lakh',
  '40-50 Lakh',
  '50 Lakh - 1 Cr',
  '1 Cr+',
];

const SkeletonBox = ({ width, height, style }) => {
  const opacity = React.useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: 8,
          backgroundColor: '#E5E7EB',
          opacity,
        },
        style,
      ]}
    />
  );
};

const SkeletonForm = () => (
  <ScrollView
    style={{ flex: 1 }}
    contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    showsVerticalScrollIndicator={false}
  >
    {/* Header */}
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <SkeletonBox
        width="65%"
        height={24}
        style={{ alignSelf: 'center', marginBottom: 10 }}
      />
      <SkeletonBox
        width="45%"
        height={12}
        style={{ alignSelf: 'center' }}
      />
    </View>

    {/* User Pill */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 12,
        marginBottom: 14,
      }}
    >
      <SkeletonBox
        width={40}
        height={40}
        style={{ borderRadius: 20, marginRight: 12 }}
      />

      <View style={{ flex: 1 }}>
        <SkeletonBox width={120} height={12} style={{ marginBottom: 6 }} />
        <SkeletonBox width={160} height={10} />
      </View>

      <SkeletonBox
        width={20}
        height={20}
        style={{ borderRadius: 10 }}
      />
    </View>
    
    {/* User Info Section */}
    <View style={sk.section}>
      <SkeletonBox width={120} height={12} style={{ marginBottom: 14 }} />

      {[1, 2, 3].map(item => (
        <View
          key={item}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: item !== 3 ? 16 : 0,
          }}
        >
          <SkeletonBox
            width={18}
            height={18}
            style={{ borderRadius: 9, marginRight: 10 }}
          />

          <View style={{ flex: 1 }}>
            <SkeletonBox width={80} height={8} style={{ marginBottom: 6 }} />
            <SkeletonBox width="70%" height={12} />
          </View>
        </View>
      ))}
    </View>

    {/* Plant Selection */}
    <View style={sk.section}>
      <SkeletonBox width={140} height={12} style={{ marginBottom: 14 }} />

      {[1, 2, 3, 4].map(item => (
        <SkeletonBox
          key={item}
          width="100%"
          height={54}
          style={{
            marginBottom: 12,
            borderRadius: 12,
          }}
        />
      ))}
    </View>

    {/* Investment Amount */}
    <View style={sk.section}>
      <SkeletonBox width={130} height={12} style={{ marginBottom: 10 }} />
      <SkeletonBox width={180} height={10} style={{ marginBottom: 14 }} />

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBox
            key={i}
            width="48%"
            height={42}
            style={{
              marginBottom: 10,
              borderRadius: 10,
            }}
          />
        ))}
      </View>
    </View>

    {/* Discussion Duration */}
    <View style={sk.section}>
      <SkeletonBox width={150} height={12} style={{ marginBottom: 14 }} />

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox
            key={i}
            width="48%"
            height={90}
            style={{
              marginBottom: 10,
              borderRadius: 14,
            }}
          />
        ))}
      </View>
    </View>

    {/* Date & Time */}
    <View style={sk.section}>
      <SkeletonBox width={140} height={12} style={{ marginBottom: 14 }} />

      <SkeletonBox
        width="100%"
        height={54}
        style={{
          marginBottom: 12,
          borderRadius: 12,
        }}
      />

      <SkeletonBox
        width="100%"
        height={54}
        style={{
          marginBottom: 10,
          borderRadius: 12,
        }}
      />

      <SkeletonBox width="70%" height={10} />
    </View>

    {/* Payment Summary */}
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
      }}
    >
      <SkeletonBox width={120} height={12} style={{ marginBottom: 14 }} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <SkeletonBox width={150} height={12} />
        <SkeletonBox width={70} height={12} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <SkeletonBox width={100} height={12} />
        <SkeletonBox width={60} height={12} />
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: '#e5e7eb',
          marginVertical: 10,
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <SkeletonBox width={110} height={14} />
        <SkeletonBox width={100} height={22} />
      </View>
    </View>

    {/* Button */}
    <SkeletonBox
      width="100%"
      height={56}
      style={{
        borderRadius: 14,
        marginBottom: 14,
      }}
    />

    {/* Secure text */}
    <SkeletonBox
      width={180}
      height={10}
      style={{
        alignSelf: 'center',
      }}
    />
  </ScrollView>
);

// ── Success Screen ─────────────────────────────────────────────────────────
const BookingSuccessScreen = ({ booking, onGoBack }) => {
  const b = booking?.booking || {};
  const formatDate = (d) => {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
  };
  const formatTime = (t) => {
    if (!t) return '—';
    const [hh, mm] = t.split(':');
    const h = parseInt(hh);
    return `${h % 12 || 12}:${mm} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <View style={ss.successContainer}>
      <ScrollView contentContainerStyle={ss.successScroll} showsVerticalScrollIndicator={false}>
        <View style={ss.successIconWrap}>
          <View style={ss.successIconBg}>
            <MaterialIcons name="check" size={40} color="#fff" />
          </View>
        </View>
        <Text style={ss.successTitle}>Booking Confirmed!</Text>
        <Text style={ss.successSubtitle}>Our team will connect with you shortly.</Text>

        {/* Customer card */}
        <View style={ss.customerCard}>
          <View style={ss.avatarRow}>
            <View style={ss.avatar}>
              <Text style={ss.avatarText}>{(b.fullName || '?').charAt(0).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={ss.avatarName}>{b.fullName || '—'}</Text>
              <Text style={ss.avatarPhone}>{b.mobileNumber || ''}</Text>
            </View>
          </View>
          <View style={ss.sessionBadge}>
            <Text style={ss.sessionBadgeLabel}>{b.discussionTime} Consultation</Text>
            <Text style={ss.sessionBadgeDate}>{formatDate(b.date)}  ·  {formatTime(b.time)}</Text>
          </View>
        </View>

        {/* Booking details */}
        <View style={ss.detailsCard}>
          <Text style={ss.detailsTitle}>Booking Details</Text>
          {b.email ? <InfoRow label="Email" value={b.email} /> : null}
          {b.category?.name ? <InfoRow label="Category" value={b.category.name} /> : null}
          {b.product?.name ? <InfoRow label="Product" value={b.product.name} /> : null}
          {b.investmentAmount ? <InfoRow label="Investment Range" value={b.investmentAmount} /> : null}
        </View>

        {/* Payment */}
        <View style={ss.detailsCard}>
          <Text style={ss.detailsTitle}>Payment</Text>
          {b.discussionFee != null && (
            <InfoRow label="Consultation Fee" value={`₹${Number(b.discussionFee).toLocaleString('en-IN')}`} />
          )}
          {b.gstAmount != null && (
            <InfoRow label="GST (18%)" value={`₹${Number(b.gstAmount).toLocaleString('en-IN')}`} />
          )}
          <View style={ss.totalRow2}>
            <Text style={ss.totalLabel2}>Total Paid</Text>
            <Text style={ss.totalValue2}>₹{Number(b.totalAmount || b.discussionFee || 0).toLocaleString('en-IN')}</Text>
          </View>
          {b.paymentId ? (
            <View style={ss.paymentIdBox}>
              <Text style={ss.paymentIdLabel}>Payment ID</Text>
              <Text style={ss.paymentIdValue}>{b.paymentId}</Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity style={ss.homeBtn} onPress={onGoBack}>
          <Text style={ss.homeBtnText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={ss.infoRow}>
    <Text style={ss.infoLabel}>{label}</Text>
    <Text style={ss.infoValue}>{value}</Text>
  </View>
);

// ── Investment Pill ────────────────────────────────────────────────────────
const InvestmentPill = ({ option, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.investPill, selected && styles.investPillActive]}
    onPress={() => onPress(option)}
    activeOpacity={0.75}
  >
    <View style={[styles.investRadio, selected && styles.investRadioActive]}>
      {selected && <View style={styles.investRadioDot} />}
    </View>
    <Text style={[styles.investPillText, selected && styles.investPillTextActive]}>{option}</Text>
  </TouchableOpacity>
);

// ── Custom Dropdown ────────────────────────────────────────────────────────
const CustomDropdown = ({ label, options, selectedValue, onSelect, visible, onToggle, disabled }) => {
  const selected = options.find(o => o._id === selectedValue || o.id === selectedValue);
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[styles.dropdownButton, disabled && styles.dropdownButtonDisabled]}
        onPress={onToggle}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.dropdownButtonText, selected && styles.dropdownButtonTextSelected]}>
          {selected ? selected.name : label}
        </Text>
        <MaterialIcons name={visible ? 'expand-less' : 'expand-more'} size={24} color={disabled ? '#ccc' : '#666'} />
      </TouchableOpacity>
      {visible && !disabled && (
        <Modal visible transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onToggle}>
            <View style={styles.dropdownMenuModal}>
              {options.length > 0 ? (
                <FlatList
                  data={options}
                  keyExtractor={o => o._id || o.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dropdownMenuItem,
                        (item._id === selectedValue || item.id === selectedValue) && styles.dropdownMenuItemActive,
                      ]}
                      onPress={() => { onSelect(item._id || item.id); onToggle(); }}
                    >
                      <Text style={[
                        styles.dropdownMenuItemText,
                        (item._id === selectedValue || item.id === selectedValue) && styles.dropdownMenuItemTextActive,
                      ]}>
                        {item.name}
                      </Text>
                      {(item._id === selectedValue || item.id === selectedValue) && (
                        <MaterialIcons name="check" size={16} color="#00395F" />
                      )}
                    </TouchableOpacity>
                  )}
                  scrollEnabled
                  nestedScrollEnabled
                />
              ) : (
                <Text style={styles.dropdownMenuEmpty}>No options available</Text>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

// ── User Info Row (disabled, read-only) ───────────────────────────────────
const UserInfoRow = ({ icon, label, value }) => (
  <View style={styles.userInfoRow}>
    <MaterialIcons name={icon} size={16} color="#9ca3af" style={{ marginTop: 1 }} />
    <View style={{ flex: 1 }}>
      <Text style={styles.userInfoLabel}>{label}</Text>
      <Text style={styles.userInfoValue}>{value || '—'}</Text>
    </View>
  </View>
);

// ── Main Component ─────────────────────────────────────────────────────────
const OnlineConsultation = ({ navigation }) => {
  const { user, isLoggedIn } = useAuth();

  // Derive full name from firstName + lastName
  const userFullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const userPhone = user?.phone || user?.mobileNumber || '';
  const userEmail = user?.email || '';

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    subSubCategory: '',
    product: '',
    investmentAmount: '',
    discussionTime: '30 mins',
    discussionFee: 2000,
    date: '',
    time: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [showSubSubCategoryDropdown, setShowSubSubCategoryDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const gstAmount = Math.round(formData.discussionFee * GST_RATE);
  const totalAmount = formData.discussionFee + gstAmount;

  useEffect(() => {
    setLoadingCategories(true);
    axios
      .get(`${API_BASE_URL}/categories/get-all-categories`, { timeout: 8000 })
      .then(r => setCategories(r.data || []))
      .catch(() => Alert.alert('Error', 'Failed to fetch categories'))
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    if (!formData.category) return setSubCategories([]);
    axios
      .get(`${API_BASE_URL}/sub-categories/get-sub-categories-by-category/${formData.category}`, { timeout: 8000 })
      .then(r => setSubCategories(r.data.subCategories || r.data || []))
      .catch(() => setSubCategories([]));
  }, [formData.category]);

  useEffect(() => {
    if (!formData.subCategory) return setSubSubCategories([]);
    axios
      .get(`${API_BASE_URL}/sub-sub-categories/subcategory/${formData.subCategory}`, { timeout: 8000 })
      .then(r => setSubSubCategories(r.data || []))
      .catch(() => setSubSubCategories([]));
  }, [formData.subCategory]);

  useEffect(() => {
    if (!formData.subSubCategory) return setProducts([]);
    axios
      .get(`${API_BASE_URL}/products/products-by-sub-sub-category/${formData.subSubCategory}`, { timeout: 8000 })
      .then(r => setProducts(r.data || []))
      .catch(() => setProducts([]));
  }, [formData.subSubCategory]);

  const set = (key, value) => setFormData(p => ({ ...p, [key]: value }));

  const handleCategorySelect = id =>
    setFormData(p => ({ ...p, category: id, subCategory: '', subSubCategory: '', product: '' }));
  const handleSubCategorySelect = id =>
    setFormData(p => ({ ...p, subCategory: id, subSubCategory: '', product: '' }));
  const handleSubSubCategorySelect = id =>
    setFormData(p => ({ ...p, subSubCategory: id, product: '' }));
  const handleInvestmentSelect = option =>
    setFormData(p => ({ ...p, investmentAmount: p.investmentAmount === option ? '' : option }));

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (!selectedDate) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      Alert.alert('Invalid Date', 'Please select today or a future date.');
      return;
    }
    set('date', selectedDate.toISOString().split('T')[0]);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (!selectedTime) return;
    const hh = String(selectedTime.getHours()).padStart(2, '0');
    const mm = String(selectedTime.getMinutes()).padStart(2, '0');
    set('time', `${hh}:${mm}`);
  };

  // ── Validation (mirrors web) ─────────────────────────────────────────────
  const validate = () => {
    const errs = [];
    if (!formData.category) errs.push('Please select a category');
    if (!formData.subCategory) errs.push('Please select a sub category');
    if (!formData.subSubCategory) errs.push('Please select a sub-sub category');
    if (!formData.product) errs.push('Please select a product');
    if (!formData.date) errs.push('Please select a date');
    if (!formData.time) errs.push('Please select a time');

    // Phone validation on the user's stored number
    const mobile = userPhone.replace(/\s/g, '');
    if (!mobile) errs.push('No mobile number found on your account');
    else if (!/^\d{10}$/.test(mobile)) errs.push('Account mobile number must be 10 digits (no country code)');
    else if (!['6', '7', '8', '9'].includes(mobile[0])) errs.push('Account mobile number must start with 6, 7, 8, or 9');

    if (errs.length > 0) {
      Alert.alert('Incomplete', errs[0]); // show first error, consistent with web
      return false;
    }
    return true;
  };

  const getName = (items, id) => (items.find(i => i._id === id || i.id === id) || {}).name || '';

  const createOrder = async () => {
    const { data } = await axios.post(
      `${API_BASE_URL}/razorpay/create-order`,
      {
        amount: totalAmount,
        name: userFullName,
        email: userEmail,
        number: userPhone.replace(/\s/g, ''),
        product: getName(products, formData.product) || 'Guidance Consultation',
        profile_name: userFullName.toLowerCase().replace(/\s+/g, '_'),
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );
    return data;
  };

  const createBooking = async paymentResponse => {
    const { data } = await axios.post(
      `${API_BASE_URL}/guidance-booking/book`,
      {
        category: formData.category,
        subCategory: formData.subCategory || undefined,
        subSubCategory: formData.subSubCategory || undefined,
        product: formData.product || undefined,
        ...(formData.investmentAmount ? { investmentAmount: formData.investmentAmount } : {}),
        fullName: userFullName,
        mobileNumber: userPhone.replace(/\s/g, ''),
        email: userEmail,
        discussionTime: formData.discussionTime,
        discussionFee: formData.discussionFee,
        date: formData.date,
        time: formData.time,
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id,
        paymentSignature: paymentResponse.razorpay_signature,
        paymentStatus: 'completed',
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );
    return data;
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please log in to book a consultation.',
        [
          { text: 'Login', onPress: () => navigation.navigate('AuthPage') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    if (!validate()) return;

    if (!RAZORPAY_KEY_ID) {
      Alert.alert('Error', 'Payment configuration missing. Please contact support.');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = await createOrder();
      if (!orderData?.id || !orderData?.amount) throw new Error('Invalid order data from server');

      const razorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Panda Machines',
        description: `Guidance Consultation – ${formData.discussionTime}`,
        order_id: orderData.id,
        prefill: {
          name: userFullName,
          email: userEmail,
          contact: userPhone.replace(/\s/g, ''),
        },
        notes: { category: formData.category, discussionTime: formData.discussionTime },
        theme: { color: '#FF8617' },
      };

      RazorpayCheckout.open(razorpayOptions)
        .then(async response => {
          try {
            const result = await createBooking(response);
            setSubmitting(false);
            setBookingResult(result);
          } catch (bookingErr) {
            setSubmitting(false);
            const msg =
              bookingErr?.response?.data?.error ||
              bookingErr?.response?.data?.message ||
              bookingErr.message ||
              'Unknown error';
            Alert.alert(
              'Warning',
              `Payment successful but booking failed.\n\nReason: ${msg}\n\nSave your Payment ID: ${response.razorpay_payment_id}`
            );
          }
        })
        .catch(error => {
          setSubmitting(false);
          if (error?.code === 0) return; // user cancelled — silent
          Alert.alert(
            'Payment Failed',
            error?.description || 'Something went wrong. Please try again.',
            [
              { text: 'Retry', onPress: handleSubmit },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        });
    } catch (error) {
      setSubmitting(false);
      Alert.alert(
        'Error',
        error?.response?.data?.message || error.message || 'Failed to initiate payment.',
        [
          { text: 'Try Again', onPress: handleSubmit },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  if (bookingResult) {
    return (
      <View style={styles.container}>
        <SideScreenNavbar pageName="Booking Confirmed" navigation={navigation} />
        <BookingSuccessScreen booking={bookingResult} onGoBack={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SideScreenNavbar pageName="Online Consultation" navigation={navigation} />

      {loadingCategories ? (
        <SkeletonForm />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Book Expert Guidance</Text>
            <Text style={styles.headerSub}>Select your preferences and pay securely</Text>
          </View>
            {/* Not logged in warning */}
            {!isLoggedIn && (
              <TouchableOpacity
                style={styles.loginBanner}
                onPress={() => navigation.navigate('AuthPage')}
              >
                <MaterialIcons name="info-outline" size={18} color="#92400e" />
                <Text style={styles.loginBannerText}>You're not logged in. Tap to login and book.</Text>
                <MaterialIcons name="arrow-forward-ios" size={14} color="#92400e" />
              </TouchableOpacity>
            )}

            {/* User info pill */}
            {isLoggedIn && (
              <View style={styles.userPill}>
                <View style={styles.userPillAvatar}>
                  <Text style={styles.userPillAvatarText}>
                    {(userFullName || '?').charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userPillName}>{userFullName || '—'}</Text>
                  <Text style={styles.userPillSub}>Details prefilled from your account</Text>
                </View>
                <MaterialIcons name="verified" size={20} color="#16a34a" />
              </View>
            )}

          {/* ── Your Information (prefilled, phone disabled) ── */}
          {isLoggedIn && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Information</Text>
              <View style={styles.userInfoCard}>
                <UserInfoRow icon="person" label="Full Name" value={userFullName} />
                <View style={styles.userInfoDivider} />
                <UserInfoRow icon="phone" label="Mobile Number" value={userPhone} />
                <View style={styles.userInfoDivider} />
                <UserInfoRow icon="email" label="Email Address" value={userEmail} />
              </View>
              <View style={styles.lockedHint}>
                <MaterialIcons name="lock" size={12} color="#6b7280" />
                <Text style={styles.lockedHintText}>Edit these in your profile settings</Text>
              </View>
            </View>
          )}
          {/* ── Plant Type Selection ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plant Type Selection</Text>
            <CustomDropdown
              label="Select Category"
              options={categories}
              selectedValue={formData.category}
              onSelect={handleCategorySelect}
              visible={showCategoryDropdown}
              onToggle={() => {
                setShowCategoryDropdown(v => !v);
                setShowSubCategoryDropdown(false);
                setShowSubSubCategoryDropdown(false);
                setShowProductDropdown(false);
              }}
            />
            <CustomDropdown
              label="Select Sub Category"
              options={subCategories}
              selectedValue={formData.subCategory}
              onSelect={handleSubCategorySelect}
              visible={showSubCategoryDropdown}
              onToggle={() => {
                setShowSubCategoryDropdown(v => !v);
                setShowCategoryDropdown(false);
                setShowSubSubCategoryDropdown(false);
                setShowProductDropdown(false);
              }}
              disabled={!formData.category}
            />
            <CustomDropdown
              label="Select Sub-Sub Category"
              options={subSubCategories}
              selectedValue={formData.subSubCategory}
              onSelect={handleSubSubCategorySelect}
              visible={showSubSubCategoryDropdown}
              onToggle={() => {
                setShowSubSubCategoryDropdown(v => !v);
                setShowCategoryDropdown(false);
                setShowSubCategoryDropdown(false);
                setShowProductDropdown(false);
              }}
              disabled={!formData.subCategory}
            />
            <CustomDropdown
              label="Select Product"
              options={products}
              selectedValue={formData.product}
              onSelect={id => set('product', id)}
              visible={showProductDropdown}
              onToggle={() => {
                setShowProductDropdown(v => !v);
                setShowCategoryDropdown(false);
                setShowSubCategoryDropdown(false);
                setShowSubSubCategoryDropdown(false);
              }}
              disabled={!formData.subSubCategory}
            />
          </View>



          {/* ── Investment Amount ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investment Amount</Text>
            <Text style={styles.hintText}>How much are you planning to invest? (Optional)</Text>
            <View style={styles.investGrid}>
              {INVESTMENT_OPTIONS.map(option => (
                <InvestmentPill
                  key={option}
                  option={option}
                  selected={formData.investmentAmount === option}
                  onPress={handleInvestmentSelect}
                />
              ))}
            </View>
          </View>

          {/* ── Discussion Duration ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Discussion Duration</Text>
            <View style={styles.discussionGrid}>
              {DISCUSSION_OPTIONS.map(({ time, fee }) => {
                const active = formData.discussionTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    style={[styles.discussionCard, active && styles.discussionCardActive]}
                    onPress={() => setFormData(p => ({ ...p, discussionTime: time, discussionFee: fee }))}
                    activeOpacity={0.7}
                  >
                    {active && (
                      <View style={styles.discussionCheck}>
                        <MaterialIcons name="check-circle" size={14} color="#00395F" />
                      </View>
                    )}
                    <Text style={[styles.discussionCardTime, active && styles.discussionCardTimeActive]}>{time}</Text>
                    <Text style={[styles.discussionCardFee, active && styles.discussionCardFeeActive]}>
                      ₹{fee.toLocaleString('en-IN')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Date & Time ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Time Slot</Text>
            <TouchableOpacity style={styles.dateTimeBtn} onPress={() => setShowDatePicker(true)}>
              <MaterialIcons name="calendar-today" size={18} color="#00395F" />
              <Text style={[styles.dateTimeText, !formData.date && styles.dateTimePlaceholder]}>
                {formData.date
                  ? (() => {
                    const [y, m, d] = formData.date.split('-');
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
                  })()
                  : 'Select Date'}
              </Text>
              <MaterialIcons name="chevron-right" size={18} color="#9ca3af" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.dateTimeBtn} onPress={() => setShowTimePicker(true)}>
              <MaterialIcons name="schedule" size={18} color="#00395F" />
              <Text style={[styles.dateTimeText, !formData.time && styles.dateTimePlaceholder]}>
                {formData.time
                  ? (() => {
                    const [hh, mm] = formData.time.split(':');
                    const h = parseInt(hh);
                    return `${h % 12 || 12}:${mm} ${h >= 12 ? 'PM' : 'AM'}`;
                  })()
                  : 'Select Time'}
              </Text>
              <MaterialIcons name="chevron-right" size={18} color="#9ca3af" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <Text style={styles.slotHint}>
              Our team will confirm availability within 2 hours of your booking.
            </Text>
          </View>

          {/* ── Payment Summary ── */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Consultation ({formData.discussionTime})</Text>
              <Text style={styles.summaryValue}>₹{formData.discussionFee.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (18%)</Text>
              <Text style={styles.summaryValue}>₹{gstAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.summaryTotal}>
              <Text style={styles.summaryTotalLabel}>Total Payable</Text>
              <Text style={styles.summaryTotalValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* ── Submit ── */}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialIcons name="payment" size={20} color="#fff" />
                <Text style={styles.submitBtnText}>
                  Pay ₹{totalAmount.toLocaleString('en-IN')} – Confirm Booking
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.secureRow}>
            <MaterialIcons name="shield" size={13} color="#16a34a" />
            <Text style={styles.secureText}>Secured by Razorpay · 256-bit SSL</Text>
          </View>
        </ScrollView>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={formData.date ? new Date(formData.date + 'T00:00:00') : new Date()}
          mode="date"
          minimumDate={new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

export default OnlineConsultation;

// ── Skeleton styles ────────────────────────────────────────────────────────
const sk = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
});

// ── Main styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8f4' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  headerContainer: {
    backgroundColor: '#00395F',
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', textAlign: 'center' },
  headerSub: { fontSize: 13, color: '#93c5fd', textAlign: 'center', marginTop: 4 },

  loginBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  loginBannerText: { flex: 1, fontSize: 13, color: '#92400e', fontWeight: '500' },

  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  userPillAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#00395F', justifyContent: 'center', alignItems: 'center',
  },
  userPillAvatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  userPillName: { fontSize: 14, fontWeight: '700', color: '#166534' },
  userPillSub: { fontSize: 11, color: '#4ade80', marginTop: 1 },

  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: '#f97316',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10,
  },

  // User info card
  userInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  userInfoDivider: { height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 14 },
  userInfoLabel: { fontSize: 10, color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  userInfoValue: { fontSize: 14, color: '#111827', fontWeight: '600' },
  lockedHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    marginLeft: 2,
  },
  lockedHintText: { fontSize: 11, color: '#6b7280' },

  hintText: { fontSize: 12, color: '#9ca3af', marginBottom: 10, marginTop: -4 },

  investGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  investPill: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    borderWidth: 1.5, borderColor: '#d1d5db', borderRadius: 10,
    paddingVertical: 9, paddingHorizontal: 12,
    backgroundColor: '#fff', width: '47%',
  },
  investPillActive: { borderColor: '#00395F', backgroundColor: '#EBF5FB' },
  investRadio: {
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 2, borderColor: '#d1d5db',
    justifyContent: 'center', alignItems: 'center',
  },
  investRadioActive: { borderColor: '#00395F' },
  investRadioDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#00395F' },
  investPillText: { fontSize: 12, color: '#374151', fontWeight: '500', flexShrink: 1 },
  investPillTextActive: { color: '#00395F', fontWeight: '700' },

  dropdownContainer: { marginBottom: 10 },
  dropdownButton: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13, backgroundColor: '#fff',
  },
  dropdownButtonDisabled: { opacity: 0.4, backgroundColor: '#f9fafb' },
  dropdownButtonText: { fontSize: 14, color: '#9ca3af', flex: 1 },
  dropdownButtonTextSelected: { color: '#111827', fontWeight: '600' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  dropdownMenuModal: {
    backgroundColor: '#fff', borderRadius: 16,
    maxHeight: '65%', width: '85%', paddingVertical: 6,
  },
  dropdownMenuItem: {
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  dropdownMenuItemActive: { backgroundColor: '#EBF5FB' },
  dropdownMenuItemText: { fontSize: 14, color: '#374151', flex: 1 },
  dropdownMenuItemTextActive: { color: '#00395F', fontWeight: '700' },
  dropdownMenuEmpty: { fontSize: 14, color: '#9ca3af', padding: 16, textAlign: 'center' },

  discussionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  discussionCard: {
    flex: 1, minWidth: '47%', position: 'relative',
    borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 10,
    alignItems: 'center', backgroundColor: '#fff',
  },
  discussionCardActive: { borderColor: '#00395F', backgroundColor: '#EBF5FB' },
  discussionCheck: { position: 'absolute', top: 6, right: 6 },
  discussionCardTime: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  discussionCardTimeActive: { color: '#00395F' },
  discussionCardFee: { fontSize: 16, fontWeight: '800', color: '#00395F' },
  discussionCardFeeActive: { color: '#f97316' },

  dateTimeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 14,
    backgroundColor: '#fff', marginBottom: 10,
  },
  dateTimeText: { fontSize: 14, color: '#111827', fontWeight: '600', flex: 1 },
  dateTimePlaceholder: { color: '#9ca3af', fontWeight: '400' },
  slotHint: { fontSize: 11, color: '#9ca3af', marginTop: 2 },

  summaryCard: {
    backgroundColor: '#00395F', borderRadius: 16, padding: 18, marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 11, fontWeight: '700', color: '#93c5fd',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#bfdbfe' },
  summaryValue: { fontSize: 14, color: '#fff', fontWeight: '600' },
  summaryTotal: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 12, marginTop: 4,
  },
  summaryTotalLabel: { fontSize: 15, fontWeight: '700', color: '#fff' },
  summaryTotalValue: { fontSize: 22, fontWeight: '800', color: '#fdba74' },

  submitBtn: {
    backgroundColor: '#f97316', flexDirection: 'row', gap: 8,
    paddingVertical: 16, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 8 },
  secureText: { textAlign: 'center', fontSize: 12, color: '#6b7280' },
});

// ── Success styles ─────────────────────────────────────────────────────────
const ss = StyleSheet.create({
  successContainer: { flex: 1, backgroundColor: '#f9fafb' },
  successScroll: { padding: 20, paddingBottom: 40 },
  successIconWrap: { alignItems: 'center', marginBottom: 16, marginTop: 8 },
  successIconBg: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#22c55e', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#22c55e', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#00395F', textAlign: 'center', marginBottom: 6 },
  successSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  customerCard: { backgroundColor: '#00395F', borderRadius: 18, padding: 18, marginBottom: 14 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  avatarName: { color: '#fff', fontSize: 16, fontWeight: '800' },
  avatarPhone: { color: '#93c5fd', fontSize: 13 },
  sessionBadge: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 12 },
  sessionBadgeLabel: { color: '#bfdbfe', fontSize: 13, fontWeight: '600' },
  sessionBadgeDate: { color: '#fff', fontSize: 15, fontWeight: '800', marginTop: 2 },
  detailsCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6',
  },
  detailsTitle: { fontSize: 11, fontWeight: '700', color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f9fafb',
  },
  infoLabel: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  infoValue: { fontSize: 13, color: '#111827', fontWeight: '700', maxWidth: '55%', textAlign: 'right' },
  totalRow2: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6', marginTop: 6,
  },
  totalLabel2: { fontSize: 14, fontWeight: '700', color: '#111827' },
  totalValue2: { fontSize: 18, fontWeight: '800', color: '#16a34a' },
  paymentIdBox: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 10, marginTop: 10 },
  paymentIdLabel: { fontSize: 10, color: '#9ca3af', marginBottom: 2 },
  paymentIdValue: { fontSize: 11, color: '#374151', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  homeBtn: {
    borderWidth: 2, borderColor: '#00395F',
    paddingVertical: 14, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  homeBtnText: { color: '#00395F', fontSize: 15, fontWeight: '700' },
});