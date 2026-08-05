import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/basicInfo';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SideScreenNavbar from '../Navbar/SideScreenNavbar';
import AppLoader from '../../screens/common/AppLoader';

const { width } = Dimensions.get('window');

const BlogDetailsScreen = ({ route }) => {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const blogId = route?.params?.blogId;

  useFocusEffect(
    useCallback(() => {
      if (blogId) {
        fetchBlogDetails();
      }
    }, [blogId]),
  );

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = {
        method: 'get',
        url: `${API_BASE_URL}/blog/get-blog-by-id/${blogId}`,
        headers: {},
      };

      const response = await axios.request(config);
      console.log('Blog data:', response.data);
      setBlogData(response.data);
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatContent = content => {
    return content.split('\n').filter(paragraph => paragraph.trim() !== '');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${blogData.title}\n\n${blogData.content.substring(
          0,
          100,
        )}...\n\nRead the full article in our app!`,
        title: blogData.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share article');
    }
  };

  if (loading) {
    return <AppLoader size={100} />;
  }

  if (error || !blogData) {
    return (
      <View style={styles.container}>
        <SideScreenNavbar pageName="Blog Details" navigation={navigation} />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={60} color="#D1D5DB" />
          <Text style={styles.errorText}>{error || 'Blog not found'}</Text>
          <Text style={styles.errorSubtext}>Please try again later.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchBlogDetails}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const contentParagraphs = formatContent(blogData.content);

  return (
    <View style={styles.container}>
      <SideScreenNavbar pageName="Blog Details" navigation={navigation} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Blog Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: blogData.image }}
            style={styles.blogImage}
            resizeMode="cover"
          />
        </View>

        {/* Blog Title */}
        <View style={styles.titleSection}>
          <Text style={styles.blogTitle}>{blogData.title}</Text>
        </View>

        {/* Blog Meta */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="person" size={16} color="#6B7280" />
              <Text style={styles.metaText}>{blogData.author}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="calendar-today" size={16} color="#6B7280" />
              <Text style={styles.metaText}>
                {formatDate(blogData.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Blog Content */}
        <View style={styles.contentSection}>
          {contentParagraphs.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* About Blog Card */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About this Blog</Text>

          <View style={styles.aboutContent}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Published:</Text>
              <Text style={styles.aboutValue}>
                {formatDate(blogData.createdAt)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Author:</Text>
              <Text style={styles.aboutValue}>{blogData.author}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <MaterialIcons name="share" size={18} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>Share Article</Text>
          </TouchableOpacity>
        </View>

        {/* Spacing for bottom */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
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
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  blogImage: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  blogTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 32,
  },
  metaSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(166, 201, 233, 0.15)',
    marginVertical: 12,
  },
  metaRow: {
    marginVertical: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  paragraph: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'justify',
  },
  aboutCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  aboutContent: {
    marginBottom: 16,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  aboutLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004680',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BlogDetailsScreen;
