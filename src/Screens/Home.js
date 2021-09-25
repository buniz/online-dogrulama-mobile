import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {useAPI} from '../utils/useApi';
import {Context} from '../context/AuthContext';

const HomeScreen = ({navigation}) => {
  const {get} = useAPI();

  const [trackNo, setTrackNo] = React.useState('');
  const [document, setDocument] = useState({information: [], data: []});
  const {signout} = useContext(Context);
  const searchTrackingNumber = () => {
    const endpoint = `filledDocuments/byTrackingNumber/${trackNo}`;
    get({endpoint}).then(response => {
      if (response?.status) {
        setDocument(response.document);
      }
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableOpacity
        style={{
          borderRadius: 10,
          alignItems: 'flex-end',
          marginTop: 20,
          marginRight: 20,
        }}
        onPress={() => {
          signout();
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#219ebc'}}>
          Çıkış
        </Text>
      </TouchableOpacity>
      <View style={{flex: 1, padding: 20, marginTop: 20}}>
        <View
          style={{
            height: 150,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
          <TextInput
            style={styles.input}
            onChangeText={trackNo => setTrackNo(trackNo)}
            value={trackNo}
            placeholder="Takip Numarası"
          />
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={searchTrackingNumber}>
            <Text style={styles.buttonTextStyle}>Ara</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{
            width: '100%',
            marginTop: 30,
          }}>
          {document.information.length ? (
            <>
              {document.information.map(item => (
                <View
                  key={item._id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  <Text style={styles.generalDataKey}>{item.key}:</Text>
                  <Text style={styles.generalDataValue}>{item.value}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={{
                  ...styles.buttonStyle,
                  width: '82%',
                  backgroundColor: '#219ebc',
                }}
                activeOpacity={0.5}
                onPress={() => {
                  setTrackNo('');
                  setDocument({information: [], data: []});
                  navigation.navigate('Verify', {
                    data: document.data,
                    documentId: document._id,
                  });
                }}>
                <Text style={styles.buttonTextStyle}>Doğrula</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </ScrollView>
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
    width: 300,
    borderColor: '#dadae8',
  },
  buttonStyle: {
    backgroundColor: '#90be6d',
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
    width: 300,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  generalDataKey: {
    margin: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  generalDataValue: {
    margin: 10,
    fontSize: 16,
  },
});

export default HomeScreen;
