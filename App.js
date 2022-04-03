import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NewsFeed from './src/Screens/DashBoard/NewsFeed';
import { AuthContext } from './src/Components/context';
import RootStackScreen from './src/Screens/Authentication/RootStackScreen'
import { Provider as PaperProvider } from 'react-native-paper';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Drawer = createDrawerNavigator();
import { DrawerContent } from './src/Components/DrawerContent';
import UserDetailsScreen from './src/Screens/Authentication/UserDetailsScreen';

const App = () => {

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    newUser: true,
  };
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
          newUser: action.newUser
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'DETAILS_SUBMITTED':
        return {
          ...prevState,
          newUser: false
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {
      // setUserToken('fgkj');
      // setIsLoading(false);
      console.log(foundUser);
      const userToken = String(foundUser.userToken);
      const userName = foundUser.username;
      try {
        await AsyncStorage.setItem('userToken', userToken);
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'LOGIN', id: userName, token: userToken, newUser: foundUser.newUser });
    },
    signOut: async () => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    },
    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    },
    detailsUpdate: () => {
      dispatch({ type: 'DETAILS_SUBMITTED' });
    }
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <PaperProvider >
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {
            loginState.userToken !== null ? (
              loginState.newUser == true ? <UserDetailsScreen /> : (
                <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
                  <Drawer.Screen name="HomeDrawer" component={NewsFeed} />
                </Drawer.Navigator>
              )
            ) :
              <RootStackScreen />
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>


  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignContent: "center",
    fontSize: 22
  },
  icon: {
    //marginLeft: 25,
    backgroundColor: '#f4511e',
    fontSize: 30,
    color: 'white'
  }
})

export default App;