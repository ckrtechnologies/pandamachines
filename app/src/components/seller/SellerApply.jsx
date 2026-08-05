import { pick } from '@react-native-documents/picker';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SideScreenNavbar from '../../components/Navbar/SideScreenNavbar';
import {
  API_BASE_URL,
  REACT_APP_CLOUDINARY_NAME,
  REACT_APP_UPLOAD_PRESET,
} from '../../utils/basicInfo';

// ─── Category Skeleton ────────────────────────────────────────────────────────
const CategorySkeleton = () => {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);
  return (
    <View style={drawerStyles.skeletonGrid}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Animated.View key={i} style={[drawerStyles.skeletonItem, { opacity }]} />
      ))}
    </View>
  );
};

// ─── Categories Drawer ────────────────────────────────────────────────────────
const CategoriesDrawer = ({ visible, onClose, categories, loadingCategories, selectedCategories, onToggle, onDone, COLORS }) => {
  const translateY = useRef(new Animated.Value(500)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 500, duration: 220, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;
  const selectedCount = selectedCategories.length;

  return (
    <View style={drawerStyles.overlay}>
      <Animated.View style={[drawerStyles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[drawerStyles.sheet, { transform: [{ translateY }] }]}>
        <View style={drawerStyles.handleBar} />
        <View style={drawerStyles.sheetHeader}>
          <Text style={drawerStyles.sheetTitle}>
            Select Categories
            {selectedCount > 0 ? <Text style={{ color: COLORS.primary }}> ({selectedCount})</Text> : null}
          </Text>
          <TouchableOpacity onPress={onClose} style={drawerStyles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name="close" size={20} color="#555" />
          </TouchableOpacity>
        </View>
        <ScrollView style={drawerStyles.listScroll} contentContainerStyle={drawerStyles.listContent} showsVerticalScrollIndicator={false}>
          {loadingCategories ? <CategorySkeleton /> : categories.length === 0 ? (
            <Text style={drawerStyles.emptyText}>No categories available</Text>
          ) : categories.map(cat => {
            const isSelected = selectedCategories.includes(cat._id);
            return (
              <TouchableOpacity key={cat._id} style={[drawerStyles.catRow, isSelected && drawerStyles.catRowActive]} onPress={() => onToggle(cat._id)} activeOpacity={0.7}>
                <View style={[drawerStyles.catCheckbox, isSelected && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}>
                  {isSelected && <MaterialIcons name="check" size={14} color="#fff" />}
                </View>
                <Text style={[drawerStyles.catLabel, isSelected && { color: COLORS.primary, fontWeight: '600' }]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={drawerStyles.sheetFooter}>
          <TouchableOpacity style={drawerStyles.cancelBtn} onPress={onClose}>
            <Text style={drawerStyles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[drawerStyles.doneBtn, { backgroundColor: COLORS.primary }]} onPress={onDone}>
            <Text style={drawerStyles.doneBtnText}>Done{selectedCount > 0 ? ` (${selectedCount})` : ''}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

// ─── Image Upload with Preview ────────────────────────────────────────────────
const ImageUploadField = ({ label, required, fieldName, fileData, uploading, onPick, onRemove, error, COLORS }) => {
  return (
    <View style={styles.fileUploadContainer}>
      <Text style={styles.label}>
        {label}{required && <Text style={{ color: COLORS.danger }}> *</Text>}
      </Text>

      {uploading ? (
        // Loading state — preview placeholder with spinner overlay
        <View style={styles.imagePreviewBox}>
          <View style={styles.imagePreviewLoading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.uploadingText}>Uploading...</Text>
          </View>
        </View>
      ) : fileData?.uri ? (
        // Preview state
        <View style={styles.imagePreviewBox}>
          <Image source={{ uri: fileData.uri }} style={styles.imagePreview} resizeMode="cover" />
          <View style={styles.imagePreviewOverlay}>
            <TouchableOpacity style={styles.imagePreviewRemoveBtn} onPress={onRemove}>
              <MaterialIcons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.imagePreviewBadge}>
            <MaterialIcons name="check-circle" size={14} color={COLORS.success} />
            <Text style={styles.imagePreviewBadgeText} numberOfLines={1}>{fileData.name?.substring(0, 18)}...</Text>
          </View>
        </View>
      ) : (
        // Empty state
        <TouchableOpacity style={[styles.uploadButton, error && { borderColor: COLORS.danger }]} onPress={onPick}>
          <MaterialIcons name="cloud-upload" size={20} color={COLORS.gray} style={{ marginRight: 8 }} />
          <Text style={styles.uploadText}>Upload {label}</Text>
        </TouchableOpacity>
      )}

      {error && !fileData && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// ─── Doc Upload Field (non-image) ─────────────────────────────────────────────
const DocUploadField = ({ label, required, fieldName, fileData, uploading, onPick, onRemove, error, COLORS }) => (
  <View style={styles.fileUploadContainer}>
    <Text style={styles.label}>
      {label}{required && <Text style={{ color: COLORS.danger }}> *</Text>}
    </Text>
    <TouchableOpacity
      style={[styles.uploadButton, fileData && { backgroundColor: COLORS.lightBg }, uploading && { opacity: 0.6 }, error && !fileData && { borderColor: COLORS.danger }]}
      onPress={onPick}
      disabled={uploading}
    >
      {uploading ? (
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 8 }} />
      ) : (
        <MaterialIcons name={fileData ? 'check-circle' : 'cloud-upload'} size={20} color={fileData ? COLORS.success : COLORS.gray} style={{ marginRight: 8 }} />
      )}
      <Text style={styles.uploadText}>
        {uploading ? 'Uploading...' : fileData ? `✓ ${fileData.name?.substring(0, 22)}...` : `Upload ${label}`}
      </Text>
    </TouchableOpacity>
    {error && !fileData && <Text style={styles.errorText}>{error}</Text>}
    {fileData && (
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const SellerApply = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    mobNo: '',
    emailId: '',
    gender: 'Male',
    address: '',
    businessName: '',
    gstIn: '',
    panNo: '',
    commission: '',
    bulkOrderCommission: '',
    shopImage: null,
    businessRegistrationName: '',
    gstCertificate: null,
    ownerIdProof: null,
    showroomPhoto: null,
    otherDocuments: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPickerField, setCurrentPickerField] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [tempSelected, setTempSelected] = useState([]);

  const COLORS = {
    primary: '#00569e',
    secondary: '#004680',
    tertiary: '#2a6e8e',
    success: '#8cc441',
    warning: '#FF8617',
    danger: '#ff4444',
    lightBg: '#f5f5f5',
    white: '#ffffff',
    gray: '#666666',
    lightGray: '#cccccc',
    borderGray: '#e0e0e0',
  };

  const steps = [
    { step: 1, label: 'Basic' },
    { step: 2, label: 'Business' },
    { step: 3, label: 'Documents' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch(`${API_BASE_URL}/categories/get-all-categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to fetch categories:', e);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // ── Readiness checks for disabling Continue ──
  const isStep1Ready = () =>
    formData.fullName.trim() &&
    /^\d{10}$/.test(formData.mobNo) &&
    /\S+@\S+\.\S+/.test(formData.emailId) &&
    formData.address.trim();

  const isStep2Ready = () =>
    formData.businessName.trim() &&
    selectedCategories.length > 0 &&
    formData.gstIn.trim() &&
    formData.panNo.trim() &&
    formData.commission &&
    formData.shopImage;

  const isStep3Ready = () =>
    formData.gstCertificate &&
    formData.ownerIdProof &&
    formData.showroomPhoto &&
    termsAccepted;

  const openDrawer = () => { setTempSelected([...selectedCategories]); setDrawerVisible(true); };
  const closeDrawer = () => setDrawerVisible(false);
  const handleToggleTemp = useCallback((id) => {
    setTempSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);
  const handleDone = () => {
    setSelectedCategories(tempSelected);
    if (errors.categories) setErrors(prev => ({ ...prev, categories: '' }));
    setDrawerVisible(false);
  };

  const getSelectedCategoryNames = () =>
    categories.filter(c => selectedCategories.includes(c._id)).map(c => c.name).join(', ');

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const uploadToCloudinary = async (file, fieldName) => {
    if (!file || !file.uri) return null;
    setUploadingFiles(prev => ({ ...prev, [fieldName]: true }));
    const uploadFormData = new FormData();
    uploadFormData.append('file', { uri: file.uri, type: file.type || 'image/jpeg', name: file.name || `file_${Date.now()}` });
    uploadFormData.append('upload_preset', REACT_APP_UPLOAD_PRESET);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${REACT_APP_CLOUDINARY_NAME}/image/upload`, { method: 'POST', body: uploadFormData });
      const data = await response.json();
      if (data.secure_url) return data.secure_url;
      Alert.alert('Upload Error', `Failed to upload ${fieldName}.`);
      return null;
    } catch (error) {
      Alert.alert('Upload Error', `Network error uploading ${fieldName}`);
      return null;
    } finally {
      setUploadingFiles(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const validateBasicDetails = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.mobNo.trim()) newErrors.mobNo = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobNo)) newErrors.mobNo = 'Enter valid 10-digit mobile number';
    if (!formData.emailId.trim()) newErrors.emailId = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.emailId)) newErrors.emailId = 'Enter valid email';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBusinessDetails = () => {
    const newErrors = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (selectedCategories.length === 0) newErrors.categories = 'Please select at least one category';
    if (!formData.gstIn.trim()) newErrors.gstIn = 'GSTIN is required';
    if (!formData.panNo.trim()) newErrors.panNo = 'PAN number is required';
    if (!formData.commission) newErrors.commission = 'Commission is required';
    else if (![10, 15, 20, 30, 40].includes(Number(formData.commission))) newErrors.commission = 'Please select a valid commission percentage';
    if (formData.bulkOrderCommission && (Number(formData.bulkOrderCommission) < 0 || Number(formData.bulkOrderCommission) > 50))
      newErrors.bulkOrderCommission = 'Bulk order commission must be between 0 and 50';
    if (!formData.shopImage) newErrors.shopImage = 'Shop image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDocuments = () => {
    const newErrors = {};
    if (!formData.gstCertificate) newErrors.gstCertificate = 'GST certificate is required';
    if (!formData.ownerIdProof) newErrors.ownerIdProof = 'Owner ID proof is required';
    if (!formData.showroomPhoto) newErrors.showroomPhoto = 'Showroom photo is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (currentStep === 1 && validateBasicDetails()) setCurrentStep(2);
    else if (currentStep === 2 && validateBusinessDetails()) setCurrentStep(3);
  };

  // Gallery pick — sets local URI immediately for preview, upload happens on submit
  const handleGalleryPick = (fieldName) => {
    setCurrentPickerField(fieldName);
    launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 1 }, response => {
      if (response.didCancel || response.errorCode) return;
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setFormData(prev => ({
          ...prev,
          [fieldName]: {
            name: asset.fileName || `image_${Date.now()}.jpg`,
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
          },
        }));
        if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: '' }));
      }
    });
  };

  const handleDocumentPick = async () => {
    try {
      const result = await pick({ allowMultiple: false });
      if (result && result[0]) {
        const doc = result[0];
        setFormData(prev => ({
          ...prev,
          otherDocuments: [...prev.otherDocuments, { name: doc.name || `document_${Date.now()}`, uri: doc.uri, type: doc.mimeType || 'application/octet-stream' }],
        }));
      }
    } catch (e) { }
  };

  const pickDocumentByField = async fieldType => {
    try {
      const result = await pick({ allowMultiple: false });
      if (result && result[0]) {
        const doc = result[0];
        setFormData(prev => ({ ...prev, [fieldType]: { name: doc.name || `document_${Date.now()}`, uri: doc.uri, type: doc.mimeType || 'application/octet-stream' } }));
        if (errors[fieldType]) setErrors(prev => ({ ...prev, [fieldType]: '' }));
      }
    } catch (e) { }
  };

  const removeDocument = fieldName => setFormData(prev => ({ ...prev, [fieldName]: null }));
  const removeOtherDocument = index => setFormData(prev => ({ ...prev, otherDocuments: prev.otherDocuments.filter((_, i) => i !== index) }));

  const handleSubmit = async () => {
    if (!validateDocuments()) {
      Alert.alert('Missing Documents', 'Please upload all required documents');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Terms Required', 'Please accept Terms and Conditions to proceed');
      return;
    }
    setIsSubmitting(true);
    try {
      const [shopImageUrl, gstCertificateUrl, ownerIdProofUrl, showroomPhotoUrl] = await Promise.all([
        formData.shopImage ? uploadToCloudinary(formData.shopImage, 'shopImage') : Promise.resolve(null),
        formData.gstCertificate ? uploadToCloudinary(formData.gstCertificate, 'gstCertificate') : Promise.resolve(null),
        formData.ownerIdProof ? uploadToCloudinary(formData.ownerIdProof, 'ownerIdProof') : Promise.resolve(null),
        formData.showroomPhoto ? uploadToCloudinary(formData.showroomPhoto, 'showroomPhoto') : Promise.resolve(null),
      ]);

      if (!shopImageUrl || !gstCertificateUrl || !ownerIdProofUrl || !showroomPhotoUrl) {
        Alert.alert('Upload Failed', 'One or more files failed to upload. Please try again.');
        setIsSubmitting(false);
        return;
      }

      let otherDocumentsUrls = [];
      if (formData.otherDocuments.length > 0) {
        const uploadPromises = formData.otherDocuments.map((doc, i) => uploadToCloudinary(doc, `otherDoc_${i}`));
        otherDocumentsUrls = (await Promise.all(uploadPromises)).filter(Boolean);
      }

      const businessTypeData = { categories: selectedCategories, hasOther: false, otherType: '' };

      const payload = {
        fullName: formData.fullName,
        mobNo: formData.mobNo,
        emailId: formData.emailId,
        gender: formData.gender,
        address: formData.address,
        businessName: formData.businessName,
        businessType: businessTypeData,
        businessRegistrationName: formData.businessRegistrationName,
        panNo: formData.panNo,
        commission: Number(formData.commission),
        bulkOrderCommission: Number(formData.bulkOrderCommission) || 0,
        gstIn: formData.gstIn,
        shopImage: shopImageUrl,
        ownerIdProof: ownerIdProofUrl,
        gstCertificate: gstCertificateUrl,
        showroomPhoto: showroomPhotoUrl,
        otherDocuments: otherDocumentsUrls,
      };

      const response = await fetch(`${API_BASE_URL}/supplier/suppliers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setCurrentStep(4);
        Alert.alert('Success', 'Registration submitted. Wait for approval');
      } else {
        const errorData = await response.json();
        Alert.alert('Registration Failed', errorData.message || 'An error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Compact Step Indicator ──
  const StepIndicator = () => (
    <View style={styles.stepContainer}>
      {steps.map((stepItem, index) => {
        const isDone = currentStep > stepItem.step;
        const isActive = currentStep === stepItem.step;
        return (
          <React.Fragment key={stepItem.step}>
            <View style={styles.stepItem}>
              <View style={[
                styles.stepPill,
                isActive && styles.stepPillActive,
                isDone && styles.stepPillDone,
              ]}>
                {isDone
                  ? <MaterialIcons name="check" size={12} color="#fff" />
                  : <Text style={[styles.stepNum, isActive && { color: '#fff' }, !isActive && !isDone && { color: COLORS.gray }]}>{stepItem.step}</Text>
                }
              </View>
              <Text style={[styles.stepLabel, isActive && { color: COLORS.primary, fontWeight: '600' }, isDone && { color: COLORS.warning }]}>
                {stepItem.label}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[styles.stepLine, isDone && { backgroundColor: COLORS.warning }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );

  const categoriesLabel = selectedCategories.length > 0 ? getSelectedCategoryNames() : 'Select Categories';

  const anyUploading = Object.values(uploadingFiles).some(Boolean);

  return (
    <SafeAreaView style={styles.container}>
      <SideScreenNavbar pageName="Seller Registration" navigation={navigation} />
      <StepIndicator />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* ── Step 1: Basic Details ── */}
          {currentStep === 1 && (
            <View style={styles.stepContent}>
              <TextInput style={[styles.input, errors.fullName && styles.inputError]} placeholder="Contact Person Name *" value={formData.fullName} onChangeText={v => handleInputChange('fullName', v)} placeholderTextColor={COLORS.lightGray} />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

              <TextInput style={[styles.input, errors.mobNo && styles.inputError]} placeholder="Mobile Number *" keyboardType="numeric" value={formData.mobNo} onChangeText={v => handleInputChange('mobNo', v)} maxLength={10} placeholderTextColor={COLORS.lightGray} />
              {errors.mobNo && <Text style={styles.errorText}>{errors.mobNo}</Text>}

              <TextInput style={[styles.input, errors.emailId && styles.inputError]} placeholder="Email Address *" keyboardType="email-address" value={formData.emailId} onChangeText={v => handleInputChange('emailId', v)} placeholderTextColor={COLORS.lightGray} />
              {errors.emailId && <Text style={styles.errorText}>{errors.emailId}</Text>}

              <View style={styles.genderContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.radioGroup}>
                  {['Male', 'Female'].map(g => (
                    <TouchableOpacity key={g} style={styles.radioOption} onPress={() => handleInputChange('gender', g)}>
                      <View style={[styles.radioButton, formData.gender === g && styles.radioButtonSelected]}>
                        {formData.gender === g && <View style={styles.radioButtonInner} />}
                      </View>
                      <Text style={styles.radioText}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TextInput style={[styles.textArea, errors.address && styles.inputError]} placeholder="Complete Address *" value={formData.address} onChangeText={v => handleInputChange('address', v)} multiline numberOfLines={3} placeholderTextColor={COLORS.lightGray} />
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </View>
          )}

          {/* ── Step 2: Business Details ── */}
          {currentStep === 2 && (
            <View style={styles.stepContent}>
              <TextInput style={[styles.input, errors.businessName && styles.inputError]} placeholder="Business Name *" value={formData.businessName} onChangeText={v => handleInputChange('businessName', v)} placeholderTextColor={COLORS.lightGray} />
              {errors.businessName && <Text style={styles.errorText}>{errors.businessName}</Text>}

              {/* Categories */}
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Categories <Text style={{ color: COLORS.danger }}>*</Text></Text>
                <TouchableOpacity
                  style={[styles.categoriesInput, errors.categories && { borderColor: COLORS.danger }, selectedCategories.length > 0 && { borderColor: COLORS.primary }]}
                  onPress={openDrawer}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoriesInputText, selectedCategories.length === 0 && { color: COLORS.lightGray }]} numberOfLines={2}>
                    {categoriesLabel}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={22} color={selectedCategories.length > 0 ? COLORS.primary : COLORS.gray} />
                </TouchableOpacity>
                {selectedCategories.length > 0 && (
                  <View style={styles.selectedTagsRow}>
                    {categories.filter(c => selectedCategories.includes(c._id)).map(c => (
                      <View key={c._id} style={[styles.tag, { backgroundColor: COLORS.primary + '14', borderColor: COLORS.primary + '44' }]}>
                        <Text style={[styles.tagText, { color: COLORS.primary }]}>{c.name}</Text>
                        <TouchableOpacity onPress={() => setSelectedCategories(prev => prev.filter(id => id !== c._id))} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                          <MaterialIcons name="close" size={13} color={COLORS.primary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                {errors.categories && <Text style={styles.errorText}>{errors.categories}</Text>}
              </View>

              {/* Commission */}
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Commission Percentage <Text style={{ color: COLORS.danger }}>*</Text></Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.commissionScroll}>
                  {[10, 15, 20, 30, 40].map(value => (
                    <TouchableOpacity key={value} style={[styles.commissionButton, formData.commission === String(value) && styles.commissionButtonActive]} onPress={() => handleInputChange('commission', String(value))}>
                      <Text style={[styles.commissionButtonText, formData.commission === String(value) && styles.commissionButtonTextActive]}>{value}%</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {errors.commission && <Text style={styles.errorText}>{errors.commission}</Text>}
                <Text style={styles.helperText}>Higher commission rates increase your product visibility</Text>
              </View>

              {/* Bulk Commission */}
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Bulk Order Commission (Optional)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.commissionScroll}>
                  {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(value => (
                    <TouchableOpacity key={value} style={[styles.commissionButton, formData.bulkOrderCommission === String(value) && styles.commissionButtonActive]} onPress={() => handleInputChange('bulkOrderCommission', String(value))}>
                      <Text style={[styles.commissionButtonText, formData.bulkOrderCommission === String(value) && styles.commissionButtonTextActive]}>{value}%</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {errors.bulkOrderCommission && <Text style={styles.errorText}>{errors.bulkOrderCommission}</Text>}
                <Text style={styles.helperText}>Extra commission on bulk orders. Optional.</Text>
              </View>

              {/* GST with label */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>GST Number <Text style={{ color: COLORS.danger }}>*</Text></Text>
                <TextInput
                  style={[styles.input, { marginBottom: 0 }, errors.gstIn && styles.inputError]}
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  value={formData.gstIn}
                  onChangeText={v => handleInputChange('gstIn', v.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  maxLength={15}
                  placeholderTextColor={COLORS.lightGray}
                />
                {errors.gstIn && <Text style={styles.errorText}>{errors.gstIn}</Text>}
              </View>

              {/* PAN with label */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>PAN Number <Text style={{ color: COLORS.danger }}>*</Text></Text>
                <TextInput
                  style={[styles.input, { marginBottom: 0 }, errors.panNo && styles.inputError]}
                  placeholder="e.g. ABCDE1234F"
                  value={formData.panNo}
                  onChangeText={v => handleInputChange('panNo', v.toUpperCase().slice(0, 10))}
                  maxLength={10}
                  placeholderTextColor={COLORS.lightGray}
                />
                {errors.panNo && <Text style={styles.errorText}>{errors.panNo}</Text>}
              </View>

              {/* Shop Image with preview */}
              <ImageUploadField
                label="Shop Image"
                required
                fieldName="shopImage"
                fileData={formData.shopImage}
                uploading={uploadingFiles.shopImage}
                onPick={() => handleGalleryPick('shopImage')}
                onRemove={() => removeDocument('shopImage')}
                error={errors.shopImage}
                COLORS={COLORS}
              />
            </View>
          )}

          {/* ── Step 3: Documents ── */}
          {currentStep === 3 && (
            <View style={styles.stepContent}>
              <TextInput style={styles.input} placeholder="Business Registration Name" value={formData.businessRegistrationName} onChangeText={v => handleInputChange('businessRegistrationName', v)} placeholderTextColor={COLORS.lightGray} />

              <DocUploadField label="GST Certificate" required fieldName="gstCertificate" fileData={formData.gstCertificate} uploading={uploadingFiles.gstCertificate} onPick={() => pickDocumentByField('gstCertificate')} onRemove={() => removeDocument('gstCertificate')} error={errors.gstCertificate} COLORS={COLORS} />

              <DocUploadField label="Owner ID Proof" required fieldName="ownerIdProof" fileData={formData.ownerIdProof} uploading={uploadingFiles.ownerIdProof} onPick={() => pickDocumentByField('ownerIdProof')} onRemove={() => removeDocument('ownerIdProof')} error={errors.ownerIdProof} COLORS={COLORS} />

              <ImageUploadField
                label="Showroom Photo"
                required
                fieldName="showroomPhoto"
                fileData={formData.showroomPhoto}
                uploading={uploadingFiles.showroomPhoto}
                onPick={() => handleGalleryPick('showroomPhoto')}
                onRemove={() => removeDocument('showroomPhoto')}
                error={errors.showroomPhoto}
                COLORS={COLORS}
              />

              {/* Other Docs */}
              <View style={styles.fileUploadContainer}>
                <Text style={styles.label}>Other Documents (Optional)</Text>
                {formData.otherDocuments.length > 0 && (
                  <View style={styles.documentsList}>
                    {formData.otherDocuments.map((doc, index) => (
                      <View key={index} style={styles.documentItem}>
                        <MaterialIcons name="description" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                        <Text style={styles.documentName} numberOfLines={1}>{doc.name}</Text>
                        <TouchableOpacity onPress={() => removeOtherDocument(index)} style={styles.removeDocButton}>
                          <Text style={styles.removeDocText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentPick}>
                  <MaterialIcons name="add-circle" size={20} color={COLORS.gray} style={{ marginRight: 8 }} />
                  <Text style={styles.uploadText}>Upload Additional Documents</Text>
                </TouchableOpacity>
              </View>

              {/* Terms */}
              <View style={styles.termsContainer}>
                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setTermsAccepted(!termsAccepted)}>
                  <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                    {termsAccepted && <MaterialIcons name="check" size={16} color={COLORS.white} />}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the <Text style={styles.termsLink}>Terms and Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Step 4: Success ── */}
          {currentStep === 4 && (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.successIconText}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Registration Submitted!</Text>
              <Text style={styles.successMessage}>
                Your registration has been submitted and is under review. You will be notified once approved.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* ── Footer Buttons ── */}
        {currentStep < 4 && (
          <View style={styles.footer}>
            {currentStep === 1 && (
              <>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.continueButton, !isStep1Ready() && styles.buttonDisabled]}
                  onPress={handleContinue}
                  disabled={!isStep1Ready()}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
              </>
            )}
            {currentStep > 1 && currentStep < 4 && (
              <>
                <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(currentStep - 1)}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                {currentStep === 3 ? (
                  <TouchableOpacity
                    style={[styles.submitButton, (!isStep3Ready() || isSubmitting || anyUploading) && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={!isStep3Ready() || isSubmitting || anyUploading}
                  >
                    {isSubmitting ? <ActivityIndicator size="small" color={COLORS.white} /> : <Text style={styles.submitButtonText}>Submit Registration</Text>}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.continueButton, !isStep2Ready() && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!isStep2Ready()}
                  >
                    <Text style={styles.continueButtonText}>Continue</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}

        {currentStep === 4 && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.continueButton} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}>
              <Text style={styles.continueButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      <CategoriesDrawer
        visible={drawerVisible}
        onClose={closeDrawer}
        categories={categories}
        loadingCategories={loadingCategories}
        selectedCategories={tempSelected}
        onToggle={handleToggleTemp}
        onDone={handleDone}
        COLORS={COLORS}
      />
    </SafeAreaView>
  );
};

// ─── Drawer Styles ────────────────────────────────────────────────────────────
const drawerStyles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 999, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 480, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 20 },
  handleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ddd', alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  closeBtn: { padding: 4 },
  listScroll: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingVertical: 8 },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  catRowActive: { backgroundColor: '#f0f6ff', borderRadius: 8, marginHorizontal: -4, paddingHorizontal: 8 },
  catCheckbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  catLabel: { fontSize: 14, color: '#333', flex: 1 },
  skeletonGrid: { marginTop: 8 },
  skeletonItem: { height: 44, borderRadius: 8, backgroundColor: '#e8e8e8', marginBottom: 10 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 32, fontSize: 14 },
  sheetFooter: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 14, paddingBottom: 28, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fff' },
  cancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#555' },
  doneBtn: { flex: 2, paddingVertical: 13, borderRadius: 10, alignItems: 'center' },
  doneBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

// ─── Main Styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  // ── Compact step indicator ──
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepPillActive: {
    backgroundColor: '#00569e',
  },
  stepPillDone: {
    backgroundColor: '#FF8617',
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 6,
  },

  content: { flex: 1, paddingHorizontal: 16 },
  stepContent: { paddingVertical: 20 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 12, fontSize: 14, color: '#000000' },
  inputError: { borderColor: '#ff4444' },
  textArea: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 12, fontSize: 14, color: '#000000', textAlignVertical: 'top', minHeight: 100 },
  errorText: { color: '#ff4444', fontSize: 12, marginBottom: 8, marginTop: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 8 },
  fieldGroup: { marginBottom: 12 },
  genderContainer: { marginBottom: 12 },
  radioGroup: { flexDirection: 'row', marginBottom: 12 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#e0e0e0', marginRight: 8, justifyContent: 'center', alignItems: 'center' },
  radioButtonSelected: { borderColor: '#00569e' },
  radioButtonInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00569e' },
  radioText: { fontSize: 14, color: '#000000' },
  pickerContainer: { marginBottom: 12 },
  commissionScroll: { marginBottom: 8 },
  commissionButton: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, marginRight: 8, backgroundColor: '#ffffff' },
  commissionButtonActive: { backgroundColor: '#00569e', borderColor: '#00569e' },
  commissionButtonText: { fontSize: 12, fontWeight: '600', color: '#666666' },
  commissionButtonTextActive: { color: '#ffffff' },
  helperText: { fontSize: 12, color: '#666666', marginTop: 8 },
  fileUploadContainer: { marginBottom: 16 },
  uploadButton: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#e0e0e0', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  uploadText: { fontSize: 14, color: '#666666', fontWeight: '500' },
  removeButton: { marginTop: 8, paddingVertical: 6, alignItems: 'center' },
  removeText: { color: '#ff4444', fontSize: 12, fontWeight: '500' },

  // Image preview
  imagePreviewBox: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 160,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePreviewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  uploadingText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  imagePreviewOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  imagePreviewRemoveBtn: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  imagePreviewBadgeText: {
    fontSize: 11,
    color: '#fff',
    flex: 1,
  },

  documentsList: { marginBottom: 12 },
  documentItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  documentName: { fontSize: 12, color: '#000000', fontWeight: '500', flex: 1 },
  removeDocButton: { paddingHorizontal: 8, paddingVertical: 4 },
  removeDocText: { color: '#ff4444', fontSize: 18, fontWeight: '600' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 40 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff3e0', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  successIconText: { fontSize: 40, color: '#FF8617', fontWeight: '600' },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#000000', marginBottom: 12, textAlign: 'center' },
  successMessage: { fontSize: 14, color: '#666666', textAlign: 'center', marginBottom: 32, lineHeight: 20 },

  footer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 48, gap: 12 },
  cancelButton: { flex: 1, borderWidth: 1, borderColor: '#e0e0e0', paddingVertical: 14, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: '#666666' },
  backButton: { flex: 1, borderWidth: 1, borderColor: '#e0e0e0', paddingVertical: 14, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  backButtonText: { fontSize: 14, fontWeight: '600', color: '#666666' },
  continueButton: { flex: 1, backgroundColor: '#004680', paddingVertical: 14, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  continueButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
  submitButton: { flex: 1, backgroundColor: '#004680', paddingVertical: 14, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  buttonDisabled: { backgroundColor: '#b0bec5', opacity: 0.7 },

  termsContainer: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  checkboxChecked: { backgroundColor: '#00569e', borderColor: '#00569e' },
  termsText: { fontSize: 13, color: '#666666', flex: 1, lineHeight: 20 },
  termsLink: { color: '#00569e', fontWeight: '600' },

  categoriesInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 8, backgroundColor: '#fff' },
  categoriesInputText: { flex: 1, fontSize: 14, color: '#000' },
  selectedTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
  tag: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, gap: 4 },
  tagText: { fontSize: 12, fontWeight: '500' },
});

export default SellerApply;