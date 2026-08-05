/**
 * OrderSuccess.jsx
 * ─────────────────
 * Shown after a successful order placement.
 * route.params: { groupOrderId, mode }
 */

import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../theme/colors';

const OrderSuccess = ({ route, navigation }) => {
    const { groupOrderId } = route.params || {};

    // ── Entrance animation ────────────────────────────────────────────────────
    const scale = useRef(new Animated.Value(0.6)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                tension: 60,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.inner, { opacity, transform: [{ scale }] }]}>

                {/* Success circle */}
                <View style={styles.iconWrap}>
                    <View style={styles.iconRing} />
                    <View style={styles.iconCircle}>
                        <MaterialIcons name="check" size={40} color="#fff" />
                    </View>
                </View>

                {/* Badge */}
                <View style={styles.badge}>
                    <MaterialIcons name="verified" size={13} color="#16a34a" />
                    <Text style={styles.badgeText}>Order Confirmed</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>Order Placed{'\n'}Successfully!</Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Thank you for your purchase. Your order has been received and is being processed.
                </Text>

                {/* Order ID */}
                {/* {groupOrderId ? (
                    <View style={styles.orderIdWrap}>
                        <Text style={styles.orderIdLabel}>Group Order ID</Text>
                        <Text style={styles.orderId}>{groupOrderId}</Text>
                    </View>
                ) : null} */}

                {/* Timeline */}
                <View style={styles.timeline}>
                    <Step icon="check-circle" label="Received" done />
                    <View style={styles.timelineLine} />
                    <Step icon="autorenew" label="Processing" />
                    <View style={styles.timelineLine} />
                    <Step icon="local-shipping" label="Delivery" />
                </View>

                {/* CTAs */}
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => navigation.replace('UserOrdersScreen')}
                    activeOpacity={0.85}
                >
                    <MaterialIcons name="receipt-long" size={18} color="#fff" />
                    <Text style={styles.primaryBtnText}>View My Orders</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => navigation.navigate('MainTabs', { screen: 'HomeStack' })}
                    activeOpacity={0.7}
                >
                    <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

// ─── Step pill for timeline ───────────────────────────────────────────────────
const Step = ({ icon, label, done = false }) => (
    <View style={styles.step}>
        <MaterialIcons
            name={icon}
            size={18}
            color={done ? '#16a34a' : '#d1d5db'}
        />
        <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{label}</Text>
    </View>
);

export default OrderSuccess;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    inner: {
        width: '100%',
        alignItems: 'center',
    },

    // icon
    iconWrap: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    iconRing: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#dcfce7',
        opacity: 0.6,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#16a34a',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
    },

    // badge
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#f0fdf4',
        borderWidth: 1,
        borderColor: '#bbf7d0',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginBottom: 20,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#16a34a',
    },

    // title
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        lineHeight: 34,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 13,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 20,
        marginVertical: 20,
        maxWidth: 280,
    },

    // order ID
    orderIdWrap: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 18,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 24,
    },
    orderIdLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 3,
    },
    orderId: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        fontFamily: 'monospace',
    },

    // timeline
    timeline: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        gap: 4,
    },
    step: {
        alignItems: 'center',
        gap: 4,
    },
    stepLabel: {
        fontSize: 10,
        color: '#9ca3af',
        fontWeight: '500',
    },
    stepLabelDone: {
        color: '#16a34a',
    },
    timelineLine: {
        width: 28,
        height: 1,
        backgroundColor: '#e5e7eb',
        marginBottom: 14,
        marginHorizontal: 2,
    },

    // buttons
    primaryBtn: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    secondaryBtn: {
        paddingVertical: 12,
    },
    secondaryBtnText: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
});