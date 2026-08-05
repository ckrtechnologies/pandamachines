import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SideScreenNavbar from '../../components/Navbar/SideScreenNavbar';
import { useCart } from '../../context/CartContext';
import { COD_THRESHOLD, useCheckout } from '../../context/CheckoutContext';
import { COLORS } from '../../theme/colors';
import { API_BASE_URL } from '../../utils/basicInfo';
import RazorpayPaymentRN from '../../utils/RazorpayPaymentRN';
import AppLoader from '../common/AppLoader';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
    `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

// ─── Sub-components ───────────────────────────────────────────────────────────
const SectionHeader = ({ title }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
);

const Divider = () => <View style={styles.divider} />;

const PriceLine = ({ label, value, bold, accent, dimLabel }) => (
    <View style={styles.priceLine}>
        <Text style={[styles.priceLabel, dimLabel && styles.priceLabelDim, bold && styles.priceLabelBold]}>
            {label}
        </Text>
        <Text style={[styles.priceValue, bold && styles.priceValueBold, accent && { color: COLORS.primary }]}>
            {value}
        </Text>
    </View>
);

const PaymentOption = ({ id, label, sublabel, icon, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.payOption, selected && styles.payOptionSelected]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[styles.payOptionIcon, selected && styles.payOptionIconSelected]}>
            <MaterialIcons name={icon} size={18} color={selected ? '#fff' : '#9ca3af'} />
        </View>
        <View style={styles.payOptionBody}>
            <Text style={[styles.payOptionLabel, selected && styles.payOptionLabelSelected]}>
                {label}
            </Text>
            <Text style={styles.payOptionSub}>{sublabel}</Text>
        </View>
        <View style={[styles.payRadio, selected && styles.payRadioSelected]}>
            {selected && <View style={styles.payRadioDot} />}
        </View>
    </TouchableOpacity>
);

// ─── Address Modal ────────────────────────────────────────────────────────────
const AddressModal = ({ visible, addresses, selectedId, onSelect, onClose }) => (
    <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Delivery Address</Text>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                        <MaterialIcons name="close" size={22} color="#374151" />
                    </TouchableOpacity>
                </View>

                {addresses.length === 0 ? (
                    <View style={styles.modalEmpty}>
                        <MaterialIcons name="location-off" size={36} color="#d1d5db" />
                        <Text style={styles.modalEmptyText}>No addresses found. Add one in your profile.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={addresses}
                        keyExtractor={a => a._id}
                        contentContainerStyle={{ padding: 12 }}
                        renderItem={({ item }) => {
                            const active = selectedId === item._id;
                            return (
                                <TouchableOpacity
                                    style={[styles.addrOption, active && styles.addrOptionActive]}
                                    onPress={() => onSelect(item)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.addrOptionLeft}>
                                        <View style={styles.addrTypePill}>
                                            <Text style={styles.addrTypeText}>{item.addressType}</Text>
                                        </View>
                                        <Text style={styles.addrName}>{item.fullName}</Text>
                                        <Text style={styles.addrDetail} numberOfLines={1}>
                                            {item.addressLine1}{item.addressLine2 ? `, ${item.addressLine2}` : ''}
                                        </Text>
                                        <Text style={styles.addrDetail}>
                                            {item.city}, {item.state} {item.postalCode}
                                        </Text>
                                        {item.landmark ? (
                                            <Text style={styles.addrLandmark}>📍 {item.landmark}</Text>
                                        ) : null}
                                        <Text style={styles.addrPhone}>📞 {item.phone}</Text>
                                    </View>
                                    {active && (
                                        <MaterialIcons name="check-circle" size={22} color={COLORS.primary} />
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                    />
                )}
            </View>
        </View>
    </Modal>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const CheckoutPage = ({ navigation }) => {
    const {
        checkoutMode,          // ← source of truth, not route.params
        checkoutItems,
        selectedAddress,
        paymentMethod,
        pricing,
        isLargeOrder,
        loading: ctxLoading,
        setSelectedAddress,
        setPaymentMethod,
        placeOrder,
        resetCheckout,
    } = useCheckout();

    const isBuyNow = checkoutMode === 'buy_now';

    const { fetchCart } = useCart();

    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [addrModal, setAddrModal] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    const [placing, setPlacing] = useState(false);
    const [initLoading, setInitLoading] = useState(true);

    // ── This ref is the key fix ──────────────────────────────────────────────
    // Set to true the moment order succeeds, BEFORE we call resetCheckout().
    // The empty-items guard checks this ref and skips the redirect if true.
    const orderPlacedRef = useRef(false);

    // ─── Init: load user + addresses ─────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem('pm-user-data');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    setUserId(parsed._id);
                    setUserData(parsed);
                    await loadAddresses(parsed._id);
                }
            } catch (e) {
                console.error('CheckoutPage init:', e);
            } finally {
                setInitLoading(false);
            }
        })();
    }, []);

    // ─── Cleanup on unmount ───────────────────────────────────────────────────
    // Handles the back-button case: user navigates away without ordering.
    // We do NOT resetCheckout on success — that's done in handlePlaceOrder
    // after navigation.replace() has already fired.
    useEffect(() => {
        return () => {
            if (!orderPlacedRef.current) {
                // User left without placing — clean up stale checkout state
                resetCheckout();
            }
        };
    }, []);

    const loadAddresses = async (uid) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/address/user/${uid}`, { timeout: 8000 });
            if (res.data.success && res.data.data?.length) {
                setAddresses(res.data.data);
                const def = res.data.data.find(a => a.isDefault) || res.data.data[0];
                setSelectedAddress(def);
            }
        } catch (e) {
            console.error('loadAddresses:', e);
        }
    };

    // ─── Guard: nothing to checkout ───────────────────────────────────────────
    // Only fires when there are genuinely no items AND we haven't just placed
    // a successful order (which would have cleared items via resetCheckout).
    useEffect(() => {
        if (!initLoading && checkoutItems.length === 0 && !orderPlacedRef.current) {
            Alert.alert('Nothing to checkout', 'Please add items first.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        }
    }, [initLoading, checkoutItems.length]);

    // ─── Place order (COD or after Razorpay success) ──────────────────────────
    const handlePlaceOrder = useCallback(
        async (razorpayId = null) => {
            if (!selectedAddress) {
                Toast.show({ type: 'error', text1: 'Select a delivery address', position: 'bottom' });
                return;
            }
            if (!userId) return;

            setPlacing(true);
            const res = await placeOrder({ userId, razorpayId });
            setPlacing(false);

            if (res.success) {
                setPaymentModal(false);

                // Mark order as placed BEFORE resetting context.
                // This prevents the empty-items guard from firing as a side-effect
                // of resetCheckout() while this screen is still mounted.
                orderPlacedRef.current = true;

                // Always resync cart — for both buy_now and cart modes,
                // the backend may have mutated cart state.
                await fetchCart();

                // Navigate first, THEN reset context.
                // navigation.replace removes CheckoutPage from the stack so by
                // the time resetCheckout() runs and checkoutItems becomes [],
                // this component is already unmounted and the guard effect is gone.
                navigation.replace('OrderSuccess', {
                    groupOrderId: res.data?.groupOrderId,
                    mode: checkoutMode,
                });

                resetCheckout();
            } else {
                Toast.show({ type: 'error', text1: 'Order Failed', text2: res.message, position: 'bottom' });
            }
        },
        [selectedAddress, userId, placeOrder, fetchCart, resetCheckout, navigation, checkoutMode],
    );

    const handlePayButton = () => {
        if (!selectedAddress) {
            Toast.show({ type: 'error', text1: 'Select a delivery address', position: 'bottom' });
            return;
        }
        if (paymentMethod === 'COD' || isLargeOrder) {
            Alert.alert(
                'Confirm Order',
                `Place order for ${fmt(pricing.grandTotal)} via Cash on Delivery?`,
                [
                    { text: 'Cancel' },
                    { text: 'Place Order', onPress: () => handlePlaceOrder() },
                ],
            );
        } else {
            setPaymentModal(true);
        }
    };

    // ─── Loading ──────────────────────────────────────────────────────────────
    if (initLoading || ctxLoading) {
        return (
            <>
                <SideScreenNavbar pageName="Checkout" navigation={navigation} />
                <AppLoader size={80} />
            </>
        );
    }

    const canProceed = !!selectedAddress && !placing;

    return (
        <>
            <SideScreenNavbar
                pageName={isBuyNow ? 'Order Summary' : 'Checkout'}
                navigation={navigation}
            />

            <View style={styles.container}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >

                    {/* ── Address Section ── */}
                    <View style={styles.card}>
                        <View style={styles.cardHeaderRow}>
                            <View style={styles.cardHeaderLeft}>
                                <MaterialIcons name="location-on" size={16} color={COLORS.primary} />
                                <SectionHeader title="Deliver to" />
                            </View>
                            <TouchableOpacity onPress={() => setAddrModal(true)}>
                                <Text style={styles.changeBtn}>Change</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedAddress ? (
                            <View style={styles.addrCard}>
                                <View style={styles.addrTypePillSelected}>
                                    <Text style={styles.addrTypeTextSelected}>{selectedAddress.addressType}</Text>
                                </View>
                                <Text style={styles.addrCardName}>{selectedAddress.fullName}</Text>
                                <Text style={styles.addrCardDetail}>
                                    {selectedAddress.addressLine1}
                                    {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}
                                </Text>
                                <Text style={styles.addrCardDetail}>
                                    {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                                </Text>
                                {selectedAddress.landmark ? (
                                    <Text style={styles.addrCardDetail}>{selectedAddress.landmark}</Text>
                                ) : null}
                                <Text style={styles.addrCardPhone}>{selectedAddress.phone}</Text>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.addAddrBtn} onPress={() => setAddrModal(true)}>
                                <MaterialIcons name="add-location-alt" size={20} color={COLORS.primary} />
                                <Text style={styles.addAddrText}>Select delivery address</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* ── Items ── */}
                    <View style={styles.card}>
                        <View style={styles.cardHeaderRow}>
                            <View style={styles.cardHeaderLeft}>
                                <MaterialIcons name="shopping-bag" size={16} color={COLORS.primary} />
                                <SectionHeader title="Order Items" />
                            </View>
                            <View style={styles.itemCountBadge}>
                                <Text style={styles.itemCountText}>
                                    {checkoutItems.length} item{checkoutItems.length !== 1 ? 's' : ''}
                                </Text>
                            </View>
                        </View>

                        {checkoutItems.map((item, idx) => (
                            <View key={item.productId} style={[styles.itemRow, idx > 0 && styles.itemRowBorder]}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                                <View style={styles.itemBody}>
                                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                                    {item.selectedSize ? (
                                        <Text style={styles.itemMeta}>Size: {item.selectedSize}</Text>
                                    ) : null}
                                    <Text style={styles.itemMeta}>Qty: {item.quantity}</Text>
                                </View>
                                <Text style={styles.itemTotal}>{fmt(item.price * item.quantity)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* ── Price Breakdown ── */}
                    <View style={styles.card}>
                        <View style={styles.cardHeaderLeft}>
                            <MaterialIcons name="receipt" size={16} color={COLORS.primary} />
                            <SectionHeader title="Price Details" />
                        </View>

                        <Divider />
                        <PriceLine label="Subtotal" value={fmt(pricing.subtotal)} />
                        {pricing.gst > 0 && <PriceLine label="GST" value={fmt(pricing.gst)} dimLabel />}
                        {pricing.extraTax > 0 && (
                            <PriceLine label="Extra Tax" value={fmt(pricing.extraTax)} dimLabel />
                        )}
                        <PriceLine
                            label="Shipping"
                            value={pricing.shipping === 0 ? 'Free' : fmt(pricing.shipping)}
                        />
                        <Divider />
                        <PriceLine label="Total Amount" value={fmt(pricing.grandTotal)} bold accent />
                    </View>

                    {/* ── Payment Method ── */}
                    <View style={styles.card}>
                        <View style={styles.cardHeaderLeft}>
                            <MaterialIcons name="credit-card" size={16} color={COLORS.primary} />
                            <SectionHeader title="Payment Method" />
                        </View>

                        {isLargeOrder && (
                            <View style={styles.largeOrderNotice}>
                                <MaterialIcons name="info-outline" size={14} color="#92400e" />
                                <Text style={styles.largeOrderText}>
                                    Orders above {fmt(COD_THRESHOLD)} — our team will confirm your order.
                                </Text>
                            </View>
                        )}

                        <PaymentOption
                            id="cod"
                            label="Cash on Delivery"
                            sublabel="Pay when your order arrives"
                            icon="local-shipping"
                            selected={paymentMethod === 'COD'}
                            onPress={() => setPaymentMethod('COD')}
                        />

                        {!isLargeOrder && (
                            <PaymentOption
                                id="rzrpay"
                                label="Pay Online"
                                sublabel="UPI, Cards, Net Banking"
                                icon="payment"
                                selected={paymentMethod === 'Rzrpay'}
                                onPress={() => setPaymentMethod('Rzrpay')}
                            />
                        )}
                    </View>

                    <View style={{ height: 16 }} />
                </ScrollView>

                {/* ── Fixed bottom CTA ── */}
                <View style={styles.bottomBar}>
                    <View style={styles.bottomBarInner}>
                        <View>
                            <Text style={styles.bottomLabel}>
                                {paymentMethod === 'COD' || isLargeOrder ? 'Pay on Delivery' : 'Pay Now'}
                            </Text>
                            <Text style={styles.bottomTotal}>{fmt(pricing.grandTotal)}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.placeBtn, !canProceed && styles.placeBtnDisabled]}
                            onPress={handlePayButton}
                            disabled={!canProceed}
                        >
                            {placing ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <>
                                    <Text style={styles.placeBtnText}>Place Order</Text>
                                    <MaterialIcons name="arrow-forward" size={18} color="#fff" />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {!selectedAddress && (
                        <View style={styles.addrHint}>
                            <MaterialIcons name="info-outline" size={13} color="#d97706" />
                            <Text style={styles.addrHintText}>Select a delivery address to continue</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* ── Address Modal ── */}
            <AddressModal
                visible={addrModal}
                addresses={addresses}
                selectedId={selectedAddress?._id}
                onSelect={(addr) => {
                    setSelectedAddress(addr);
                    setAddrModal(false);
                }}
                onClose={() => setAddrModal(false)}
            />

            {/* ── Razorpay Modal ── */}
            <RazorpayPaymentRN
                visible={paymentModal}
                onClose={() => setPaymentModal(false)}
                onSuccess={(pd) => handlePlaceOrder(pd.paymentId || pd.razorpayPaymentId)}
                onFailure={(err) => {
                    setPaymentModal(false);
                    Toast.show({ type: 'error', text1: 'Payment Failed', text2: err?.message, position: 'bottom' });
                }}
                amount={pricing.grandTotal}
                orderId={`${userId}_${Date.now()}`}
                userData={userData}
            />
        </>
    );
};

export default CheckoutPage;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 12,
        gap: 10,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1f2937',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    changeBtn: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
    },

    addrCard: {
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
    },
    addrTypePillSelected: {
        backgroundColor: '#dbeafe',
        borderRadius: 4,
        paddingHorizontal: 7,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        marginBottom: 6,
    },
    addrTypeTextSelected: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.primary,
    },
    addrCardName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 2,
    },
    addrCardDetail: {
        fontSize: 12,
        color: '#6b7280',
        lineHeight: 17,
    },
    addrCardPhone: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        marginTop: 4,
    },

    addAddrBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
    },
    addAddrText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
    },

    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 10,
    },
    itemRowBorder: {
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#f9fafb',
    },
    itemBody: {
        flex: 1,
    },
    itemName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1f2937',
        lineHeight: 17,
    },
    itemMeta: {
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 2,
    },
    itemTotal: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
    },
    itemCountBadge: {
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    itemCountText: {
        fontSize: 11,
        color: '#6b7280',
        fontWeight: '500',
    },

    divider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginVertical: 8,
    },
    priceLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    priceLabel: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '500',
    },
    priceLabelDim: { color: '#9ca3af' },
    priceLabelBold: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
    },
    priceValue: {
        fontSize: 13,
        color: '#1f2937',
        fontWeight: '600',
    },
    priceValueBold: {
        fontSize: 16,
        fontWeight: '700',
    },

    largeOrderNotice: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        backgroundColor: '#fffbeb',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#fde68a',
    },
    largeOrderText: {
        flex: 1,
        fontSize: 12,
        color: '#92400e',
        lineHeight: 17,
    },
    payOption: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 10,
        padding: 12,
        marginTop: 8,
        gap: 12,
    },
    payOptionSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#eff6ff',
    },
    payOptionIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    payOptionIconSelected: {
        backgroundColor: COLORS.primary,
    },
    payOptionBody: { flex: 1 },
    payOptionLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    payOptionLabelSelected: { color: COLORS.primary },
    payOptionSub: {
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 1,
    },
    payRadio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#d1d5db',
        alignItems: 'center',
        justifyContent: 'center',
    },
    payRadioSelected: { borderColor: COLORS.primary },
    payRadioDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },

    bottomBar: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 20,
    },
    bottomBarInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    bottomLabel: {
        fontSize: 11,
        color: '#9ca3af',
        fontWeight: '500',
        marginBottom: 2,
    },
    bottomTotal: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    placeBtn: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingVertical: 13,
        paddingHorizontal: 22,
        borderRadius: 10,
        alignItems: 'center',
        gap: 6,
    },
    placeBtnDisabled: {
        opacity: 0.5,
    },
    placeBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    addrHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 8,
        justifyContent: 'center',
    },
    addrHintText: {
        fontSize: 12,
        color: '#d97706',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '82%',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    modalTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1f2937',
    },
    modalEmpty: {
        padding: 32,
        alignItems: 'center',
        gap: 10,
    },
    modalEmptyText: {
        fontSize: 13,
        color: '#9ca3af',
        textAlign: 'center',
    },

    addrOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
    },
    addrOptionActive: {
        backgroundColor: '#eff6ff',
        borderColor: COLORS.primary,
        borderWidth: 1.5,
    },
    addrOptionLeft: { flex: 1, marginRight: 10 },
    addrTypePill: {
        backgroundColor: '#fef3c7',
        borderRadius: 4,
        paddingHorizontal: 7,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    addrTypeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#92400e',
    },
    addrName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 3,
    },
    addrDetail: {
        fontSize: 12,
        color: '#6b7280',
        lineHeight: 17,
    },
    addrLandmark: {
        fontSize: 12,
        color: '#059669',
        marginTop: 3,
    },
    addrPhone: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        marginTop: 4,
    },
});