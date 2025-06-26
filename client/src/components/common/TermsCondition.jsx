import React from "react";

const TermsCondition = () => {
  return (
    <div className="bg-white text-[#1f1f1f] py-6 px-4 xl:px-6 text-justify">
      {/* Main Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">
        Panda Machine – Trusted E-commerce Online Shopping Site for Industrial Products
      </h2>

      {/* Description */}
      <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
        Panda Machine is an e-commerce company that caters to both B2B and B2C operations. Panda Machine deals in various categories including industrial tools, electronic appliances,
        household appliances, office equipment and stationaries, agricultural tools, construction site products, medical equipment, and automotive parts. With over 800,000+
        SKUs across 1500+ categories, Panda Machine is India's largest B2B e-commerce platform for industrial products. We provide digital procurement and supply chain solutions
        for various industries like agriculture, construction, healthcare, and automobiles. Additionally, we provide excellent deals on bulk orders as per the inquiries received.
      </p>

      <p className="text-gray-700 mb-8 text-sm sm:text-base leading-relaxed">
        As we know, today’s online shopping involves a lot of delivery delays, but with the hassle-free supply chain of Panda Machine, delivery is faster and more efficient. As a
        company, we aim to provide exclusive deals, ensure effortless delivery, low prices, and customer satisfaction. Our company’s mission is to provide a smooth and
        flawless experience for both sellers and buyers.
      </p>

      {/* Subheading */}
      <h3 className="text-xl font-semibold mb-4">
        Some of our Top-Selling B2B Categories
      </h3>

      {/* Categories Grid */}
      <div className="space-y-6 text-sm sm:text-base text-gray-800 leading-relaxed">
        <div>
          <strong>Home and Kitchen Appliances:</strong> In the home and kitchen category, we have a variety of products. It includes geysers, air conditioners,{" "}
          <a className="text-blue-600 hover:underline" href="#">refrigerators</a>, televisions, heaters,{" "}
          <a className="text-blue-600 hover:underline" href="#">fans</a>, mixer grinders, blenders, cookers, grillers, gas stoves,{" "}
          <a className="text-blue-600 hover:underline" href="#">cooktops</a>, etc.
        </div>

        <div>
          <strong>Industrial Tools:</strong> These tools can help hasten your project and provide ease in your DIY projects. Panda Machine has power tools products such as{" "}
          <a className="text-blue-600 hover:underline" href="#">drills</a>,{" "}
          <a className="text-blue-600 hover:underline" href="#">grinders</a>, pneumatic tools, material handling tools, precision measuring tools, and hand tools like saws,
          spanners,{" "}
          <a className="text-blue-600 hover:underline" href="#">welding machines</a>, tool kits,{" "}
          <a className="text-blue-600 hover:underline" href="#">vices</a>, clamps, etc.
        </div>

        <div>
          <strong>Electric Tools and Equipment:</strong> All electrical appliances must work at their optimum levels, ensuring precision and cost-effectiveness. Panda Machine has many tools, such as wires, circuit breakers, fuses, switches,{" "}
          <a className="text-blue-600 hover:underline" href="#">generators</a>, transformers,{" "}
          <a className="text-blue-600 hover:underline" href="#">solar inverters</a>, and much more.
        </div>

        <div>
          <strong>Safety Supplies:</strong> For every supervisor and manager, their employee’s safety plays a pivotal role. The best-in-class safety products at Panda Machine are safety shoes,{" "}
          <a className="text-blue-600 hover:underline" href="#">safety helmets</a>, workwear, safety gloves,{" "}
          <a className="text-blue-600 hover:underline" href="#">traffic safety</a>, etc.
        </div>

        <div>
          <strong>Office Supplies:</strong> Your office should be as ideal as your home, get all the perfect office supplies and equipment at Panda Machine to have a flawless experience.
          The top-quality office tools are printers,{" "}
          <a className="text-blue-600 hover:underline" href="#">office chairs</a>, currency-counting machines,{" "}
          <a className="text-blue-600 hover:underline" href="#">barcode scanners</a>, office stationery, etc.
        </div>

        <div>
          <strong>Automotive Products:</strong> The proper functioning of a vehicle is important for every individual. Panda Machine offers a variety of products related to vehicle
          problems, updating, accessories, etc. They include compressor pumps, vehicle kits, vehicle lights,{" "}
          <a className="text-blue-600 hover:underline" href="#">bike helmets</a>, car mats,{" "}
          <a className="text-blue-600 hover:underline" href="#">vehicle horns</a>, and much more.
        </div>

        <div>
          <strong>Agriculture and Gardening:</strong> It is very important to have a productive and efficient crop yield. Agriculture and Gardening are labor-intensive in
          nature, and that are being replaced by machines to offer better and cost-effective results. Panda Machine provides a variety of quality tools, such as chain saws,
          hedge trimmers, sprayers,{" "}
          <a className="text-blue-600 hover:underline" href="#">brush cutters</a>,{" "}
          <a className="text-blue-600 hover:underline" href="#">grass trimmers</a>, and more.
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;
