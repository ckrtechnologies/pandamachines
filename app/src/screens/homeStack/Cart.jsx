import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SideScreenNavbar from '../../components/Navbar/SideScreenNavbar';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../context/CheckoutContext';
import { COLORS } from '../../theme/colors';
import AppLoader from '../common/AppLoader';

//  Helpers ──
const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

//  Cart Row ──
const CartRow = React.memo(({ item, onUpdateQty, onRemove, updating, removing }) => (
  <View style={styles.row}>
    <Image source={{ uri: item.image }} style={styles.rowImage} resizeMode="cover" />

    <View style={styles.rowBody}>
      {/* name */}
      <Text style={styles.rowName} numberOfLines={2}>{item.name}</Text>
      {item.selectedSize ? (
        <Text style={styles.rowMeta}>Size: {item.selectedSize}</Text>
      ) : null}

      {/* price */}
      <Text style={styles.rowPrice}>{fmt(item.price)}</Text>

      {/* qty + remove */}
      <View style={styles.rowFooter}>
        {/* quantity stepper */}
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => onUpdateQty(item, item.quantity - 1)}
            disabled={updating || item.quantity <= 1}
          >
            <MaterialIcons name="remove" size={16} color={item.quantity <= 1 ? '#d1d5db' : '#374151'} />
          </TouchableOpacity>

          <View style={styles.stepValue}>
            <Text style={styles.stepValueText}>{item.quantity}</Text>
          </View>

          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => onUpdateQty(item, item.quantity + 1)}
            disabled={updating}
          >
            <MaterialIcons name="add" size={16} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* line total */}
        <Text style={styles.rowLineTotal}>{fmt(item.price * item.quantity)}</Text>

        {/* remove */}
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => onRemove(item)}
          disabled={removing}
          hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
        >
          {removing ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  </View>
));

//  Price row for summary card ──
const PriceLine = ({
  label,
  value,
  bold,
  accent,
  valueStyle,
}) => (
  <View style={styles.priceLine}>
    <Text
      style={[
        styles.priceLabel,
        bold && styles.priceLabelBold,
      ]}
    >
      {label}
    </Text>

    <Text
      style={[
        styles.priceValue,
        bold && styles.priceValueBold,
        accent && styles.priceValueAccent,
        valueStyle,
      ]}
    >
      {value}
    </Text>
  </View>
);

const CartFooter = ({ cartCount, cartTotals }) => (
  <View style={styles.summaryCard}>
    <View style={styles.summaryHeader}>
      <Text style={styles.summaryTitle}>Order Summary</Text>

      <View style={styles.summaryBadge}>
        <MaterialIcons name="inventory-2" size={11} color="#6b7280" />
        <Text style={styles.summaryBadgeText}>
          {cartCount} item{cartCount !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>

    <View style={styles.divider} />

    <PriceLine
      label="Subtotal"
      value={fmt(cartTotals.subtotal)}
    />

    {cartTotals.discount > 0 && (
      <PriceLine
        label="Discount"
        value={`- ${fmt(cartTotals.discount)}`}
        valueStyle={{ color: '#16a34a' }}
      />
    )}

    {cartTotals.gst > 0 && (
      <PriceLine
        label="GST"
        value={fmt(cartTotals.gst)}
      />
    )}

    {cartTotals.extraTax > 0 && (
      <PriceLine
        label="Extra Tax"
        value={fmt(cartTotals.extraTax)}
      />
    )}

    <PriceLine
      label="Shipping"
      value={
        cartTotals.shipping === 0
          ? 'Free'
          : fmt(cartTotals.shipping)
      }
    />

    <View style={styles.divider} />

    <PriceLine
      label="TOTAL"
      value={fmt(cartTotals.grandTotal)}
      bold
    />
  </View>
);

//  Main 
const Cart = ({ navigation }) => {
  const {
    cartItems,
    cartTotals,
    cartCount,
    loading,
    fetchCart,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const originalTotal = cartTotals.subtotal + cartTotals.discount;
  const { loadCartItems } = useCheckout();

  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, []),
  );


  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCart();
    setRefreshing(false);
  };

  const handleUpdateQty = async (item, newQty) => {

    if (newQty < 1) {
      Alert.alert('Remove item', `Remove "${item.name}" from cart?`, [
        { text: 'Cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => handleRemove(item),
        },
      ]);
      return;
    }

    setUpdatingId(item.productId);
    await updateQuantity(item.productId, newQty);
    setUpdatingId(null);
  };

  const handleRemove = async (item) => {
    setRemovingId(item.productId);
    const res = await removeFromCart(item.productId);
    if (!res.success) {
      Alert.alert('Error', 'Could not remove item. Please try again.');
    }
    setRemovingId(null);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // Pass normalised items to checkout context, then navigate
    loadCartItems(cartItems);
    navigation.navigate('Checkout', { mode: 'cart' });
  };

  // ── Loading ─
  if (loading && cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <SideScreenNavbar pageName="My Cart" navigation={navigation} />
        <AppLoader size={80} />
      </View>
    );
  }

  // ── Empty 
  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <SideScreenNavbar pageName="My Cart" navigation={navigation} />
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <MaterialIcons name="shopping-cart" size={36} color="#9ca3af" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add items to get started</Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'HomeStack' })}
          >
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Main ─
  return (
    <View style={styles.container}>
      <SideScreenNavbar pageName="My Cart" navigation={navigation} />

      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <CartRow
            item={item}
            updating={updatingId === item.productId}
            removing={removingId === item.productId}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemove}
          />
        )}
        ListFooterComponent={
          <CartFooter

            cartCount={cartCount}
            cartTotals={cartTotals}
          />
        }
      />

      {/* fixed bottom */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomTotal}>
          {cartTotals.discount > 0 && (
            <Text style={styles.bottomOriginalPrice}>
              {fmt(originalTotal)}
            </Text>
          )}

          <Text style={styles.bottomTotalValue}>
            {fmt(cartTotals.grandTotal)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutBtnText}>
            Proceed
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;

//  Styles ─
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // list
  list: {
    padding: 12,
    paddingBottom: 24,
  },

  // row
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  rowImage: {
    width: 88,
    height: 88,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    marginRight: 12,
  },
  rowBody: {
    flex: 1,
  },
  rowName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: 18,
  },
  rowMeta: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  rowPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 6,
  },
  rowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  rowLineTotal: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
  },

  // stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  stepValue: {
    width: 32,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  stepValueText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },

  // remove
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
  },

  // summary card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // elevation: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  summaryBadgeText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 10,
  },
  priceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
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
  priceValueAccent: {
    color: COLORS.primary,
  },

  // empty
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  browseBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  bottomBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  bottomTotal: {
    flex: 1,
    paddingRight: 10,
  },

  bottomTotalLabel: {
    fontSize: 10,
    color: '#707987',
    fontWeight: '500',
  },

  bottomOriginalPrice: {
    fontSize: 11,
    color: '#89909e',
    textDecorationLine: 'line-through',
  },

  bottomTotalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  checkoutBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.8
  },

  checkoutBtn: {
    backgroundColor: COLORS.primary,
    height: 38,
    minWidth: 150,
    paddingHorizontal: 16,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

});