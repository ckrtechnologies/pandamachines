/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import SideScreenNavbar from '../../components/Navbar/SideScreenNavbar';
import { API_BASE_URL } from '../../utils/basicInfo';

import { RefreshControl } from 'react-native';
import { getCloudinaryImageUrl } from '../../utils/getCloudinaryImageUrl';

const { width } = Dimensions.get('window');

const CATEGORY_LIMIT = 16;
const SUBCATEGORY_LIMIT = 12;

const Categories = ({ navigation, route }) => {
  const selectedCategoryFromRoute =
    route?.params?.selectedCategoryId || null;

  /*  STATES  */

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [catPage, setCatPage] = useState(1);
  const [subPage, setSubPage] = useState(1);

  const [catHasMore, setCatHasMore] = useState(true);
  const [subHasMore, setSubHasMore] = useState(true);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /*  REFS  */

  const subCategoryRef = useRef(null);


  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      // Reset categories pagination
      setCatPage(1);
      setCatHasMore(true);

      // Reset subcategories pagination
      setSubPage(1);
      setSubHasMore(true);

      // Clear old data
      setCategories([]);
      setSubcategories([]);
      setSelectedCategory(null);

      // Reload fresh categories
      const response = await fetch(
        `${API_BASE_URL}/navigation/categories?page=1&limit=${CATEGORY_LIMIT}`,
      );

      const data = await response.json();

      if (data?.success) {
        setCategories(data.categories);
        setCatHasMore(data.hasMore);
        setCatPage(2);

        // Auto select first category
        const firstCategory =
          data.categories.find(
            item => item._id === selectedCategoryFromRoute,
          ) || data.categories[0];

        if (firstCategory) {
          setSelectedCategory(firstCategory);

          // Load subcategories
          const subResponse = await fetch(
            `${API_BASE_URL}/navigation/subcategories?categoryId=${firstCategory._id}&page=1&limit=${SUBCATEGORY_LIMIT}`,
          );

          const subData = await subResponse.json();

          if (subData?.success) {
            setSubcategories(subData.subCategories);
            setSubHasMore(subData.hasMore);
            setSubPage(2);
          }
        }
      }
    } catch (error) {
      console.log('Refresh Error:', error);
    } finally {
      setRefreshing(false);
    }
  };
  /*  LOAD CATEGORIES  */

  const loadCategories = async () => {
    if (loadingCategories || !catHasMore) return;

    try {
      setLoadingCategories(true);

      const response = await fetch(
        `${API_BASE_URL}/navigation/categories?page=${catPage}&limit=${CATEGORY_LIMIT}`,
      );

      const data = await response.json();

      if (data?.success) {
        setCategories(prev => {
          const map = new Map();

          [...prev, ...data.categories].forEach(item => {
            map.set(item._id, item);
          });

          return Array.from(map.values());
        });

        setCatHasMore(data.hasMore);
        setCatPage(prev => prev + 1);
      }
    } catch (error) {
      console.log('Category Error:', error);
    } finally {
      setLoadingCategories(false);
      setInitialLoading(false);
    }
  };

  /*  LOAD SUBCATEGORIES  */

  const loadSubCategories = async (
    categoryId,
    reset = false,
  ) => {
    if (!categoryId) return;

    if (loadingSubcategories || (!subHasMore && !reset)) return;

    try {
      setLoadingSubcategories(true);

      const pageToUse = reset ? 1 : subPage;

      const response = await fetch(
        `${API_BASE_URL}/navigation/subcategories?categoryId=${categoryId}&page=${pageToUse}&limit=${SUBCATEGORY_LIMIT}`,
      );

      const data = await response.json();

      if (data?.success) {
        setSubcategories(prev => {
          const merged = reset
            ? data.subCategories
            : [...prev, ...data.subCategories];

          const map = new Map();

          merged.forEach(item => {
            map.set(item._id, item);
          });

          return Array.from(map.values());
        });

        setSubHasMore(data.hasMore);

        if (reset) {
          setSubPage(2);
        } else {
          setSubPage(prev => prev + 1);
        }
      }
    } catch (error) {
      console.log('SubCategory Error:', error);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  /*  INITIAL LOAD  */

  useFocusEffect(
    useCallback(() => {
      if (!categories.length) {
        loadCategories();
      }
    }, []),
  );

  /*  AUTO SELECT CATEGORY  */

  useEffect(() => {
    if (!categories.length) return;

    let selected =
      categories.find(
        item => item._id === selectedCategoryFromRoute,
      ) || categories[0];

    setSelectedCategory(selected);
  }, [categories, selectedCategoryFromRoute]);

  /*  CATEGORY CHANGE  */

  useEffect(() => {
    if (!selectedCategory?._id) return;

    setSubcategories([]);
    setSubPage(1);
    setSubHasMore(true);

    subCategoryRef.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });

    loadSubCategories(selectedCategory._id, true);
  }, [selectedCategory]);

  /*  HANDLERS  */

  const handleCategoryPress = useCallback(item => {
    setSelectedCategory(item);
  }, []);

  const handleSubcategoryPress = useCallback(
    item => {
      navigation.navigate('SubCategories', {
        subcategoryId: item._id,
        subcategoryTitle: item.name,
      });
    },
    [navigation],
  );

  /*  RENDER CATEGORY  */

  const renderCategoryItem = useCallback(
    ({ item }) => {
      const isActive =
        selectedCategory?._id === item._id;

      return (
        <CategoryCard
          item={item}
          active={isActive}
          onPress={handleCategoryPress}
        />
      );
    },
    [selectedCategory],
  );

  /*  RENDER SUBCATEGORY  */

  const renderSubCategoryItem = useCallback(
    ({ item }) => (
      <SubCategoryCard
        item={item}
        onPress={handleSubcategoryPress}
      />
    ),
    [],
  );

  /*  FOOTERS  */

  const categoryFooter = useMemo(() => {
    if (!loadingCategories || categories.length === 0)
      return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#004680" />
      </View>
    );
  }, [loadingCategories]);

  const subCategoryFooter = useMemo(() => {
    if (!loadingSubcategories || subcategories.length === 0)
      return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#004680" />
      </View>
    );
  }, [loadingSubcategories]);

  /*  SKELETON  */

  if (initialLoading && categories.length === 0) {
    return (
      <View style={styles.container}>
        <SideScreenNavbar
          pageName="Categories"
          navigation={navigation}
        />
        {refreshing && (
          <View style={styles.topRefreshLoader}>
            <ActivityIndicator
              size="small"
              color="#004680"
            />
            <Text style={styles.refreshText}>
              Refreshing...
            </Text>
          </View>
        )}
        <View style={styles.mainContent}>
          {/* LEFT */}
          <View style={styles.leftSidebar}>
            {Array.from({ length: 10 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </View>

          {/* RIGHT */}
          <View style={styles.rightContent}>
            <View style={styles.skeletonTitle} />

            <View style={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <SubCategorySkeleton key={i} />
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }

  /*  UI  */

  return (
    <View style={styles.container}>
      <SideScreenNavbar
        pageName="Categories"
        navigation={navigation}
      />

      <View style={styles.mainContent}>
        {/* LEFT SIDEBAR */}

        <View style={styles.leftSidebar}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}

            onEndReached={loadCategories}
            onEndReachedThreshold={0.5}
            ListFooterComponent={categoryFooter}
            removeClippedSubviews
            maxToRenderPerBatch={8}
            windowSize={8}
            initialNumToRender={8}

          />
        </View>

        {/* RIGHT CONTENT */}

        <View style={styles.rightContent}>
          <Text style={styles.title}>
            {selectedCategory?.name}
          </Text>

          {loadingSubcategories &&
            subcategories.length === 0 ? (
            <View style={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <SubCategorySkeleton key={i} />
              ))}
            </View>
          ) : (
            <FlatList
              ref={subCategoryRef}
              data={subcategories}
              renderItem={renderSubCategoryItem}
              keyExtractor={item => item._id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.row}
              contentContainerStyle={{
                paddingBottom: 120,
              }}
              onEndReached={() =>
                loadSubCategories(selectedCategory?._id)
              }
              onEndReachedThreshold={0.5}
              ListFooterComponent={subCategoryFooter}
              removeClippedSubviews
              maxToRenderPerBatch={8}
              windowSize={10}
              initialNumToRender={8}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#004680']}
                  tintColor="#004680"
                />
              }
            />
          )}
        </View>
      </View>
    </View>
  );
};

