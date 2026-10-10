import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/Home/Herobanners.css";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 ${className}`} />
);

const HeroBanners = () => {
  const navigate = useNavigate();

  const [mainBanners, setMainBanners] = useState([]);
  const [smallBanners, setSmallBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [current, setCurrent] = useState(0);

  const intervalRef = useRef(null);

  // =====================================================
  // TOUCH REFS
  // =====================================================

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // =====================================================
  // FETCH BANNERS
  // =====================================================

  const fetchBanners = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/banners/all-banners`
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.banners || [];

      const main = data.filter(
        (item) => item.bannerType === "main-banner"
      );

      const small = data.filter(
        (item) => item.bannerType === "small-banner"
      );

      console.log(
        "===================================="
      );

      console.log("MAIN BANNERS:", main);

      console.log("SMALL BANNERS:", small);

      main.forEach((banner, index) => {
        console.log(`MAIN BANNER ${index + 1}:`, {
          bannerId: banner?._id,
          name: banner?.name,
          productId:
            banner?.productId?._id ||
            banner?.productId ||
            null,
        });
      });

      small.forEach((banner, index) => {
        console.log(`SMALL BANNER ${index + 1}:`, {
          bannerId: banner?._id,
          name: banner?.name,
          productId:
            banner?.productId?._id ||
            banner?.productId ||
            null,
        });
      });

      console.log(
        "===================================="
      );

      setMainBanners(main);
      setSmallBanners(small);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching banners:",
        error
      );

      setLoading(false);
    }
  };

  // =====================================================
  // GET PRODUCT ID
  // =====================================================

  const getProductId = (banner) => {
    if (!banner) {
      return null;
    }

    /*
      Backend can return:

      productId: "6943b749fe5168e53ce5551"

      OR after populate():

      productId: {
        _id: "6943b749fe5168e53ce5551",
        name: "..."
      }
    */

    if (
      typeof banner.productId === "object" &&
      banner.productId !== null
    ) {
      return (
        banner.productId._id ||
        banner.productId.id ||
        null
      );
    }

    if (
      typeof banner.productId === "string"
    ) {
      return banner.productId;
    }

    return null;
  };

  // =====================================================
  // BANNER CLICK
  // =====================================================

  const handleBannerClick = (banner) => {
    console.log(
      "===================================="
    );

    console.log(
      "CLICKED BANNER:",
      banner
    );

    console.log(
      "BANNER ID:",
      banner?._id
    );

    console.log(
      "BANNER NAME:",
      banner?.name
    );

    console.log(
      "RAW PRODUCT ID:",
      banner?.productId
    );

    const productId =
      getProductId(banner);

    console.log(
      "FINAL PRODUCT ID:",
      productId
    );

    console.log(
      "===================================="
    );

    // =================================================
    // NO PRODUCT LINKED
    // =================================================

    if (!productId) {
      alert(
        "This banner is not linked to any product."
      );

      return;
    }

    // =================================================
    // OPEN THE ACTUAL PRODUCT
    // =================================================

    navigate(
      `/user-product-details/${productId}`
    );
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchBanners();
  }, []);

  // =====================================================
  // AUTO ROTATION
  // =====================================================

  const startAutoRotate = () => {
    clearInterval(intervalRef.current);

    if (mainBanners.length === 0) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveBanner((prev) => {
        return (
          (prev + 1) %
          mainBanners.length
        );
      });

      setCurrent((prev) => {
        return (
          (prev + 1) %
          mainBanners.length
        );
      });
    }, 5000);
  };

  useEffect(() => {
    if (
      !loading &&
      mainBanners.length > 0
    ) {
      startAutoRotate();
    }

    return () => {
      clearInterval(
        intervalRef.current
      );
    };
  }, [loading, mainBanners]);

  // =====================================================
  // DESKTOP HOVER
  // =====================================================

  const handleHover = (index) => {
    if (index !== activeBanner) {
      setActiveBanner(index);
      setCurrent(index);
      startAutoRotate();
    }
  };

  // =====================================================
  // TOUCH START
  // =====================================================

  const handleTouchStart = (e) => {
    clearInterval(
      intervalRef.current
    );

    touchStartX.current =
      e.touches[0].clientX;

    touchEndX.current =
      e.touches[0].clientX;
  };

  // =====================================================
  // TOUCH MOVE
  // =====================================================

  const handleTouchMove = (e) => {
    touchEndX.current =
      e.touches[0].clientX;
  };

  // =====================================================
  // TOUCH END
  // =====================================================

  const handleTouchEnd = () => {
    if (mainBanners.length === 0) {
      return;
    }

    const diff =
      touchStartX.current -
      touchEndX.current;

    // =================================================
    // NOT A SWIPE
    // =================================================

    if (Math.abs(diff) < 50) {
      startAutoRotate();
      return;
    }

    // =================================================
    // SWIPE LEFT
    // =================================================

    if (diff > 0) {
      setCurrent(
        (prev) =>
          (prev + 1) %
          mainBanners.length
      );
    }

    // =================================================
    // SWIPE RIGHT
    // =================================================

    else {
      setCurrent((prev) =>
        prev === 0
          ? mainBanners.length - 1
          : prev - 1
      );
    }

    startAutoRotate();
  };

  // =====================================================
  // LOADING SKELETON
  // =====================================================

  if (loading) {
    return (
      <div className="flex-1 hidden md:flex flex-col justify-between h-full rounded-md">

        <SkeletonBox
          className="h-64 md:h-80 w-full rounded-t-md mb-4"
        />

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {[...Array(4)].map(
            (_, idx) => (
              <SkeletonBox
                key={idx}
                className="h-10 w-full"
              />
            )
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          {[...Array(3)].map(
            (_, idx) => (
              <SkeletonBox
                key={idx}
                className="h-32 w-full rounded-md"
              />
            )
          )}
        </div>

      </div>
    );
  }

  return (
    <>
      {/* =====================================================
          DESKTOP VIEW
      ====================================================== */}

      <div className="flex-1 hidden lg:flex flex-col justify-between h-full rounded-md">

        {/* =================================================
            MAIN BANNER
        ================================================== */}

        {mainBanners.length > 0 && (
          <div className="overflow-hidden h-64 md:h-80 rounded-t-md shadow-md">

            <img
              key={
                mainBanners[
                  activeBanner
                ]?._id
              }
              src={
                mainBanners[
                  activeBanner
                ]?.imgUrl
              }
              alt={
                mainBanners[
                  activeBanner
                ]?.name ||
                "Banner"
              }

              /*
               * IMPORTANT:
               * Pass the actual currently
               * displayed banner.
               */
              onClick={() =>
                handleBannerClick(
                  mainBanners[
                    activeBanner
                  ]
                )
              }

              className="w-full h-full object-cover rounded-t-md opacity-0 animate-fadeSlide cursor-pointer"
            />

          </div>
        )}

        {/* =================================================
            BANNER CONTROLS
        ================================================== */}

        {mainBanners.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-6 rounded-b-md overflow-hidden shadow-md">

            {mainBanners.map(
              (banner, index) => {
                const words =
                  banner.name?.split(
                    " "
                  ) || [];

                const formattedName =
                  [];

                for (
                  let i = 0;
                  i < words.length;
                  i += 4
                ) {
                  formattedName.push(
                    words
                      .slice(
                        i,
                        i + 4
                      )
                      .join(" ")
                  );
                }

                return (
                  <div
                    key={banner._id}
                    onMouseEnter={() =>
                      handleHover(
                        index
                      )
                    }

                    /*
                     * IMPORTANT:
                     * Pass THIS banner,
                     * not a hardcoded ID.
                     */
                    onClick={() =>
                      handleBannerClick(
                        banner
                      )
                    }

                    className={`py-4 px-8 sm:px-6 text-sm sm:text-[15px] text-center cursor-pointer transition tracking-wide border-gray-400 font-medium ${
                      index !== 0
                        ? "border-l"
                        : ""
                    } ${
                      activeBanner ===
                      index
                        ? "bg-[#FFF8F8] text-[#FF8717]"
                        : "bg-[#FFF8F8] text-gray-800"
                    }`}
                  >

                    {formattedName.map(
                      (
                        line,
                        i
                      ) => (
                        <div key={i}>
                          {line}
                        </div>
                      )
                    )}

                  </div>
                );
              }
            )}

          </div>
        )}

        {/* =================================================
            SMALL BANNERS
        ================================================== */}

        {smallBanners.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">

            {smallBanners.map(
              (banner) => (
                <div
                  key={banner._id}

                  /*
                   * IMPORTANT:
                   * Pass the clicked small banner.
                   */
                  onClick={() =>
                    handleBannerClick(
                      banner
                    )
                  }

                  className="overflow-hidden rounded-md cursor-pointer"
                >

                  <img
                    src={banner.imgUrl}
                    alt={
                      banner.name ||
                      "Banner"
                    }
                    className="w-full h-32 object-cover rounded-md shadow-md animate-auto-zoom"
                  />

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          MOBILE VIEW
      ====================================================== */}

      <div className="block lg:hidden w-full">

        {mainBanners.length > 0 && (
          <div
            className="relative overflow-hidden rounded-md"
            onTouchStart={
              handleTouchStart
            }
            onTouchMove={
              handleTouchMove
            }
            onTouchEnd={
              handleTouchEnd
            }
          >

            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  current * 100
                }%)`,
              }}
            >

              {mainBanners.map(
                (banner) => (
                  <img
                    key={banner._id}
                    src={banner.imgUrl}
                    alt={
                      banner.name ||
                      "Banner"
                    }

                    /*
                     * IMPORTANT:
                     * Pass THIS mobile banner.
                     */
                    onClick={() =>
                      handleBannerClick(
                        banner
                      )
                    }

                    className="w-full h-32 sm:h-40 md:h-44 flex-shrink-0 rounded-md cursor-pointer"
                  />
                )
              )}

            </div>

            {/* =================================================
                MOBILE INDICATORS
            ================================================== */}

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">

              {mainBanners.map(
                (_, index) => (
                  <div
                    key={index}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      current ===
                      index
                        ? "w-5 bg-white"
                        : "w-2 bg-white/40"
                    }`}
                  />
                )
              )}

            </div>

          </div>
        )}

      </div>
    </>
  );
};

export default HeroBanners;