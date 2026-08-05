import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_BASE_URL } from '../../utils/basicInfo';
import { getCloudinaryImageUrl } from '../../utils/getCloudinaryImageUrl';


const HomeCategoriesSection = ({ isRefreshing }) => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const fetchCategories = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            } setError(null); // reset error

            const res = await axios.get(`${API_BASE_URL}/categories`, {
                params: { simple: true, limit: 16 }
            });

            const displayCategories = [
                ...res.data?.data?.slice(0, 15),
                { isViewAll: true }
            ];

            setCategories(displayCategories);
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error('Category fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);


    // Run on screen focus (initial load)
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories])

    //  Run on pull-to-refresh
    useEffect(() => {
        if (isRefreshing) {
            fetchCategories(false);
        }
    }, [isRefreshing, fetchCategories]);

    const renderItem = ({ item }) => {

        if (item.isViewAll) {
            return (
                <TouchableOpacity
                    style={styles.viewAllCard}
                    onPress={() => navigation.navigate('CategoriesStack', {
                        screen: "CategoriesMain"
                    })}
                >
                    <View style={styles.iconCircle}>
                        <MaterialIcons name="grid-view" size={22} color="#fff" />
                    </View>

                    <Text style={styles.viewAllText}>
                        View All
                    </Text>
                </TouchableOpacity>
            );
        }

        return (

            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate('CategoriesStack', {
                        screen: 'CategoriesMain',
                        params: {
                            selectedCategoryId: item._id,
                        },
                    })
                }
            >
                <Image
                    source={{
                        uri: getCloudinaryImageUrl(item.imgUrl, { width: 300 }),
                    }}
                    style={styles.image}
                />
                <Text style={styles.text} numberOfLines={2}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        )
    };


    return (
        <View style={styles.container}>

            {loading ? (
                <HomeCategoriesSkeleton />
            ) : error ? (
                <HomeCategoriesError onRetry={fetchCategories} />
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    numColumns={4}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => (item?._id || index.toString())}
                />
            )}

        </View>
    );
}

const HomeCategoriesSkeleton = () => {
    const skeletonItems = Array.from({ length: 16 });

    return (
        <View style={skeletonStyles.container}>
            <View style={skeletonStyles.grid}>
                {skeletonItems.map((_, index) => (
                    <View key={index} style={skeletonStyles.card}>
                        <View style={skeletonStyles.image} />
                        <View style={skeletonStyles.text} />
                        <View style={skeletonStyles.text2} />
                    </View>
                ))}
            </View>
        </View>
    );
};

const HomeCategoriesError = ({ onRetry }) => {
    return (
        <View style={errorStyles.container}>
            <MaterialIcons name="error-outline" size={40} color="#999" />

            <Text style={errorStyles.title}>
                Failed to load categories
            </Text>

            <Text style={errorStyles.subtitle}>
                Please check your connection or try again
            </Text>

            <TouchableOpacity style={errorStyles.button} onPress={onRetry}>
                <Text style={errorStyles.buttonText}>Retry</Text>
            </TouchableOpacity>
        </View>
    );
};
export default HomeCategoriesSection


const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    card: {
        flex: 1,
        margin: 6,
        alignItems: 'center',
    },
    image: {
        width: 68,
        height: 68,
        borderRadius: 10,
        backgroundColor: '#eee',
    },
    text: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 5,
        color: '#333',
    },
    viewAllCard: {
        flex: 1,
        margin: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconCircle: {
        width: 68,
        height: 68,
        borderRadius: 10,
        backgroundColor: '#999999',
        alignItems: 'center',
        justifyContent: 'center',
    },

    viewAllText: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 5,
        color: '#333',
    },
});

const skeletonStyles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    card: {
        width: '25%',
        alignItems: 'center',
        marginBottom: 12,
    },
    image: {
        width: 68,
        height: 68,
        borderRadius: 10,
        backgroundColor: '#e0e0e0',
    },
    text: {
        width: 40,
        height: 10,
        marginTop: 6,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
    },
    text2: {
        width: 60,
        height: 10,
        marginTop: 6,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
    },
});
const errorStyles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    subtitle: {
        fontSize: 12,
        color: '#777',
        marginTop: 4,
        textAlign: 'center',
    },
    button: {
        marginTop: 12,
        backgroundColor: '#00569e',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
    },
});