import React from "react";
import { Home, ChevronRight, X } from "lucide-react";
import SellersNav from "../../components/common/SellersNav";
import AllUserFooter from "../../components/common/AllUserFooter";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate();
  // Cart items data
  const cartItems = [
    {
      id: 1,
      name: "Water Purification RO Plant",
      price: 100000,
      quantity: 5,
      image:
        "https://tse2.mm.bing.net/th?id=OIP.5oFe5b6yVztc6bD7lCV99QHaGN&pid=Api&P=0&h=180",
    },
    {
      id: 2,
      name: "Water Purification RO Plant",
      price: 100000,
      quantity: 5,
      image:
        "https://tse2.mm.bing.net/th?id=OIP.5oFe5b6yVztc6bD7lCV99QHaGN&pid=Api&P=0&h=180",
    },
  ];

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 500;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-orange-50">
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

      <main className="flex-grow w-full mx-auto px-4 md:px-6 lg:px-6 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">
          My Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items - Takes 3/4 width on desktop, full width on mobile */}
          <div className="lg:w-3/4">
            {/* Mobile View - Column Layout */}
            <div className="lg:hidden space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <h3 className="font-semibold text-gray-900 tracking-wide">
                        {item.name}
                      </h3>
                    </div>
                    <button className="text-gray-400 hover:text-red-500">
                      <X className="w-5 h-5 " />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <span className="font-bold">
                      {item.price.toLocaleString()}
                    </span>
                    <div className="flex items-center border rounded-full justify-center p-1">
                      <button className="px-3 py-1 rounded-full bg-gray-100">-</button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button className="px-3 py-1 rounded-full bg-gray-100">+</button>
                    </div>
                    <span className="font-bold text-right">
                      {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Table Row Layout */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PRODUCT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PRICE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      QUANTITY
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SUBTOTAL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {/* Empty header for delete button */}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-20 object-cover rounded"
                          />
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center p-1 border rounded-full w-24">
                          <button className="px-2 py-1 rounded-full bg-gray-100 flex-grow">
                            -
                          </button>
                          <span className="px-2 py-1 text-center">
                            {item.quantity}
                          </span>
                          <button className="px-2 py-1 rounded-full bg-gray-100 flex-grow">
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-gray-400 hover:text-red-500">
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="w-full h-px bg-gray-200"></div>
              <div className="flex justify-center p-4">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded">
                  Return to shop
                </button>
              </div>
            </div>
          </div>

          {/* Cart Total - Takes 1/4 width on desktop, full width on mobile */}
          <div className="lg:w-1/4">
            <div className="bg-white px-6 py-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-6">Cart Total</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Subtotal:</span>
                  <span>{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Shipping:</span>
                  <span>{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">{total.toLocaleString()}</span>
                </div>
              </div>
              <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded">
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      </main>
      <AllUserFooter />
    </div>
  );
};

export default Cart;
