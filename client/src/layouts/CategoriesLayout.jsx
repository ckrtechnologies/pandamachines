import AllCategories from "../screens/users/Category/Allcategories";
import MobileCategoryPage from "../screens/users/Category/MobileCategoryPage";

const CategoriesLayout = () => {
    return (
        <>
            <div className="block lg:hidden">
                <MobileCategoryPage />
            </div>

            <div className="hidden lg:block">
                <AllCategories />
            </div>
        </>
    );
};
export default CategoriesLayout;