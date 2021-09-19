import React, { useState } from "react";
import { View, Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity } from "react-native";


const HomeScreen = ({navigation}) => {
  const [trackNo, setTrackNo] = React.useState(null);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 20}}>
        <View
          style={{
          height:50,
            alignItems: 'center',
            justifyContent: 'center',
            width:"100%"
          }}>
            <TextInput
              style={styles.input}
              onChangeText={(trackNo) =>
                setTrackNo(trackNo)
              }
              value={trackNo}
              placeholder="TR"
              keyboardType="numeric"
            />

      </View>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => navigation.navigate()}
        >
          <Text style={styles.buttonTextStyle}>Ara</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    width:300,
    borderColor: '#dadae8',
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
    width:300,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default HomeScreen;
