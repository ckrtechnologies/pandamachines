import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const SkeletonBlock = ({ style }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.6,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                style,
                {
                    opacity,
                },
            ]}
        />
    );
};

const ProductDetailsSkeleton = () => {
    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <SkeletonBlock style={styles.iconBtn} />
                <SkeletonBlock style={styles.searchBar} />
                <SkeletonBlock style={styles.iconBtn} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Banner */}
                <SkeletonBlock style={styles.banner} />

                {/* Dots */}
                <View style={styles.dotsRow}>
                    <SkeletonBlock style={styles.dotActive} />
                    <SkeletonBlock style={styles.dot} />
                    <SkeletonBlock style={styles.dot} />
                </View>

                {/* Product Info */}
                <View style={styles.card}>
                    <View style={styles.badgesRow}>
                        <SkeletonBlock style={styles.badge} />
                        <SkeletonBlock style={styles.badge} />
                    </View>

                    <SkeletonBlock style={styles.title} />
                    <SkeletonBlock style={[styles.title, { width: '70%' }]} />

                    <SkeletonBlock style={styles.rating} />

                    <View style={styles.priceRow}>
                        <SkeletonBlock style={styles.price} />
                        <SkeletonBlock style={styles.oldPrice} />
                    </View>

                    <SkeletonBlock style={styles.smallText} />

                    <SkeletonBlock style={styles.infoRow} />
                    <SkeletonBlock style={styles.infoRow} />
                    <SkeletonBlock style={styles.infoRow} />
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <SkeletonBlock style={styles.sectionTitle} />

                    <SkeletonBlock style={styles.paragraph} />
                    <SkeletonBlock style={styles.paragraph} />
                    <SkeletonBlock style={[styles.paragraph, { width: '60%' }]} />
                </View>

                {/* Features */}
                <View style={styles.section}>
                    <SkeletonBlock style={styles.sectionTitle} />

                    {[1, 2, 3, 4].map(i => (
                        <View key={i} style={styles.featureRow}>
                            <SkeletonBlock style={styles.featureIcon} />
                            <SkeletonBlock style={styles.featureText} />
                        </View>
                    ))}
                </View>

                {/* Contact Cards */}
                <View style={styles.section}>
                    <SkeletonBlock style={styles.sectionTitle} />

                    <View style={styles.contactGrid}>
                        {[1, 2, 3, 4].map(i => (
                            <SkeletonBlock
                                key={i}
                                style={styles.contactCard}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.actionBar}>
                <SkeletonBlock style={styles.actionBtn} />
                <SkeletonBlock style={styles.actionBtnFilled} />
            </View>
        </View>
    );
};

export default ProductDetailsSkeleton;

const skeletonColor = '#E5E7EB';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },

    skeleton: {
        backgroundColor: skeletonColor,
    },

    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        gap: 10,
    },

    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
    },

    searchBar: {
        flex: 1,
        height: 38,
        borderRadius: 10,
    },

    banner: {
        width,
        height: width * 0.75,
    },

    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        backgroundColor: '#FFF',
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 999,
    },

    dotActive: {
        width: 18,
        height: 6,
        borderRadius: 999,
    },

    card: {
        backgroundColor: '#FFF',
        padding: 16,
        marginBottom: 8,
    },

    badgesRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 14,
    },

    badge: {
        width: 90,
        height: 24,
        borderRadius: 999,
    },

    title: {
        width: '95%',
        height: 20,
        borderRadius: 6,
        marginBottom: 10,
    },

    rating: {
        width: 100,
        height: 14,
        borderRadius: 6,
        marginBottom: 16,
    },

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },

    price: {
        width: 120,
        height: 28,
        borderRadius: 6,
    },

    oldPrice: {
        width: 80,
        height: 18,
        borderRadius: 6,
    },

    smallText: {
        width: '45%',
        height: 12,
        borderRadius: 6,
        marginBottom: 14,
    },

    infoRow: {
        width: '100%',
        height: 18,
        borderRadius: 6,
        marginBottom: 12,
    },

    section: {
        backgroundColor: '#FFF',
        padding: 16,
        marginBottom: 8,
    },

    sectionTitle: {
        width: 140,
        height: 18,
        borderRadius: 6,
        marginBottom: 16,
    },

    paragraph: {
        width: '100%',
        height: 14,
        borderRadius: 6,
        marginBottom: 10,
    },

    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },

    featureIcon: {
        width: 18,
        height: 18,
        borderRadius: 999,
        marginRight: 10,
    },

    featureText: {
        flex: 1,
        height: 14,
        borderRadius: 6,
    },

    contactGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },

    contactCard: {
        width: (width - 42) / 2,
        height: 120,
        borderRadius: 12,
    },

    actionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },

    actionBtn: {
        flex: 1,
        height: 50,
        borderRadius: 10,
    },

    actionBtnFilled: {
        flex: 1,
        height: 50,
        borderRadius: 10,
    },
});