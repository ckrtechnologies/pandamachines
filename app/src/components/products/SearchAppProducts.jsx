import {
  useNavigation,
  useRoute
} from '@react-navigation/native';
import axios from 'axios';
import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_BASE_URL } from '../../utils/basicInfo';
import SearchBar from '../common/SearchBar';
import ProductCard, { ProductCardSkeleton } from './ProductCard.jsx';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2;

//  Filter config
const FILTERS = [
  { id: 'newest', label: 'Newest First', sortBy: 'createdAt', order: 'desc' },
  { id: 'price_lo', label: 'Price: Low → High', sortBy: 'price', order: 'asc' },
  { id: 'price_hi', label: 'Price: High → Low', sortBy: 'price', order: 'desc' },
  { id: 'rating', label: 'Highest Rated', sortBy: 'ratings', order: 'desc' },
];

// map uri param → filter id
const URI_FILTER_MAP = {
  new_arrivals: 'newest',
  hot_deals: 'price_lo',
  top_rated: 'rating',
};

const PAGE_LIMIT = 10;

//  Skeleton grid
const SkeletonGrid = () => (
  <FlatList
    data={Array.from({ length: 6 })}
    keyExtractor={(_, i) => `skeleton-${i}`}
    numColumns={2}
    scrollEnabled={false}
    columnWrapperStyle={styles.columnWrapper}
    contentContainerStyle={styles.listContent}
    renderItem={() => (
      <ProductCardSkeleton gridMode cardWidth={CARD_WIDTH} />
    )}
  />
);

//  Main component
const SearchAppProducts = () => {
  const navigation = useNavigation();
  const route = useRoute();

  //  URL params
  const initialQuery = route.params?.searchQuery || '';
  const sectionFilter = route.params?.section || ''; // 'new_arrivals' | 'hot_deals' | 'top_rated'

  //  Search / filter state
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState(URI_FILTER_MAP[sectionFilter] || 'newest');

  //  Products state
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(!!initialQuery || !!sectionFilter);

  //  Featured fallback
  const [featured, setFeatured] = useState([]);
  const [featPage, setFeatPage] = useState(1);
  const [featTotalPages, setFeatTotalPages] = useState(1);
  const [featLoading, setFeatLoading] = useState(false);
  const [featLoadMore, setFeatLoadMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ── Fetch products ────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async (query, filter, pageNum = 1, append = false) => {
    const cfg = FILTERS.find(f => f.id === filter) || FILTERS[0];
    if (pageNum === 1) setLoading(true); else setLoadingMore(true);

    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: PAGE_LIMIT,
        sortBy: cfg.sortBy,
        order: cfg.order,
        status: 'approved',
      });
      if (query.trim()) params.set('search', query.trim());

      const res = await axios.get(`${API_BASE_URL}/products?${params.toString()}`);
      const { data = [], total: t = 0, totalPages: tp = 1 } = res.data;

      setTotal(t);
      setTotalPages(tp);
      setProducts(prev => append ? [...prev, ...data] : data);
      setPage(pageNum);
    } catch (err) {
      console.error('fetchProducts error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // ── Fetch featured fallback ───────────────────────────────────────────────
  const fetchFeatured = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setFeatLoading(true); else setFeatLoadMore(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/products/featured?page=${pageNum}&limit=${PAGE_LIMIT}`
      );
      const { data = [], pagination = {} } = res.data;
      setFeatTotalPages(pagination.pages || 1);
      setFeatPage(pageNum);
      setFeatured(prev => append ? [...prev, ...data] : data);
    } catch (err) {
      console.error('fetchFeatured error:', err);
    } finally {
      setFeatLoading(false);
      setFeatLoadMore(false);
    }
  }, []);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialQuery || sectionFilter) {
      setIsSearchMode(true);
      fetchProducts(initialQuery, activeFilter, 1);
    } else {
      setIsSearchMode(false);
      fetchFeatured(1);
    }
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Called by SearchBar on every debounced keystroke, submit, or voice result
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setIsSearchMode(false);
      fetchFeatured(1);
      return;
    }
    setIsSearchMode(true);
    fetchProducts(query, activeFilter, 1);
  }, [activeFilter, fetchProducts, fetchFeatured]);

  const handleFilterChange = useCallback((filterId) => {
    setActiveFilter(filterId);
    if (isSearchMode) fetchProducts(searchQuery, filterId, 1);
  }, [isSearchMode, searchQuery, fetchProducts]);

  const handleEndReached = useCallback(() => {
    if (isSearchMode) {
      if (loadingMore || page >= totalPages) return;
      fetchProducts(searchQuery, activeFilter, page + 1, true);
    } else {
      if (featLoadMore || featPage >= featTotalPages) return;
      fetchFeatured(featPage + 1, true);
    }
  }, [
    isSearchMode, loadingMore, page, totalPages,
    featLoadMore, featPage, featTotalPages,
    searchQuery, activeFilter,
    fetchProducts, fetchFeatured,
  ]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      if (isSearchMode) await fetchProducts(searchQuery, activeFilter, 1);
      else await fetchFeatured(1);
    } finally {
      setRefreshing(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const renderCard = useCallback(({ item }) => (
    <ProductCard  product={item} />
  ), []);

  const ListFooter = () => {
    const isMore = isSearchMode ? loadingMore : featLoadMore;
    if (!isMore) return <View style={{ height: 24 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#E53935" />
      </View>
    );
  };

  const displayData = isSearchMode ? products : featured;
  const initialLoad = isSearchMode ? loading : featLoading;
  const currentTotal = isSearchMode ? total : null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>

        <SearchBar
          mode="page"
          initialValue={initialQuery}
          placeholder="Search products…"
          onSearch={handleSearch}
          autoFocus={!initialQuery && !sectionFilter}
          style={styles.searchBarWrapper}
        />
      </View>

      {/* ── Filters strip ── */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map(f => {
            const active = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => handleFilterChange(f.id)}
                style={[styles.filterChip, active && styles.filterChipActive]}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Result count strip ── */}
      {isSearchMode && !loading && (
        <View style={styles.countStrip}>
          <Text style={styles.countText}>
            {currentTotal} result{currentTotal !== 1 ? 's' : ''}
            {searchQuery.trim() ? ` for "${searchQuery.trim()}"` : ''}
          </Text>
        </View>
      )}

      {!isSearchMode && !featLoading && (
        <View style={styles.countStrip}>
          <Text style={styles.countText}>Featured Products</Text>
        </View>
      )}

      {/* ── Content ── */}
      {initialLoad ? (
        <SkeletonGrid />
      ) : displayData.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="search-off" size={52} color="#e5e7eb" />
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptySubtitle}>Try a different search or filter</Text>
        </View>
      ) : (
        <FlatList
          data={displayData}
          renderItem={renderCard}
          keyExtractor={item => item._id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={<ListFooter />}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
  },

  // Filters
  filtersWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filtersContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // Count strip
  countStrip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },

  // List
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 10,
    marginBottom: 10,
  },

  // Footer
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },

  // Empty
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9ca3af',
  },
});

export default SearchAppProducts;