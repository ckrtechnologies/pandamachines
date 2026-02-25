import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import axios from "axios";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const userId =
          JSON.parse(localStorage.getItem("pm-user-data"))?._id || "";

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/review/product-reviews/${productId}`,
          {
            data: { userId },
          }
        );

        if (response.data.success) {
          setReviews(response.data.data.reviews || []);
          setStatistics(response.data.data.statistics || {});
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  if (loading) {
    return <ReviewsSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded text-red-600">
        Error loading reviews: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="font-bold text-md mb-6 tracking-wide">Customer Reviews</h3>

      {/* Rating Statistics */}
      {statistics && statistics.totalReviews > 0 && (
        <div className="mb-8 pb-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center bg-orange-50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {statistics.averageRating}
              </div>
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={
                      i < Math.floor(statistics.averageRating)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Based on {statistics.totalReviews} review
                {statistics.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = statistics.ratingDistribution?.[rating] || 0;
                const percentage =
                  statistics.totalReviews > 0
                    ? Math.round((count / statistics.totalReviews) * 100)
                    : 0;

                return (
                  <div key={rating} className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star
                        size={14}
                        fill="currentColor"
                        className="text-yellow-400"
                      />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-6 last:border-b-0">
              {/* Reviewer Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  {review.user.imageUrl ? (
                    <img
                      src={review.user.imageUrl}
                      alt={`${review.user.firstName} ${review.user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold uppercase">
                      {review.user.firstName.charAt(0)}
                      {review.user.lastName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {review.user.firstName} {review.user.lastName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {review.rating} out of 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {review.reviewText}
              </p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {review.images.map((image, index) => (
                    <div
                      key={index}
                      className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;

// Skeleton Loader for Reviews
const ReviewsSkeleton = () => {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-6 bg-gray-200 w-48 rounded mb-6"></div>

      {/* Statistics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-6 border-b">
        <div className="bg-gray-200 p-6 rounded-lg h-32"></div>
        <div className="md:col-span-2 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 h-2 bg-gray-200 rounded"></div>
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Skeleton */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b pb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 w-32 rounded mb-2"></div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
            </div>
            <div className="flex gap-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="w-24 h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
