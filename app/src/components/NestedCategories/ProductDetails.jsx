/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../../src/context/AuthContext';
import { useCart } from '../../../src/context/CartContext.js';
import { useWishlist } from '../../../src/context/WishlistContext';
import QuotationModal from '../../components/Quotation/QuotationModal';
import { API_BASE_URL } from '../../utils/basicInfo';
import ProductDetailsSkeleton from './ProductDetailsSkeleton';

const { width } = Dimensions.get('window');

//  Helpers 

const extractYouTubeId = url => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
};

const isCloudinaryVideo = url =>
  url?.includes('/video/upload/');

const isValidUrl = url => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const formatPrice = price =>
  price != null ? `₹${Number(price).toLocaleString('en-IN')}` : null;

const calcDiscount = (prev, curr) => {
  if (!prev || !curr || prev <= curr) return null;
  return Math.round(((prev - curr) / prev) * 100);
};


//  Sub-components 
const StarRating = ({ rating }) => (
  <View style={styles.starsRow}>
    {[1, 2, 3, 4, 5].map(i => (
      <MaterialIcons
        key={i}
        name={i <= Math.floor(rating) ? 'star' : i - 0.5 <= rating ? 'star-half' : 'star-border'}
        size={14}
        color="#F59E0B"
        style={{ marginRight: 1 }}
      />
    ))}
  </View>
);

const SpecRow = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.specRow}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{String(value)}</Text>
    </View>
  );
};

const CollapsibleSection = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.collapsibleCard}>
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => setOpen(o => !o)}
        activeOpacity={0.7}
      >
        <View style={styles.collapsibleHeaderLeft}>
          <MaterialIcons name={icon} size={16} color="#004680" />
          <Text style={styles.collapsibleTitle}>{title}</Text>
        </View>
        <MaterialIcons
          name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>
      {open && <View style={styles.collapsibleBody}>{children}</View>}
    </View>
  );
};

//  Media Slide 

