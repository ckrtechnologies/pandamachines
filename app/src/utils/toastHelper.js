import Toast from 'react-native-toast-message';

const DEFAULT_OPTIONS = {
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
};

export const showSuccess = (
    message,
    title = 'Success',
    options = {},
) => {
    Toast.show({
        type: 'success',
        text1: title,
        text2: message,
        ...DEFAULT_OPTIONS,
        ...options,
    });
};

export const showError = (
    message,
    title = 'Error',
    options = {},
) => {
    Toast.show({
        type: 'error',
        text1: title,
        text2: message,
        ...DEFAULT_OPTIONS,
        ...options,
    });
};

export const showInfo = (
    message,
    title = 'Info',
    options = {},
) => {
    Toast.show({
        type: 'info',
        text1: title,
        text2: message,
        ...DEFAULT_OPTIONS,
        ...options,
    });
};

export const showWarning = (
    message,
    title = 'Warning',
    options = {},
) => {
    Toast.show({
        type: 'info',
        text1: title,
        text2: message,
        ...DEFAULT_OPTIONS,
        ...options,
    });
};

export const hideToast = () => {
    Toast.hide();
};

export default {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
};