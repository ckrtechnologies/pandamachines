import React, { useState, useRef } from "react";

const ImageMagnifier = ({ imageUrl, altText = "Product" }) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentages for background positioning
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setMagnifierPosition({ x: xPercent, y: yPercent });
    setImagePosition({ x, y });
  };

  return (
    <div className="relative w-full">
      {/* Main Image Container */}
      <div className="border border-gray-200 h-[280px] md:h-[350px] lg:h-[320px] rounded-lg relative overflow-hidden">
        <img
          ref={imgRef}
          src={imageUrl}
          alt={altText}
          draggable={false}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full object-fill rounded-lg cursor-pointer"
        />

        {/* Magnifier Circle on Image */}
        {/* {showMagnifier && (
          <div
            className="absolute pointer-events-none border-2 border-orange-400"
            style={{
              left: `${imagePosition.x - 75}px`,
              top: `${imagePosition.y - 75}px`,
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              boxShadow: "0 0 0 2000px rgba(0,0,0,0.3)",
              zIndex: 10,
            }}
          />
        )} */}
      </div>

      {/* Zoomed Preview on Right - Desktop */}
      {showMagnifier && (
        <div
          className="absolute top-0 left-full ml-4 w-[600px] h-[400px] border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-xl z-20 hidden lg:block"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "180%",
            backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {/* Zoomed Preview - Mobile/Tablet */}
      {showMagnifier && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div
            className="w-[80vw] h-[80vw] md:w-96 md:h-96 rounded-xl"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "180%",
              backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
            onClick={() => setShowMagnifier(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageMagnifier;

// import React, { useState, useRef } from "react";

// const ImageMagnifier = ({ imageUrl, altText = "Product" }) => {
//   const [showMagnifier, setShowMagnifier] = useState(false);
//   const [magnifierHeight, setMagnifierHeight] = useState(150);
//   const [magnifierWidth, setMagnifierWidth] = useState(150);
//   const [magnifiedHeight, setMagnifiedHeight] = useState(300);
//   const [magnifiedWidth, setMagnifiedWidth] = useState(400);
//   const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
//   const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
//   const imgRef = useRef(null);
//   const containerRef = useRef(null);
//   const magnifierRef = useRef(null);

//   const handleMouseEnter = (e) => {
//     const elem = e.currentTarget;
//     const { height, width } = elem.getBoundingClientRect();

//     setMagnifierHeight(height / 3.5);
//     setMagnifierWidth(width / 3.5);
//     setMagnifiedHeight(height * 1.2);
//     setMagnifiedWidth(width * 1);

//     setShowMagnifier(true);
//   };

//   const handleMouseMove = (e) => {
//     if (!showMagnifier || !imgRef.current) return;

//     const elem = imgRef.current;
//     const { top, left } = elem.getBoundingClientRect();

//     let x = e.clientX - left;
//     let y = e.clientY - top;

//     if (x > elem.width) x = elem.width;
//     if (x < 0) x = 0;
//     if (y > elem.height) y = elem.height;
//     if (y < 0) y = 0;

//     // Update magnifier position
//     setMagnifierPos({
//       x: x - magnifierWidth / 2,
//       y: y - magnifierHeight / 2,
//     });

//     // Update preview background position
//     setPreviewPos({
//       x: -x * (magnifiedWidth / elem.width) + magnifierWidth / 2,
//       y: -y * (magnifiedHeight / elem.height) + magnifierHeight / 2,
//     });
//   };

//   const handleMouseLeave = () => {
//     setShowMagnifier(false);
//   };

//   return (
//     <div ref={containerRef} className="relative w-full">
//       {/* Image Container */}
//       <div className="relative w-full inline-block">
//         <img
//           ref={imgRef}
//           src={imageUrl}
//           alt={altText}
//           draggable={false}
//           onMouseEnter={handleMouseEnter}
//           onMouseMove={handleMouseMove}
//           onMouseLeave={handleMouseLeave}
//           className="w-full h-[320px] object-cover rounded-lg cursor-crosshair"
//         />

//         {/* Magnifier Box on Image */}
//         {showMagnifier && (
//           <div
//             ref={magnifierRef}
//             style={{
//               height: magnifierHeight + "px",
//               width: magnifierWidth + "px",
//               backgroundColor: "white",
//               backgroundImage: `url('${imageUrl}')`,
//               backgroundRepeat: "no-repeat",
//               position: "absolute",
//               border: "3px solid #ff9500",
//               borderRadius: "8px",
//               backgroundSize: magnifiedWidth + "px " + magnifiedHeight + "px",
//               backgroundPosition: `${previewPos.x}px ${previewPos.y}px`,
//               pointerEvents: "none",
//               boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
//               left: magnifierPos.x + "px",
//               top: magnifierPos.y + "px",
//             }}
//           ></div>
//         )}
//       </div>

//       {/* Zoomed Preview on Right - Absolutely Positioned */}
//       {showMagnifier && (
//         <div
//           ref={containerRef}
//           style={{
//             width: magnifiedWidth + "px",
//             height: magnifiedHeight + "px",
//             backgroundImage: `url('${imageUrl}')`,
//             backgroundRepeat: "no-repeat",
//             backgroundSize: magnifiedWidth + "px " + magnifiedHeight + "px",
//             backgroundPosition: `${previewPos.x}px ${previewPos.y}px`,
//             borderRadius: "8px",
//             backgroundColor: "#ffffff",
//             // border: "3px solid #ffffff",
//             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
//             position: "absolute",
//             right: "-500px",
//             top: "0",
//             zIndex: 50,
//           }}
//         ></div>
//       )}
//     </div>
//   );
// };

// export default ImageMagnifier;
