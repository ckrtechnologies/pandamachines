/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';

import axios from 'axios';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useFocusEffect } from '@react-navigation/native';

import SideScreenNavbar from '../Navbar/SideScreenNavbar';

import { API_BASE_URL } from '../../utils/basicInfo';

import ProductCard, {
    ProductCardSkeleton,
} from '../products/ProductCard';

const { width } = Dimensions.get('window');

const CARD_GAP = 10;
const SCREEN_PADDING = 12;

const CARD_WIDTH =
    (width - SCREEN_PADDING * 2 - CARD_GAP) / 2;

const ProductsPage = ({
    route,
    navigation,
}) => {
    const category =
        route?.params?.category;

    const subCategory =
        route?.params?.subCategory;

    const subSubCategory =
        route?.params?.subSubCategory;

    /* ---------------- STATES ---------------- */

    const [breadcrumb, setBreadcrumb] =
        useState(null);

    const [products, setProducts] =
        useState([]);

    const [hasMore, setHasMore] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [loadingMore, setLoadingMore] =
        useState(false);

    const [refreshing, setRefreshing] =
        useState(false);

    const [search, setSearch] =
        useState('');

    const [
        debouncedSearch,
        setDebouncedSearch,
    ] = useState('');

    const [sort, setSort] =
        useState('newest');


    const pageRef = useRef(1);

    const loadingRef = useRef(false);

    const hasMoreRef = useRef(true);


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);


    useEffect(() => {
        setProducts([]);

        pageRef.current = 1;

        setHasMore(true);

        hasMoreRef.current = true;
    }, [
        category,
        subCategory,
        subSubCategory,
        debouncedSearch,
        sort,
    ]);

    /* ---------------- FETCH ---------------- */

    const fetchProducts = async (
        refresh = false,
    ) => {
        if (
            loadingRef.current ||
            (!hasMoreRef.current &&
                !refresh)
        )
            return;

        try {
            loadingRef.current = true;

            if (refresh) {
                if (
                    products.length === 0
                ) {
                    setLoading(true);
                } else {
                    setRefreshing(true);
                }
            } else {
                setLoadingMore(true);
            }

            const response = await axios.get(
                `${API_BASE_URL}/catalog/products`,
                {
                    params: {
                        category,
                        subCategory,
                        subSubCategory,
                        page: refresh
                            ? 1
                            : pageRef.current,
                        limit: 10,
                        search:
                            debouncedSearch,
                        sort,
                    },
                },
            );

            const data = response.data;

            setProducts(prev => {
                const merged = refresh
                    ? data.products
                    : [
                        ...prev,
                        ...data.products,
                    ];

                const map = new Map();

                merged.forEach(item => {
                    map.set(item._id, item);
                });

                return Array.from(
                    map.values(),
                );
            });

            if (
                (refresh
                    ? 1
                    : pageRef.current) === 1
            ) {
                setBreadcrumb(
                    data.breadcrumb,
                );
            }

            const totalPages =
                data.pagination.totalPages;

            const currentPage =
                refresh
                    ? 1
                    : pageRef.current;

            if (
                currentPage >= totalPages
            ) {
                hasMoreRef.current = false;

                setHasMore(false);
            } else {
                hasMoreRef.current = true;

                setHasMore(true);

                pageRef.current =
                    currentPage + 1;
            }
        } catch (error) {
            console.log(error);
        } finally {
            loadingRef.current = false;

            setLoading(false);

            setLoadingMore(false);

            setRefreshing(false);
        }
    };

    /* ---------------- INITIAL LOAD ---------------- */

    useFocusEffect(
        useCallback(() => {
            fetchProducts(true);
        }, [
            category,
            subCategory,
            subSubCategory,
            debouncedSearch,
            sort,
        ]),
    );

    /* ---------------- REFRESH ---------------- */

    const handleRefresh =
        async () => {
            pageRef.current = 1;

            hasMoreRef.current = true;

            setHasMore(true);

            await fetchProducts(true);
        };

    /* ---------------- ADD TO CART ---------------- */

    const handleAddToCart =
        async product => {
            return {
                success: true,
            };
        };

    /* ---------------- LOAD MORE ---------------- */

    const handleLoadMore =
        useCallback(() => {
            if (
                !loadingMore &&
                hasMore
            ) {
                fetchProducts();
            }
        }, [loadingMore, hasMore]);

    /* ---------------- SORT PILLS ---------------- */

    const sortOptions = useMemo(
        () => [
            {
                key: 'newest',
                label: 'Newest',
            },
            {
                key: 'price_asc',
                label: 'Low → High',
            },
            {
                key: 'price_desc',
                label: 'High → Low',
            },
        ],
        [],
    );

    /* ---------------- SKELETON DATA ---------------- */

    const skeletonData = Array.from(
        { length: 6 },
        (_, index) => ({
            _id: `skeleton-${index}`,
            skeleton: true,
        }),
    );

    /* ---------------- PRODUCT CARD ---------------- */

    const renderProduct =
        useCallback(
            ({ item }) => {
                if (item.skeleton) {
                    return (
                        <View
                            style={{
                                width:
                                    CARD_WIDTH,
                            }}
                        >
                            <ProductCardSkeleton
                                gridMode
                                cardWidth={
                                    CARD_WIDTH
                                }
                            />
                        </View>
                    );
                }

                return (
                    <View
                        style={{
                            width:
                                CARD_WIDTH,
                        }}
                    >
                        <ProductCard
                            product={item}
                            gridMode
                            cardWidth={
                                CARD_WIDTH
                            }
                            onPress={product =>
                                navigation.navigate(
                                    'ProductDetails',
                                    {
                                        productId:
                                            product._id,
                                    },
                                )
                            }
                            onAddToCart={
                                handleAddToCart
                            }
                            onBuyNow={product =>
                                navigation.navigate(
                                    'Checkout',
                                    {
                                        productId:
                                            product._id,
                                    },
                                )
                            }
                            onQuotation={() => { }}
                        />
                    </View>
                );
            },
            [navigation],
        );

    /* ---------------- HEADER ---------------- */

    const listHeader = (
        <>
            {/* BREADCRUMB */}

            <View style={styles.breadcrumbRow}>
                {breadcrumb?.categoryName && (
                    <>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={
                                styles.breadcrumbItem
                            }
                        >
                            {
                                breadcrumb.categoryName
                            }
                        </Text>

                        <Text
                            style={
                                styles.breadcrumbSlash
                            }
                        >
                            /
                        </Text>
                    </>
                )}

                {breadcrumb?.subCategoryName && (
                    <>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={
                                styles.breadcrumbItem
                            }
                        >
                            {
                                breadcrumb.subCategoryName
                            }
                        </Text>

                        <Text
                            style={
                                styles.breadcrumbSlash
                            }
                        >
                            /
                        </Text>
                    </>
                )}

                {breadcrumb?.subSubCategoryName && (
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                            styles.breadcrumbItem,
                            styles.breadcrumbActive,
                        ]}
                    >
                        {
                            breadcrumb.subSubCategoryName
                        }
                    </Text>
                )}
            </View>

            {/* SEARCH */}

            <View style={styles.searchWrap}>
                <MaterialIcons
                    name="search"
                    size={18}
                    color="#9CA3AF"
                    style={
                        styles.searchIcon
                    }
                />

                <TextInput
                    placeholder="Search products..."
                    placeholderTextColor="#9CA3AF"
                    value={search}
                    onChangeText={
                        setSearch
                    }
                    style={
                        styles.searchInput
                    }
                />
            </View>

            {/* SORT */}

            <FlatList
                horizontal
                data={sortOptions}
                keyExtractor={item =>
                    item.key
                }
                showsHorizontalScrollIndicator={
                    false
                }
                contentContainerStyle={{
                    paddingBottom: 4,
                }}
                renderItem={({ item }) => {
                    const active =
                        sort === item.key;

                    return (
                        <TouchableOpacity
                            activeOpacity={
                                0.85
                            }
                            style={[
                                styles.sortPill,

                                active &&
                                styles.sortPillActive,
                            ]}
                            onPress={() =>
                                setSort(
                                    item.key,
                                )
                            }
                        >
                            <Text
                                style={[
                                    styles.sortPillText,

                                    active &&
                                    styles.sortPillTextActive,
                                ]}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </>
    );

    return (
        <View style={styles.container}>
            <SideScreenNavbar
                pageName="Products"
            />

            <FlatList
                data={
                    loading &&
                        products.length === 0
                        ? skeletonData
                        : products
                }
                renderItem={renderProduct}
                keyExtractor={item =>
                    item._id
                }
                numColumns={2}
                columnWrapperStyle={
                    styles.row
                }
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={{
                    paddingHorizontal: 12,
                    paddingBottom: 120,
                }}
                ListHeaderComponent={
                    listHeader
                }
                onEndReached={
                    handleLoadMore
                }
                onEndReachedThreshold={
                    0.5
                }
                removeClippedSubviews
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                windowSize={7}
                refreshControl={
                    <RefreshControl
                        refreshing={
                            refreshing
                        }
                        onRefresh={
                            handleRefresh
                        }
                        colors={['#004680']}
                        tintColor="#004680"
                    />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View
                            style={
                                styles.emptyWrap
                            }
                        >
                            <MaterialIcons
                                name="inventory-2"
                                size={48}
                                color="#D1D5DB"
                            />

                            <Text
                                style={
                                    styles.emptyTitle
                                }
                            >
                                No Products Found
                            </Text>

                            <Text
                                style={
                                    styles.emptySub
                                }
                            >
                                Try changing
                                search or
                                filters
                            </Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    <>
                        {loadingMore && (
                            <View
                                style={
                                    styles.footerLoader
                                }
                            >
                                <ActivityIndicator
                                    size="small"
                                    color="#004680"
                                />
                            </View>
                        )}

                        {!hasMore &&
                            products.length >
                            0 && (
                                <Text
                                    style={
                                        styles.noMoreText
                                    }
                                >
                                    No more
                                    products
                                </Text>
                            )}
                    </>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            '#F6F8FB',
    },

    breadcrumbRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },

    breadcrumbItem: {
        maxWidth: 120,

        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },

    breadcrumbActive: {
        color: '#111827',
        fontWeight: '700',
    },

    breadcrumbSlash: {
        marginHorizontal: 6,

        color: '#D1D5DB',

        fontSize: 12,
    },

    searchWrap: {
        height: 46,

        borderRadius: 14,

        backgroundColor:
            '#FFFFFF',

        borderWidth: 1,
        borderColor: '#E5E7EB',

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 14,

        marginBottom: 14,
    },

    searchIcon: {
        marginRight: 8,
    },

    searchInput: {
        flex: 1,

        fontSize: 14,

        color: '#111827',
    },

    sortPill: {
        paddingHorizontal: 14,
        paddingVertical: 8,

        borderRadius: 999,

        backgroundColor:
            '#FFFFFF',

        borderWidth: 1,
        borderColor: '#E5E7EB',

        marginRight: 8,

        marginBottom: 16,
    },

    sortPillActive: {
        backgroundColor:
            '#FF6B00',
        borderColor: '#FF6B00',
    },

    sortPillText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },

    sortPillTextActive: {
        color: '#FFFFFF',
    },

    row: {
        justifyContent:
            'space-between',

        marginBottom: 10,
    },

    footerLoader: {
        paddingVertical: 18,
    },

    noMoreText: {
        textAlign: 'center',

        color: '#9CA3AF',

        fontSize: 12,

        paddingVertical: 18,
    },

    emptyWrap: {
        alignItems: 'center',

        justifyContent:
            'center',

        paddingTop: 80,
    },

    emptyTitle: {
        marginTop: 12,

        fontSize: 16,

        fontWeight: '700',

        color: '#374151',
    },

    emptySub: {
        marginTop: 6,

        fontSize: 12,

        color: '#9CA3AF',
    },
});

export default ProductsPage;