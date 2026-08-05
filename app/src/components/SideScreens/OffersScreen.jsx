import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/basicInfo';
import AppLoader from '../../screens/common/AppLoader';
import SideScreenNavbar from '../Navbar/SideScreenNavbar';

const { width } = Dimensions.get('window');

const OffersScreen = ({ navigation }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        method: 'get',
        url: `${API_BASE_URL}/offer/get-all-offer`,
        headers: {},
      };

      const response = await axios.request(config);
      console.log('Offers fetched:', response.data);

      const ongoingOffers = response.data.filter(
        offer => offer.status === 'Ongoing' || offer.status === 'Incoming',
      );

      const sortedOffers = ongoingOffers.sort((a, b) => {
        if (a.status === 'Ongoing' && b.status === 'Incoming') return -1;
        if (a.status === 'Incoming' && b.status === 'Ongoing') return 1;
        return 0;
      });

      setOffers(sortedOffers);
    } catch (err) {
      console.log('Error fetching offers:', err);
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOffers();
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

  const parseDate = dateString => {
    const [day, month, year] = dateString.split('-');
    return new Date(
      `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
    );
  };

  const getRemainingDays = endDate => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const end = parseDate(endDate);
    end.setHours(23, 59, 59, 999);

    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  const getBadgeInfo = offer => {
    if (offer.status === 'Incoming') {
      return {
        text: 'Incoming',
        bgColor: '#3B82F6',
      };
    } else if (offer.status === 'Ongoing') {
      const remainingDays = getRemainingDays(offer.endDate);
      return {
        text:
          remainingDays === 0
            ? 'Last Day!'
            : `${remainingDays} ${remainingDays === 1 ? 'day' : 'days'} left`,
        bgColor: '#EF4444',
      };
    }
    return {
      text: 'Active',
      bgColor: '#22C55E',
    };
  };

  const renderOfferCard = ({ item }) => {
    const badgeInfo = getBadgeInfo(item);

    return (
      <TouchableOpacity style={styles.offerCard} activeOpacity={0.8}>
        <Image
          source={{ uri: item.image }}
          style={styles.offerImage}
          resizeMode="cover"
        />

        <View
          style={[
            styles.badgeContainer,
            { backgroundColor: badgeInfo.bgColor },
          ]}
        >
          <Text style={styles.badgeText}>{badgeInfo.text}</Text>
        </View>

        <View style={styles.overlay}>
          <Text style={styles.offerName} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.offerDescription} numberOfLines={3}>
            {item.description}
          </Text>

          <View style={styles.periodContainer}>
            <Text style={styles.periodLabel}>Offer Period</Text>
            <Text style={styles.periodDate}>
              {formatDate(item.startDate.split('-').reverse().join('-'))} -{' '}
              {formatDate(item.endDate.split('-').reverse().join('-'))}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (error) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.errorContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Unable to Load Offers</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOffers}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (loading) {
    return <AppLoader size={100} />;
  }

  return (
    <View style={styles.container}>
      <SideScreenNavbar pageName={'Offers'} navigation={navigation} />

      {offers.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.emptyIcon}>🎁</Text>
          <Text style={styles.emptyTitle}>No Active Offers Available</Text>
          <Text style={styles.emptyMessage}>
            Stay tuned for exciting deals and offers coming your way!
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={offers}
          renderItem={renderOfferCard}
          keyExtractor={item => item._id}
          numColumns={1}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          scrollEnabled={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
  },
  gridWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 12,
  },

  offerCard: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  offerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 10,
    elevation: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    opacity: 0,
  },
  offerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  offerDescription: {
    fontSize: 12,
    color: '#D1D5DB',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  periodContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
  },
  periodLabel: {
    fontSize: 10,
    color: '#D1D5DB',
    marginBottom: 4,
    fontWeight: '500',
  },
  periodDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default OffersScreen;
