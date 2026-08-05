import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SideScreenNavbar from '../../components/Navbar/SideScreenNavbar';
import { API_BASE_URL } from '../../utils/basicInfo';
const PAGE_SIZE = 10;
const BRAND = '#00395F';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n || 0);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const normaliseOrder = (order) => {
  const orderStatus = order.orderStatus || order.status || 'Pending';
  let grandTotal = order.pricing?.grandTotal ?? null;
  if (!grandTotal) {
    if (order.totalAmount && order.totalAmount > 0) {
      grandTotal = order.totalAmount;
    } else {
      grandTotal = (order.products || []).reduce((sum, p) => {
        const qty = p.quantity || 1;
        return (
          sum +
          ((p.price || 0) +
            (p.gst || 0) +
            (p.extraTax || 0) +
            (p.shippingCharge || 0)) *
          qty
        );
      }, 0);
    }
  }
  const orderId =
    order.orderId || (order._id?.slice(-8) || '').toUpperCase();
  const paymentMethod = order.paymentMethod || null;
  const paymentStatus = order.paymentStatus || null;
  return {
    ...order,
    _normalised: true,
    orderStatus,
    grandTotal,
    orderId,
    paymentMethod,
    paymentStatus,
  };
};

const STATUS_META = {
  pending: { color: '#B45309', bg: '#FFFBEB', border: '#FDE68A', icon: 'clock-outline' },
  confirmed: { color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE', icon: 'check-circle-outline' },
  processing: { color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA', icon: 'autorenew' },
  shipped: { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: 'truck-outline' },
  delivered: { color: '#065F46', bg: '#ECFDF5', border: '#A7F3D0', icon: 'check-circle' },
  cancelled: { color: '#B91C1C', bg: '#FEF2F2', border: '#FECACA', icon: 'close-circle-outline' },
  returned: { color: '#374151', bg: '#F9FAFB', border: '#E5E7EB', icon: 'undo-variant' },
  'exchange requested': { color: '#0F766E', bg: '#F0FDFA', border: '#99F6E4', icon: 'swap-horizontal' },
};

const getStatusMeta = (status = '') =>
  STATUS_META[status.toLowerCase()] || {
    color: '#374151',
    bg: '#F9FAFB',
    border: '#E5E7EB',
    icon: 'clock-outline',
  };

const STATUS_FILTERS = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

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

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const OrderCardSkeleton = () => (
  <View style={styles.card}>
    {/* Top bar */}
    <View style={styles.cardTopBar}>
      <ShimmerBox style={{ width: 100, height: 12, borderRadius: 4 }} />
      <ShimmerBox style={{ width: 70, height: 16, borderRadius: 4 }} />
    </View>

    {/* Body */}
    <View style={styles.cardBody}>
      {/* Image */}
      <ShimmerBox style={{ width: 72, height: 72, borderRadius: 12, flexShrink: 0 }} />

      {/* Content */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <ShimmerBox style={{ width: '85%', height: 14, borderRadius: 4 }} />
        <ShimmerBox style={{ width: '55%', height: 14, borderRadius: 4, marginTop: 8 }} />
        <ShimmerBox style={{ width: 100, height: 11, borderRadius: 4, marginTop: 10 }} />
        <ShimmerBox style={{ width: 72, height: 20, borderRadius: 100, marginTop: 10 }} />
      </View>
    </View>

    {/* Footer */}
    <View style={styles.cardFooter}>
      <ShimmerBox style={{ width: 64, height: 10, borderRadius: 4 }} />
    </View>
  </View>
);

const ListSkeleton = ({ count = 5 }) => (
  <View style={{ gap: 12, paddingTop: 4 }}>
    {Array.from({ length: count }).map((_, i) => (
      <OrderCardSkeleton key={i} />
    ))}
  </View>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const meta = getStatusMeta(status);
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: meta.bg, borderColor: meta.border },
      ]}>
      <MaterialCommunityIcons name={meta.icon} size={11} color={meta.color} />
      <Text style={[styles.badgeText, { color: meta.color }]}>{status}</Text>
    </View>
  );
};

