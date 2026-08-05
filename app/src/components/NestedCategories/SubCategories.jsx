/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  memo,
  useCallback,
  useState,
} from 'react';

import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import axios from 'axios';

import { useFocusEffect } from '@react-navigation/native';

import SideScreenNavbar from '../Navbar/SideScreenNavbar';

import { API_BASE_URL } from '../../utils/basicInfo';


import { getCloudinaryImageUrl } from '../../utils/getCloudinaryImageUrl';
import ProductCard, { ProductCardSkeleton } from '../products/ProductCard';
import LinearGradient from 'react-native-linear-gradient';


const SubCategories = ({ route, navigation }) => {
  const subcategoryId = route?.params?.subcategoryId;

  const subcategoryTitle =
    route?.params?.subcategoryTitle;

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchData = async (
    refresh = false,
  ) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `${API_BASE_URL}/catalog/subcategory/${subcategoryId}`,
      );

      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [subcategoryId]),
  );

  /* ---------------- REFRESH ---------------- */

  const handleRefresh = async () => {
    await fetchData(true);
  };

  /* ---------------- ADD TO CART ---------------- */

  const handleAddToCart = async (
    product,
  ) => {
    return { success: true };
  };

  /* ---------------- SECTION ---------------- */

  const renderSection = useCallback(
    ({ item, index }) => (
      <SectionBlock
        section={item}
        index={index}
        navigation={navigation}
        onAddToCart={handleAddToCart}
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <SideScreenNavbar
        pageName={subcategoryTitle}
      />

      <FlatList
        data={data?.sections || []}
        renderItem={renderSection}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#004680']}
            tintColor="#004680"
          />
        }
        ListHeaderComponent={
          <>
            {/* SHOP BY CATEGORIES */}

            <View style={styles.shopSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Shop by Categories
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      'CategoriesMain',
                    )
                  }
                  style={styles.viewAllBtn}
                >
                  <Text
                    style={
                      styles.viewAllText
                    }
                  >
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                >
                  {Array.from({
                    length: 6,
                  }).map((_, i) => (
                    <ShopSkeleton
                      key={i}
                    />
                  ))}
                </ScrollView>
              ) : (
                <FlatList
                  horizontal
                  data={
                    data?.shopByCategories ||
                    []
                  }
                  keyExtractor={item =>
                    item._id
                  }
                  renderItem={({ item }) => (
                    <ShopCard
                      item={item}
                      navigation={
                        navigation
                      }
                    />
                  )}
                  showsHorizontalScrollIndicator={
                    false
                  }
                  contentContainerStyle={{
                    paddingRight: 20,
                  }}
                />
              )}
            </View>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <View
              style={{
                paddingTop: 12,
              }}
            >
              {Array.from({
                length: 3,
              }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    marginBottom: 22,
                  }}
                >
                  <View
                    style={
                      styles.headerSkeleton
                    }
                  />

                  <ScrollView
                    horizontal
                  >
                    {Array.from({
                      length: 4,
                    }).map((_, j) => (
                      <View
                        key={j}
                        style={{
                          marginLeft: 12,
                        }}
                      >
                        <ProductCardSkeleton />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              ))}
            </View>
          ) : null
        }
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      />
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 SHOP CARD                                  */
/* -------------------------------------------------------------------------- */

