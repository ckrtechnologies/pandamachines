import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AuthPage from '../../src/components/LoginAndRegister/AuthPage';
import AddAddressScreen from '../components/Address/AddAddressScreen';
import AddressListScreen from '../components/Address/AddressListScreen';
import ProductDetails from '../components/NestedCategories/ProductDetails';
import ProductsPage from '../components/NestedCategories/ProductsPage';
import BuyNow from '../components/Orders/BuyNow';
import OrderDetailsScreen from '../components/Orders/OrderDetailsScreen';
import OrderSummary from '../components/Orders/OrderSummary';
import UserOrdersScreen from '../components/Orders/UserOrdersScreen';
import SearchAppProducts from '../components/products/SearchAppProducts';
import RequestQuotationScren from '../components/Quotation/QuotationScreen';
import SellerApply from '../components/seller/SellerApply';
import BlogDetailsScreen from '../components/SideScreens/BlogDetailsScreen';
import BlogScreen from '../components/SideScreens/BlogScreen';
import Inquiry from '../components/SideScreens/Inquiry';
import OffersScreen from '../components/SideScreens/OffersScreen';
import OnlineConsultation from '../components/SideScreens/OnlineConsultation';
import WishlistScreen from '../components/SideScreens/WishlistScreen';
import { useAuth } from '../context/AuthContext';
import Cart from '../screens/homeStack/Cart';
import Categories from '../screens/homeStack/Categories';
import Home from '../screens/homeStack/Home';
import Checkout from '../screens/checkout/Checkout';
import OrderSuccess from '../screens/checkout/OrderSuccess';
import Profile from '../screens/homeStack/Profile';
import Splash from '../screens/splash/Splash';
import SubCategories from '../components/NestedCategories/SubCategories';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const colors = {
  primaryColor: '#00569e',
  primaryFadedColor: '#a6c9e9',
  accentColor: '#8cc441',
  primaryTextColor: '#1f2937',
  secondaryTextColor: '#6b7280',
  primaryBtnColor: '#004680',
  primaryBtnHoverColor: '#00365f',
  skeletonLoaderColor: '#e5e7eb',
};

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={Home} />
    </Stack.Navigator>
  );
};

// Categories Stack Navigator
const CategoriesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoriesMain" component={Categories} />
      <Stack.Screen name="SubCategories" component={SubCategories} />
      <Stack.Screen name="ProductsPage" component={ProductsPage} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainTabs = () => {
  const { isLoggedIn } = useAuth();
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeStack') {
            iconName = 'home';
          } else if (route.name === 'CategoriesStack') {
            iconName = 'category';
          } else if (route.name === 'Cart') {
            iconName = 'shopping-cart';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primaryBtnColor,
        tabBarInactiveTintColor: colors.secondaryTextColor,
        tabBarLabelStyle: {
          fontFamily: 'Lato-Regular',
          letterSpacing: 0.5,
          fontSize: 12,
          color: colors.primaryTextColor,
        },
        tabBarStyle: {
          display: 'flex',
          paddingBottom: 5,
          paddingTop: 5,
          height: 65,
          backgroundColor: '#ffffff',
          borderTopColor: colors.primaryFadedColor,
          borderTopWidth: 1,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="CategoriesStack"
        component={CategoriesStack}
        options={{
          tabBarLabel: 'Categories',
        }}
      />

      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{ tabBarLabel: 'Cart' }}
        listeners={({ navigation: navProp }) => ({
          tabPress: async e => {
            e.preventDefault();
            if (isLoggedIn) {
              navProp.navigate('Cart');
            } else {
              navProp.navigate('AuthPage');
            }
          },
        })}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: 'Profile' }}
        listeners={({ navigation: navProp }) => ({
          tabPress: async e => {
            e.preventDefault();
            if (isLoggedIn) {
              navProp.navigate('Profile');
            } else {
              navProp.navigate('AuthPage');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={Splash} />

      <Stack.Screen name="MainTabs" component={MainTabs} />

      <Stack.Group screenOptions={{ presentation: 'modal' }}>

        <Stack.Screen name="AuthPage" component={AuthPage} />

      </Stack.Group>

      <Stack.Group>

        <Stack.Screen name="ProductSearch" component={SearchAppProducts} />

        <Stack.Screen name="ProductDetails" component={ProductDetails} />

      </Stack.Group>

      <Stack.Group>

        <Stack.Screen name="UserOrdersScreen" component={UserOrdersScreen} />

        <Stack.Screen name="OrderSummary" component={OrderSummary} />

        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />

        <Stack.Screen name="BuyNow" component={BuyNow} />

        <Stack.Screen name="Checkout" component={Checkout} />

        <Stack.Screen name="OrderSuccess" component={OrderSuccess} />

      </Stack.Group>

      <Stack.Group>

        <Stack.Screen name="AddAddress" component={AddAddressScreen} />

        <Stack.Screen name="AddressListScreen" component={AddressListScreen} />

      </Stack.Group>

      <Stack.Group>

        <Stack.Screen name="BlogScreen" component={BlogScreen} />

        <Stack.Screen name="BlogDetails" component={BlogDetailsScreen} />

      </Stack.Group>

      <Stack.Screen name="WishlistScreen" component={WishlistScreen} />

      <Stack.Screen name="OffersScreen" component={OffersScreen} />

      <Stack.Screen name="SellerApply" component={SellerApply} />

      <Stack.Screen name="Quotation" component={RequestQuotationScren} />

      <Stack.Screen name="OnlineConsultation" component={OnlineConsultation} />

      <Stack.Screen name="Inquiry" component={Inquiry} />

    </Stack.Navigator>
  )
}
export default AppNavigator;
