import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FilterSidebar() {
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [subCategoryExpanded, setSubCategoryExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Food Processing Plant');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    'Juice & Beverage Plant',
    'Food Processing Plant',
    'Filling & Packing Machines',
    'Bakery Plant',
    'Plastic Product Plant',
    'Pharmaceutical Plant',
    'Dairy Plant',
    'Paper Products Plant',
    'Other Industrial Plants',
    'Testing Equipments',
    'Cosmetics Manufacturing'
  ];

  // Subcategories based on selected category
  const getSubCategories = (category) => {
    const subCategoriesMap = {
      'Juice & Beverage Plant': [
        'Juice Processing Line',
        'Beverage Mixing System',
        'Pasteurization Unit',
        'Carbonation System'
      ],
      'Food Processing Plant': [
        'Vegetable Processing',
        'Meat Processing',
        'Canning Line',
        'Freezing Line',
        'Packaging Line'
      ],
      'Filling & Packing Machines': [
        'Liquid Filling Machines',
        'Powder Filling Machines',
        'Capping Machines',
        'Labeling Machines',
        'Case Packers'
      ],
      'Bakery Plant': [
        'Dough Mixers',
        'Baking Ovens',
        'Cooling Tunnels',
        'Slicing Machines',
        'Packaging Lines'
      ],
      'Plastic Product Plant': [
        'Injection Molding',
        'Blow Molding',
        'Extrusion Lines',
        'Thermoforming'
      ],
      'Pharmaceutical Plant': [
        'Tablet Press',
        'Capsule Filling',
        'Coating Machine',
        'Sterilization Equipment'
      ],
      'Dairy Plant': [
        'Milk Processing',
        'Cheese Production',
        'Yogurt Fermentation',
        'Packaging Lines'
      ],
      'Paper Products Plant': [
        'Tissue Paper Machines',
        'Paper Cup Machines',
        'Box Making Machines'
      ],
      'Other Industrial Plants': [
        'Chemical Processing',
        'Textile Machinery',
        'Metal Working'
      ],
      'Testing Equipments': [
        'Lab Testing',
        'Quality Control',
        'Inspection Systems'
      ],
      'Cosmetics Manufacturing': [
        'Mixing Tanks',
        'Filling Lines',
        'Packaging Machines'
      ]
    };

    return subCategoriesMap[category] || [];
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(''); // Reset subcategory when category changes
  };

  return (
    <div className="relative">
      {/* Mobile filter button */}
      <div className="lg:hidden p-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-between w-full px-4 py-2 bg-slate-700 text-white rounded-md"
        >
          <span>Filters</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Sidebar - hidden on mobile unless menu is open */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block px-4 md:px-6 py-4`}>
        <div className="w-full lg:w-64 border border-gray-200 lg:border-r lg:border-t-0 lg:border-b-0 lg:border-l-0 rounded-lg lg:rounded-none space-y-6">
          {/* Filter by Category */}
          <div className="bg-slate-700 text-white px-4 py-3 rounded-t-lg lg:rounded-t-none">
            <button
              onClick={() => setCategoryExpanded(!categoryExpanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium">Filter by Category</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${categoryExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          
          {categoryExpanded && (
            <div className="border-b border-gray-200">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 ${
                    selectedCategory === category 
                      ? 'bg-orange-100 text-orange-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}

          {/* Filter by Sub-Category */}
          <div className="bg-slate-700 text-white px-4 py-3">
            <button
              onClick={() => setSubCategoryExpanded(!subCategoryExpanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium">Filter by Sub-Category</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${subCategoryExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          
          {subCategoryExpanded && (
            <div className="border-b border-gray-200">
              {getSubCategories(selectedCategory).map((subCategory, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 ${
                    selectedSubCategory === subCategory 
                      ? 'bg-orange-100 text-orange-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSubCategory(subCategory)}
                >
                  {subCategory}
                </div>
              ))}
            </div>
          )}

          {/* Filter by Price */}
          <div className="bg-slate-700 text-white px-4 py-3 rounded-b-lg lg:rounded-b-none">
            <button className="flex items-center justify-between w-full text-left">
              <span className="font-medium">Filter by Price</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}