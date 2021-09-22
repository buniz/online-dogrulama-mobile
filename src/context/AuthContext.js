import createDataContext from './createDataContext';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {token: null, loading: true};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'signout':
      return {token: null, loading: false};
    case 'signin':
    case 'signup':
      return {
        token: action.payload.token,
        loading: false,
      };
    case 'fetch': {
      return {token: action.payload.token, loading: false};
    }
    default:
      return state;
  }
};

const signup = dispatch => {
  return ({email, password}) => {
    console.log('Signup');
  };
};

const signin = dispatch => {
  return ({token}) => {
    AsyncStorage.setItem('token', token).then(() => {
      dispatch({
        type: 'signin',
        payload: {
          token,
        },
      });
    });
  };
};

const fetch = dispatch => {
  return () => {
    AsyncStorage.getItem('token').then(token => {
      dispatch({
        type: 'signin',
        payload: {
          token,
        },
      });
    });
  };
};

const signout = dispatch => {
  return () => {
    AsyncStorage.removeItem('token').then(token => {
      dispatch({type: 'signout'});
    });
  };
};

export const {Provider, Context} = createDataContext(
  authReducer,
  {signin, signout, signup, fetch},
  initialState,
);
