import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/basicInfo';
import { COLORS } from '../../theme/colors';

const BANNER_HEIGHT = 140;
const AUTO_SCROLL_INTERVAL = 3500;

const BannerSection = ({ isRefreshing }) => {
  const { width } = useWindowDimensions();

  const flatListRef = useRef(null);
  const timerRef = useRef(null);
  const currentIndexRef = useRef(0);

  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const dotAnimations = useRef([]);

  //  Fetch Banners 
  const fetchBanners = useCallback(async () => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      const res = await axios.get(
        `${API_BASE_URL}/banners/all-banners?bannerType=main-banner`
      );

      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data?.banners) data = res.data.banners;

      const filtered = data.filter(item => item.bannerType === 'main-banner');
      setBanners(filtered);
    } catch (err) {
      console.error('Banner fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [isRefreshing]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners, isRefreshing]);


  //  Setup dot animations when banners load ─
  useEffect(() => {
    if (banners.length === 0) return;

    // Create one Animated.Value per banner, all starting at 0 (inactive state)
    dotAnimations.current = banners.map(() => new Animated.Value(0));

    // Activate the first dot immediately
    animateDot(0);
  }, [banners]);

  //  Animate a single dot (progress bar fill effect) 
  const animateDot = (index) => {
    // Reset ALL dots to 0 first
    dotAnimations.current.forEach(anim => anim.setValue(0));

    // Then animate the active dot from 0 → 1 over the scroll interval
    Animated.timing(dotAnimations.current[index], {
      toValue: 1,
      duration: AUTO_SCROLL_INTERVAL,
      useNativeDriver: false, //  false because we're animating WIDTH (layout property)
    }).start();
  };


  //  Auto-scroll logic
  useEffect(() => {
    if (banners.length <= 1) return; // no point scrolling 1 item

    // Clear any existing timer before starting a new one
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % banners.length;
      currentIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      animateDot(nextIndex);

      // Scroll the FlatList to the next item
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(timerRef.current);
  }, [banners]);

  //  When user manually swipes s
  const onMomentumScrollEnd = (event) => {
    // Calculate which index the user scrolled to
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    if (newIndex !== currentIndexRef.current) {
      currentIndexRef.current = newIndex;
      setActiveIndex(newIndex);
      animateDot(newIndex);

      // Reset the auto-scroll timer so it doesn't jump immediately
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const nextIndex = (currentIndexRef.current + 1) % banners.length;
        currentIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        animateDot(nextIndex);
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }, AUTO_SCROLL_INTERVAL);
    }
  };

  //  Render each banner image 
  const renderBanner = ({ item }) => (
    <View style={[styles.bannerWrapper, { width }]}>
      <Image
        source={{ uri: item.imgUrl }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </View>
  );

  //  Render progress-bar style dots 
  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {banners.map((_, index) => {
        const isActive = index === activeIndex;

        // The dot's background track (grey)
        // Inside it, an animated white bar fills from left to right
        return (
          <View
            key={index}
            style={[
              styles.dotTrack,
              isActive ? styles.dotTrackActive : styles.dotTrackInactive,
            ]}
          >
            {isActive && (
              <Animated.View
                style={[
                  styles.dotFill,
                  {
                    // width animates from 0% → 100%
                    width: dotAnimations.current[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );

  if (loading) {
    return <SkeletonLoader width={width} />;
  }

  if (banners.length === 0) return null;

  //  Main render ─
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={renderBanner}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          // Tells FlatList exact item size — needed for scrollToIndex to work
          length: width,
          offset: width * index,
          index,
        })}
        scrollEventThrottle={16}  // how often scroll events fire (16ms = 60fps)
      />
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10
  },

  bannerWrapper: {
    paddingHorizontal: 10,
    overflow: 'hidden',
  },

  bannerImage: {
    width: '100%',
    borderRadius: 13,
    height: BANNER_HEIGHT,
  },

  skeleton: {
    backgroundColor: '#E0E0E0',
  },

  // The grey track behind each dot
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 4,
  },

  dotTrack: {
    height: 3,
    borderRadius: 3,
    overflow: 'hidden',
  },

  dotTrackActive: {
    width: 24,
    backgroundColor: COLORS.grayMedium,
  },

  dotTrackInactive: {
    width: 6,
    backgroundColor: COLORS.grayMedium,
    opacity: 0.4,
  },

  dotFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  skeletonBanner: {
    width: '100%',
    height: BANNER_HEIGHT,
    borderRadius: 13, // EXACT same as image
    backgroundColor: COLORS.grayLight,
  },

  skeletonDot: {
    height: 3,
    borderRadius: 3,
    backgroundColor: COLORS.grayMedium,
    width: 20,
  },
});

export default BannerSection;

const SkeletonLoader = ({ width }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      {/* Banner skeleton */}
      <View style={[styles.bannerWrapper, { width }]}>
        <Animated.View
          style={[
            styles.skeletonBanner,
            { opacity }
          ]}
        />
      </View>

      {/* Dots skeleton */}
      <View style={styles.dotsContainer}>
        {[1, 2, 3].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.skeletonDot,
              { opacity }
            ]}
          />
        ))}
      </View>
    </View>
  );
};