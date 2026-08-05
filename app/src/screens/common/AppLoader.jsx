import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { G, Circle, Polygon } from 'react-native-svg';

const AppLoader = ({ size = 80 }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue1 = useRef(new Animated.Value(1)).current;
  const scaleValue2 = useRef(new Animated.Value(1)).current;
  const scaleValue3 = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const createPulseAnimation = (scaleValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(scaleValue, {
            toValue: 1.3,
            duration: 800,
            easing: Easing.bezier(0.45, 0.05, 0.55, 0.95),
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 800,
            easing: Easing.bezier(0.45, 0.05, 0.55, 0.95),
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    spinAnimation.start();
    createPulseAnimation(scaleValue1, 0).start();
    createPulseAnimation(scaleValue2, 800).start();
    createPulseAnimation(scaleValue3, 1600).start();
    opacityAnimation.start();

    return () => {
      spinAnimation.stop();
      opacityAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Generate gear teeth
  const generateGearTeeth = (radius, teethCount = 12) => {
    const teeth = [];
    const angle = 360 / teethCount;

    for (let i = 0; i < teethCount; i++) {
      const startAngle = i * angle * (Math.PI / 180);
      const endAngle = (i + 1) * angle * (Math.PI / 180);

      const outerRadius = radius * 1.15;
      const innerRadius = radius * 0.85;

      const x1 = radius + innerRadius * Math.cos(startAngle);
      const y1 = radius + innerRadius * Math.sin(startAngle);
      const x2 =
        radius +
        outerRadius * Math.cos(startAngle + (angle / 2) * (Math.PI / 180));
      const y2 =
        radius +
        outerRadius * Math.sin(startAngle + (angle / 2) * (Math.PI / 180));
      const x3 = radius + innerRadius * Math.cos(endAngle);
      const y3 = radius + innerRadius * Math.sin(endAngle);

      teeth.push({ x1, y1, x2, y2, x3, y3 });
    }

    return teeth;
  };

  const gearRadius = size / 2;
  const teeth = generateGearTeeth(gearRadius, 12);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width: size, height: size }]}>
        {/* Animated Gear Ring */}
        <Animated.View
          style={{
            width: size,
            height: size,
            transform: [{ rotate: spin }],
          }}
        >
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <G>
              {/* Outer gear circle */}
              <Circle
                cx={gearRadius}
                cy={gearRadius}
                r={gearRadius * 0.95}
                fill="none"
                stroke="#00569e"
                strokeWidth={size * 0.08}
              />

              {/* Gear teeth */}
              {teeth.map((tooth, idx) => (
                <Polygon
                  key={idx}
                  points={`${tooth.x1},${tooth.y1} ${tooth.x2},${tooth.y2} ${tooth.x3},${tooth.y3}`}
                  fill="#00569e"
                />
              ))}

              {/* Inner circle */}
              <Circle
                cx={gearRadius}
                cy={gearRadius}
                r={gearRadius * 0.65}
                fill="none"
                stroke="#00569e"
                strokeWidth={size * 0.06}
              />
            </G>
          </Svg>
        </Animated.View>

        {/* Middle faded ring */}
        <Animated.View
          style={[
            styles.middleRing,
            {
              width: size * 0.75,
              height: size * 0.75,
              borderRadius: (size * 0.75) / 2,
              borderWidth: size * 0.04,
              top: size * 0.125,
              left: size * 0.125,
              opacity: opacityValue,
            },
          ]}
        />

        {/* Pulsing dots */}
        <Animated.View
          style={[
            styles.dot,
            {
              width: size * 0.15,
              height: size * 0.15,
              borderRadius: (size * 0.15) / 2,
              top: 0,
              left: size * 0.425,
              transform: [{ scale: scaleValue1 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              width: size * 0.15,
              height: size * 0.15,
              borderRadius: (size * 0.15) / 2,
              bottom: 0,
              left: size * 0.425,
              transform: [{ scale: scaleValue2 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              width: size * 0.15,
              height: size * 0.15,
              borderRadius: (size * 0.15) / 2,
              top: size * 0.425,
              right: 0,
              transform: [{ scale: scaleValue3 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              width: size * 0.15,
              height: size * 0.15,
              borderRadius: (size * 0.15) / 2,
              top: size * 0.425,
              left: 0,
              transform: [{ scale: scaleValue1 }],
            },
          ]}
        />

        {/* Center accent circle */}
        <View
          style={[
            styles.centerCircle,
            {
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: (size * 0.25) / 2,
              top: size * 0.375,
              left: size * 0.375,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d5e7f0ff',
  },
  container: {
    position: 'relative',
  },
  middleRing: {
    position: 'absolute',
    borderColor: '#a6c9e9',
  },
  dot: {
    position: 'absolute',
    backgroundColor: '#8cc441',
  },
  centerCircle: {
    position: 'absolute',
    backgroundColor: '#004680',
    shadowColor: '#00569e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default AppLoader;

// import React, { useEffect, useRef } from 'react';
// import { View, Animated, Easing, StyleSheet } from 'react-native';

// const AppLoader = ({ size = 80 }) => {
//   const spinValue = useRef(new Animated.Value(0)).current;
//   const scaleValue1 = useRef(new Animated.Value(1)).current;
//   const scaleValue2 = useRef(new Animated.Value(1)).current;
//   const scaleValue3 = useRef(new Animated.Value(1)).current;
//   const opacityValue = useRef(new Animated.Value(0.3)).current;

//   useEffect(() => {
//     // Rotation animation
//     const spinAnimation = Animated.loop(
//       Animated.timing(spinValue, {
//         toValue: 1,
//         duration: 2000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       }),
//     );

//     // Pulsing animations for circles
//     const createPulseAnimation = (scaleValue, delay) => {
//       return Animated.loop(
//         Animated.sequence([
//           Animated.delay(delay),
//           Animated.timing(scaleValue, {
//             toValue: 1.3,
//             duration: 800,
//             easing: Easing.bezier(0.45, 0.05, 0.55, 0.95),
//             useNativeDriver: true,
//           }),
//           Animated.timing(scaleValue, {
//             toValue: 1,
//             duration: 800,
//             easing: Easing.bezier(0.45, 0.05, 0.55, 0.95),
//             useNativeDriver: true,
//           }),
//         ]),
//       );
//     };

//     // Opacity animation
//     const opacityAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(opacityValue, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(opacityValue, {
//           toValue: 0.3,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ]),
//     );

//     spinAnimation.start();
//     createPulseAnimation(scaleValue1, 0).start();
//     createPulseAnimation(scaleValue2, 800).start();
//     createPulseAnimation(scaleValue3, 1600).start();
//     opacityAnimation.start();

//     return () => {
//       spinAnimation.stop();
//       opacityAnimation.stop();
//     };
//   }, []);

//   const spin = spinValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   return (
//     <View style={styles.wrapper}>
//       <View style={[styles.container, { width: size, height: size }]}>
//         {/* Outer rotating ring */}
//         <Animated.View
//           style={[
//             styles.outerRing,
//             {
//               width: size,
//               height: size,
//               borderRadius: size / 2,
//               borderWidth: size * 0.05,
//               transform: [{ rotate: spin }],
//             },
//           ]}
//         />

//         {/* Middle faded ring */}
//         <Animated.View
//           style={[
//             styles.middleRing,
//             {
//               width: size * 0.75,
//               height: size * 0.75,
//               borderRadius: (size * 0.75) / 2,
//               borderWidth: size * 0.04,
//               top: size * 0.125,
//               left: size * 0.125,
//               opacity: opacityValue,
//             },
//           ]}
//         />

//         {/* Pulsing dots */}
//         {/* Top dot */}
//         <Animated.View
//           style={[
//             styles.dot,
//             {
//               width: size * 0.15,
//               height: size * 0.15,
//               borderRadius: (size * 0.15) / 2,
//               top: 0,
//               left: size * 0.425,
//               transform: [{ scale: scaleValue1 }],
//             },
//           ]}
//         />
//         {/* Bottom dot */}
//         <Animated.View
//           style={[
//             styles.dot,
//             {
//               width: size * 0.15,
//               height: size * 0.15,
//               borderRadius: (size * 0.15) / 2,
//               bottom: 0,
//               left: size * 0.425,
//               transform: [{ scale: scaleValue2 }],
//             },
//           ]}
//         />
//         {/* Right dot */}
//         <Animated.View
//           style={[
//             styles.dot,
//             {
//               width: size * 0.15,
//               height: size * 0.15,
//               borderRadius: (size * 0.15) / 2,
//               top: size * 0.425,
//               right: 0,
//               transform: [{ scale: scaleValue3 }],
//             },
//           ]}
//         />
//         {/* Left dot */}
//         <Animated.View
//           style={[
//             styles.dot,
//             {
//               width: size * 0.15,
//               height: size * 0.15,
//               borderRadius: (size * 0.15) / 2,
//               top: size * 0.425,
//               left: 0,
//               transform: [{ scale: scaleValue1 }],
//             },
//           ]}
//         />

//         {/* Center accent circle */}
//         <View
//           style={[
//             styles.centerCircle,
//             {
//               width: size * 0.25,
//               height: size * 0.25,
//               borderRadius: (size * 0.25) / 2,
//               top: size * 0.375,
//               left: size * 0.375,
//             },
//           ]}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     position: 'relative',
//   },
//   outerRing: {
//     position: 'absolute',
//     borderColor: '#00569e',
//     borderTopColor: 'transparent',
//     borderRightColor: 'transparent',
//   },
//   middleRing: {
//     position: 'absolute',
//     borderColor: '#a6c9e9',
//   },
//   dot: {
//     position: 'absolute',
//     backgroundColor: '#8cc441',
//   },
//   centerCircle: {
//     position: 'absolute',
//     backgroundColor: '#004680',
//     shadowColor: '#00569e',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
// });

// export default AppLoader;