const ShopCard = memo(
  ({ item, navigation }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.shopCard}
        onPress={() =>
          navigation.navigate(
            'ProductsPage',
            {
              subSubCategory:
                item._id,
            },
          )
        }
      >
        <View style={styles.shopImageWrap}>
          <Image
            source={{
              uri: getCloudinaryImageUrl(
                item.imgUrl,
                {
                  width: 200,
                },
              ),
            }}
            style={styles.shopImage}
          />

          <View style={styles.countBadge}>
            <Text
              style={
                styles.countBadgeText
              }
            >
              {item.productCount}
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={2}
          style={styles.shopName}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*                               SECTION BLOCK                                */
/* -------------------------------------------------------------------------- */

const SectionBlock = memo(
  ({
    section,
    index,
    navigation,
    onAddToCart,
  }) => {
    const sectionGradients = [
      [
        'rgba(254,243,199,0.85)',
        'rgba(254,243,199,0.25)',
        'rgba(255,255,255,0)',
      ],

      [
        'rgba(243,232,255,0.85)',
        'rgba(243,232,255,0.22)',
        'rgba(255,255,255,0)',
      ],

      [
        'rgba(219,234,254,0.85)',
        'rgba(219,234,254,0.22)',
        'rgba(255, 255, 255, 0)',
      ],

      [
        'rgba(254,215,170,0.85)',
        'rgba(254,215,170,0.22)',
        'rgba(255,255,255,0)',
      ],
    ];

    const gradient =
      sectionGradients[
      index % sectionGradients.length
      ];

    return (
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sectionBlock}
      >
        {/* HEADER */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {section.name}
          </Text>

          {section.hasMore && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'ProductsPage',
                  {
                    subSubCategory:
                      section._id,
                  },
                )
              }
              style={styles.viewAllBtn}
            >
              <Text
                style={
                  styles.viewAllText
                }
              >
                View All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* PRODUCTS */}

        {section.products.length ===
          0 ? (
          <View
            style={
              styles.emptyProducts
            }
          >
            <Text
              style={
                styles.emptyProductsText
              }
            >
              No products available
            </Text>
          </View>
        ) : (
          <FlatList
            horizontal
            data={
              section.hasMore
                ? [
                  ...section.products,
                  {
                    _id: 'view-all',
                    isViewAll: true,
                  },
                ]
                : section.products
            }
            keyExtractor={item =>
              item._id
            }
            renderItem={({ item }) => {

              // VIEW ALL CARD
              if (section.hasMore && item.isViewAll) {
                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.viewAllCard}
                    onPress={() =>
                      navigation.navigate(
                        'ProductsPage',
                        {
                          subSubCategory:
                            section._id,
                        },
                      )
                    }
                  >
                    <View style={styles.viewAllCircle}>
                      <Text style={styles.viewAllArrow}>
                        →
                      </Text>
                    </View>

                    <Text style={styles.viewAllCardText}>
                      View All
                    </Text>

                    <Text style={styles.viewAllSubText}>
                      {section.products.length} Products
                    </Text>
                  </TouchableOpacity>
                );
              }

              // NORMAL PRODUCT CARD
              return (
                <View
                  style={{
                    marginLeft: 12,
                  }}
                >
                  <ProductCard
                    product={item}
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
                      onAddToCart
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
            }}
            showsHorizontalScrollIndicator={
              false
            }
            removeClippedSubviews
            initialNumToRender={3}
            maxToRenderPerBatch={4}
            windowSize={5}
            contentContainerStyle={{
              paddingRight: 12,
            }}
          />
        )}
      </LinearGradient>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*                                 SKELETON                                   */
/* -------------------------------------------------------------------------- */

const ShopSkeleton = () => (
  <View style={styles.shopSkeleton}>
    <View
      style={styles.shopSkeletonImage}
    />

    <View
      style={styles.shopSkeletonText}
    />

    <View
      style={
        styles.shopSkeletonTextSmall
      }
    />
  </View>
);

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({

  viewAllCard: {
    width: 190,
    height: 290,
    marginLeft: 12,

    backgroundColor: '#FFFFFF',

    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    borderStyle: 'dashed',
  },

  viewAllArrow: {
    fontSize: 28,
    color: '#FF6B00',
    fontWeight: '700',
  },

  viewAllCardText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  viewAllSubText: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
  },

  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },

  shopSection: {
    paddingTop: 12,
    marginBottom: 18,
  },

  sectionBlock: {
    paddingTop: 14,
    paddingBottom: 20,
  },

  sectionHeader: {
    paddingHorizontal: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  viewAllBtn: {
    borderWidth: 1,
    borderColor: '#FF6B00',
    backgroundColor:
      'rgba(255,107,0,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  viewAllText: {
    color: '#FF6B00',
    fontSize: 11,
    fontWeight: '600',
  },

  /* SHOP */

  shopCard: {
    width: 86,
    marginLeft: 12,
  },

  shopImageWrap: {
    width: 86,
    height: 86,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    position: 'relative',
  },

  shopImage: {
    width: '100%',
    height: '100%',
  },

  countBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor:
      'rgba(0,0,0,0.45)',
    paddingVertical: 4,
  },

  countBadgeText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
  },

  shopName: {
    marginTop: 6,
    fontSize: 11,
    textAlign: 'center',
    color: '#4c4f55',
    lineHeight: 12,
    fontWeight: '500',
  },

  /* EMPTY */

  emptyProducts: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },

  emptyProductsText: {
    color: '#6B7280',
    fontSize: 12,
  },

  /* SKELETON */

  shopSkeleton: {
    width: 86,
    marginLeft: 12,
  },

  shopSkeletonImage: {
    width: 86,
    height: 86,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
  },

  shopSkeletonText: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
    width: '80%',
    alignSelf: 'center',
  },

  shopSkeletonTextSmall: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    marginTop: 5,
    width: '50%',
    alignSelf: 'center',
  },

  headerSkeleton: {
    height: 16,
    width: 140,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    marginBottom: 18,
    marginLeft: 12,
  },
});

export default SubCategories;