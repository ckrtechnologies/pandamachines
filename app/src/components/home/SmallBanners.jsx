/*******************************************************
 * SmallBanners.jsx
 *******************************************************/

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

import axios from "axios";

import { API_BASE_URL } from "../../utils/basicInfo";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// =====================================================
// LAYOUT
// =====================================================

const H_PADDING = 14;
const CARD_GAP = 10;

const CARD_WIDTH =
  SCREEN_WIDTH - H_PADDING * 2;

const CARD_HEIGHT =
  Math.round(CARD_WIDTH * (6 / 16));

const AUTOPLAY_INTERVAL = 3200;

// =====================================================
// SKELETON
// =====================================================

const SkeletonBanner = () => {
  const anim = useRef(
    new Animated.Value(0.4)
  ).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),

        Animated.timing(anim, {
          toValue: 0.4,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [anim]);

  return (
    <View style={styles.skeletonWrapper}>
      <Animated.View
        style={[
          styles.skeletonCard,
          {
            opacity: anim,
          },
        ]}
      />

      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              styles.dotInactive,
              {
                opacity: anim,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// =====================================================
// DOT INDICATORS
// =====================================================

const Dots = ({
  count,
  activeIndex,
}) => {
  return (
    <View style={styles.dotsRow}>
      {Array.from({
        length: count,
      }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,

            i === activeIndex
              ? styles.dotActive
              : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
};

// =====================================================
// SMALL BANNERS
// =====================================================

const SmallBanners = ({
  isRefreshing,
  onBannerPress,
}) => {
  const [banners, setBanners] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const flatListRef =
    useRef(null);

  const autoplayTimer =
    useRef(null);

  const currentIndex =
    useRef(0);

  // ===================================================
  // STOP AUTOPLAY
  // ===================================================

  const stopAutoplay = useCallback(() => {
    if (autoplayTimer.current) {
      clearInterval(
        autoplayTimer.current
      );

      autoplayTimer.current = null;
    }
  }, []);

  // ===================================================
  // FETCH BANNERS
  // ===================================================

  const fetchBanners =
    useCallback(async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_BASE_URL}/banners/all-banners?bannerType=small-banner`
        );

        const raw =
          Array.isArray(res.data)
            ? res.data
            : res.data?.banners ?? [];

        const filtered =
          raw.filter(
            (banner) =>
              banner.bannerType ===
              "small-banner"
          );

        console.log(
          "SMALL BANNERS:",
          filtered
        );

        // IMPORTANT:
        // Keep productId exactly as returned
        setBanners(filtered);

        currentIndex.current = 0;
        setActiveIndex(0);
      } catch (err) {
        console.error(
          "SmallBanners fetch error:",
          err
        );

        setBanners([]);
      } finally {
        setLoading(false);
      }
    }, []);

  // ===================================================
  // INITIAL FETCH
  // ===================================================

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // ===================================================
  // REFRESH
  // ===================================================

  useEffect(() => {
    if (isRefreshing) {
      fetchBanners();
    }
  }, [
    isRefreshing,
    fetchBanners,
  ]);

  // ===================================================
  // AUTOPLAY
  // ===================================================

  const startAutoplay =
    useCallback(() => {
      stopAutoplay();

      if (banners.length <= 1) {
        return;
      }

      autoplayTimer.current =
        setInterval(() => {
          const next =
            (currentIndex.current + 1) %
            banners.length;

          flatListRef.current?.scrollToIndex(
            {
              index: next,
              animated: true,
            }
          );

          currentIndex.current =
            next;

          setActiveIndex(next);
        }, AUTOPLAY_INTERVAL);
    }, [
      banners.length,
      stopAutoplay,
    ]);

  // ===================================================
  // START / STOP AUTOPLAY
  // ===================================================

  useEffect(() => {
    if (banners.length > 1) {
      startAutoplay();
    } else {
      stopAutoplay();
    }

    return () => {
      stopAutoplay();
    };
  }, [
    banners.length,
    startAutoplay,
    stopAutoplay,
  ]);

  // ===================================================
  // SCROLL END
  // ===================================================

  const onMomentumScrollEnd =
    useCallback(
      (e) => {
        const offset =
          e.nativeEvent.contentOffset.x;

        const index =
          Math.round(
            offset /
              (CARD_WIDTH + CARD_GAP)
          );

        const clamped =
          Math.max(
            0,
            Math.min(
              index,
              banners.length - 1
            )
          );

        currentIndex.current =
          clamped;

        setActiveIndex(clamped);
      },
      [banners.length]
    );

  // ===================================================
  // DRAG START
  // ===================================================

  const onScrollBeginDrag =
    useCallback(() => {
      stopAutoplay();
    }, [stopAutoplay]);

  // ===================================================
  // DRAG END
  // ===================================================

  const onScrollEndDrag =
    useCallback(() => {
      if (banners.length > 1) {
        startAutoplay();
      }
    }, [
      banners.length,
      startAutoplay,
    ]);

  // ===================================================
  // BANNER CLICK
  // ===================================================

  const handleBannerPress =
    useCallback(
      (banner) => {
        console.log(
          "================================"
        );

        console.log(
          "CLICKED BANNER:",
          banner
        );

        console.log(
          "BANNER NAME:",
          banner?.name
        );

        console.log(
          "BANNER ID:",
          banner?._id
        );

        console.log(
          "BANNER PRODUCT ID:",
          banner?.productId
        );

        console.log(
          "================================"
        );

        // Send the complete banner object
        // to parent screen
        if (onBannerPress) {
          onBannerPress(banner);
        }
      },
      [onBannerPress]
    );

  // ===================================================
  // RENDER ITEM
  // ===================================================

  const renderItem =
    useCallback(
      ({ item }) => {
        return (
          <TouchableOpacity
            activeOpacity={0.92}
            style={styles.card}
            onPress={() =>
              handleBannerPress(item)
            }
          >
            <Image
              source={{
                uri: item.imgUrl,
              }}
              style={
                styles.bannerImage
              }
              resizeMode="cover"
            />

            <View
              style={
                styles.overlay
              }
            />
          </TouchableOpacity>
        );
      },
      [handleBannerPress]
    );

  // ===================================================
  // KEY
  // ===================================================

  const keyExtractor =
    useCallback(
      (item, index) =>
        item?._id ||
        `banner-${index}`,
      []
    );

  // ===================================================
  // ITEM LAYOUT
  // ===================================================

  const getItemLayout =
    useCallback(
      (_, index) => ({
        length:
          CARD_WIDTH +
          CARD_GAP,

        offset:
          (CARD_WIDTH +
            CARD_GAP) *
          index,

        index,
      }),
      []
    );

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return <SkeletonBanner />;
  }

  // ===================================================
  // EMPTY
  // ===================================================

  if (!banners.length) {
    return null;
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={
          false
        }
        snapToInterval={
          CARD_WIDTH + CARD_GAP
        }
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={
          styles.listContent
        }
        getItemLayout={
          getItemLayout
        }
        onMomentumScrollEnd={
          onMomentumScrollEnd
        }
        onScrollBeginDrag={
          onScrollBeginDrag
        }
        onScrollEndDrag={
          onScrollEndDrag
        }
        scrollEventThrottle={16}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
      />

      {banners.length > 1 && (
        <Dots
          count={banners.length}
          activeIndex={activeIndex}
        />
      )}
    </View>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: "#f3f3f3",
  },

  listContent: {
    paddingHorizontal: H_PADDING,
    gap: CARD_GAP,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  bannerImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      "rgba(0,0,0,0.04)",
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },

  dot: {
    height: 6,
    borderRadius: 3,
  },

  dotActive: {
    width: 20,
    backgroundColor: "#FF6B35",
  },

  dotInactive: {
    width: 6,
    backgroundColor: "#d1d5db",
  },

  skeletonWrapper: {
    paddingVertical: 12,
    backgroundColor: "#f3f3f3",
  },

  skeletonCard: {
    marginHorizontal: H_PADDING,
    height: CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
});

export default React.memo(
  SmallBanners
);