const MediaSlide = ({ item, isActive }) => {
  const ytId = extractYouTubeId(item.uri);

  if (ytId) {
    return (
      <View style={styles.mediaSlide}>
        {isActive ? (
          <WebView
            source={{
              uri: `https://www.youtube.com/embed/${ytId}?autoplay=1&playsinline=1`,
            }}
            style={styles.mediaSlideInner}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
          />
        ) : (
          <View style={[styles.mediaSlideInner, styles.ytThumb]}>
            <Image
              source={{ uri: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            <View style={styles.ytPlayOverlay}>
              <MaterialIcons name="play-circle-filled" size={56} color="rgba(255,255,255,0.9)" />
            </View>
            <View style={styles.ytBadge}>
              <MaterialIcons name="smart-display" size={12} color="#FF0000" />
              <Text style={styles.ytBadgeText}>YouTube</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  if (isCloudinaryVideo(item.uri)) {
    return (
      <View style={styles.mediaSlide}>
        <Video
          source={{ uri: item.uri }}
          style={styles.mediaSlideInner}
          controls
          resizeMode="cover"
          paused={!isActive}
          repeat
        />
      </View>
    );
  }

  return (
    <View style={styles.mediaSlide}>
      <Image
        source={{ uri: item.uri }}
        style={styles.mediaSlideInner}
        resizeMode="cover"
      />
    </View>
  );
};

//  Main Component 

const ProductDetails = ({ route, navigation }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const productId = route?.params?.productId;

  //  Contexts 
  const { isLoggedIn } = useAuth();
  const { addToCart, cartItems } = useCart();
  const { isWishlisted, toggleWishlist, updatingWishlist } = useWishlist();

  const flatListRef = useRef(null);

  //  Auth-guard: redirect to AuthPage and return to this screen after login 
  const requireAuth = useCallback(() => {
    if (!isLoggedIn) {
      navigation.navigate('AuthPage', {
        redirectTo: 'ProductDetails',
        redirectParams: { productId },
      });
      return false;
    }
    return true;
  }, [isLoggedIn, navigation, productId]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID not provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/products/get-product-by-id/${productId}`,
        );
        if (response.data) setProduct(response.data);
        else setError('Invalid data format received');
      } catch {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId])

  //  Derived state 
  const mediaItems = useMemo(
    () =>
      product
        ? [
          ...(product.images || []).map(uri => ({ type: 'image', uri })),
          ...(isValidUrl(product.demo_video)
            ? [{ type: 'video', uri: product.demo_video }]
            : []),
          ...(isValidUrl(product.production_video)
            ? [{ type: 'video', uri: product.production_video }]
            : []),
        ]
        : [],
    [product],
  );

  // Check if this product is already in the cart
  const isInCart = useMemo(
    () => product != null && cartItems.some(item => item.productId === product._id),
    [cartItems, product],
  );

  const isLiked = product ? isWishlisted(product._id) : false;
  const wishlistUpdating = product ? updatingWishlist.has(product._id) : false;

  const discountPct = product
    ? calcDiscount(product.previous_price, product.price)
    : null;

  //  Handlers 

  const handleToggleWishlist = useCallback(() => {
    if (!requireAuth()) return;
    toggleWishlist(product._id);
  }, [requireAuth, toggleWishlist, product]);

  const handleAddToCart = async () => {
    if (!requireAuth()) return;

    // Already in cart → navigate directly to cart
    if (isInCart) {
      navigation.navigate('MainTabs', { screen: 'Cart' });
      return;
    }

    setAddingToCart(true);
    try {
      const result = await addToCart(product._id, 1);
      if (result.success) {
        Alert.alert('Added to Cart', 'Product added successfully!', [
          { text: 'Continue Shopping' },
          {
            text: 'Go to Cart',
            onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' }),
          },
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to add product to cart.');
      }
    } catch {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!requireAuth()) return;
    try {
      // AsyncStorage only used here for BuyNow handoff — not for auth
      await AsyncStorage.setItem(
        'buy-now-product',
        JSON.stringify({ product, quantity: 1 }),
      );
      navigation.navigate('BuyNow', { productId: product._id, quantity: 1 });
    } catch {
      Alert.alert('Error', 'Failed to proceed to checkout');
    }
  };

  const handleWhatsApp = useCallback(() => {
    const productName = encodeURIComponent(product?.name || 'your product');
    const message = encodeURIComponent(
      `Hi! I'm interested in *${product?.name || 'a product'}* (ID: ${product?.pm_id || product?._id}). Could you please provide more details?`
    );
    const url = `https://api.whatsapp.com/send/?phone=919393991563&text=${message}&type=phone_number&app_absent=0`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Could not open WhatsApp. Please make sure it is installed.')
    );
  }, [product]);

  const handleVideoConsultation = useCallback(() => {
    navigation.navigate('OnlineConsultation');
  }, [navigation]);

  const handleInquiry = useCallback(() => {
    navigation.navigate('Inquiry');
  }, [navigation]);

  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('ProductSearch', { searchQuery: searchQuery.trim() });
    }
  };

  //  Cart button content 
  const CartBtnContent = () => {
    if (addingToCart) return <ActivityIndicator color="#FF6B35" size="small" />;
    if (isInCart) {
      return (
        <>
          <MaterialIcons name="shopping-cart" size={18} color="#FFF" />
          <Text style={[styles.addToCartText, { color: '#FFF' }]}>Go to Cart</Text>
        </>
      );
    }
    return (
      <>
        <MaterialIcons name="shopping-cart" size={18} color="#FF6B35" />
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </>
    );
  };

  //  Render guards 

  if (loading) return <ProductDetailsSkeleton />;

  if (error || !product) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarBtn}>
            <MaterialIcons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={48} color="#DC2626" />
          <Text style={styles.errorText}>{error || 'Product not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/*  Top Bar  */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}
          style={styles.topBarBtn}
        >
          <MaterialIcons name="shopping-cart" size={22} color="#1F2937" />
          {/* Orange dot indicator when product is already in cart */}
          {isInCart && <View style={styles.cartDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/*  Media Carousel  */}
        {mediaItems.length > 0 && (
          <View>
            <FlatList
              ref={flatListRef}
              data={mediaItems}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => String(i)}
              onMomentumScrollEnd={e => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentIndex(idx);
              }}
              renderItem={({ item, index }) => (
                <MediaSlide item={item} isActive={index === currentIndex} />
              )}
            />

            {/* Dots */}
            {mediaItems.length > 1 && (
              <View style={styles.dotsRow}>
                {mediaItems.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      flatListRef.current?.scrollToIndex({ index: i, animated: true });
                      setCurrentIndex(i);
                    }}
                  >
                    <View
                      style={[
                        styles.dot,
                        i === currentIndex && styles.dotActive,
                        item.type === 'video' && styles.dotVideo,
                        i === currentIndex && item.type === 'video' && styles.dotVideoActive,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Counter chip */}
            <View style={styles.mediaCounter}>
              <Text style={styles.mediaCounterText}>
                {currentIndex + 1}/{mediaItems.length}
              </Text>
              {mediaItems[currentIndex]?.type === 'video' && (
                <MaterialIcons name="videocam" size={12} color="#FFF" style={{ marginLeft: 4 }} />
              )}
            </View>

            {/*  Wishlist FAB — top-left of carousel  */}
            <TouchableOpacity
              style={styles.wishlistFab}
              onPress={handleToggleWishlist}
              activeOpacity={0.85}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              disabled={wishlistUpdating}
            >
              {wishlistUpdating ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <MaterialIcons
                  name={isLiked ? 'favorite' : 'favorite-border'}
                  size={22}
                  color={isLiked ? '#EF4444' : '#6B7280'}
                />
              )}
            </TouchableOpacity>
          </View>
        )}

        {/*  Title & Pricing  */}
        <View style={styles.infoCard}>
          {/* Badges row */}
          <View style={styles.badgesRow}>
            {product.isBestProduct && (
              <View style={[styles.badge, styles.badgeBest]}>
                <MaterialIcons name="workspace-premium" size={13} color="#EA580C" />
                <Text style={[styles.badgeText, { color: '#C2410C' }]}>Best Seller</Text>
              </View>
            )}

            {product.stock_status === 'active' && (
              <View style={[styles.badge, styles.badgeInStock]}>
                <MaterialIcons name="verified" size={13} color="#059669" />
                <Text style={[styles.badgeText, { color: '#047857' }]}>In Stock</Text>
              </View>
            )}

            {discountPct && (
              <View style={[styles.badge, styles.badgeDiscount]}>
                <MaterialIcons name="local-offer" size={13} color="#059669" />
                <Text style={[styles.badgeText, { color: '#047857' }]}>{discountPct}% OFF</Text>
              </View>
            )}
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating */}
          {product.ratings != null && (
            <View style={styles.ratingRow}>
              <StarRating rating={product.ratings} />
              <Text style={styles.ratingNum}>{product.ratings}</Text>
              <Text style={styles.ratingLabel}>Ratings</Text>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceRow}>
            {product.price != null && (
              <Text style={styles.currentPrice}>{formatPrice(product.price)}</Text>
            )}
            {product.previous_price != null && product.previous_price > product.price && (
              <Text style={styles.prevPrice}>{formatPrice(product.previous_price)}</Text>
            )}
          </View>

          {/* Tax note */}
          {product.gstPercentage != null && (
            <Text style={styles.taxNote}>
              + {product.gstPercentage}% GST
              {product.extraTaxPercentage ? ` + ${product.extraTaxPercentage}% extra tax` : ''}
              {' '}applicable
            </Text>
          )}

          {/* Shipping */}
          {product.shippingType === 'extra' && product.shippingCharge != null && (
            <View style={styles.shippingRow}>
              <MaterialIcons name="local-shipping" size={13} color="#6B7280" />
              <Text style={styles.shippingText}>
                Shipping: {formatPrice(product.shippingCharge)} extra
              </Text>
            </View>
          )}
          {product.shippingType === 'free' && (
            <View style={styles.shippingRow}>
              <MaterialIcons name="local-shipping" size={13} color="#059669" />
              <Text style={[styles.shippingText, { color: '#059669' }]}>Free Shipping</Text>
            </View>
          )}

          {/* Brand */}
          {product.brandStatus && product.brand && (
            <View style={styles.brandRow}>
              <Text style={styles.brandLabel}>Brand</Text>
              <Text style={styles.brandValue}>{product.brand}</Text>
            </View>
          )}

          {/* Measurement / Size */}
          {product.measurement && (
            <View style={styles.brandRow}>
              <Text style={styles.brandLabel}>Size / Capacity</Text>
              <Text style={styles.brandValue}>{product.measurement}</Text>
            </View>
          )}

          {/* PM ID */}
          {product.pm_id && (
            <View style={styles.brandRow}>
              <Text style={styles.brandLabel}>Product ID</Text>
              <Text
                style={[
                  styles.brandValue,
                  {
                    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                    fontSize: 11,
                  },
                ]}
              >
                {product.pm_id}
              </Text>
            </View>
          )}
        </View>

        {/*  Description  */}
        {product.description && (
          <CollapsibleSection title="Description" icon="description" defaultOpen={true}>
            <Text style={styles.descText}>{product.description}</Text>
          </CollapsibleSection>
        )}

        {/*  Features  */}
        {product.features && product.features.length > 0 && (
          <CollapsibleSection title="Key Features" icon="star" defaultOpen={true}>
            {product.features.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <MaterialIcons name="check-circle" size={14} color="#004680" />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </CollapsibleSection>
        )}

        {/*  Specifications  */}
        {(product.material ||
          product.automaticGrade ||
          product.controlSystem ||
          product.energyConsumption ||
          product.productType) && (
            <CollapsibleSection title="Specifications" icon="settings" defaultOpen={false}>
              <SpecRow label="Product Type" value={product.productType} />
              <SpecRow label="Material" value={product.material} />
              <SpecRow label="Automatic Grade" value={product.automaticGrade} />
              <SpecRow label="Control System" value={product.controlSystem} />
              <SpecRow label="Energy Consumption" value={product.energyConsumption} />
            </CollapsibleSection>
          )}

        {/*  Warranty  */}
        {product.warranty && (
          <CollapsibleSection title="Warranty" icon="verified-user" defaultOpen={false}>
            <SpecRow
              label="Warranty"
              value={
                product.warranty.hasWarranty
                  ? product.warranty.warrantyDays
                  : 'No warranty'
              }
            />
          </CollapsibleSection>
        )}

        {/*  Trade Info  */}
        {product.tradeInfo && (
          <CollapsibleSection title="Trade Information" icon="business" defaultOpen={false}>
            <SpecRow label="Payment Terms" value={product.tradeInfo.paymentTerms} />
            <SpecRow label="Delivery Time" value={product.tradeInfo.deliveryTime} />
            <SpecRow label="Supply Ability" value={product.tradeInfo.supplyAbility} />
            <SpecRow label="Market" value={product.tradeInfo.mainDomesticMarket} />
            <SpecRow label="Return Policy" value={product.return_policy} />
          </CollapsibleSection>
        )}

        {/*  How to Buy  */}
        {product.howToBuy?.enabled && product.howToBuy.steps?.length > 0 && (
          <CollapsibleSection title="How to Buy" icon="shopping-bag" defaultOpen={false}>
            {product.howToBuy.steps
              .filter(s => s.isActive)
              .slice(0, product.howToBuy.showLimit || 4)
              .map(step => (
                <View key={step.stepNo} style={styles.howToBuyStep}>
                  <View style={styles.stepNumCircle}>
                    <Text style={styles.stepNumText}>{step.stepNo}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              ))}
          </CollapsibleSection>
        )}

        {/*  Category Info  */}
        {(product.category?.name || product.subCategory?.name) && (
          <CollapsibleSection title="Category" icon="category" defaultOpen={false}>
            <SpecRow label="Category" value={product.category?.name} />
            <SpecRow label="Sub Category" value={product.subCategory?.name} />
            <SpecRow label="Sub-Sub Category" value={product.subSubCategory?.name} />
          </CollapsibleSection>
        )}

        {/*  Contact / CTA Section  */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Get in Touch</Text>
          <Text style={styles.contactSubtitle}>
            Our team is ready to assist you with quotes, demos, and bulk pricing.
          </Text>

          <View style={styles.contactGrid}>
            {/* WhatsApp */}
            <TouchableOpacity
              style={[styles.contactCard, styles.contactCardWA]}
              activeOpacity={0.8}
              onPress={handleWhatsApp}
            >
              <View style={[styles.contactIconWrap, { backgroundColor: '#DCFCE7' }]}>
                <MaterialIcons name="chat" size={22} color="#16A34A" />
              </View>
              <Text style={styles.contactCardLabel}>WhatsApp</Text>
              <Text style={styles.contactCardSub}>Chat instantly</Text>
            </TouchableOpacity>

            {/* Video Consultation */}
            <TouchableOpacity
              style={[styles.contactCard, styles.contactCardVideo]}
              activeOpacity={0.8}
              onPress={handleVideoConsultation}
            >
              <View style={[styles.contactIconWrap, { backgroundColor: '#DBEAFE' }]}>
                <MaterialIcons name="videocam" size={22} color="#2563EB" />
              </View>
              <Text style={styles.contactCardLabel}>Video Call</Text>
              <Text style={styles.contactCardSub}>Live consultation</Text>
            </TouchableOpacity>

            {/* Send Inquiry */}
            <TouchableOpacity
              style={[styles.contactCard, styles.contactCardInquiry]}
              activeOpacity={0.8}
              onPress={handleInquiry}
            >
              <View style={[styles.contactIconWrap, { backgroundColor: '#FEF3C7' }]}>
                <MaterialIcons name="email" size={22} color="#D97706" />
              </View>
              <Text style={styles.contactCardLabel}>Inquiry</Text>
              <Text style={styles.contactCardSub}>Send a request</Text>
            </TouchableOpacity>

            {/* Download Quotation */}
            <TouchableOpacity
              style={[styles.contactCard, styles.contactCardQuote]}
              activeOpacity={0.8}
              onPress={() => setShowQuotationModal(true)}
            >
              <View style={[styles.contactIconWrap, { backgroundColor: '#EDE9FE' }]}>
                <MaterialIcons name="picture-as-pdf" size={22} color="#7C3AED" />
              </View>
              <Text style={styles.contactCardLabel}>Quotation</Text>
              <Text style={styles.contactCardSub}>Download PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/*  Fixed Bottom Action Bar  */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.addToCartBtn, isInCart && styles.addToCartBtnFilled]}
          onPress={handleAddToCart}
          disabled={addingToCart}
          activeOpacity={0.85}
        >
          <CartBtnContent />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowBtn}
          onPress={handleBuyNow}
          activeOpacity={0.85}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      <QuotationModal
        visible={showQuotationModal}
        onClose={() => setShowQuotationModal(false)}
        product={product}
        quantity={1}
      />
    </View>
  );
};

