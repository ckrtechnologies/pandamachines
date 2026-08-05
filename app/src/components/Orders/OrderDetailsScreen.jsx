import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Animated,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import SideScreenNavbar from '../../components/Navbar/SideScreenNavbar';
import { API_BASE_URL } from '../../utils/basicInfo';
import { downloadInvoiceRN } from '../../utils/InvoicePDFRN';

const BRAND = '#00395F';

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmt = n =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtDate = d =>
  d
    ? new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    : null;

const fmtDateTime = d =>
  d
    ? new Date(d).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : null;

// ─── Status meta (mirrors web STATUS_META exactly) ───────────────────────────

const STATUS_META = {
  pending: { dot: '#FCD34D', text: '#B45309', bg: '#FFFBEB', border: '#FDE68A', icon: 'clock-outline', label: 'Pending' },
  confirmed: { dot: '#60A5FA', text: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE', icon: 'check-circle-outline', label: 'Confirmed' },
  processing: { dot: '#FB923C', text: '#C2410C', bg: '#FFF7ED', border: '#FED7AA', icon: 'autorenew', label: 'Processing' },
  shipped: { dot: '#A78BFA', text: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: 'truck-outline', label: 'Shipped' },
  delivered: { dot: '#34D399', text: '#065F46', bg: '#ECFDF5', border: '#A7F3D0', icon: 'check-circle', label: 'Delivered' },
  cancelled: { dot: '#F87171', text: '#B91C1C', bg: '#FEF2F2', border: '#FECACA', icon: 'close-circle-outline', label: 'Cancelled' },
  returned: { dot: '#94A3B8', text: '#374151', bg: '#F9FAFB', border: '#E5E7EB', icon: 'undo-variant', label: 'Returned' },
  'exchange requested': { dot: '#2DD4BF', text: '#0F766E', bg: '#F0FDFA', border: '#99F6E4', icon: 'swap-horizontal', label: 'Exchange Requested' },
};

const getStatusMeta = (s = '') =>
  STATUS_META[s.toLowerCase()] || {
    dot: '#94A3B8', text: '#374151', bg: '#F9FAFB', border: '#E5E7EB', icon: 'clock-outline', label: s,
  };

// ─── Shimmer ──────────────────────────────────────────────────────────────────

const ShimmerBox = ({ style }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });
  return <Animated.View style={[{ backgroundColor: '#E5E7EB', borderRadius: 6, opacity }, style]} />;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const OrderDetailsSkeleton = ({ navigation }) => (
  <View style={styles.screen}>
    <SideScreenNavbar pageName="Order Details" navigation={navigation} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header card */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ gap: 8 }}>
            <ShimmerBox style={{ width: 140, height: 14 }} />
            <ShimmerBox style={{ width: 72, height: 22, borderRadius: 6 }} />
            <ShimmerBox style={{ width: 80, height: 10 }} />
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <ShimmerBox style={{ width: 64, height: 10 }} />
            <ShimmerBox style={{ width: 100, height: 24 }} />
          </View>
        </View>
      </View>

      {/* Products card */}
      <View style={[styles.card, { padding: 0, overflow: 'hidden' }]}>
        <View style={styles.cardHeader}>
          <ShimmerBox style={{ width: 120, height: 12 }} />
        </View>
        {[1, 2].map(i => (
          <View key={i} style={[styles.productRow, i === 1 && { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }]}>
            <ShimmerBox style={{ width: 76, height: 76, borderRadius: 12, flexShrink: 0 }} />
            <View style={{ flex: 1, marginLeft: 14, gap: 8 }}>
              <ShimmerBox style={{ width: '85%', height: 13 }} />
              <ShimmerBox style={{ width: '60%', height: 13 }} />
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <ShimmerBox style={{ width: 48, height: 20, borderRadius: 4 }} />
                <ShimmerBox style={{ width: 56, height: 20, borderRadius: 4 }} />
              </View>
              <ShimmerBox style={{ width: '70%', height: 11 }} />
              <ShimmerBox style={{ width: 64, height: 16 }} />
            </View>
          </View>
        ))}
      </View>

      {/* Timeline */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ShimmerBox style={{ width: 110, height: 12 }} />
        </View>
        <View style={{ padding: 16, gap: 18 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <ShimmerBox style={{ width: 22, height: 22, borderRadius: 11 }} />
              <View style={{ gap: 6 }}>
                <ShimmerBox style={{ width: 90, height: 12 }} />
                <ShimmerBox style={{ width: 60, height: 10 }} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Address */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ShimmerBox style={{ width: 120, height: 12 }} />
        </View>
        <View style={{ padding: 16, gap: 8 }}>
          <ShimmerBox style={{ width: 140, height: 14 }} />
          <ShimmerBox style={{ width: '100%', height: 12 }} />
          <ShimmerBox style={{ width: '80%', height: 12 }} />
          <ShimmerBox style={{ width: '60%', height: 12 }} />
          <ShimmerBox style={{ width: 100, height: 12 }} />
        </View>
      </View>

      {/* Price + actions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ShimmerBox style={{ width: 120, height: 12 }} />
        </View>
        <View style={{ padding: 16, gap: 14 }}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ShimmerBox style={{ width: 72, height: 12 }} />
              <ShimmerBox style={{ width: 56, height: 12 }} />
            </View>
          ))}
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <ShimmerBox style={{ height: 48, borderRadius: 12 }} />
        <ShimmerBox style={{ height: 48, borderRadius: 12 }} />
      </View>
    </ScrollView>
  </View>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const meta = getStatusMeta(status);
  return (
    <View style={[styles.badge, { backgroundColor: meta.bg, borderColor: meta.border }]}>
      <View style={[styles.badgeDot, { backgroundColor: meta.dot }]} />
      <Text style={[styles.badgeText, { color: meta.text }]}>{meta.label}</Text>
    </View>
  );
};

// ─── Price Row ────────────────────────────────────────────────────────────────

const PriceRow = ({ label, value, bold = false, muted = false, freeText = null }) => (
  <View style={styles.priceRowWrap}>
    <Text style={[styles.priceLabel, muted && { color: '#9CA3AF' }]}>{label}</Text>
    {freeText ? (
      <Text style={styles.priceFree}>{freeText}</Text>
    ) : (
      <Text style={[styles.priceValue, bold && styles.priceValueBold]}>{value}</Text>
    )}
  </View>
);

// ─── Delivery Timeline (mirrors web DeliveryTimeline) ────────────────────────

const TIMELINE_STEPS = [
  { key: 'Pending', label: 'Order Placed', icon: 'package-variant' },
  { key: 'Confirmed', label: 'Confirmed', icon: 'check-circle-outline' },
  { key: 'Processing', label: 'Processing', icon: 'autorenew' },
  { key: 'Shipped', label: 'Shipped', icon: 'truck-outline' },
  { key: 'Delivered', label: 'Delivered', icon: 'check-circle' },
];
const ORDER_FLOW = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const DeliveryTimeline = ({ order }) => {
  const orderStatus = order.orderStatus || order.status || 'Pending';
  const currentIdx = ORDER_FLOW.indexOf(orderStatus);
  const isCancelled = orderStatus === 'Cancelled' || orderStatus === 'Returned';
  const isExchange = orderStatus === 'Exchange Requested';

  if (isCancelled || isExchange) {
    const bg = isCancelled ? '#FEF2F2' : '#F0FDFA';
    const border = isCancelled ? '#FECACA' : '#99F6E4';
    const color = isCancelled ? '#B91C1C' : '#0F766E';
    const icon = isCancelled ? 'close-circle-outline' : 'swap-horizontal';

    return (
      <View style={[styles.timelineSpecial, { backgroundColor: bg, borderColor: border }]}>
        <MaterialCommunityIcons name={icon} size={16} color={color} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.timelineSpecialTitle, { color }]}>{orderStatus}</Text>
          {isExchange && order.exchangeRequest?.requestedAt && (
            <Text style={[styles.timelineSpecialSub, { color }]}>
              Requested on {fmtDateTime(order.exchangeRequest.requestedAt)}
            </Text>
          )}
          {isExchange && order.exchangeRequest?.reason && (
            <Text style={styles.timelineSpecialReason}>"{order.exchangeRequest.reason}"</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
      {TIMELINE_STEPS.map((step, idx) => {
        const done = currentIdx >= idx;
        const active = currentIdx === idx;
        return (
          <View key={step.key} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            {/* Line column */}
            <View style={{ width: 22, alignItems: 'center' }}>
              <View
                style={[
                  styles.timelineDot,
                  done
                    ? { backgroundColor: BRAND, borderColor: BRAND }
                    : { backgroundColor: '#fff', borderColor: '#E5E7EB' },
                ]}>
                <MaterialCommunityIcons
                  name={step.icon}
                  size={10}
                  color={done ? '#fff' : '#CBD5E1'}
                />
              </View>
              {idx < TIMELINE_STEPS.length - 1 && (
                <View style={[styles.timelineConnector, done && idx < currentIdx && { backgroundColor: BRAND + '40' }]} />
              )}
            </View>

            {/* Content */}
            <View style={{ flex: 1, marginLeft: 12, paddingBottom: idx < TIMELINE_STEPS.length - 1 ? 20 : 0, marginTop: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.timelineLabel, done ? { color: '#111827', fontWeight: '600' } : { color: '#9CA3AF' }]}>
                  {step.label}
                </Text>
                {active && (
                  <View style={styles.nowPill}>
                    <Text style={styles.nowText}>NOW</Text>
                  </View>
                )}
              </View>
              {step.key === 'Pending' && order.createdAt && done && (
                <Text style={styles.timelineSubText}>{fmtDateTime(order.createdAt)}</Text>
              )}
              {step.key === 'Delivered' && order.updatedAt && done && (
                <Text style={styles.timelineSubText}>{fmtDateTime(order.updatedAt)}</Text>
              )}
              {active && step.key !== 'Pending' && step.key !== 'Delivered' && (
                <Text style={[styles.timelineSubText, { color: BRAND }]}>In progress</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

// ─── Exchange Modal ───────────────────────────────────────────────────────────

const ExchangeModal = ({ visible, onClose, orderId, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Required', 'Please provide a reason for the exchange.');
      return;
    }
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/orders/order-exchange-request/${orderId}`,
        { reason: reason.trim() },
      );
      Alert.alert('Success', 'Exchange request submitted!');
      setReason('');
      onSuccess?.();
      onClose?.();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Handle */}
          <View style={styles.modalHandle} />

          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>Request Exchange</Text>
            <TouchableOpacity onPress={onClose} disabled={loading} style={styles.modalClose}>
              <MaterialCommunityIcons name="close" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
            <Text style={styles.modalLabel}>
              Reason <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Describe the reason for exchange (damaged, wrong item, etc.)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={5}
              editable={!loading}
              style={styles.textarea}
              textAlignVertical="top"
            />
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
              <TouchableOpacity
                onPress={onClose}
                disabled={loading}
                style={[styles.modalBtn, styles.modalBtnOutline]}>
                <Text style={styles.modalBtnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading || !reason.trim()}
                style={[styles.modalBtn, styles.modalBtnPrimary, (loading || !reason.trim()) && { opacity: 0.45 }]}>
                {loading ? (
                  <MaterialCommunityIcons name="loading" size={16} color="#fff" />
                ) : (
                  <Text style={styles.modalBtnPrimaryText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = ({ icon, label }) => (
  <View style={styles.cardHeader}>
    <MaterialCommunityIcons name={icon} size={14} color="#9CA3AF" />
    <Text style={styles.cardHeaderText}>{label}</Text>
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const OrderDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const orderId = route.params?.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExchange, setShowExchange] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/orders/get-order-by-id/${orderId}`);
      setOrder(data);
    } catch {
      setError('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useFocusEffect(useCallback(() => { fetchOrder(); }, [fetchOrder]));

  // ── Totals (mirrors web useMemo) ──────────────────────────────────

  const totals = useMemo(() => {
    if (!order) return null;
    if (order.pricing?.grandTotal != null) {
      return {
        subtotal: order.pricing.subtotal || 0,
        gst: order.pricing.gstTotal || 0,
        extraTax: order.pricing.extraTaxTotal || 0,
        shipping: order.pricing.shippingTotal || 0,
        grandTotal: order.pricing.grandTotal,
      };
    }
    const items = order.products || [];
    const subtotal = items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
    const gst = items.reduce((s, i) => s + (i.gst || 0) * (i.quantity || 1), 0);
    const extraTax = items.reduce((s, i) => s + (i.extraTax || 0) * (i.quantity || 1), 0);
    const shipping = items.reduce((s, i) => s + (i.shippingCharge || 0) * (i.quantity || 1), 0);
    return {
      subtotal, gst, extraTax, shipping,
      grandTotal: order.totalAmount || (subtotal + gst + extraTax + shipping),
    };
  }, [order]);

  const orderStatus = order?.orderStatus || order?.status || 'Pending';
  const isDelivered = orderStatus === 'Delivered';
  const canRequestExchange = isDelivered && !order?.exchangeRequest?.isRequested;
  const exchangeStatus = order?.exchangeRequest?.status;

  const handleDownloadInvoice = async () => {
    if (!order?.groupOrderId) {
      Alert.alert('Not Available', 'Invoice is only available for completed orders.');
      return;
    }
    setDownloadingInvoice(true);
    try {
      await downloadInvoiceRN(order.groupOrderId);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  // ── States ────────────────────────────────────────────────────────

  if (loading) return <OrderDetailsSkeleton navigation={navigation} />;

  if (error || !order) {
    return (
      <View style={styles.screen}>
        <SideScreenNavbar pageName="Order Details" navigation={navigation} />
        <View style={styles.centerContent}>
          <MaterialCommunityIcons name="close-circle-outline" size={56} color="#FCA5A5" />
          <Text style={styles.errorTitle}>{error || 'Order not found'}</Text>
          <Text style={styles.errorSub}>We couldn't load the details for this order.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={fetchOrder}>
            <Text style={styles.primaryBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const displayId = order.orderId || order._id?.slice(-8).toUpperCase();

  return (
    <View style={styles.screen}>
      <SideScreenNavbar pageName="Order Details" navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ── Header card ── */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.orderId}>#{displayId}</Text>
              <View style={{ marginTop: 8 }}>
                <StatusBadge status={orderStatus} />
              </View>
              {order.createdAt && (
                <Text style={styles.orderDate}>{fmtDate(order.createdAt)}</Text>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.totalLabel}>Order Total</Text>
              <Text style={styles.totalAmount}>{fmt(totals?.grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* ── Products ── */}
        <View style={[styles.card, { padding: 0 }]}>
          <SectionHeader
            icon="package-variant"
            label={`${order.products?.length || 0} Item${(order.products?.length || 0) !== 1 ? 's' : ''}`}
          />
          {order.products?.map((item, idx) => {
            const imgKey = `prod-${idx}`;
            const img = item?.product?.images?.[0] || item.productImage;
            const name = item?.product?.name || item.productName || 'Product';
            const qty = item.quantity || 1;
            const unitBase = item.price || 0;
            const unitGst = item.gst || 0;
            const unitExtra = item.extraTax || 0;
            const unitShip = item.shippingCharge || 0;
            const lineTotal = (unitBase + unitGst + unitExtra + unitShip) * qty;

            return (
              <View
                key={idx}
                style={[
                  styles.productRow,
                  idx < order.products.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
                ]}>

                {/* Thumbnail */}
                <View style={styles.thumbWrap}>
                  {img && !imgErrors[imgKey] ? (
                    <Image
                      source={{ uri: img }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                      onError={() => setImgErrors(p => ({ ...p, [imgKey]: true }))}
                    />
                  ) : (
                    <View style={styles.thumbFallback}>
                      <MaterialCommunityIcons name="package-variant" size={26} color="#CBD5E1" />
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName} numberOfLines={2}>{name}</Text>
                  {item.brand && (
                    <Text style={styles.productBrand}>{item.brand}</Text>
                  )}

                  {/* Attribute chips */}
                  <View style={styles.attrRow}>
                    {item.size && <View style={styles.attrChip}><Text style={styles.attrChipText}>{item.size}</Text></View>}
                    {item.variantModel && <View style={styles.attrChip}><Text style={styles.attrChipText}>{item.variantModel}</Text></View>}
                    <View style={styles.attrChip}><Text style={styles.attrChipText}>Qty {qty}</Text></View>
                  </View>

                  {/* Pricing */}
                  <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                      <Text style={styles.unitPrice}>{fmt(unitBase)}/unit</Text>
                      {unitGst > 0 && <Text style={styles.priceMeta}>+ GST {fmt(unitGst)}</Text>}
                      {unitExtra > 0 && <Text style={styles.priceMeta}>+ Tax {fmt(unitExtra)}</Text>}
                      {unitShip > 0 && <Text style={styles.priceMeta}>+ Ship {fmt(unitShip)}</Text>}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                      <Text style={styles.priceMeta}>Total</Text>
                      <Text style={styles.lineTotal}>{fmt(lineTotal)}</Text>
                      {qty > 1 && <Text style={styles.priceMeta}>for {qty} units</Text>}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Timeline ── */}
        <View style={[styles.card, { padding: 0 }]}>
          <SectionHeader icon="map-marker-path" label="Order Timeline" />
          <DeliveryTimeline order={order} />
        </View>

        {/* ── Delivery Address ── */}
        {order.shippingAddress && (
          <View style={[styles.card, { padding: 0 }]}>
            <SectionHeader icon="map-marker-outline" label="Delivery Address" />
            <View style={{ padding: 16 }}>
              <Text style={styles.addressName}>{order.shippingAddress.fullName}</Text>
              <Text style={styles.addressLine}>{order.shippingAddress.addressLine1}</Text>
              {order.shippingAddress.addressLine2 && (
                <Text style={styles.addressLine}>{order.shippingAddress.addressLine2}</Text>
              )}
              <Text style={styles.addressLine}>
                {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.postalCode}
              </Text>
              <Text style={styles.addressLine}>{order.shippingAddress.country}</Text>
              <Text style={[styles.addressLine, { marginTop: 6, fontWeight: '600', color: '#374151' }]}>
                📞 {order.shippingAddress.phone}
              </Text>
            </View>
          </View>
        )}

        {/* ── Price Breakdown ── */}
        {totals && (
          <View style={[styles.card, { padding: 0 }]}>
            <SectionHeader icon="credit-card-outline" label="Price Breakdown" />
            <View style={{ padding: 16, gap: 12 }}>
              <PriceRow label="Subtotal" value={fmt(totals.subtotal)} />
              {totals.gst > 0 && <PriceRow label="GST" value={fmt(totals.gst)} />}
              {totals.extraTax > 0 && <PriceRow label="Extra Tax" value={fmt(totals.extraTax)} />}
              <PriceRow
                label="Shipping"
                value={fmt(totals.shipping)}
                freeText={totals.shipping === 0 ? 'Free' : null}
              />
            </View>
            <View style={styles.divider} />
            <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
              <PriceRow label="Order Total" value={fmt(totals.grandTotal)} bold />
            </View>

            {/* Payment details */}
            <View style={styles.divider} />
            <View style={{ padding: 16, gap: 10 }}>
              {order.paymentMethod && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Method</Text>
                  <Text style={styles.infoValue}>{order.paymentMethod}</Text>
                </View>
              )}
              {order.paymentStatus && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={[
                    styles.infoValue,
                    { fontWeight: '700' },
                    order.paymentStatus === 'Paid' && { color: '#059669' },
                    order.paymentStatus === 'Refunded' && { color: '#2563EB' },
                    order.paymentStatus === 'Failed' && { color: '#DC2626' },
                    !['Paid', 'Refunded', 'Failed'].includes(order.paymentStatus) && { color: '#D97706' },
                  ]}>
                    {order.paymentStatus}
                  </Text>
                </View>
              )}
              {order.razorpayId && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Razorpay ID</Text>
                  <Text style={[styles.infoValue, { fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', fontSize: 11 }]}>
                    {order.razorpayId}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* ── Order Info ── */}
        <View style={[styles.card, { padding: 0 }]}>
          <SectionHeader icon="information-outline" label="Order Info" />
          <View style={{ padding: 16, gap: 10 }}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order ID</Text>
              <Text style={[styles.infoValue, { fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', fontWeight: '700' }]}>
                {order.orderId || '—'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Placed</Text>
              <Text style={styles.infoValue}>{fmtDate(order.createdAt)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last updated</Text>
              <Text style={styles.infoValue}>{fmtDate(order.updatedAt)}</Text>
            </View>
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={{ gap: 10 }}>
          {/* Invoice download — always visible */}
          <TouchableOpacity
            onPress={handleDownloadInvoice}
            disabled={downloadingInvoice}
            style={[styles.outlineBtn, downloadingInvoice && { opacity: 0.5 }]}>
            <MaterialCommunityIcons name={downloadingInvoice ? 'loading' : 'download-outline'} size={18} color={BRAND} />
            <Text style={styles.outlineBtnText}>
              {downloadingInvoice ? 'Generating Invoice…' : 'Download Invoice'}
            </Text>
          </TouchableOpacity>

          {/* Exchange request */}
          {canRequestExchange && (
            <TouchableOpacity onPress={() => setShowExchange(true)} style={styles.primaryBtn}>
              <MaterialCommunityIcons name="autorenew" size={16} color="#fff" />
              <Text style={styles.primaryBtnText}>Request Exchange</Text>
            </TouchableOpacity>
          )}

          {/* Exchange status pill */}
          {order?.exchangeRequest?.isRequested && (
            <View style={[
              styles.exchangePill,
              exchangeStatus === 'Approved' && { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
              exchangeStatus === 'Rejected' && { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
              exchangeStatus === 'Completed' && { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
              !['Approved', 'Rejected', 'Completed'].includes(exchangeStatus) && { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
            ]}>
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={16}
                color={
                  exchangeStatus === 'Approved' ? '#059669' :
                    exchangeStatus === 'Rejected' ? '#DC2626' :
                      exchangeStatus === 'Completed' ? '#2563EB' : '#D97706'
                }
              />
              <Text style={[
                styles.exchangePillText,
                {
                  color:
                    exchangeStatus === 'Approved' ? '#059669' :
                      exchangeStatus === 'Rejected' ? '#DC2626' :
                        exchangeStatus === 'Completed' ? '#2563EB' : '#D97706'
                },
              ]}>
                Exchange: {exchangeStatus || 'Requested'}
              </Text>
            </View>
          )}

          {/* Proof of delivery */}
          {order.pod_img_url && (
            <TouchableOpacity style={[styles.outlineBtn, { borderColor: '#6EE7B7' }]}>
              <MaterialCommunityIcons name="check-circle-outline" size={18} color="#059669" />
              <Text style={[styles.outlineBtnText, { color: '#059669' }]}>View Delivery Proof</Text>
            </TouchableOpacity>
          )}

          {/* Back */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Orders')}
            style={[styles.outlineBtn, { borderColor: '#E5E7EB' }]}>
            <MaterialCommunityIcons name="arrow-left" size={16} color="#6B7280" />
            <Text style={[styles.outlineBtnText, { color: '#6B7280' }]}>Back to My Orders</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <ExchangeModal
        visible={showExchange}
        onClose={() => setShowExchange(false)}
        orderId={order._id}
        onSuccess={fetchOrder}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 14, paddingBottom: 40 },

  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  errorTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 14, textAlign: 'center' },
  errorSub: { fontSize: 13, color: '#9CA3AF', marginTop: 6, textAlign: 'center' },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#9CA3AF',
  },

  // Header
  orderId: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.3,
  },
  orderDate: { fontSize: 11, color: '#9CA3AF', marginTop: 6 },
  totalLabel: { fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  totalAmount: { fontSize: 22, fontWeight: '800', color: '#111827' },

  // Badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },

  // Products
  productRow: { flexDirection: 'row', gap: 14, padding: 16, alignItems: 'flex-start' },
  thumbWrap: {
    width: 76,
    height: 76,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#F9FAFB',
    flexShrink: 0,
  },
  thumbFallback: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  productName: { fontSize: 13, fontWeight: '700', color: '#111827', lineHeight: 18 },
  productBrand: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  attrRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  attrChip: { backgroundColor: '#F3F4F6', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  attrChipText: { fontSize: 11, color: '#6B7280' },
  unitPrice: { fontSize: 12, fontWeight: '600', color: '#374151' },
  priceMeta: { fontSize: 11, color: '#9CA3AF' },
  lineTotal: { fontSize: 14, fontWeight: '800', color: '#111827' },

  // Timeline
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineConnector: { width: 2, flex: 1, backgroundColor: '#E5E7EB', minHeight: 16 },
  timelineLabel: { fontSize: 13 },
  timelineSubText: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  nowPill: { backgroundColor: BRAND, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  nowText: { fontSize: 8, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  timelineSpecial: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  timelineSpecialTitle: { fontSize: 13, fontWeight: '700' },
  timelineSpecialSub: { fontSize: 11, marginTop: 3 },
  timelineSpecialReason: { fontSize: 11, color: '#6B7280', marginTop: 4, fontStyle: 'italic' },

  // Address
  addressName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 6 },
  addressLine: { fontSize: 13, color: '#6B7280', lineHeight: 20 },

  // Price
  priceRowWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 13, color: '#6B7280' },
  priceValue: { fontSize: 13, fontWeight: '500', color: '#374151' },
  priceValueBold: { fontSize: 15, fontWeight: '800', color: '#111827' },
  priceFree: { fontSize: 13, fontWeight: '600', color: '#059669' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },

  // Info rows
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 12, color: '#9CA3AF' },
  infoValue: { fontSize: 12, color: '#374151', fontWeight: '500' },

  // Buttons
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND,
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
  },
  outlineBtnText: { color: BRAND, fontWeight: '600', fontSize: 14 },
  exchangePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
  },
  exchangePillText: { fontWeight: '700', fontSize: 14 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  modalClose: { padding: 6, backgroundColor: '#F3F4F6', borderRadius: 8 },
  modalLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 },
  textarea: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnOutline: { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  modalBtnOutlineText: { color: '#374151', fontWeight: '600', fontSize: 14 },
  modalBtnPrimary: { backgroundColor: BRAND },
  modalBtnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default OrderDetailsScreen;