import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/basicInfo';
import QuotationPDFRN from '../../utils/QuotationPDFRN';
import { SUBJECT_OPTIONS } from '../../utils/constants';

// ─── Subject Picker (Pill Style) ─────────────────────────────────────────────
const SubjectSelector = ({ value, onChange }) => (
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

// ─── Checkbox Row ────────────────────────────────────────────────────────────
const CheckboxRow = ({ label, checked, onToggle, indent }) => (
  <TouchableOpacity
    style={[styles.checkboxRow, indent && styles.checkboxRowIndent]}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <MaterialIcons
      name={checked ? 'check-box' : 'check-box-outline-blank'}
      size={22}
      color={checked ? '#004680' : '#999'}
    />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

// ─── Preview Row ─────────────────────────────────────────────────────────────
const PreviewRow = ({ label, value, isBold, isTotal }) => (
  <View style={[styles.previewRow, isTotal && styles.totalRow]}>
    <Text style={[styles.previewLabel, isBold && styles.boldText]}>{label}</Text>
    <Text style={[styles.previewValue, isBold && styles.boldText, isTotal && styles.totalValue]}>
      {value}
    </Text>
  </View>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const QuotationModal = ({ visible, onClose, product, quantity }) => {
  const [step, setStep] = useState('form'); // form | preview
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const { user, isLoggedIn } = useAuth();

  const getInitialFormData = () => ({
    fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    mobNumber: user?.phone || '',
    email: user?.email || '',
    city: '',
    state: '',
    subject: '',
    heading: '',
    description: '',
    referral: '',
  });

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

  const [formData, setFormData] = useState(getInitialFormData);

  // Sync user data when modal opens
  useEffect(() => {
    if (visible && user) {
      setFormData(prev => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        mobNumber: user.phone || '',
        email: user.email || '',
      }));
    }
  }, [visible, user]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionToggle = section => {
    setPdfSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Almost There!', 'Please enter your full name');
      return false;
    }
    if (!formData.mobNumber.trim()) {
      Alert.alert('Almost There!', 'Please enter your mobile number');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Almost There!', 'Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Alert.alert('Almost There!', 'Please enter a valid email');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Almost There!', 'Please enter your city');
      return false;
    }
    if (!formData.state.trim()) {
      Alert.alert('Almost There!', 'Please enter your state');
      return false;
    }
    return true;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const quotationPayload = {
        fullName: formData.fullName,
        mobNumber: formData.mobNumber,
        email: formData.email,
        city: formData.city,
        state: formData.state,
        subject: formData.subject,
        heading: formData.heading,          // <-- new
        description: formData.description,  // <-- new
        referral: formData.referral,
        product: product._id,
        quantity: quantity || 1,
        category: product.category?._id,
        subCategory: product.subCategory?._id,
        subSubCategory: product.subSubCategory?._id,
      };

      const response = await axios.post(
        `${API_BASE_URL}/quotation/create-quotation`,
        quotationPayload,
      );

      if (response.data.success) {
        const quotationId = response.data.data._id;
        const quotResponse = await axios.get(
          `${API_BASE_URL}/quotation/get-quotation-by-id/${quotationId}`,
        );
        if (quotResponse.data.success) {
          setPreviewData(quotResponse.data.data);
          setStep('preview');
        }
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create quotation');
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
      Alert.alert('Error', error.message || 'Failed to create quotation');
    } finally {
      setLoading(false);
    }
  };

  // ─── Pricing Helpers ───────────────────────────────────────────────────────
  const formatCurrency = amount => {
    if (!amount && amount !== 0) return 'INR 0.00';
    return `INR ${parseFloat(amount).toFixed(2)}`;
  };

  const calculatePricing = product => {
    const basePrice = parseFloat(product?.price || 0);
    const gstPercentage = parseFloat(product?.gstPercentage || 18);
    const extraTaxPercentage = parseFloat(product?.extraTaxPercentage || 0);
    const shippingCharge = parseFloat(product?.shippingCharge || 0);

    const gstAmount = (basePrice * gstPercentage) / 100;
    const extraTaxAmount = (basePrice * extraTaxPercentage) / 100;
    const priceWithTaxes = basePrice + gstAmount + extraTaxAmount;
    const totalAmount = priceWithTaxes + shippingCharge;

    return {
      basePrice,
      gstAmount,
      extraTaxAmount,
      shippingCharge,
      priceWithTaxes,
      totalAmount,
      gstPercentage,
      extraTaxPercentage,
    };
  };

  // ─── PDF Download ──────────────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const quotationDataForPDF = {
        ...previewData,
        products: [
          {
            product: previewData.product,
            quantity: previewData.quantity || 1,
            category: previewData.category,
            subCategory: previewData.subCategory,
            subSubCategory: previewData.subSubCategory,
          },
        ],
      };

      const pdfGenerator = new QuotationPDFRN();
      await pdfGenerator.generateAndDownloadPDF(quotationDataForPDF, pdfSections);

      Alert.alert('Success', 'Quotation PDF has been generated and shared', [
        {
          text: 'OK',
          onPress: () => {
            resetModal();
            onClose();
          },
        },
      ]);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert('Error', error.message || 'Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  // ─── Reset & Close ─────────────────────────────────────────────────────────
  const resetModal = () => {
    setStep('form');
    setFormData(getInitialFormData());
    setPdfSections({
      customerInfo: true,
      productInfo: true,
      pricing: true,
      brandInfo: true,
      categoryInfo: true,
      materialInfo: true,
      measurementInfo: true,
      warrantyInfo: true,
    });
    setPreviewData(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {step === 'form' ? 'Get Quotation' : 'Preview Quotation'}
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <MaterialIcons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {step === 'form' ? (
          // ─── Form Step ──────────────────────────────────────────────────────
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, isLoggedIn && styles.readOnlyInput]}
                editable={!isLoggedIn}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={text => handleInputChange('fullName', text)}
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Mobile Number *</Text>
              <TextInput
                style={[styles.input, isLoggedIn && styles.readOnlyInput]}
                editable={!isLoggedIn}
                placeholder="Enter mobile number"
                value={formData.mobNumber}
                onChangeText={text => handleInputChange('mobNumber', text)}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Email ID *</Text>
              <TextInput
                style={[styles.input, isLoggedIn && styles.readOnlyInput]}
                editable={!isLoggedIn}
                placeholder="Enter email address"
                value={formData.email}
                onChangeText={text => handleInputChange('email', text)}
                keyboardType="email-address"
                placeholderTextColor="#999"
              />

              {/* Quotation For – Pill selector */}
              <Text style={styles.label}>Quotation For (Optional)</Text>
              <SubjectSelector
                value={formData.subject}
                onChange={v => handleInputChange('subject', v)}
              />

              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your city"
                value={formData.city}
                onChangeText={text => handleInputChange('city', text)}
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>State *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your state"
                value={formData.state}
                onChangeText={text => handleInputChange('state', text)}
                placeholderTextColor="#999"
              />

              {/* Additional Details – Heading & Description */}
              <Text style={styles.sectionTitle}>Additional Details</Text>

              <Text style={styles.label}>Heading (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional heading (max 200 chars)"
                value={formData.heading}
                onChangeText={text => handleInputChange('heading', text)}
                maxLength={200}
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Optional description (max 1000 chars)"
                value={formData.description}
                onChangeText={text => handleInputChange('description', text)}
                multiline
                maxLength={1000}
                textAlignVertical="top"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Referral Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter referral name"
                value={formData.referral}
                onChangeText={text => handleInputChange('referral', text)}
                placeholderTextColor="#999"
              />

              <View style={styles.infoBox}>
                <MaterialIcons name="info" size={16} color="#004680" />
                <Text style={styles.infoText}>
                  All fields marked with * are required
                </Text>
              </View>
            </View>
          </ScrollView>
        ) : (
          // ─── Preview Step ───────────────────────────────────────────────────
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.previewContainer}>
              {/* Customer Information */}
              {pdfSections.customerInfo && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Customer Information</Text>
                  <PreviewRow label="Name" value={previewData.fullName} />
                  <PreviewRow label="Phone" value={previewData.mobNumber} />
                  <PreviewRow label="Email" value={previewData.email} />
                  {previewData.city && <PreviewRow label="City" value={previewData.city} />}
                  {previewData.state && <PreviewRow label="State" value={previewData.state} />}
                  {previewData.subject && (
                    <PreviewRow label="Quotation For" value={previewData.subject} />
                  )}
                </View>
              )}

              {/* Product Information */}
              {pdfSections.productInfo && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Product Information</Text>
                  <PreviewRow label="Product" value={previewData.product?.name || 'N/A'} />
                  <PreviewRow label="Quantity" value={previewData.quantity || 1} />
                  {pdfSections.brandInfo && (
                    <PreviewRow label="Brand" value={previewData.product?.brand || 'N/A'} />
                  )}
                  {pdfSections.categoryInfo && (
                    <>
                      <PreviewRow label="Category" value={previewData.category?.name || 'N/A'} />
                      <PreviewRow label="Sub-Category" value={previewData.subCategory?.name || 'N/A'} />
                    </>
                  )}
                  {pdfSections.materialInfo && (
                    <PreviewRow label="Material" value={previewData.product?.material || 'N/A'} />
                  )}
                  {/* Measurement added */}
                  {pdfSections.measurementInfo && (
                    <PreviewRow label="Measurement" value={previewData.product?.measurement || 'N/A'} />
                  )}
                  {pdfSections.warrantyInfo && (
                    <PreviewRow label="Warranty" value={previewData.product?.warranty?.warrantyDays || 'N/A'} />
                  )}
                </View>
              )}

              {/* Pricing */}
              {pdfSections.pricing && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Pricing Details</Text>
                  {(() => {
                    const pricing = calculatePricing(previewData.product);
                    return (
                      <>
                        <PreviewRow label="Base Price" value={formatCurrency(pricing.basePrice)} isBold />
                        <PreviewRow label={`GST (${pricing.gstPercentage}%)`} value={formatCurrency(pricing.gstAmount)} />
                        {pricing.extraTaxPercentage > 0 && (
                          <PreviewRow label={`Extra Tax (${pricing.extraTaxPercentage}%)`} value={formatCurrency(pricing.extraTaxAmount)} />
                        )}
                        <PreviewRow label="Shipping" value={formatCurrency(pricing.shippingCharge)} />
                        <PreviewRow label="Total Amount" value={formatCurrency(pricing.totalAmount)} isBold isTotal />
                      </>
                    );
                  })()}
                </View>
              )}

              {/* PDF Section Toggles */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customize PDF Content</Text>
                <CheckboxRow
                  label="Customer Information"
                  checked={pdfSections.customerInfo}
                  onToggle={() => handleSectionToggle('customerInfo')}
                />
                <CheckboxRow
                  label="Product Information"
                  checked={pdfSections.productInfo}
                  onToggle={() => handleSectionToggle('productInfo')}
                />
                <CheckboxRow
                  label="Brand Details"
                  checked={pdfSections.brandInfo}
                  onToggle={() => handleSectionToggle('brandInfo')}
                  indent
                />
                <CheckboxRow
                  label="Category Details"
                  checked={pdfSections.categoryInfo}
                  onToggle={() => handleSectionToggle('categoryInfo')}
                  indent
                />
                <CheckboxRow
                  label="Material Info"
                  checked={pdfSections.materialInfo}
                  onToggle={() => handleSectionToggle('materialInfo')}
                  indent
                />
                <CheckboxRow
                  label="Measurements"
                  checked={pdfSections.measurementInfo}
                  onToggle={() => handleSectionToggle('measurementInfo')}
                  indent
                />
                <CheckboxRow
                  label="Warranty Info"
                  checked={pdfSections.warrantyInfo}
                  onToggle={() => handleSectionToggle('warrantyInfo')}
                  indent
                />
                <CheckboxRow
                  label="Pricing Breakdown"
                  checked={pdfSections.pricing}
                  onToggle={() => handleSectionToggle('pricing')}
                />
              </View>
            </View>
          </ScrollView>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {step === 'form' ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="preview" size={18} color="#FFF" />
                    <Text style={styles.submitButtonText}>Preview</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setStep('form')}
              >
                <Text style={styles.cancelButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleDownloadPDF}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="download" size={18} color="#FFF" />
                    <Text style={styles.submitButtonText}>Download</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

// ─── Styles (same as before, just cleaned up) ────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  header: {
    backgroundColor: '#004680',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  previewContainer: {
    padding: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  readOnlyInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E0F2FE',
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
    gap: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#004680',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#004680',
    marginBottom: 12,
    marginTop: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  totalRow: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#004680',
  },
  previewLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  previewValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },
  boldText: {
    fontWeight: '700',
  },
  totalValue: {
    color: '#004680',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  checkboxRowIndent: {
    marginLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
    paddingLeft: 10,
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
  subjectWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  subjectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fafbfc',
  },
  subjectPillActive: {
    backgroundColor: '#004680',
    borderColor: '#004680',
  },
  subjectPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  subjectPillTextActive: {
    color: '#fff',
  },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  submitButton: {
    backgroundColor: '#004680',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default QuotationModal;