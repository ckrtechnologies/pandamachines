import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  RefreshControl,
  NativeModules,
  View,
  Alert,
  BackHandler,
  Animated,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Nav from '../../components/Navbar/Nav';
import BannerSection from '../../components/home/BannerSection';
import HomeCategoriesSection from '../../components/home/HomeCategoriesSection';
import BestSellingProducts from '../../components/home/BestSellingProducts';
import SmallBanners from '../../components/home/SmallBanners';
import NewArrivals from '../../components/home/NewArrivals';
import TopRated from '../../components/home/TopRated';
import HotDeals from '../../components/home/HotDeals';
import CategoryStrips from '../../components/home/CategoryStrips';

const { ScreenshotManager } = NativeModules;

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const SCROLL_THRESHOLD = 400;

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshKey(prev => prev + 1);

    setTimeout(() => setRefreshing(false), 1000);
  };


  useEffect(() => {
    if (ScreenshotManager) {
      ScreenshotManager.allowScreenshots(true);

      return () => {
        ScreenshotManager.allowScreenshots(true);
      };
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Exit App', 'Do you want to exit the app?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );

  const handleScroll = event => {
    const scrollY = event.nativeEvent.contentOffset.y;

    if (scrollY > SCROLL_THRESHOLD && !showScrollToTop) {
      setShowScrollToTop(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (scrollY <= SCROLL_THRESHOLD && showScrollToTop) {
      setShowScrollToTop(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // const scrollToTop = () => {
  //   flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  // };

  const SECTIONS = [
    { key: "banner" },
    { key: "categories" },
    { key: "small-banners" },
    { key: "best-selling" },
    { key: "new-arrivals" },
    { key: "hot-deals" },
    { key: "top-rated" },
    { key: "category-strips" },
  ];

  const renderSection = useCallback(
    ({ item }) => {
      switch (item.key) {
        case "banner": return <BannerSection isRefreshing={refreshing} />;

        case "categories": return <HomeCategoriesSection isRefreshing={refreshing} />;

        case "small-banners": return <SmallBanners isRefreshing={refreshing} />;

        case "best-selling": return <BestSellingProducts isRefreshing={refreshing} />;

        case "new-arrivals": return <NewArrivals isRefreshing={refreshing} />;

        case "hot-deals": return <HotDeals isRefreshing={refreshing} />;

        case "top-rated": return <TopRated isRefreshing={refreshing} />;

        case "category-strips": return <CategoryStrips isRefreshing={refreshing} />;

        default:
          return null;
      }
    },
    [refreshing]
  );

  return (
    <View style={styles.mainContainer}>
      <FlatList
        ref={flatListRef}
        data={SECTIONS}
        renderItem={renderSection}
        keyExtractor={(item, index) => item.key + index}
        ListHeaderComponent={<Nav isRefreshing={refreshing} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollEventThrottle={16}
        onScroll={handleScroll}
      />
      
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({

  mainContainer: {
    flex: 1
  },

  scrollToTopBtnContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },

  scrollToTopBtn: {
    backgroundColor: '#00569e',
    borderRadius: 50,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  }
})