/* ---------- */
/*                                CATEGORY CARD                               */
/* ---------- */

const CategoryCard = memo(
  ({ item, active, onPress }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(item)}
        style={[
          styles.categoryCard,
          active && styles.categoryCardActive,
        ]}
      >
        <Image
          source={{
            uri: getCloudinaryImageUrl(item.imgUrl, {
              width: 120,
            }),
          }}
          style={styles.categoryImage}
          resizeMode="cover"
        />

        <Text
          style={[
            styles.categoryName,
            active && styles.categoryNameActive,
          ]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  },
);

/* ---------- */
/*                              SUBCATEGORY CARD                              */
/* ---------- */

const SubCategoryCard = memo(
  ({ item, onPress }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(item)}
        style={styles.subCard}
      >
        <View style={styles.subImageWrapper}>
          <Image
            source={{
              uri: getCloudinaryImageUrl(item.imgUrl, {
                width: 300,
              }),
            }}
            style={styles.subImage}
            resizeMode="contain"
          />

          <View style={styles.productCountBadge}>
            <Text style={styles.productCountText}>
              {item.productCount || 0}
            </Text>
          </View>
        </View>

        <Text
          style={styles.subName}
          numberOfLines={2}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  },
);

/* ---------- */
/*                                 SKELETONS                                  */
/* ---------- */