//  Styles 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#004680',
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },

  //  Top Bar 
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    gap: 10,
  },
  topBarBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Orange dot on cart icon when product is already in cart
  cartDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    padding: 0,
  },

  //  Media Carousel 
  mediaSlide: {
    width,
    height: width * 0.75,
    backgroundColor: '#E5E7EB',
  },
  mediaSlideInner: {
    width: '100%',
    height: '100%',
  },
  ytThumb: {
    position: 'relative',
    overflow: 'hidden',
  },
  ytPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  ytBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
  },
  ytBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#111',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    backgroundColor: '#FFF',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#004680',
    borderRadius: 3,
  },
  dotVideo: {
    backgroundColor: '#FCA5A5',
  },
  dotVideoActive: {
    backgroundColor: '#DC2626',
  },
  mediaCounter: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mediaCounterText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },

  //  Wishlist FAB 
  wishlistFab: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  //  Info Card 
  infoCard: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 5,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  badgeBest: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  badgeInStock: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  badgeDiscount: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  productName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 24,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  starsRow: { flexDirection: 'row' },
  ratingNum: { fontSize: 13, fontWeight: '700', color: '#1F2937' },
  ratingLabel: { fontSize: 12, color: '#9CA3AF' },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#004680',
  },
  prevPrice: {
    fontSize: 15,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  taxNote: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  shippingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  shippingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  brandLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  brandValue: { fontSize: 12, color: '#1F2937', fontWeight: '600' },

  //  Collapsible 
  collapsibleCard: {
    backgroundColor: '#FFF',
    marginBottom: 8,
    overflow: 'hidden',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  collapsibleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collapsibleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  collapsibleBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  descText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 21,
  },

  //  Features 
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },

  //  Spec 
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  specLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500', flex: 0.45 },
  specValue: { fontSize: 12, color: '#1F2937', fontWeight: '600', flex: 0.52, textAlign: 'right' },

  //  How to Buy 
  howToBuyStep: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  stepNumCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#004680',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  stepTitle: { fontSize: 13, fontWeight: '700', color: '#1F2937', marginBottom: 3 },
  stepDesc: { fontSize: 12, color: '#6B7280', lineHeight: 18 },

  //  Contact Section 
  contactSection: {
    backgroundColor: '#FFF',
    marginBottom: 8,
    padding: 16,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  contactCard: {
    width: (width - 42) / 2,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  contactCardWA: { borderColor: '#BBF7D0' },
  contactCardVideo: { borderColor: '#BFDBFE' },
  contactCardInquiry: { borderColor: '#FDE68A' },
  contactCardQuote: { borderColor: '#DDD6FE' },
  contactIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactCardSub: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  //  Action Bar 
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF6B35',
    backgroundColor: '#FFF',
  },
  // When product is already in cart — fill the button orange
  addToCartBtnFilled: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
  },
  buyNowBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#004680',
  },
  buyNowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
});

export default ProductDetails;

