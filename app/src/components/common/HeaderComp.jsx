import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {WIDTH} from '../../utils/basicInfo';

const HeaderComp = ({navigation, header, back}) => {
  return (
    <View
      style={{
        height: 32,
        width: WIDTH,
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 30,
        backgroundColor: '#F2FCFF',
        elevation: 5,
      }}>
      <TouchableOpacity
        onPress={back}
        style={{
          height: 40,
          width: 40,
          justifyContent: 'center',
          paddingLeft: 10,
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          elevation: 5,
        }}>
        <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
      </TouchableOpacity>

      <View style={{height: 40, width: '80%', justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: 'Lato-Regular',
            fontSize: 18,
            textAlign: 'center',
            color: 'black',
            height: 30,
            letterSpacing: 0.5,
            // fontWeight: 'bold',
          }}>
          {header}
        </Text>
      </View>
      {/* <TouchableOpacity
        onPress={back}
        style={{
          height: 40,
          width: 40,
          justifyContent: 'center',
          paddingLeft: 10,
          backgroundColor: '#e1eff8',
          borderRadius: 50,
        }}>
        <MaterialIcons name="edit-note" size={25} color="#1677CA" />
      </TouchableOpacity> */}
    </View>
  );
};

export default HeaderComp;
