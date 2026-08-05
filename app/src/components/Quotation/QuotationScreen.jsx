import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import QuotationPDFRN from '../../utils/QuotationPDFRN';
import { API_BASE_URL } from '../../utils/basicInfo';
import SideScreenNavbar from '../Navbar/SideScreenNavbar';
import { useAuth } from '../../context/AuthContext';
import { SUBJECT_OPTIONS } from "../../utils/constants.js"
const { width } = Dimensions.get('window');
const API_URL = API_BASE_URL;

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
const SkeletonBox = ({ width: w, height: h, style }) => {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  return (
    <Animated.View
      style={[
        { width: w, height: h, backgroundColor: '#e0e0e0', borderRadius: 8, opacity: anim },
        style,
      ]}
    />
  );
};

// ─── Colors ──────────────────────────────────────────────────────────────────
const C = {
  primary: '#004680',
  primaryDark: '#00365f',
  accent: '#f97316',
  accentGreen: '#16a34a',
  bg: '#f0f4f8',
  card: '#ffffff',
  border: '#dde3ea',
  borderFocus: '#004680',
  text: '#0f172a',
  textSub: '#64748b',
  textMuted: '#94a3b8',
  error: '#dc2626',
  success: '#16a34a',
  tag: '#e8f0f9',
  tagText: '#004680',
  disabled: '#f1f5f9',
  disabledText: '#94a3b8',
};

// ─── Chip Tab ─────────────────────────────────────────────────────────────────
const ChipTab = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// ─── Field Label ──────────────────────────────────────────────────────────────
const FieldLabel = ({ label, required }) => (
  <Text style={styles.fieldLabel}>
    {label}
    {required && <Text style={{ color: C.error }}> *</Text>}
  </Text>
);

// ─── Styled Input ─────────────────────────────────────────────────────────────
const StyledInput = ({ icon, disabled, prefilled, ...props }) => {
  const [focused, setFocused] = useState(false);
  const isDisabled = disabled || prefilled;
  return (
    <View style={[
      styles.inputWrap,
      focused && !isDisabled && styles.inputWrapFocused,
      isDisabled && styles.inputWrapDisabled,
    ]}>
      {icon && (
        <MaterialIcons
          name={icon}
          size={18}
          color={isDisabled ? C.textMuted : focused ? C.primary : C.textMuted}
          style={styles.inputIcon}
        />
      )}
      <TextInput
        style={[styles.inputText, isDisabled && styles.inputTextDisabled]}
        placeholderTextColor={C.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        editable={!isDisabled}
        {...props}
      />
      {prefilled && (
        <MaterialIcons name="lock" size={14} color={C.textMuted} />
      )}
    </View>
  );
};

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ title, icon, children, action }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionCardHeader}>
      <View style={styles.sectionCardHeaderLeft}>
        <View style={styles.sectionIconWrap}>
          <MaterialIcons name={icon} size={16} color={C.primary} />
        </View>
        <Text style={styles.sectionCardTitle}>{title}</Text>
      </View>
      {action}
    </View>
    {children}
  </View>
);

