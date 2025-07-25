import React, { useState, useEffect } from 'react';
import { FiUsers, FiLayers, FiGrid, FiPackage } from "react-icons/fi";
import axios from 'axios';

function DashboardsmallCards() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const baseUrl = process.env.REACT_APP_API_URL;

                const [usersRes, categoriesRes, subCategoriesRes, productsRes] = await Promise.all([
                    axios.get(`${baseUrl}/customers/get-all-users`),
                    axios.get(`${baseUrl}/categories/get-all-categories`),
                    axios.get(`${baseUrl}/sub-categories/get-all-sub-categories`),
                    axios.get(`${baseUrl}/products/get-all-products`),
                ]);

                setStats([
                    {
                        title: "Total Users",
                        value: usersRes.data.data.length ?? 0,
                        icon: <FiUsers size={24} />,
                    },
                    {
                        title: "Categories",
                        value: categoriesRes.data.length ?? 0,
                        icon: <FiLayers size={24} />,
                    },
                    {
                        title: "Sub-Categories",
                        value: subCategoriesRes.data.length ?? 0,
                        icon: <FiGrid size={24} />,
                    },
                    {
                        title: "Products",
                        value: productsRes.data.length ?? 0,
                        icon: <FiPackage size={24} />,
                    },
                ]);

            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    function getGradientColor(index) {
        const gradients = [
            "bg-gradient-to-b from-blue-500 to-blue-400",
            "bg-gradient-to-b from-green-500 to-green-400",
            "bg-gradient-to-b from-purple-500 to-purple-400",
            "bg-gradient-to-b from-amber-500 to-amber-400",
        ];
        return gradients[index % gradients.length];
    }
    function getIconBgColor(index) {
        const colors = [
            "bg-blue-100",
            "bg-green-100",
            "bg-purple-100",
            "bg-amber-100",
        ];
        return colors[index % colors.length];
    }

    function getIconColor(index) {
        const colors = [
            "text-blue-600",
            "text-green-600",
            "text-purple-600",
            "text-amber-600",
        ];
        return colors[index % colors.length];
    }

    if (loading) {
        return (
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                    Dashboard Overview
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="relative p-6 rounded-xl bg-white border border-gray-100 overflow-hidden shadow-md animate-pulse"
                        >
                            <div
                                className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-300 to-gray-200`}
                            ></div>

                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                    <div className="h-6 w-16 bg-gray-300 rounded"></div>
                                </div>
                                <div className="p-3 rounded-lg bg-gray-200">
                                    <div className="h-6 w-6 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

    return (
        <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                Dashboard Overview
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="group relative p-6 rounded-xl bg-white border border-gray-100 overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-lg shadow-md"
                    >

                        <div
                            className={`absolute top-0 left-0 w-1 h-full ${getGradientColor(
                                index
                            )}`}
                        ></div>

                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    {stat.title}
                                </p>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {stat.value}
                                </h3>
                            </div>
                            <div
                                className={`p-3 rounded-lg bg-opacity-80 ${getIconBgColor(
                                    index
                                )} group-hover:scale-110 transition-transform`}
                            >
                                {React.cloneElement(stat.icon, {
                                    className: `${getIconColor(index)} text-xl`,
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardsmallCards;


