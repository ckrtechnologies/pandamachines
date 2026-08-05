import React, { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Categories from '../screens/homeStack/Categories';
import Profile from '../screens/homeStack/Profile';
import Cart from '../screens/homeStack/Cart';
import Home from '../screens/homeStack/Home';
import { Alert, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

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

const HomeStack = () => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Exit App', 'Do you want to exit the app?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Categories') {
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
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Categories"
        component={Categories}
        options={{
          tabBarLabel: 'Categories',
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarLabel: 'Cart',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeStack;