// ─── Custom Modal Dropdown ────────────────────────────────────────────────────
const CustomModalDropdown = ({ label, value, options, onSelect, disabled, isOpen, onToggle }) => {
  const getSelectedName = (items, id) => {
    if (!id || !Array.isArray(items)) return '';
    const item = items.find(i => i._id === id || i.id === id);
    return item ? item.name : '';
  };
  const selectedName = getSelectedName(options, value);
  return (
    <>
      <TouchableOpacity
        style={[styles.dropdownBtn, disabled && styles.dropdownBtnDisabled, value && styles.dropdownBtnSelected]}
        onPress={onToggle}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[styles.dropdownBtnText, value && styles.dropdownBtnTextSelected]} numberOfLines={1}>
          {selectedName || `Select ${label}`}
        </Text>
        <MaterialIcons
          name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20}
          color={disabled ? C.textMuted : C.primary}
        />
      </TouchableOpacity>

      <Modal visible={!!isOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onToggle}>
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownModalHeader}>
              <Text style={styles.dropdownModalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={onToggle}>
                <MaterialIcons name="close" size={20} color={C.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.dropdownModalDivider} />
            {options.length > 0 ? (
              <FlatList
                data={options}
                keyExtractor={opt => opt._id || opt.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.dropdownItem, item._id === value && styles.dropdownItemActive]}
                    onPress={() => { onSelect(item._id || item.id); onToggle(); }}
                  >
                    <Text style={[styles.dropdownItemText, item._id === value && styles.dropdownItemTextActive]}>
                      {item.name}
                    </Text>
                    {item._id === value && <MaterialIcons name="check" size={16} color={C.primary} />}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={styles.dropdownEmpty}>
                <MaterialIcons name="inbox" size={28} color={C.textMuted} />
                <Text style={styles.dropdownEmptyText}>No options available</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};



export const SubjectPicker = ({ value, onChange }) => (
  <View style={styles.subjectWrap}>
    {SUBJECT_OPTIONS.map(opt => (
      <TouchableOpacity
        key={opt.value}
        style={[styles.subjectPill, value === opt.value && styles.subjectPillActive]}
        onPress={() => onChange(opt.value)}
        activeOpacity={0.8}
      >
        {value === opt.value && (
          <MaterialIcons name="check-circle" size={14} color="#fff" style={{ marginRight: 4 }} />
        )}
        <Text style={[styles.subjectPillText, value === opt.value && styles.subjectPillTextActive]}>
          {opt.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Checkbox Row ─────────────────────────────────────────────────────────────
const CheckboxRow = ({ label, value, onToggle, indent }) => (
  <TouchableOpacity
    style={[styles.checkRow, indent && styles.checkRowIndent]}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <MaterialIcons
      name={value ? 'check-box' : 'check-box-outline-blank'}
      size={22}
      color={value ? C.primary : C.textMuted}
    />
    <Text style={[styles.checkLabel, { marginLeft: 10 }]}>{label}</Text>
  </TouchableOpacity>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const QuotationScreen = ({ navigation }) => {
  const { user } = useAuth();

  // Build full name from firstName + lastName
  const userFullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ')
    : '';

  const [quotationMode, setQuotationMode] = useState('detailed');
  const [formData, setFormData] = useState({
    fullName: userFullName,
    mobNumber: user?.phone || '',
    email: user?.email || '',
    city: '',
    state: '',
    subject: '',
    heading: '',
    description: '',
    referral: '',
  });

  // Sync user data into form if user loads after mount
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: [user.firstName, user.lastName].filter(Boolean).join(' '),
        mobNumber: user.phone || prev.mobNumber,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const [products, setProducts] = useState([
    { id: Date.now(), category: '', subCategory: '', subSubCategory: '', product: '', quantity: 1 },
  ]);

  const [simpleProduct, setSimpleProduct] = useState({ product: '', quantity: 1 });

  const [categories, setCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [subSubCategoriesMap, setSubSubCategoriesMap] = useState({});
  const [productsMap, setProductsMap] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedProductData, setSelectedProductData] = useState(null);

  const [initialLoading, setInitialLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [pdfSections, setPdfSections] = useState({
    customerInfo: true,
    productInfo: true,
    pricing: true,
    brandInfo: true,
    categoryInfo: true,
    materialInfo: true,
    measurementInfo: true,
    warrantyInfo: true,
  });

  const [showCategoryModal, setShowCategoryModal] = useState(null);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState({});
  const [showSubSubCategoryModal, setShowSubSubCategoryModal] = useState({});
  const [showProductModal, setShowProductModal] = useState({});

  const quotationPDF = new QuotationPDFRN();

  // ─── Data Fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (quotationMode === 'detailed') fetchCategories();
  }, [quotationMode]);

  useEffect(() => {
    if (quotationMode === 'simple') fetchAllProducts();
  }, [quotationMode]);

  useEffect(() => {
    products.forEach(product => {
      if (product.category && !subCategoriesMap[product.category]) fetchSubCategories(product.category);
      if (product.subCategory && !subSubCategoriesMap[product.subCategory]) fetchSubSubCategories(product.subCategory);
      if (product.subSubCategory && !productsMap[product.subSubCategory]) fetchProducts(product.subSubCategory);
    });
  }, [products]);

  const fetchCategories = async () => {
    try {
      setInitialLoading(true);
      const res = await fetch(`${API_URL}/categories/get-all-categories`);
      const data = await res.json();
      setCategories(data?.reverse?.() || []);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load categories' });
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchSubCategories = async categoryId => {
    try {
      const res = await fetch(`${API_URL}/sub-categories/get-sub-categories-by-category/${categoryId}`);
      const data = await res.json();
      setSubCategoriesMap(prev => ({ ...prev, [categoryId]: data?.subCategories || data || [] }));
    } catch { }
  };

  const fetchSubSubCategories = async subCategoryId => {
    try {
      const res = await fetch(`${API_URL}/sub-sub-categories/subcategory/${subCategoryId}`);
      const data = await res.json();
      setSubSubCategoriesMap(prev => ({ ...prev, [subCategoryId]: data || [] }));
    } catch { }
  };

  const fetchProducts = async subSubCategoryId => {
    try {
      const res = await fetch(`${API_URL}/products/products-by-sub-sub-category/${subSubCategoryId}`);
      const data = await res.json();
      setProductsMap(prev => ({ ...prev, [subSubCategoryId]: data || [] }));
    } catch { }
  };

  const fetchAllProducts = async () => {
    try {
      setInitialLoading(true);
      const res = await fetch(`${API_URL}/products/get-all-products`);
      const data = await res.json();
      setAllProducts(data || []);
      setFilteredProducts(data || []);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load products' });
    } finally {
      setInitialLoading(false);
    }
  };

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleInputChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleModeSwitch = mode => {
    setQuotationMode(mode);
    setProducts([{ id: Date.now(), category: '', subCategory: '', subSubCategory: '', product: '', quantity: 1 }]);
    setSimpleProduct({ product: '', quantity: 1 });
    setSearchQuery('');
    setSelectedProductName('');
    setSelectedProductData(null);
    setShowSearchResults(false);
  };

  const addProductRow = () => {
    setProducts(prev => [
      ...prev,
      { id: Date.now(), category: '', subCategory: '', subSubCategory: '', product: '', quantity: 1 },
    ]);
  };

  const removeProductRow = id => {
    if (products.length > 1) {
      setProducts(prev => prev.filter(p => p.id !== id));
      Toast.show({ type: 'success', text1: 'Product removed' });
    }
  };

  const updateProduct = (id, field, value) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };
        if (field === 'category') { updated.subCategory = ''; updated.subSubCategory = ''; updated.product = ''; }
        else if (field === 'subCategory') { updated.subSubCategory = ''; updated.product = ''; }
        else if (field === 'subSubCategory') { updated.product = ''; }
        return updated;
      }),
    );
  };

  const handleProductSearch = query => {
    setSearchQuery(query);
    if (!query.length) { setFilteredProducts(allProducts); setShowSearchResults(false); return; }
    setFilteredProducts(
      allProducts.filter(p =>
        p?.name?.toLowerCase().includes(query.toLowerCase()) ||
        p?.description?.toLowerCase().includes(query.toLowerCase()),
      ),
    );
    setShowSearchResults(true);
  };

  const handleProductSelect = product => {
    setSimpleProduct({ product: product._id, quantity: 1 });
    setSelectedProductName(product.name);
    setSelectedProductData({
      ...product,
      category: product?.category?._id || product?.category,
      subCategory: product?.subCategory?._id || product?.subCategory,
      subSubCategory: product?.subSubCategory?._id || product?.subSubCategory,
      categoryObj: product?.category,
      subCategoryObj: product?.subCategory,
      subSubCategoryObj: product?.subSubCategory,
    });
    setSearchQuery(product.name);
    setShowSearchResults(false);
    Toast.show({ type: 'success', text1: 'Product selected' });
  };

  const handleCancel = () => {
    // Reset only editable fields; keep prefilled user data
    setFormData({
      fullName: userFullName,
      mobNumber: user?.phone || '',
      email: user?.email || '',
      city: '',
      state: '',
      subject: '',
      heading: '',
      description: '',
      referral: '',
    });
    setProducts([{ id: Date.now(), category: '', subCategory: '', subSubCategory: '', product: '', quantity: 1 }]);
    setSimpleProduct({ product: '', quantity: 1 });
    setSearchQuery('');
    setSelectedProductName('');
    setSelectedProductData(null);
    setShowSearchResults(false);
    Toast.show({ type: 'success', text1: 'Form cleared' });
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.mobNumber || !formData.email || !formData.city || !formData.state) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Please fill all required customer fields' });
      return;
    }

    let quotationData, apiUrl;

    if (quotationMode === 'detailed') {
      const invalid = products.filter(p => !p.category || !p.subCategory || !p.subSubCategory || !p.product);
      if (invalid.length) {
        Toast.show({ type: 'error', text1: 'Incomplete products', text2: 'Complete all product selections' });
        return;
      }
      apiUrl = `${API_URL}/quotation/create-quotation/multiple-products`;
      quotationData = {
        ...formData,
        referral: formData.referral || undefined,
        heading: formData.heading || undefined,
        description: formData.description || undefined,
        products: products.map(p => ({
          category: p.category, subCategory: p.subCategory, subSubCategory: p.subSubCategory, product: p.product, quantity: p.quantity || 1,
        })),
      };
    } else {
      if (!simpleProduct.product || !selectedProductData) {
        Toast.show({ type: 'error', text1: 'No product', text2: 'Please select a product' });
        return;
      }
      apiUrl = `${API_URL}/quotation/create-quotation`;
      quotationData = {
        ...formData,
        referral: formData.referral || undefined,
        heading: formData.heading || undefined,
        description: formData.description || undefined,
        category: selectedProductData?.categoryObj?._id || selectedProductData?.category?._id || selectedProductData?.category,
        subCategory: selectedProductData?.subCategoryObj?._id || selectedProductData?.subCategory?._id || selectedProductData?.subCategory,
        subSubCategory: selectedProductData?.subSubCategoryObj?._id || selectedProductData?.subSubCategory?._id || selectedProductData?.subSubCategory,
        product: simpleProduct.product,
        quantity: simpleProduct.quantity || 1,
      };
    }

    try {
      setSubmitLoading(true);
      const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(quotationData) });
      const resData = await res.json();
      if (!res.ok || !resData?.success) throw new Error(resData?.message || 'Failed to create quotation');

      const qRes = await fetch(`${API_URL}/quotation/get-quotation-by-id/${resData?.data?._id}`);
      let completeData = await qRes.json();
      if (!qRes.ok || !completeData?.success) throw new Error('Failed to fetch quotation');

      if (quotationMode === 'simple' && completeData?.data) {
        const qd = completeData.data;
        if (!qd.products || !qd.products.length) {
          qd.products = [{
            product: selectedProductData,
            quantity: simpleProduct.quantity || 1,
            category: selectedProductData?.categoryObj || { _id: selectedProductData?.category, name: 'Category' },
            subCategory: selectedProductData?.subCategoryObj || { _id: selectedProductData?.subCategory, name: 'Sub Category' },
            subSubCategory: selectedProductData?.subSubCategoryObj || { _id: selectedProductData?.subSubCategory, name: 'Sub Category' },
          }];
        }
      }

      setPreviewData(completeData?.data);
      setShowPreview(true);
      Toast.show({ type: 'success', text1: 'Quotation created!' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: err?.message || 'Failed to create quotation' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      Toast.show({ type: 'info', text1: 'Generating PDF...' });
      await quotationPDF.generateAndDownloadPDF(previewData, pdfSections);
      Toast.show({ type: 'success', text1: 'PDF downloaded!' });
      setShowPreview(false);
      handleCancel();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: err?.message || 'Failed to generate PDF' });
    }
  };

  const toggleSection = section => setPdfSections(prev => ({ ...prev, [section]: !prev[section] }));

  const formatCurrency = amount => {
    if (!amount && amount !== 0) return 'INR 0.00';
    return `INR ${parseFloat(amount).toFixed(2)}`;
  };

  const calculatePricing = product => {
    const base = parseFloat(product?.price || 0);
    const gstPct = parseFloat(product?.gstPercentage || 18);
    const extraPct = parseFloat(product?.extraTaxPercentage || 0);
    const ship = parseFloat(product?.shippingCharge || 0);
    const gst = (base * gstPct) / 100;
    const extra = (base * extraPct) / 100;
    return { basePrice: base, gstAmount: gst, extraTaxAmount: extra, shippingCharge: ship, totalAmount: base + gst + extra + ship, gstPercentage: gstPct, extraTaxPercentage: extraPct };
  };

  const calculateGrandTotal = qData => {
    if (!qData?.products?.length) return 0;
    return qData.products.reduce((sum, item) => {
      const { totalAmount } = calculatePricing(item.product);
      return sum + totalAmount * (item.quantity || 1);
    }, 0);
  };

  // ─── Skeleton ────────────────────────────────────────────────────────────────
  const renderSkeleton = () => (
    <View style={{ gap: 12 }}>
      {[1, 2, 3, 4].map(i => (
        <View key={i} style={{ gap: 8 }}>
          <SkeletonBox width={120} height={12} />
          <SkeletonBox width="100%" height={44} />
        </View>
      ))}
    </View>
  );

  // ─── Preview Modal ─────────────────────────────────────────────────────────
  const renderPreviewModal = () => (
    <Modal visible={showPreview} animationType="slide" transparent onRequestClose={() => setShowPreview(false)}>
      <View style={styles.previewOverlay}>
        <View style={styles.previewSheet}>
          <View style={styles.previewHeader}>
            <View>
              <Text style={styles.previewHeaderTitle}>Quotation Preview</Text>
              {previewData?.quotationRef && (
                <Text style={styles.previewHeaderRef}>Ref: {previewData.quotationRef}</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => setShowPreview(false)} style={styles.previewClose}>
              <MaterialIcons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.accentBar} />

          <ScrollView style={styles.previewBody} showsVerticalScrollIndicator={false}>
            {pdfSections.customerInfo && previewData && (
              <View style={styles.previewCard}>
                <View style={styles.previewCardHeader}>
                  <MaterialIcons name="person" size={14} color={C.primary} />
                  <Text style={styles.previewCardTitle}>Customer Information</Text>
                </View>
                {[
                  ['Name', previewData.fullName],
                  ['Phone', previewData.mobNumber],
                  ['Email', previewData.email],
                  ['City', previewData.city],
                  ['State', previewData.state],
                  ['Quotation For', previewData.subject],
                ].filter(([, v]) => v).map(([l, v]) => (
                  <View key={l} style={styles.previewRow}>
                    <Text style={styles.previewRowLabel}>{l}</Text>
                    <Text style={styles.previewRowValue}>{v}</Text>
                  </View>
                ))}
              </View>
            )}

            {pdfSections.productInfo && previewData?.products?.map((item, idx) => (
              <View key={idx} style={styles.previewCard}>
                <View style={styles.previewCardHeader}>
                  <MaterialIcons name="inventory-2" size={14} color={C.primary} />
                  <Text style={styles.previewCardTitle}>Product {idx + 1}</Text>
                </View>
                {[
                  ['Name', item.product?.name],
                  ['Quantity', item.quantity || 1],
                  pdfSections.brandInfo ? ['Brand', item.product?.brand] : null,
                  pdfSections.categoryInfo ? ['Category', item.category?.name] : null,
                  pdfSections.categoryInfo ? ['Sub-Category', item.subCategory?.name] : null,
                  pdfSections.materialInfo ? ['Material', item.product?.material] : null,
                  pdfSections.measurementInfo ? ['Measurement', item.product?.measurement] : null,
                  pdfSections.warrantyInfo ? ['Warranty', item.product?.warranty?.warrantyDays] : null,
                ].filter(Boolean).filter(([, v]) => v).map(([l, v]) => (
                  <View key={l} style={styles.previewRow}>
                    <Text style={styles.previewRowLabel}>{l}</Text>
                    <Text style={styles.previewRowValue}>{v}</Text>
                  </View>
                ))}
                {pdfSections.pricing && (() => {
                  const p = calculatePricing(item.product);
                  return (
                    <View style={styles.pricingBlock}>
                      <View style={styles.pricingRow}>
                        <Text style={styles.pricingLabel}>Base Price</Text>
                        <Text style={styles.pricingVal}>{formatCurrency(p.basePrice)}</Text>
                      </View>
                      <View style={styles.pricingRow}>
                        <Text style={styles.pricingLabel}>GST ({p.gstPercentage}%)</Text>
                        <Text style={styles.pricingVal}>{formatCurrency(p.gstAmount)}</Text>
                      </View>
                      {p.extraTaxPercentage > 0 && (
                        <View style={styles.pricingRow}>
                          <Text style={styles.pricingLabel}>Extra Tax ({p.extraTaxPercentage}%)</Text>
                          <Text style={styles.pricingVal}>{formatCurrency(p.extraTaxAmount)}</Text>
                        </View>
                      )}
                      <View style={styles.pricingRow}>
                        <Text style={styles.pricingLabel}>Shipping</Text>
                        <Text style={styles.pricingVal}>{formatCurrency(p.shippingCharge)}</Text>
                      </View>
                      <View style={styles.pricingTotal}>
                        <Text style={styles.pricingTotalLabel}>Item Total</Text>
                        <Text style={styles.pricingTotalVal}>{formatCurrency(p.totalAmount * (item.quantity || 1))}</Text>
                      </View>
                    </View>
                  );
                })()}
              </View>
            ))}

            {pdfSections.pricing && previewData?.products?.length > 1 && (
              <View style={styles.grandTotalCard}>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalVal}>{formatCurrency(calculateGrandTotal(previewData))}</Text>
              </View>
            )}

            <View style={styles.previewCard}>
              <View style={styles.previewCardHeader}>
                <MaterialIcons name="tune" size={14} color={C.primary} />
                <Text style={styles.previewCardTitle}>Customize PDF Sections</Text>
              </View>
              <CheckboxRow label="Customer Information" value={pdfSections.customerInfo} onToggle={() => toggleSection('customerInfo')} />
              <CheckboxRow label="Product Information" value={pdfSections.productInfo} onToggle={() => toggleSection('productInfo')} />
              <CheckboxRow label="Brand Details" value={pdfSections.brandInfo} onToggle={() => toggleSection('brandInfo')} indent />
              <CheckboxRow label="Category Details" value={pdfSections.categoryInfo} onToggle={() => toggleSection('categoryInfo')} indent />
              <CheckboxRow label="Material Info" value={pdfSections.materialInfo} onToggle={() => toggleSection('materialInfo')} indent />
              <CheckboxRow label="Measurements" value={pdfSections.measurementInfo} onToggle={() => toggleSection('measurementInfo')} indent />
              <CheckboxRow label="Warranty Info" value={pdfSections.warrantyInfo} onToggle={() => toggleSection('warrantyInfo')} indent />
              <CheckboxRow label="Pricing Breakdown" value={pdfSections.pricing} onToggle={() => toggleSection('pricing')} />
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          <View style={styles.previewFooter}>
            <TouchableOpacity style={styles.previewCancelBtn} onPress={() => setShowPreview(false)}>
              <Text style={styles.previewCancelBtnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.previewDownloadBtn} onPress={handleDownloadPDF}>
              <MaterialIcons name="file-download" size={18} color="#fff" />
              <Text style={styles.previewDownloadBtnText}>Download PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ─── MAIN RENDER ─────────────────────────────────────────────────────────────
  return (
    <>
      <SideScreenNavbar pageName="Create Quotation" navigation={navigation} />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* Hero Banner */}
          <View style={styles.heroBanner}>
            <View style={styles.heroIconWrap}>
              <MaterialIcons name="description" size={26} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>
                Download free{' '}
                <Text style={styles.heroTitleAccent}>quotation</Text>
              </Text>
              <Text style={styles.heroSub}>
                Provide your details to receive a customized quotation tailored to your requirements.
              </Text>
            </View>
          </View>

          {/* Mode Toggle */}
          <View style={styles.modeSection}>
            <Text style={styles.modeSectionLabel}>Quotation Type</Text>
            <View style={styles.chipRow}>
              <ChipTab label="Detailed Selection" active={quotationMode === 'detailed'} onPress={() => handleModeSwitch('detailed')} />
              <ChipTab label="Quick Selection" active={quotationMode === 'simple'} onPress={() => handleModeSwitch('simple')} />
            </View>
          </View>

          {/* Customer Information */}
          <SectionCard title="Customer Information" icon="person">
            {/* Full Name — single column, full width */}
            <FieldLabel label="Full Name" required />
            <StyledInput
              icon="person"
              placeholder="Full name"
              value={formData.fullName}
              onChangeText={v => handleInputChange('fullName', v)}
            />

            {/* Mobile — single column, full width, prefilled & disabled */}
            <FieldLabel label="Mobile Number" required />
            <StyledInput
              icon="phone"
              placeholder="Mobile number"
              keyboardType="phone-pad"
              value={formData.mobNumber}
              onChangeText={v => {
                if (v.length <= 10) handleInputChange('mobNumber', v);
              }}
              maxLength={10}
              prefilled={!!user?.phone}
            />

            {/* Email — prefilled & disabled */}
            <FieldLabel label="Email" required />
            <StyledInput
              icon="email"
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={v => handleInputChange('email', v)}
              prefilled={!!user?.email}
            />

            {/* City & State — two columns */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldHalf}>
                <FieldLabel label="City" required />
                <StyledInput
                  icon="location-city"
                  placeholder="City"
                  value={formData.city}
                  onChangeText={v => handleInputChange('city', v)}
                />
              </View>
              <View style={styles.fieldHalf}>
                <FieldLabel label="State" required />
                <StyledInput
                  icon="map"
                  placeholder="State"
                  value={formData.state}
                  onChangeText={v => handleInputChange('state', v)}
                />
              </View>
            </View>

            <FieldLabel label="Referral" />
            <StyledInput
              icon="person-add"
              placeholder="Referral name (optional)"
              value={formData.referral}
              onChangeText={v => handleInputChange('referral', v)}
            />
          </SectionCard>

          {/* Quotation For */}
          <SectionCard title="Quotation For" icon="category">
            <Text style={styles.subjectHint}>Select the purpose of this quotation</Text>
            <SubjectPicker value={formData.subject} onChange={v => handleInputChange('subject', v)} />
          </SectionCard>

          {/* Additional Details */}
          <SectionCard title="Additional Details" icon="notes">
            <FieldLabel label="Heading" />
            <StyledInput
              icon="title"
              placeholder="Optional heading"
              value={formData.heading}
              onChangeText={v => handleInputChange('heading', v)}
              maxLength={200}
            />
            <FieldLabel label="Description" />
            <View style={[styles.inputWrap, styles.textareaWrap]}>
              <TextInput
                style={[styles.inputText, styles.textareaText]}
                placeholder="Optional description (max 1000 chars)"
                placeholderTextColor={C.textMuted}
                value={formData.description}
                onChangeText={v => handleInputChange('description', v)}
                multiline
                maxLength={1000}
                textAlignVertical="top"
              />
            </View>
            {formData.description.length > 0 && (
              <Text style={styles.charCount}>{formData.description.length}/1000</Text>
            )}
          </SectionCard>

          {/* Product Selection */}
          <SectionCard
            title="Product Selection"
            icon="inventory-2"
            action={
              quotationMode === 'detailed' ? (
                <TouchableOpacity style={styles.addBtn} onPress={addProductRow}>
                  <MaterialIcons name="add" size={16} color="#fff" />
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              ) : null
            }
          >
            {quotationMode === 'detailed' ? (
              initialLoading ? renderSkeleton() : (
                <View style={{ gap: 12 }}>
                  {products.map((product, index) => (
                    <View key={product.id} style={styles.productCard}>
                      <View style={styles.productCardHeader}>
                        <View style={styles.productBadge}>
                          <Text style={styles.productBadgeText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.productCardTitle}>Product {index + 1}</Text>
                        {products.length > 1 && (
                          <TouchableOpacity style={styles.removeBtn} onPress={() => removeProductRow(product.id)}>
                            <MaterialIcons name="delete-outline" size={18} color={C.error} />
                          </TouchableOpacity>
                        )}
                      </View>

                      <FieldLabel label="Category" />
                      <CustomModalDropdown
                        label="Category"
                        value={product.category}
                        options={categories}
                        onSelect={val => updateProduct(product.id, 'category', val)}
                        isOpen={showCategoryModal === product.id}
                        onToggle={() => setShowCategoryModal(showCategoryModal === product.id ? null : product.id)}
                      />

                      <FieldLabel label="Sub Category" />
                      <CustomModalDropdown
                        label="Sub Category"
                        value={product.subCategory}
                        options={subCategoriesMap[product.category] || []}
                        onSelect={val => updateProduct(product.id, 'subCategory', val)}
                        disabled={!product.category}
                        isOpen={!!showSubCategoryModal[product.id]}
                        onToggle={() => setShowSubCategoryModal(prev => ({ ...prev, [product.id]: !prev[product.id] }))}
                      />

                      <FieldLabel label="Tier-3 Category" />
                      <CustomModalDropdown
                        label="Tier-3 Category"
                        value={product.subSubCategory}
                        options={subSubCategoriesMap[product.subCategory] || []}
                        onSelect={val => updateProduct(product.id, 'subSubCategory', val)}
                        disabled={!product.subCategory}
                        isOpen={!!showSubSubCategoryModal[product.id]}
                        onToggle={() => setShowSubSubCategoryModal(prev => ({ ...prev, [product.id]: !prev[product.id] }))}
                      />

                      <FieldLabel label="Product" />
                      <CustomModalDropdown
                        label="Product"
                        value={product.product}
                        options={productsMap[product.subSubCategory] || []}
                        onSelect={val => updateProduct(product.id, 'product', val)}
                        disabled={!product.subSubCategory}
                        isOpen={!!showProductModal[product.id]}
                        onToggle={() => setShowProductModal(prev => ({ ...prev, [product.id]: !prev[product.id] }))}
                      />

                      <FieldLabel label="Quantity" />
                      <StyledInput
                        icon="pin"
                        placeholder="1"
                        keyboardType="number-pad"
                        value={String(product.quantity)}
                        onChangeText={v => updateProduct(product.id, 'quantity', parseInt(v) || 1)}
                      />
                    </View>
                  ))}
                </View>
              )
            ) : (
              <View>
                {initialLoading ? (
                  <View style={{ gap: 8 }}>
                    <SkeletonBox width="100%" height={44} />
                    <SkeletonBox width="70%" height={12} />
                    <SkeletonBox width="50%" height={12} />
                  </View>
                ) : (
                  <>
                    <FieldLabel label="Search Products" />
                    <StyledInput
                      icon="search"
                      placeholder="Type to search..."
                      value={searchQuery}
                      onChangeText={handleProductSearch}
                    />

                    {showSearchResults && (
                      <View style={styles.searchResults}>
                        {filteredProducts.length > 0 ? (
                          filteredProducts.slice(0, 20).map(p => (
                            <TouchableOpacity
                              key={p._id}
                              style={styles.searchResultItem}
                              onPress={() => handleProductSelect(p)}
                            >
                              <View style={{ flex: 1 }}>
                                <Text style={styles.searchResultName}>{p.name}</Text>
                                {p.description && (
                                  <Text style={styles.searchResultDesc} numberOfLines={1}>{p.description}</Text>
                                )}
                              </View>
                              {p.price ? <Text style={styles.searchResultPrice}>{formatCurrency(p.price)}</Text> : null}
                            </TouchableOpacity>
                          ))
                        ) : (
                          <View style={styles.searchEmpty}>
                            <MaterialIcons name="search-off" size={24} color={C.textMuted} />
                            <Text style={styles.searchEmptyText}>No results for "{searchQuery}"</Text>
                          </View>
                        )}
                      </View>
                    )}

                    {selectedProductName ? (
                      <View style={styles.selectedProductBadge}>
                        <MaterialIcons name="check-circle" size={18} color={C.accentGreen} />
                        <Text style={styles.selectedProductName} numberOfLines={1}>{selectedProductName}</Text>
                        <TouchableOpacity onPress={() => {
                          setSimpleProduct({ product: '', quantity: 1 });
                          setSelectedProductName('');
                          setSearchQuery('');
                        }}>
                          <MaterialIcons name="close" size={18} color={C.textSub} />
                        </TouchableOpacity>
                      </View>
                    ) : null}

                    <FieldLabel label="Quantity" />
                    <StyledInput
                      icon="pin"
                      placeholder="1"
                      keyboardType="number-pad"
                      value={String(simpleProduct.quantity)}
                      onChangeText={v => setSimpleProduct(prev => ({ ...prev, quantity: parseInt(v) || 1 }))}
                    />
                  </>
                )}
              </View>
            )}
          </SectionCard>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <MaterialIcons name="refresh" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, submitLoading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="visibility" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>Preview & Download</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {renderPreviewModal()}
        <Toast />
      </KeyboardAvoidingView>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // Hero
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: C.primary,
    borderRadius: 16,
    padding: 18,
  },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { fontSize: 17, fontWeight: '700', color: '#fff', lineHeight: 22 },
  heroTitleAccent: { color: '#f97316' },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4, lineHeight: 17 },

  // Mode
  modeSection: { marginHorizontal: 16, marginTop: 8, marginBottom: 4 },
  modeSectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.textSub,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: C.textSub },
  chipTextActive: { color: '#fff' },

  // Section Card
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionCardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: C.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCardTitle: { fontSize: 14, fontWeight: '700', color: C.text },

  // Field
  fieldLabel: { fontSize: 12, fontWeight: '600', color: C.textSub, marginBottom: 6, marginTop: 10 },
  fieldRow: { flexDirection: 'row', gap: 10 },
  fieldHalf: { flex: 1 },

  // Input
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: '#fafbfc',
  },
  inputWrapFocused: { borderColor: C.primary, backgroundColor: '#fff' },
  inputWrapDisabled: {
    backgroundColor: C.disabled,
    borderColor: '#e2e8f0',
  },
  inputIcon: { marginRight: 8 },
  inputText: { flex: 1, fontSize: 14, color: C.text },
  inputTextDisabled: { color: C.disabledText },

  // Textarea
  textareaWrap: { height: 90, alignItems: 'flex-start', paddingTop: 10 },
  textareaText: { flex: 1 },

  // Subject
  subjectHint: { fontSize: 12, color: C.textSub, marginBottom: 10 },
  subjectWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subjectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: '#fafbfc',
  },
  subjectPillActive: { backgroundColor: C.primary, borderColor: C.primary },
  subjectPillText: { fontSize: 12, fontWeight: '600', color: C.textSub },
  subjectPillTextActive: { color: '#fff' },

  // Char count
  charCount: { fontSize: 11, color: C.textMuted, textAlign: 'right', marginTop: 4 },

  // Add / Remove buttons
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.accentGreen,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  removeBtn: { marginLeft: 'auto', padding: 4 },

  // Product Card
  productCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    padding: 14,
  },
  productCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  productBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  productCardTitle: { fontSize: 13, fontWeight: '700', color: C.text, flex: 1 },

  // Dropdown
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fafbfc',
    marginBottom: 2,
  },
  dropdownBtnDisabled: { opacity: 0.45 },
  dropdownBtnSelected: { borderColor: C.primary, backgroundColor: '#f0f5fb' },
  dropdownBtnText: { fontSize: 13, color: C.textMuted, flex: 1 },
  dropdownBtnTextSelected: { color: C.text, fontWeight: '500' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: width * 0.88,
    maxHeight: '65%',
    overflow: 'hidden',
  },
  dropdownModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownModalTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  dropdownModalDivider: { height: 1, backgroundColor: C.border },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f8',
  },
  dropdownItemActive: { backgroundColor: C.tag },
  dropdownItemText: { fontSize: 14, color: C.text },
  dropdownItemTextActive: { color: C.primary, fontWeight: '600' },
  dropdownEmpty: { alignItems: 'center', paddingVertical: 28, gap: 8 },
  dropdownEmptyText: { fontSize: 13, color: C.textMuted },

  // Search
  searchResults: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 4,
    maxHeight: 260,
    backgroundColor: '#fff',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f8',
    gap: 8,
  },
  searchResultName: { fontSize: 13, fontWeight: '600', color: C.text },
  searchResultDesc: { fontSize: 11, color: C.textSub, marginTop: 2 },
  searchResultPrice: { fontSize: 12, fontWeight: '700', color: C.primary },
  searchEmpty: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  searchEmptyText: { fontSize: 12, color: C.textMuted },
  selectedProductBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#86efac',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectedProductName: { flex: 1, fontSize: 13, fontWeight: '600', color: '#166534' },

  // Action Buttons
  actionRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 16 },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#64748b',
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: C.accent,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // Checkbox
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f8',
  },
  checkRowIndent: {
    marginLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: C.border,
    paddingLeft: 10,
  },
  checkLabel: { fontSize: 13, fontWeight: '600', color: C.text },

  // Preview Modal
  previewOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  previewSheet: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 48,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: C.primary,
  },
  previewHeaderTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  previewHeaderRef: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  previewClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentBar: { height: 3, backgroundColor: C.accent },
  previewBody: { flex: 1, padding: 16 },
  previewCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  previewCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  previewCardTitle: { fontSize: 13, fontWeight: '700', color: C.primary },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#edf0f4',
  },
  previewRowLabel: { fontSize: 12, fontWeight: '600', color: C.textSub, flex: 0.42 },
  previewRowValue: { fontSize: 12, color: C.text, flex: 0.58, textAlign: 'right', fontWeight: '500' },
  pricingBlock: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  pricingLabel: { fontSize: 11, color: C.textSub },
  pricingVal: { fontSize: 11, fontWeight: '600', color: C.text },
  pricingTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1.5,
    borderTopColor: '#86efac',
  },
  pricingTotalLabel: { fontSize: 12, fontWeight: '700', color: '#166534' },
  pricingTotalVal: { fontSize: 12, fontWeight: '800', color: C.accentGreen },
  grandTotalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  grandTotalLabel: { fontSize: 14, fontWeight: '700', color: '#fff' },
  grandTotalVal: { fontSize: 16, fontWeight: '800', color: '#f97316' },
  previewFooter: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: '#f8fafc',
  },
  previewCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  previewCancelBtnText: { fontSize: 14, fontWeight: '600', color: C.textSub },
  previewDownloadBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: C.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  previewDownloadBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

export default QuotationScreen;