const CategorySkeleton = () => (
  <View style={styles.categorySkeleton}>
    <View style={styles.categorySkeletonImage} />
    <View style={styles.categorySkeletonText} />
  </View>
);

const SubCategorySkeleton = () => (
  <View style={styles.subSkeleton}>
    <View style={styles.subSkeletonImage} />
    <View style={styles.subSkeletonText} />
    <View style={styles.subSkeletonTextSmall} />
  </View>
);

/* ---------- */
/*                                   STYLES                                   */
/* ---------- */

const styles = StyleSheet.create({
  topRefreshLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#EEF5FF',
    borderBottomWidth: 1,
    borderBottomColor: '#DCEBFF',
  },

  refreshText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#004680',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F7FF',
  },

  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },

  leftSidebar: {
    width: 95,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ECECEC',
  },

  rightContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },

  categoryCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },

  categoryCardActive: {
    backgroundColor: '#EEF5FF',
    borderLeftWidth: 3,
    borderLeftColor: '#004680',
  },

  categoryImage: {
    width: 66,
    height: 66,
    borderRadius: 4,
    backgroundColor: '#F1F1F1',
  },

  categoryName: {
    marginTop: 6,
    fontSize: 10,
    textAlign: 'center',
    color: '#444',
    lineHeight: 14,
  },

  categoryNameActive: {
    color: '#004680',
    fontWeight: '700',
  },

  row: {
    justifyContent: 'space-between',
  },

  subCard: {
    width: (width - 130) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },

  subImageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    overflow: 'hidden',
  },

  subImage: {
    width: '100%',
    height: '100%',
  },

  productCountBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 4,
  },

  productCountText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
  },

  subName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    lineHeight: 16,
  },

  footerLoader: {
    paddingVertical: 14,
  },

  /* Skeleton */

  categorySkeleton: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  categorySkeletonImage: {
    width: 58,
    height: 58,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
  },

  categorySkeletonText: {
    width: 40,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E5E5',
    marginTop: 8,
  },

  skeletonTitle: {
    width: 120,
    height: 14,
    borderRadius: 999,
    backgroundColor: '#E5E5E5',
    marginBottom: 18,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  subSkeleton: {
    width: (width - 130) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 8,
  },

  subSkeletonImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: '#E5E5E5',
  },

  subSkeletonText: {
    width: '70%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E5E5',
    marginTop: 10,
    alignSelf: 'center',
  },

  subSkeletonTextSmall: {
    width: '45%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E5E5',
    marginTop: 6,
    alignSelf: 'center',
  },
});

export default Categories;