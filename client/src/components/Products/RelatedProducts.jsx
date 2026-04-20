import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";
import UserLoginModal from "../Login/UserLoginModal";
import UserRegisterModal from "../Login/UserRegisterModal";
import ProductCardOptimized, { ProductCardSkeleton } from "./ProductCardOptimized";

const RelatedProducts = ({ subCategoryId }) => {
  const { id: currentProductId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const {
    isWishlisted,
    toggleWishlist,
    updatingWishlist,
  } = useWishlist({
    onAuthRequired: () => setShowLoginModal(true),
  });

  useEffect(() => {
    if (!subCategoryId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/products-by-sub-category/${subCategoryId}`,
        );
        setProducts(
          response.data?.filter(
            (p) => String(p._id) !== String(currentProductId),
          ),
        );
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [subCategoryId, currentProductId]);


  const openLoginModal = () => setShowLoginModal(true);
  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      {showLoginModal && (
        <UserLoginModal
          onClose={closeAllModals}
          onRegisterClick={openRegisterModal}
          onLoginSuccess={() => showLoginModal(false)}
        />
      )}

      {showRegisterModal && (
        <UserRegisterModal
          onClose={closeAllModals}
          onLoginClick={openLoginModal}
        />
      )}
      <div className="text-gray-900 text-lg md:text-xl tracking-wide font-bold my-6">
        Related Products
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex space-x-4 min-w-full">
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[200px] sm:w-[220px] flex-shrink-0">
                  <ProductCardSkeleton fullWidth />
                </div>
              ))}
            {!loading &&
              products.map((product) => {
                const formattedProduct = {
                  _id: product.id,
                  name: product.name,
                  price: product.price,
                  previous_price: product.previous_price,
                  ratings: product.rating,
                  images: product?.images || [product.image],
                  discount:
                    product.previous_price > product.price
                      ? Math.round(
                        ((product.previous_price - product.price) /
                          product.previous_price) *
                        100
                      )
                      : 0,
                };
                return (
                  <div className="w-[200px] sm:w-[220px] flex-shrink-0">
                    <ProductCardOptimized
                      key={product._id}
                      product={formattedProduct}
                      fullWidth
                      isWishlisted={isWishlisted(product._id)}
                      isUpdating={updatingWishlist.has(product._id)}
                      toggleWishlist={toggleWishlist}
                    />
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
