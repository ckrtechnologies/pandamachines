/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useVoiceSearch } from './useVoiceSearch';

const SearchBar = forwardRef(({
    mode = 'home',
    initialValue = '',
    placeholder = 'Search products…',
    onSearch,
    autoFocus = false,
    style,
}, ref) => {
    const [query, setQuery] = useState(initialValue);
    const inputRef = useRef(null);
    const searchTimer = useRef(null);

    const {
        isListening,
        recognizedText,
        startListening,
        stopListening,
    } = useVoiceSearch();

    // Mic pulse animation
    const micScale = useRef(new Animated.Value(1)).current;
    const micAnim = useRef(null);

    // Expose focus/blur/clear to parent via ref
    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
        clear: () => {
            setQuery('');
            inputRef.current?.focus();
        },
        setValue: (v) => setQuery(v),
    }));

    // Sync initialValue changes (e.g. when ProductSearch receives a new route param)
    useEffect(() => {
        if (initialValue !== query) setQuery(initialValue);
    }, [initialValue]);

    // Auto focus
    useEffect(() => {
        if (autoFocus) {
            const t = setTimeout(() => inputRef.current?.focus(), 300);
            return () => clearTimeout(t);
        }
    }, []);

    // Mic animation
    useEffect(() => {
        if (isListening) {
            micAnim.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(micScale, { toValue: 1.25, duration: 400, useNativeDriver: true }),
                    Animated.timing(micScale, { toValue: 1, duration: 400, useNativeDriver: true }),
                ]),
            );
            micAnim.current.start();
        } else {
            micAnim.current?.stop();
            Animated.timing(micScale, { toValue: 1, duration: 150, useNativeDriver: true }).start();
        }
    }, [isListening]);

    // Voice result
    useEffect(() => {
        if (!recognizedText?.trim()) return;

        const text = recognizedText.trim();
        setQuery(text);

        const t = setTimeout(() => {
            triggerSearch(text);
        }, 350); // small delay so user sees the filled text

        return () => clearTimeout(t);
    }, [recognizedText]);

    // useEffect(() => {
    //     if (voiceError) Alert.alert('Voice Error', voiceError);
    // }, [voiceError]);

    // Core submit logic
    const triggerSearch = (text) => {
        if (!text?.trim()) return;
        inputRef.current?.blur();

        if (mode === 'home') {
            // Nav clears itself after navigating; the search screen owns the value
            setQuery('');
        }

        onSearch?.(text.trim());
    };

    // Typing handler: in "page" mode do debounced live search; in "home" mode just update state
    const handleChangeText = (text) => {
        setQuery(text);

        if (mode === 'page') {
            clearTimeout(searchTimer.current);
            if (!text.trim()) {
                // Signal empty query so ProductSearch can return to browse mode
                onSearch?.('');
                return;
            }
            searchTimer.current = setTimeout(() => {
                onSearch?.(text.trim());
            }, 400);
        }
    };

    const handleSubmit = () => triggerSearch(query);

    const handleClear = () => {
        setQuery('');
        inputRef.current?.focus();
        if (mode === 'page') onSearch?.(''); // signal empty → browse mode
    };

    const handleMicPress = async () => {
        if (isListening) await stopListening();
        else await startListening();
    };

    return (
        <View style={[styles.wrapper, style]}>
            <View style={[styles.container, isListening && styles.containerListening]}>
                <MaterialIcons
                    name="search"
                    size={20}
                    color={isListening ? '#E53935' : '#9E9E9E'}
                />

                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder={isListening ? 'Listening…' : placeholder}
                    placeholderTextColor={isListening ? '#E53935' : '#9E9E9E'}
                    value={query}
                    onChangeText={handleChangeText}
                    returnKeyType="search"
                    onSubmitEditing={handleSubmit}
                />

                {query.length > 0 && !isListening && (
                    <TouchableOpacity
                        onPress={handleClear}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 24 }}
                    >
                        <MaterialIcons name="close" size={17} color="#aaa" />
                    </TouchableOpacity>
                )}

                <Animated.View style={{ transform: [{ scale: micScale }] }}>
                    <TouchableOpacity
                        onPress={handleMicPress}
                        style={[styles.micBtn, isListening && styles.micBtnActive]}
                        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    >
                        {isListening
                            ? <ActivityIndicator size="small" color="#fff" />
                            : <MaterialIcons name="mic-none" size={18} color="#E53935" />
                        }
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Listening indicator */}
            {isListening && (
                <View style={styles.listeningRow}>
                    <Animated.View style={[styles.listeningDot, { transform: [{ scale: micScale }] }]} />
                    <Text style={styles.listeningText}>Listening… speak now</Text>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 25,
        paddingVertical: 6,
        paddingHorizontal: 14,
        gap: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 2,
    },
    containerListening: {
        borderColor: '#E53935',
        backgroundColor: '#fff9f9',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        paddingVertical: 4,
    },
    micBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
    },
    micBtnActive: {
        backgroundColor: '#E53935',
    },
    listeningRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 7,
        gap: 7,
        paddingHorizontal: 6,
    },
    listeningDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#E53935',
    },
    listeningText: {
        fontSize: 12,
        color: '#E53935',
        fontWeight: '500',
    },
});

export default SearchBar;