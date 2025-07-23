import React from "react";
import BedsCarousel from "./BedsCarousel";
import UserNavbar from "./UserNavbar";
import SkeletonText from "./SkeletonText";

const UserProfileSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <UserNavbar />
            <BedsCarousel />
            <div className="w-full mx-auto py-4 px-4 md:px-6">
                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">

                   
                    <div className="flex justify-between items-start mt-6 mb-6">
                        <div className="flex items-center space-x-4">
                            <SkeletonText width="w-24" height="h-24" className="rounded-full" />
                           
                        </div>
                        <SkeletonText width="w-28" height="h-10" className="rounded-md" />
                    </div>
                     <div className="space-y-2 mt-4">
                                <SkeletonText width="w-48" height="h-6" className="mt-3" />
                                <SkeletonText width="w-32" height="h-5" />
                            </div>

                   
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-8">
                       
                        <div className="space-y-4 mt-4">
                            <SkeletonText width="w-40" height="h-6" /> 
                            <div className="space-y-2">
                                <SkeletonText width="w-16" height="h-4" /> 
                                <SkeletonText width="w-60" height="h-5" />
                            </div>
                            <div className="space-y-2">
                                <SkeletonText width="w-16" height="h-4" /> 
                                <SkeletonText width="w-40" height="h-5" /> 
                            </div>
                        </div>

                       
                        <div className="space-y-4">
                            <SkeletonText width="w-48" height="h-6" /> 
                            <div className="space-y-2">
                                <SkeletonText width="w-20" height="h-4" /> 
                                <SkeletonText width="w-24" height="h-5" /> 
                            </div>
                        </div>
                    </div>

                 
                    <div className="mt-6">
                        <SkeletonText width="w-24" height="h-10" className="rounded-md" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserProfileSkeleton;
