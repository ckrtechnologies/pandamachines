import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../../context/AuthContext';

import {
    REACT_APP_CLOUDINARY_NAME,
    REACT_APP_UPLOAD_PRESET,
} from '../../utils/basicInfo';

const colors = {
    primaryColor: '#00569e',
    primaryFadedColor: '#a6c9e9',
    accentColor: '#8cc441',
    primaryTextColor: '#1f2937',
    secondaryTextColor: '#6b7280',
    primaryBtnColor: '#004680',
    darkBlue: '#00395F',
    orange: '#FF8617',
    errorColor: '#dc2626',
};

const Logo = require('../../assets/Image/logo.png');

const AuthPage = () => {
    const navigation = useNavigation();

    const {
        checkPhone,
        verifyLoginOTP,
        verifyRegisterOTP,
        registerUser,
        authLoading,
    } = useAuth();

    const [screen, setScreen] = useState('sendOTP');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);

    const [flowType, setFlowType] = useState(null);
    const [userData, setUserData] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        imageUrl: '',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
    ];

    const otpRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    useEffect(() => {
        if (screen === 'verifyOTP') {
            const timer = setTimeout(() => otpRefs[0].current?.focus(), 150);
            return () => clearTimeout(timer);
        }
    }, [screen]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (screen === 'verifyOTP') {
                    handleChangePhone();
                    return true;
                }

                if (screen === 'completeProfile') {
                    setScreen('verifyOTP');
                    return true;
                }

                Alert.alert('Exit', 'Do you want to go back?', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Yes',
                        onPress: () =>
                            navigation.goBack()
                    },
                ]);

                return true;
            };

            const sub = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress,
            );

            return () => sub.remove();
        }, [screen, navigation]),
    );

    const handleSendOTP = async () => {
        if (phoneNumber.length < 10) {
            Alert.alert(
                'Error',
                'Please enter a valid 10-digit phone number',
            );
            return;
        }

        try {
            const result = await checkPhone(phoneNumber);

            if (result.exists) {
                setFlowType('login');
                setUserData(result.userData);
            } else {
                setFlowType('register');
                setUserData(null);
            }

            setScreen('verifyOTP');

            Alert.alert('Success', 'OTP sent to your phone number');
        } catch (err) {
            Alert.alert(
                'Error',
                err.response?.data?.message ||
                'Something went wrong. Please try again.',
            );
        }
    };

    const handleOTPChange = (text, index) => {
        const digit = text.replace(/\D/g, '').slice(-1);

        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        if (digit && index < 3) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOTPKeyPress = (key, index) => {
        if (key === 'Backspace') {
            const newOtp = [...otp];

            if (newOtp[index]) {
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                newOtp[index - 1] = '';
                setOtp(newOtp);
                otpRefs[index - 1].current?.focus();
            }
        }
    };

    const handleVerifyOTP = async () => {
        const otpValue = otp.join('');

        if (otpValue.length < 4) {
            Alert.alert('Error', 'Please enter all 4 digits');
            return;
        }

        try {
            if (flowType === 'login') {
                await verifyLoginOTP(phoneNumber, otpValue, userData);

                navigation.goBack();
                
                // navigation.navigate('MainTabs', {
                //     screen: 'HomeStack',
                //     params: { screen: 'HomeMain' },
                // });
            } else {
                await verifyRegisterOTP(phoneNumber, otpValue);

                setScreen('completeProfile');
            }
        } catch (err) {
            Alert.alert(
                'Error',
                err.message || 'OTP verification failed',
            );
        }
    };

    const handleChangePhone = () => {
        setScreen('sendOTP');
        setPhoneNumber('');
        setOtp(['', '', '', '']);
        setFlowType(null);
        setUserData(null);
    };

    const uploadToCloudinary = async file => {
        if (!file?.uri) {
            return null;
        }

        setUploadingImage(true);

        const uploadFormData = new FormData();

        uploadFormData.append('file', {
            uri: file.uri,
            type: file.type || 'image/jpeg',
            name: file.name || `profile_${Date.now()}.jpg`,
        });

        uploadFormData.append(
            'upload_preset',
            REACT_APP_UPLOAD_PRESET,
        );

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${REACT_APP_CLOUDINARY_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: uploadFormData,
                },
            );

            const data = await response.json();

            if (data.secure_url) {
                return data.secure_url;
            }

            Alert.alert(
                'Upload Error',
                'Failed to upload image. Please try again.',
            );

            return null;
        } catch (error) {
            Alert.alert(
                'Upload Error',
                'Network error while uploading image.',
            );

            return null;
        } finally {
            setUploadingImage(false);
        }
    };

    const handleImagePicker = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.8,
                selectionLimit: 1,
            },
            async response => {
                if (response.didCancel || response.errorCode) {
                    return;
                }

                if (response.assets?.[0]) {
                    const asset = response.assets[0];

                    const imageFile = {
                        name:
                            asset.fileName ||
                            `image_${Date.now()}.jpg`,
                        uri: asset.uri,
                        type: asset.type || 'image/jpeg',
                    };

                    setImagePreview(imageFile.uri);

                    const url = await uploadToCloudinary(imageFile);

                    if (url) {
                        setFormData(prev => ({
                            ...prev,
                            imageUrl: url,
                        }));
                    } else {
                        setImagePreview(null);
                    }
                }
            },
        );
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            imageUrl: '',
        }));

        setImagePreview(null);
    };

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleRegister = async () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = 'Please enter a valid email';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await registerUser({
                ...formData,
                phone: phoneNumber,
            });

            Alert.alert('Success', 'Registration Successful!', [
                {
                    text: 'OK',
                    onPress: () =>
                        navigation.navigate('MainTabs', {
                            screen: 'HomeStack',
                        }),
                },
            ]);
        } catch (error) {
            Alert.alert(
                'Error',
                error.response?.data?.error ||
                'Registration failed. Please try again.',
            );
        }
    };

    if (screen === 'sendOTP') {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Image source={Logo} style={styles.logo} />

                    <Text style={styles.title}>
                        Enter Your Phone Number
                    </Text>

                    <Text style={styles.subtitle}>
                        We'll send you an OTP to verify your identity
                    </Text>

                    <View style={styles.phoneInputContainer}>
                        <Text style={styles.countryCode}>+91</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Number"
                            placeholderTextColor={
                                colors.secondaryTextColor
                            }
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={phoneNumber}
                            onChangeText={text =>
                                setPhoneNumber(
                                    text.replace(/\D/g, ''),
                                )
                            }
                            editable={!authLoading}
                        />
                    </View>

                    {/* <Text style={styles.helperText}>
                        New users will be registered automatically
                    </Text> */}

                    <TouchableOpacity
                        style={[
                            styles.button,
                            authLoading &&
                            styles.buttonDisabled,
                        ]}
                        onPress={handleSendOTP}
                        disabled={authLoading}
                    >
                        {authLoading ? (
                            <ActivityIndicator
                                color="#fff"
                                size="small"
                            />
                        ) : (
                            <Text style={styles.buttonText}>
                                Continue
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }

    if (screen === 'verifyOTP') {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Image source={Logo} style={styles.logo} />

                    <Text style={styles.title}>Enter OTP</Text>

                    <Text style={styles.subtitle}>
                        {flowType === 'login'
                            ? `Welcome back! Code sent to +91 ${phoneNumber}`
                            : `New account — code sent to +91 ${phoneNumber}`}
                    </Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={otpRefs[index]}
                                style={[
                                    styles.otpInput,
                                    digit
                                        ? styles.otpInputFilled
                                        : null,
                                ]}
                                placeholder="0"
                                placeholderTextColor={
                                    colors.primaryFadedColor
                                }
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={text =>
                                    handleOTPChange(
                                        text,
                                        index,
                                    )
                                }
                                onKeyPress={({
                                    nativeEvent,
                                }) =>
                                    handleOTPKeyPress(
                                        nativeEvent.key,
                                        index,
                                    )
                                }
                                editable={!authLoading}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            authLoading &&
                            styles.buttonDisabled,
                        ]}
                        onPress={handleVerifyOTP}
                        disabled={authLoading}
                    >
                        {authLoading ? (
                            <ActivityIndicator
                                color="#fff"
                                size="small"
                            />
                        ) : (
                            <Text style={styles.buttonText}>
                                Verify OTP
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleChangePhone}
                        style={styles.changePhoneBtn}
                        disabled={authLoading}
                    >
                        <Text style={styles.changePhoneText}>
                            Change Phone Number
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => setScreen('verifyOTP')}
                    >
                        <MaterialIcons
                            name="arrow-back"
                            size={24}
                            color={colors.darkBlue}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Complete Profile
                    </Text>

                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.content}>
                    <View style={styles.profileCard}>
                        <View style={styles.profileImageSection}>
                            {!formData.imageUrl ? (
                                <TouchableOpacity
                                    style={
                                        styles.profileImagePlaceholder
                                    }
                                    onPress={handleImagePicker}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? (
                                        <ActivityIndicator
                                            size="small"
                                            color={
                                                colors.primaryColor
                                            }
                                        />
                                    ) : (
                                        <>
                                            <MaterialIcons
                                                name="camera-alt"
                                                size={40}
                                                color={
                                                    colors.primaryColor
                                                }
                                            />

                                            <Text
                                                style={
                                                    styles.profileImageText
                                                }
                                            >
                                                Add Photo
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <View
                                    style={
                                        styles.profileImageContainer
                                    }
                                >
                                    <Image
                                        source={{
                                            uri:
                                                formData.imageUrl,
                                        }}
                                        style={
                                            styles.profileImage
                                        }
                                    />

                                    {uploadingImage && (
                                        <View
                                            style={
                                                styles.uploadingOverlay
                                            }
                                        >
                                            <ActivityIndicator
                                                size="large"
                                                color="#fff"
                                            />
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        style={
                                            styles.changePhotoIconBtn
                                        }
                                        onPress={
                                            handleImagePicker
                                        }
                                        disabled={uploadingImage}
                                    >
                                        <MaterialIcons
                                            name="edit"
                                            size={16}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={
                                            styles.removePhotoBtn
                                        }
                                        onPress={
                                            handleRemoveImage
                                        }
                                        disabled={uploadingImage}
                                    >
                                        <MaterialIcons
                                            name="close"
                                            size={16}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View style={styles.nameInputBox}>
                            <View style={styles.nameRow}>
                                <View
                                    style={
                                        styles.nameInputContainer
                                    }
                                >
                                    <Text style={styles.nameLabel}>
                                        First Name
                                    </Text>

                                    <TextInput
                                        style={[
                                            styles.nameInput,
                                            errors.firstName &&
                                            styles.inputError,
                                        ]}
                                        placeholder="Enter first name"
                                        placeholderTextColor={
                                            colors.secondaryTextColor
                                        }
                                        value={formData.firstName}
                                        onChangeText={text =>
                                            handleInputChange(
                                                'firstName',
                                                text,
                                            )
                                        }
                                        editable={!authLoading}
                                    />

                                    {errors.firstName ? (
                                        <Text
                                            style={
                                                styles.errorText
                                            }
                                        >
                                            {
                                                errors.firstName
                                            }
                                        </Text>
                                    ) : null}
                                </View>

                                <View
                                    style={
                                        styles.nameInputContainer
                                    }
                                >
                                    <Text style={styles.nameLabel}>
                                        Last Name
                                    </Text>

                                    <TextInput
                                        style={[
                                            styles.nameInput,
                                            errors.lastName &&
                                            styles.inputError,
                                        ]}
                                        placeholder="Enter last name"
                                        placeholderTextColor={
                                            colors.secondaryTextColor
                                        }
                                        value={formData.lastName}
                                        onChangeText={text =>
                                            handleInputChange(
                                                'lastName',
                                                text,
                                            )
                                        }
                                        editable={!authLoading}
                                    />

                                    {errors.lastName ? (
                                        <Text
                                            style={
                                                styles.errorText
                                            }
                                        >
                                            {errors.lastName}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.detailsForm}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>
                                Email (Optional)
                            </Text>

                            <TextInput
                                style={[
                                    styles.emailInput,
                                    errors.email &&
                                    styles.inputError,
                                ]}
                                placeholder="john@example.com"
                                placeholderTextColor={
                                    colors.secondaryTextColor
                                }
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={text =>
                                    handleInputChange(
                                        'email',
                                        text,
                                    )
                                }
                                editable={!authLoading}
                            />

                            {errors.email ? (
                                <Text style={styles.errorText}>
                                    {errors.email}
                                </Text>
                            ) : null}
                        </View>

                        <View
                            style={[
                                styles.formGroup,
                                { zIndex: 10 },
                            ]}
                        >
                            <Text style={styles.label}>
                                Gender (Optional)
                            </Text>

                            <TouchableOpacity
                                style={
                                    styles.genderDropdownBtn
                                }
                                onPress={() =>
                                    setGenderDropdownOpen(
                                        !genderDropdownOpen,
                                    )
                                }
                            >
                                <Text
                                    style={[
                                        styles.genderDropdownText,
                                        !formData.gender &&
                                        styles.genderPlaceholder,
                                    ]}
                                >
                                    {formData.gender ||
                                        'Select Gender'}
                                </Text>

                                <MaterialIcons
                                    name={
                                        genderDropdownOpen
                                            ? 'arrow-drop-up'
                                            : 'arrow-drop-down'
                                    }
                                    size={24}
                                    color={colors.primaryColor}
                                />
                            </TouchableOpacity>

                            {genderDropdownOpen && (
                                <View
                                    style={
                                        styles.genderDropdownList
                                    }
                                >
                                    {genderOptions.map(
                                        option => (
                                            <TouchableOpacity
                                                key={
                                                    option.value
                                                }
                                                style={
                                                    styles.genderDropdownItem
                                                }
                                                onPress={() => {
                                                    handleInputChange(
                                                        'gender',
                                                        option.value,
                                                    );

                                                    setGenderDropdownOpen(
                                                        false,
                                                    );
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.genderDropdownItemText,
                                                        formData.gender ===
                                                        option.value &&
                                                        styles.genderDropdownItemSelected,
                                                    ]}
                                                >
                                                    {
                                                        option.label
                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                        ),
                                    )}
                                </View>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            (authLoading ||
                                uploadingImage) &&
                            styles.buttonDisabled,
                        ]}
                        onPress={handleRegister}
                        disabled={
                            authLoading || uploadingImage
                        }
                    >
                        {authLoading ? (
                            <ActivityIndicator
                                color="#fff"
                                size="small"
                            />
                        ) : (
                            <Text style={styles.buttonText}>
                                Complete Registration
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },

    scrollContent: {
        flexGrow: 1,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primaryTextColor,
    },

    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 24,
    },

    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.primaryTextColor,
        marginBottom: 12,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 14,
        color: colors.secondaryTextColor,
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 20,
    },

    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: colors.primaryFadedColor,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
    },

    countryCode: {
        fontSize: 16,
        color: colors.secondaryTextColor,
        marginRight: 8,
        fontWeight: '600',
    },

    input: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.primaryTextColor,
    },

    helperText: {
        fontSize: 12,
        color: colors.secondaryTextColor,
        marginBottom: 24,
        alignSelf: 'flex-start',
    },

    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32,
        width: '100%',
    },

    otpInput: {
        width: 60,
        height: 60,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.primaryFadedColor,
        backgroundColor: '#fff',
        fontSize: 24,
        fontWeight: '600',
        color: colors.primaryTextColor,
        textAlign: 'center',
    },

    otpInputFilled: {
        borderColor: colors.primaryColor,
    },

    button: {
        width: '100%',

        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: colors.primaryBtnColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 10
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },

    changePhoneBtn: {
        paddingVertical: 12,
    },

    changePhoneText: {
        fontSize: 14,
        color: colors.orange,
        fontWeight: '600',
        textAlign: 'center',
    },

    formGroup: {
        marginBottom: 16,
        width: '100%',
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primaryTextColor,
        marginBottom: 8,
    },

    emailInput: {
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: colors.primaryFadedColor,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.primaryTextColor,
    },

    genderDropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: colors.primaryFadedColor,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 12,
    },

    genderDropdownText: {
        fontSize: 16,
        color: colors.primaryTextColor,
        fontWeight: '500',
    },

    genderPlaceholder: {
        color: colors.secondaryTextColor,
    },

    genderDropdownList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: colors.primaryFadedColor,
        marginTop: 4,
        zIndex: 1000,
        elevation: 5,
    },

    genderDropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },

    genderDropdownItemText: {
        fontSize: 14,
        color: colors.primaryTextColor,
    },

    genderDropdownItemSelected: {
        fontWeight: '600',
        color: colors.primaryColor,
    },

    inputError: {
        borderColor: colors.errorColor,
    },

    errorText: {
        color: colors.errorColor,
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },

    profileCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: colors.primaryFadedColor,
    },

    profileImageSection: {
        alignItems: 'center',
        marginBottom: 20,
    },

    profileImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.primaryFadedColor,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },

    profileImageText: {
        fontSize: 12,
        color: colors.primaryColor,
        marginTop: 4,
        fontWeight: '600',
    },

    profileImageContainer: {
        position: 'relative',
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
    },

    profileImage: {
        width: '100%',
        height: '100%',
    },

    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    changePhotoIconBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.accentColor,
        justifyContent: 'center',
        alignItems: 'center',
    },

    removePhotoBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#ff4444',
        justifyContent: 'center',
        alignItems: 'center',
    },

    nameInputBox: {
        backgroundColor: '#f9fafb',
        borderRadius: 10,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.primaryFadedColor,
    },

    nameRow: {
        flexDirection: 'row',
        gap: 12,
    },

    nameInputContainer: {
        flex: 1,
    },

    nameLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primaryTextColor,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    nameInput: {
        borderWidth: 1.5,
        borderColor: colors.primaryFadedColor,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: colors.primaryTextColor,
        backgroundColor: '#fff',
    },

    detailsForm: {
        width: '100%',
        marginBottom: 20,
    },
});

export default AuthPage;