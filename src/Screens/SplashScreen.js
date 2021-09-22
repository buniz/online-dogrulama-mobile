import React, {useState, useEffect, useContext} from 'react';
import {ActivityIndicator, View, StyleSheet, Image} from 'react-native';
import {Context} from '../context/AuthContext';
import {configureAxiosHeaders} from '../utils/useApi';

const SplashScreen = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);
  const {fetch, state} = useContext(Context);
  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (!state?.loading) {
      if (state?.token) {
        configureAxiosHeaders(state.token);
        navigation.navigate('Home');
      } else {
        navigation.navigate('Login');
      }
    }
  }, [state?.token, state.loading]);
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#307ecc',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