// ─── Order Card ───────────────────────────────────────────────────────────────

const OrderCard = ({ order, onPress }) => {
  const o = normaliseOrder(order);
  const [imgErr, setImgErr] = useState(false);

  const firstProduct = o.products?.[0];
  const image =
    firstProduct?.product?.images?.[0] || firstProduct?.productImage || null;
  const name =
    firstProduct?.product?.name || firstProduct?.productName || 'Product';
  const extraCount = (o.products?.length || 1) - 1;
  const size = firstProduct?.size;
  const variant = firstProduct?.variantModel;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}>
      {/* Top bar */}
      <View style={styles.cardTopBar}>
        <Text style={styles.orderId}>#{o.orderId}</Text>
        <Text style={styles.orderTotal}>{formatCurrency(o.grandTotal)}</Text>
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        {/* Image */}
        <View style={styles.imageWrap}>
          {image && !imgErr ? (
            <Image
              source={{ uri: image }}
              style={styles.productImage}
              resizeMode="cover"
              onError={() => setImgErr(true)}
            />
          ) : (
            <View style={styles.imageFallback}>
              <MaterialCommunityIcons name="package-variant" size={28} color="#CBD5E1" />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {name}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {o.products?.length || 1} item{(o.products?.length || 1) !== 1 ? 's' : ''}
            </Text>
            {size ? (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{size}</Text>
              </>
            ) : null}
            {variant ? (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{variant}</Text>
              </>
            ) : null}
          </View>

          <StatusBadge status={o.orderStatus} />

          {extraCount > 0 && (
            <Text style={styles.extraItems}>
              +{extraCount} more item{extraCount > 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* Chevron */}
        <MaterialCommunityIcons
          name="chevron-right"
          size={18}
          color="#CBD5E1"
          style={styles.chevron}
        />
      </View>

      {/* Footer date */}
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>{formatDate(o.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({ page, total, limit, onChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <View style={styles.paginationRow}>
      <TouchableOpacity
        disabled={page === 1}
        onPress={() => onChange(page - 1)}
        style={[styles.pageBtn, page === 1 && { opacity: 0.35 }]}>
        <MaterialCommunityIcons name="chevron-left" size={18} color="#374151" />
        <Text style={styles.pageBtnText}>Prev</Text>
      </TouchableOpacity>

      <View style={styles.pageNumbers}>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
          )
          .reduce((acc, p, i, arr) => {
            if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === '…' ? (
              <Text key={`e${i}`} style={styles.pageDots}>…</Text>
            ) : (
              <TouchableOpacity
                key={p}
                onPress={() => onChange(p)}
                style={[styles.pageNumber, p === page && styles.pageNumberActive]}>
                <Text
                  style={[styles.pageNumberText, p === page && styles.pageNumberTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ),
          )}
      </View>

      <TouchableOpacity
        disabled={page === totalPages}
        onPress={() => onChange(page + 1)}
        style={[styles.pageBtn, page === totalPages && { opacity: 0.35 }]}>
        <Text style={styles.pageBtnText}>Next</Text>
        <MaterialCommunityIcons name="chevron-right" size={18} color="#374151" />
      </TouchableOpacity>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const DEFAULT_FILTERS = { status: '', sort: 'newest', search: '' };

const UserOrdersScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const searchTimerRef = useRef(null);
  const isFirstLoad = useRef(true);
  const isMount = useRef(true);

  // ── Load user ────────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, []),
  );

  const loadUser = async () => {
    try {
      setUserLoading(true);
      const raw = await AsyncStorage.getItem('pm-user-data');
      if (raw) {
        const parsed = JSON.parse(raw);
        const user = parsed.data || parsed;
        setUserData(user);
      } else {
        setUserData(null);
        setPageLoading(false);
      }
    } catch (e) {
      setPageLoading(false);
    } finally {
      setUserLoading(false);
    }
  };

  // ── Fetch orders ─────────────────────────────────────────────────
  const fetchOrders = useCallback(
    async (pageNum, currentFilters, debSearch, userId) => {
      if (isFirstLoad.current) setPageLoading(true);
      else setListLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: pageNum,
          limit: PAGE_SIZE,
          sort: currentFilters.sort,
        });
        if (currentFilters.status) params.set('status', currentFilters.status);
        if (debSearch?.trim()) params.set('search', debSearch.trim());

        const res = await axios.get(
          `${API_BASE_URL}/orders/get-user-orders/${userId}?${params}`,
        );

        const data = res.data;
        // Support both paginated {orders, total} and legacy plain array
        if (Array.isArray(data)) {
          setOrders(data);
          setTotal(data.length);
        } else {
          setOrders(data.orders || []);
          setTotal(data.total ?? 0);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setPageLoading(false);
        setListLoading(false);
        isFirstLoad.current = false;
      }
    },
    [],
  );

  // Initial load when user available
  useEffect(() => {
    if (userData?._id || userData?.id) {
      const uid = userData._id || userData.id;
      fetchOrders(1, DEFAULT_FILTERS, '', uid);
    }
  }, [userData, fetchOrders]);

  // Filter / page changes (skip first render)
  useEffect(() => {
    if (isMount.current) { isMount.current = false; return; }
    const uid = userData?._id || userData?.id;
    if (!uid) return;
    fetchOrders(page, filters, debouncedSearch, uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.status, filters.sort, debouncedSearch]);

  const handleSearchChange = (val) => {
    setFilters((prev) => ({ ...prev, search: val }));
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(val);
    }, 400);
  };

  const handleStatusFilter = (s) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      status: s === 'All' ? '' : s,
    }));
  };

  const handleResetFilters = () => {
    clearTimeout(searchTimerRef.current);
    setFilters(DEFAULT_FILTERS);
    setDebouncedSearch('');
    setPage(1);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const hasActiveFilters = filters.status || filters.search;
  const activeStatusLabel = filters.status || 'All';

  // ── Not logged in ─────────────────────────────────────────────────
  if (!userLoading && !userData) {
    return (
      <View style={styles.screen}>
        <SideScreenNavbar pageName="My Orders" navigation={navigation} />
        <View style={styles.centerContent}>
          <MaterialCommunityIcons name="account-circle-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>Not Logged In</Text>
          <Text style={styles.emptySubtitle}>Please login to view your orders</Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('AuthPage')}>
            <Text style={styles.primaryBtnText}>Login Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Full page skeleton (first load) ───────────────────────────────
  if (pageLoading || userLoading) {
    return (
      <View style={styles.screen}>
        <SideScreenNavbar pageName="My Orders" navigation={navigation} />
        <View style={styles.content}>
          {/* Header skeleton */}
          <View style={styles.pageHeader}>
            <View style={{ gap: 6 }}>
              <ShimmerBox style={{ width: 120, height: 20 }} />
              <ShimmerBox style={{ width: 80, height: 11 }} />
            </View>
            <ShimmerBox style={{ width: 52, height: 28, borderRadius: 10 }} />
          </View>
          {/* Search skeleton */}
          <ShimmerBox style={{ height: 44, borderRadius: 14, marginBottom: 12 }} />
          {/* Filter chips skeleton */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {[60, 72, 80, 64].map((w, i) => (
              <ShimmerBox key={i} style={{ width: w, height: 32, borderRadius: 100 }} />
            ))}
          </View>
          <ListSkeleton count={5} />
        </View>
      </View>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────
  if (error && orders.length === 0) {
    return (
      <View style={styles.screen}>
        <SideScreenNavbar pageName="My Orders" navigation={navigation} />
        <View style={styles.centerContent}>
          <MaterialCommunityIcons name="close-circle-outline" size={56} color="#FCA5A5" />
          <Text style={styles.emptyTitle}>Couldn't load orders</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => {
              isFirstLoad.current = true;
              const uid = userData?._id || userData?.id;
              fetchOrders(1, filters, debouncedSearch, uid);
            }}>
            <Text style={styles.primaryBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      <SideScreenNavbar pageName="My Orders" navigation={navigation} />

      <FlatList
        data={listLoading ? [] : orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <>
            {/* Page Header */}
            <View style={styles.pageHeader}>
              <View>
                <Text style={styles.pageTitle}>My Orders</Text>
                {total !== null && total > 0 && (
                  <Text style={styles.pageSubtitle}>{total} order{total !== 1 ? 's' : ''} placed</Text>
                )}
              </View>
              {total !== null && total > 0 && (
                <View style={styles.totalPill}>
                  <Text style={styles.totalPillLabel}>Total</Text>
                  <Text style={styles.totalPillCount}>{total}</Text>
                </View>
              )}
            </View>

            {/* Search bar */}
            <View style={styles.searchWrap}>
              <MaterialCommunityIcons name="magnify" size={18} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by order ID or product…"
                placeholderTextColor="#9CA3AF"
                value={filters.search}
                onChangeText={handleSearchChange}
                returnKeyType="search"
              />
              {filters.search ? (
                <TouchableOpacity onPress={() => handleSearchChange('')} style={styles.searchClear}>
                  <MaterialCommunityIcons name="close" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Status filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
              style={{ marginBottom: 16 }}>
              {STATUS_FILTERS.map((s) => {
                const active = activeStatusLabel === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => handleStatusFilter(s)}
                    style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Inline list skeleton on filter change */}
            {listLoading && <ListSkeleton count={4} />}
          </>
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item._id })}
          />
        )}
        ListEmptyComponent={
          !listLoading ? (
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="shopping-outline" size={52} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>
                {hasActiveFilters ? 'No orders match your filters' : 'No Orders Yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {hasActiveFilters
                  ? 'Try adjusting your search or status filter.'
                  : 'Your purchased products will appear here.'}
              </Text>
              {hasActiveFilters ? (
                <TouchableOpacity style={styles.outlineBtn} onPress={handleResetFilters}>
                  <Text style={styles.outlineBtnText}>Clear Filters</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => navigation.navigate('Home')}>
                  <Text style={styles.primaryBtnText}>Continue Shopping</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null
        }
        ListFooterComponent={
          !listLoading && orders.length > 0 ? (
            <Pagination
              page={page}
              total={total}
              limit={PAGE_SIZE}
              onChange={handlePageChange}
            />
          ) : null
        }
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F4F6' },

  content: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 32,
  },

  // ── Page header
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },
  totalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  totalPillLabel: { fontSize: 10, color: '#6B7280', fontWeight: '600' },
  totalPillCount: { fontSize: 13, color: '#111827', fontWeight: '800' },

  // ── Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 0,
    fontWeight: '400',
  },
  searchClear: { padding: 4 },

  // ── Status chips
  chipScroll: { paddingRight: 14, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: BRAND,
    borderColor: BRAND,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  chipTextActive: { color: '#fff' },

  // ── Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  cardTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FAFAFA',
  },
  orderId: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.3,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    paddingBottom: 10,
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#F9FAFB',
    flexShrink: 0,
  },
  productImage: { width: '100%', height: '100%' },
  imageFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: { flex: 1, marginLeft: 12, paddingRight: 8 },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  metaText: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  metaDot: { fontSize: 11, color: '#CBD5E1', marginHorizontal: 4 },
  extraItems: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: BRAND,
  },
  chevron: { alignSelf: 'center' },

  // ── Badge
  badge: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },

  // ── Card footer
  cardFooter: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },
  dateText: { fontSize: 10, color: '#9CA3AF', fontWeight: '500' },

  // ── Empty state
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 32,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: 8,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 19,
  },

  // ── Buttons
  primaryBtn: {
    marginTop: 18,
    backgroundColor: BRAND,
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  outlineBtn: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 12,
  },
  outlineBtnText: { color: '#374151', fontWeight: '600', fontSize: 14 },

  // ── Center layout
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },

  // ── Pagination
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 20,
    paddingBottom: 8,
  },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  pageBtnText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  pageNumbers: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pageNumber: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumberActive: {
    backgroundColor: BRAND,
    borderColor: BRAND,
  },
  pageNumberText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  pageNumberTextActive: { color: '#fff' },
  pageDots: { fontSize: 13, color: '#9CA3AF', paddingHorizontal: 2 },
});

export default UserOrdersScreen;