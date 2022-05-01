import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NewsFeed from './src/Screens/DashBoard/NewsFeed';
import UserProfile from './src/Screens/DashBoard/UserProfile'
import Feedback from './src/Screens/DashBoard/Feedback'
import { AuthContext } from './src/Components/context';
import RootStackScreen from './src/Screens/Authentication/RootStackScreen'
import { Provider as PaperProvider } from 'react-native-paper';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Drawer = createDrawerNavigator();
import { DrawerContent } from './src/Components/DrawerContent';
import UserDetailsScreen from './src/Screens/Authentication/UserDetailsScreen';
import { Login, updateUser, SignUp } from './src/API/services'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import EditProfile from './src/Screens/DashBoard/EditProfile'


const App = () => {

  const initialLoginState = {
    isLoading: true,
    id: null,
    userName: null,
    userToken: null,
    newUser: true,
  };
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          id: action.id,
          userName: action.userName,
          userToken: action.token,
          isLoading: false,
          newUser: action.newUser
        };
      case 'LOGIN':
        return {
          ...prevState,
          id: action.id,
          userName: action.userName,
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
          userToken: action.token,
          newUser: false
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);


  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {
      // const userToken = String(foundUser.userToken);
      // const userName = foundUser.username;
      // try {
      //   await AsyncStorage.setItem('userToken', userToken);
      // } catch (e) {
      //   console.log(e);
      // }
      // dispatch({ type: 'LOGIN', id: userName, token: userToken, newUser: true });
      // setUserToken('fgkj');
      // setIsLoading(false);
      console.log(foundUser);
      try {
        const res = await Login(foundUser);
        console.log(res);
        if (!res.data.token) {
          console.log(res.data.message);
        }
        else {
          const userToken = res.data.token;
          const userdata = JSON.parse(atob(userToken.split('.')[1]));
          let username = userdata['fullName'];
          let id = userdata._id;
          console.log(userdata);
          try {
            await AsyncStorage.setItem('userToken', userToken);
          } catch (e) {
            console.log(e);
          }
          dispatch({ type: 'LOGIN', id: id, userName: username, token: userToken, newUser: userdata.newUser });
        }

      } catch (error) {
        console.log(error);
      }

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
    signUp: async (data) => {
      // setUserToken('fgkj');
      // setIsLoading(false);
      const res = await SignUp(data);
      console.log(res);

    },
    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    },
    detailsUpdate: async (updateData) => {
      try {
        const res = await updateUser(updateData);
        let userToken;
        if (res.data.token) {
          userToken = res.data.token
          await AsyncStorage.setItem('userToken', userToken);
          dispatch({ type: 'DETAILS_SUBMITTED', token: userToken });
        }
        else {
          console.log("something went wrong in updating the data")
        }
      } catch (error) {
        console.log(error);
      }
    }
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let userToken, username, id, isnewUser;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        const userdata = JSON.parse(atob(userToken.split('.')[1]));
        username = userdata['fullName'];
        id = userdata._id;
        isnewUser = userdata['newUser']
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken, userName: username, id: id, newUser: isnewUser });
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  function Root() {
    return (
      <Stack.Navigator initialRouteName="InProfile" screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="InProfile" component={UserProfile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
      </Stack.Navigator>
    );
  }


  return (
    <PaperProvider >
      <AuthContext.Provider value={{ authContext, loginState }}>
        <NavigationContainer>
          {
            loginState.userToken !== null ? (
              loginState.newUser == true ? <UserDetailsScreen /> : (
                <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
                  <Drawer.Screen name="Home" component={NewsFeed} />
                  <Drawer.Screen name="Profile" component={Root} />
                  <Drawer.Screen name="Feedback" component={Feedback} />
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