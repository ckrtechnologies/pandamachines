import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/basicInfo';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SideScreenNavbar from '../../components/Navbar/SideScreenNavbar';
import AppLoader from '../../screens/common/AppLoader';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const BlogScreen = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchBlogs();
    }, []),
  );

  const fetchBlogs = async () => {
    try {
      setError(null);
      const config = {
        method: 'get',
        url: `${API_BASE_URL}/blog/get-all-blog`,
        headers: {},
      };

      const response = await axios.request(config);
      setBlogPosts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blog posts');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBlogs();
    setRefreshing(false);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateContent = (content, maxLength = 105) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const BlogSkeleton = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonLine, { width: '80%' }]} />
        <View style={[styles.skeletonLine, { width: '60%', marginTop: 8 }]} />
        <View style={[styles.skeletonLine, { marginTop: 12 }]} />
        <View style={[styles.skeletonLine, { marginTop: 8 }]} />
        <View style={[styles.skeletonButton, { marginTop: 16 }]} />
      </View>
    </View>
  );

  const renderBlogCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BlogDetails', { blogId: item._id })}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.blogImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.blogTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.blogContent} numberOfLines={3}>
          {truncateContent(item.content)}
        </Text>

        {/* <View style={styles.metaContainer}>
          <Text style={styles.authorText}>By {item.author}</Text>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View> */}

        <TouchableOpacity
          style={styles.readButton}
          onPress={() =>
            navigation.navigate('BlogDetails', { blogId: item._id })
          }
        >
          <Text style={styles.readButtonText}>Read Full Article</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (error && blogPosts.length === 0) {
    return (
      <View style={styles.container}>
        <SideScreenNavbar pageName="Blogs" navigation={navigation} />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={60} color="#D1D5DB" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBlogs}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return <AppLoader size={100} />;
  }

  if (blogPosts.length === 0) {
    return (
      <View style={styles.container}>
        <SideScreenNavbar pageName="Blogs" navigation={navigation} />
        <View style={styles.loadingContainer}>
          <FlatList
            data={Array.from({ length: 8 })}
            renderItem={() => <BlogSkeleton />}
            keyExtractor={(_, index) => `skeleton-${index}`}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
          />
        </View>
      </View>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <View style={styles.container}>
        <SideScreenNavbar pageName="Blogs" navigation={navigation} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>No Blog Posts Yet</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new content!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SideScreenNavbar pageName="Blogs" navigation={navigation} />

      {/* <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Latest Industry Insights</Text>
        <Text style={styles.headerSubtitle}>
          Stay updated with the latest trends, tips, and insights from industry
          experts.
        </Text>
      </View> */}

      <FlatList
        data={blogPosts}
        renderItem={renderBlogCard}
        keyExtractor={item => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B35']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    padding: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  blogImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 12,
    flex: 1,
  },
  blogTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 18,
  },
  blogContent: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
    lineHeight: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  authorText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#00569e',
  },
  dateText: {
    fontSize: 10,
    color: '#6B7280',
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004680',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  readButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  skeletonCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skeletonImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#E5E7EB',
  },
  skeletonContent: {
    padding: 12,
  },
  skeletonLine: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonButton: {
    height: 36,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
  },
  loadingContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#004680',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default BlogScreen;
