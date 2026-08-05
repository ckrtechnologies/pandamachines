import { useState, useCallback, useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';

const { VoiceModule } = NativeModules;

export const useVoiceSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!VoiceModule) return;

    const eventEmitter = new NativeEventEmitter(VoiceModule);

    const resultListener = eventEmitter.addListener('VoiceResult', event => {
      if (event && event.result) {
        setRecognizedText(event.result);
        setIsListening(false);
      }
    });

    const errorListener = eventEmitter.addListener('VoiceError', event => {
      setError(event?.error || 'Voice recognition failed');
      setIsListening(false);
    });

    return () => {
      resultListener.remove();
      errorListener.remove();
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!VoiceModule) {
      setError('Voice module not available');
      return;
    }

    try {
      setError(null);
      setRecognizedText('');
      setIsListening(true);
      VoiceModule.startVoiceRecognition('Search products...', 'en-US');
    } catch (err) {
      console.error('Error starting voice recognition:', err);
      setError('Failed to start voice recognition');
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      if (VoiceModule && VoiceModule.stopVoiceRecognition) {
        VoiceModule.stopVoiceRecognition();
      }
      setIsListening(false);
    } catch (err) {
      console.error('Error stopping voice recognition:', err);
      setIsListening(false);
    }
  }, []);

  const cancelListening = useCallback(async () => {
    try {
      if (VoiceModule && VoiceModule.cancelVoiceRecognition) {
        VoiceModule.cancelVoiceRecognition();
      }
      setIsListening(false);
      setError(null);
    } catch (err) {
      console.error('Error canceling voice recognition:', err);
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    recognizedText,
    error,
    startListening,
    stopListening,
    cancelListening,
    setRecognizedText,
  };
};
