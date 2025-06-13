import React from "react";
import SellersNav from "../../components/common/SellersNav";
import SellersFooter from "../../components/common/SellersFooter";
import { Home, ChevronRight } from "lucide-react";
import { IoIosArrowDroprightCircle } from "react-icons/io";

const Categories = () => {
  const categories = [
    { name: "Soft Drink / Cold Drink", count: "03 items includes" },
    { name: "Soya / Soya Chunks Plant", count: "01 items includes" },
    { name: "Food Processing Machine", count: "77 items includes" },
    { name: "Filling Machine", count: "04 items includes" },
    { name: "Mineral Water Bottle Filling Machine", count: "34 items includes" },
    { name: "Fully Automatic Labeling Machine", count: "07 items includes" },
    { name: "Industrial Machines", count: "07 items includes" },
    { name: "Liquid Filling Machine", count: "08 items includes" },
    { name: "Multibead Weight Filter", count: "04 items includes" },
    { name: "Shrink Wrapping Machine", count: "03 items includes" },
    { name: "120 BPM BOPP Labeling Machine", count: "03 items includes" },
    { name: "Hope Bottle Filling", count: "02 items includes" },
    { name: "Soft Drink Plant", count: "02 items includes" },
    { name: "Reverse Osmosis Plant", count: "03 items includes" },
    { name: "Capping Machine", count: "03 items includes" },
    { name: "Mineral Water Turnkey Project", count: "03 items includes" },
    { name: "Pouch Packing & Sealing Machines", count: "01 items includes" },
    { name: "Cup Filling Machine", count: "01 items includes" },
    { name: "Mineral Water Pet Bottle Blowing", count: "2 items includes" },
    { name: "Pouch Filling Machine", count: "01 items includes" },
    { name: "Chapati Making Machine", count: "01 items includes" },
    { name: "Pasteurizer Unit", count: "01 items includes" },
    { name: "Pet Blow Moulding Machine", count: "01 items includes" },
    { name: "Cup Sealing Machine", count: "01 items includes" },
    { name: "Mineral Water Laboratory Set Up", count: "01 items includes" },
    { name: "Water Software", count: "01 items includes" },
    { name: "Automatic Packaging Machines", count: "01 items includes" },
    { name: "Juice Filling Machine", count: "2 items includes" },
    { name: "Certification", count: "05 items includes" },
  ];

  return (
    <div>
      <SellersNav />
      <header className="bg-slate-700 text-white">
        <div className="mx-auto py-4 px-4 md:px-6 xl:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-orange-400">Categories</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto px-4 md:px-6 xl:px-6 py-8">    
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h2 className="text-lg tracking-wide font-semibold mb-2 text-blue-900">{category.name}</h2>
              <p className="text-orange-500  transition-colors  text-sm mb-3">{category.count}</p>
              <div className="flex justify-end">
                <IoIosArrowDroprightCircle size={28} className="hover:text-orange-500 text-gray-600 cursor-pointer"/>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Categories;