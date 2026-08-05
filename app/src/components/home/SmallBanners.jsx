/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/basicInfo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

//  Layout 
const H_PADDING = 14;
const CARD_GAP = 10;
const CARD_WIDTH = SCREEN_WIDTH - H_PADDING * 2; // full-bleed card
const CARD_HEIGHT = Math.round(CARD_WIDTH * (6 / 16)); // 16:9

const AUTOPLAY_INTERVAL = 3200;

//  Skeleton 
const SkeletonBanner = () => {
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={styles.skeletonWrapper}>
      <Animated.View style={[styles.skeletonCard, { opacity: anim }]} />
      {/* Dot indicators placeholder */}
      <View style={styles.dotsRow}>
        {[0, 1, 2].map(i => (
          <Animated.View key={i} style={[styles.dot, styles.dotInactive, { opacity: anim }]} />
        ))}
      </View>
    </View>
  );
};

//  Dot Indicators 
const Dots = ({ count, activeIndex }) => (
  <View style={styles.dotsRow}>
    {Array.from({ length: count }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          i === activeIndex ? styles.dotActive : styles.dotInactive,
        ]}
      />
    ))}
  </View>
);

//  Main Component 
const SmallBanners = ({ isRefreshing, onBannerPress }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef(null);
  const autoplayTimer = useRef(null);
  const currentIndex = useRef(0);

  //  Fetch ─
  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/banners/all-banners?bannerType=small-banner`,
      );

      const raw = Array.isArray(res.data)
        ? res.data
        : res.data?.banners ?? [];

      const filtered = raw.filter(b => b.bannerType === 'small-banner');
      setBanners(filtered);
    } catch (err) {
      console.error('SmallBanners fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);
  useEffect(() => { if (isRefreshing) fetchBanners(); }, [isRefreshing]);

  //  Autoplay 
  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayTimer.current = setInterval(() => {
      if (!banners.length) return;
      const next = (currentIndex.current + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      currentIndex.current = next;
      setActiveIndex(next);
    }, AUTOPLAY_INTERVAL);
  }, [banners.length]);

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  };

  useEffect(() => {
    if (banners.length > 1) startAutoplay();
    return stopAutoplay;
  }, [banners.length, startAutoplay]);

  //  Scroll sync 
  const onMomentumScrollEnd = useCallback(e => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / (CARD_WIDTH + CARD_GAP));
    const clamped = Math.max(0, Math.min(index, banners.length - 1));
    currentIndex.current = clamped;
    setActiveIndex(clamped);
  }, [banners.length]);

  const onScrollBeginDrag = useCallback(() => {
    // Pause autoplay while user is swiping, resume after
    stopAutoplay();
  }, []);

  const onScrollEndDrag = useCallback(() => {
    if (banners.length > 1) startAutoplay();
  }, [banners.length, startAutoplay]);

  //  Render 
  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      activeOpacity={0.92}
      style={styles.card}
      onPress={() => onBannerPress?.(item)}
    >
      <Image
        source={{ uri: item.imgUrl }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      {/* Subtle gradient overlay at bottom for depth */}
      <View style={styles.overlay} />
    </TouchableOpacity>
  ), [onBannerPress]);

  const keyExtractor = useCallback(item => item._id, []);

  const getItemLayout = useCallback((_, index) => ({
    length: CARD_WIDTH + CARD_GAP,
    offset: (CARD_WIDTH + CARD_GAP) * index,
    index,
  }), []);

  //  States 
  if (loading) return <SkeletonBanner />;

  if (!banners.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={16}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
      />

      {banners.length > 1 && (
        <Dots count={banners.length} activeIndex={activeIndex} />
      )}
    </View>
  );
};

//  Styles 
const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: '#f3f3f3',
  },

  listContent: {
    paddingHorizontal: H_PADDING,
    gap: CARD_GAP,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    // shadow
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  bannerImage: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, backgroundColor: 'rgba(0,0,0,0.04)',
  },

  //  Dots 
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#FF6B35',
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#d1d5db',
  },

  //  Skeleton 
  skeletonWrapper: {
    paddingVertical: 12,
    backgroundColor: '#f3f3f3',
  },
  skeletonCard: {
    marginHorizontal: H_PADDING,
    height: CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
});

export default React.memo(SmallBanners);
