import React, { useEffect } from 'react';
import { View, Alert, StyleSheet, ToastAndroid, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UserProfile from './src/Screens/DashBoard/UserProfile'
import Feedback from './src/Screens/DashBoard/Feedback'
import { AuthContext } from './src/Components/context';
import RootStackScreen from './src/Screens/Authentication/RootStackScreen'
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Drawer = createDrawerNavigator();
import { DrawerContent } from './src/Components/DrawerContent';
import UserDetailsScreen from './src/Screens/Authentication/UserDetailsScreen';
import { Login, updateUser, SignUp } from './src/API/services'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import EditProfile from './src/Screens/DashBoard/EditProfile'
import jwt_decode from "jwt-decode";
import { GetUserbyId } from './src/API/services';
import PostsPage from './src/Screens/DashBoard/PostsPage'


const App = () => {

  const navigationOptions = () => {
    return {
      headerStyle: {
        backgroundColor: '#009387',
      },
      headerTitleStyle: {
        color: '#fff',
      }
    }
  }

  function parseJwt(token) {
    if (token) {
      return jwt_decode(token);
    }
  }
  const initialLoginState = {
    email: null,
    id: null,
    userName: null,
    userToken: null,
    newUser: true,
    collegeId: null,
    courseId: null,
    departmentId: null,
    rollNumber: null,
    mobileNumber: null,
    roleId: null,
    isLoading: true
  };
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          id: action.id,
          userName: action.userName,
          userToken: action.token,
          email: action.email,
          newUser: action.newUser,
          collegeId: action.collegeId,
          courseId: action.courseId,
          departmentId: action.departmentId,
          rollNumber: action.rollNumber,
          mobileNumber: action.mobileNumber,
          roleId: action.roleId,
          isLoading: false
        };
      case 'LOGIN':
        return {
          ...prevState,
          id: action.id,
          userName: action.userName,
          userToken: action.token,
          email: action.email,
          newUser: action.newUser,
          collegeId: action.collegeId,
          courseId: action.courseId,
          departmentId: action.departmentId,
          rollNumber: action.rollNumber,
          mobileNumber: action.mobileNumber,
          roleId: action.roleId,
          isLoading: false
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          email: null,
          isLoading: false
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          email: action.email,
          isLoading: false
        };
      case 'DETAILS_SUBMITTED':
        return {
          ...prevState,
          userToken: action.token,
          collegeId: action.collegeId,
          courseId: action.courseId,
          departmentId: action.departmentId,
          rollNumber: action.rollNumber,
          mobileNumber: action.mobileNumber,
          roleId: action.roleId,
          newUser: false,
          isLoading: false
        };
      case 'PROFILE_UPDATED':
        return {
          ...prevState,
          userName: action.userName,
          email: action.email,
          mobileNumber: action.mobileNumber,
          rollNumber: action.rollNumber,
          collegeId: action.collegeId,
          courseId: action.courseId,
          departmentId: action.departmentId,
          isLoading: false
        };
      case 'BEGIN':
        return {
          ...prevState,
          isLoading: false
        }
    }
  };
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({

    signIn: async (foundUser) => {
      let res;
      try {
        res = await Login(foundUser);
        if (res.data && res.data.token) {
          const userToken = res.data.token;
          const userdata = parseJwt(userToken);
          let { fullName, email, _id, collegeId } = userdata;
          if (res.data.userRecord[0]) {
            let { collegeId, courseId, departmentId, mobileNumber, roleId } = res.data.userRecord[0];
            await AsyncStorage.setItem('userToken', userToken);
            dispatch(
              {
                type: 'LOGIN',
                id: _id,
                userName: fullName,
                token: userToken,
                newUser: userdata.newUser,
                email: email,
                collegeId: collegeId,
                courseId: courseId,
                departmentId: departmentId,
                rollNumber: email.split('@')[0],
                mobileNumber: mobileNumber,
                roleId: roleId
              });

          } else {
            Alert.alert('Oops!', "something went wrong please try again in a while", [
              { text: 'Okay' }
            ]);
          }
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Oops!', "something went wrong please try again in a while", [
          { text: 'Okay' }
        ]);
      }
      return res;
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (e) {
        console.log(e.message);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: async (data) => {
      let res
      try {
        res = await SignUp(data);
      } catch (error) {
        console.log(error)
        Alert.alert('Invalid User!', "something went wrong please try again in a while", [
          { text: 'Okay' }
        ]);
      }
      return res;
    },
    detailsUpdate: async (updateData) => {
      try {
        const res = await updateUser(updateData);
        console.log(res)
        let userToken;
        if (res && res.data.token) {
          userToken = res.data.token
          await AsyncStorage.setItem('userToken', userToken);
          Alert.alert('yeah....!', "Details submited Successfully", [
            { text: 'Okay' }
          ]);
          if (res.data.userRecord) {
            let { collegeId, courseId, departmentId, rollNumber, mobileNumber, roleId } = res.data.userRecord
            dispatch(
              {
                type: 'DETAILS_SUBMITTED',
                token: userToken,
                collegeId: collegeId,
                courseId: courseId,
                departmentId: departmentId,
                rollNumber: rollNumber,
                mobileNumber: mobileNumber,
                roleId: roleId
              });
          }
        }
        else {
          Alert.alert('Oops!', "something went wrong in updating the data", [
            { text: 'Okay' }
          ]);
        }
      } catch (error) {
        console.log(error.message);
        Alert.alert('Oops!', "something went wrong please try again in a while", [
          { text: 'Okay' }
        ]);
      }
    },
    editProfileUpdate: async (updatedData) => {
      dispatch(
        {
          type: 'PROFILE_UPDATED',
          userName: updatedData.username,
          email: updatedData.email,
          collegeId: updatedData.collegeId,
          courseId: updatedData.courseId,
          departmentId: updatedData.departmentId,
          rollNumber: updatedData.rollNumber,
          mobileNumber: updatedData.mobileNumber
        });
    }
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      let userToken, username, id, isnewUser, email;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          const userdata = parseJwt(userToken);
          username = userdata['fullName'];
          id = userdata._id;
          isnewUser = userdata['newUser']
          email = userdata['email'];
          let userRec = await getUserById(id);
          if (!userRec) {
            dispatch(
              {
                type: 'BEGIN',
              });
          }
          let { collegeId, courseId, departmentId, rollNumber, mobileNumber, roleId } = userRec
          dispatch(
            {
              type: 'RETRIEVE_TOKEN',
              token: userToken,
              userName: username,
              id: id,
              newUser: isnewUser,
              email: email,
              collegeId: collegeId,
              courseId: courseId,
              departmentId: departmentId,
              rollNumber: rollNumber,
              mobileNumber: mobileNumber,
              roleId: roleId
            });
        } else {
          dispatch(
            {
              type: 'BEGIN',
            });
        }
      } catch (e) {
        console.log(e);
      }
    }, 100);
  }, []);

  const getUserById = async (userId) => {
    try {
      const res = await GetUserbyId(userId)
      return res.data[0];
    } catch (error) {
      console.log(error);
    }
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

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#009387" />
      </View>
    )
  }

  return (
    <PaperProvider >
      <AuthContext.Provider value={{ authContext, loginState }}>
        <NavigationContainer>
          {
            loginState.userToken !== null ? (
              loginState.newUser == true ? <UserDetailsScreen /> : (
                <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
                  <Drawer.Screen options={navigationOptions()} name="Aditya Connect" component={PostsPage} />
                  <Drawer.Screen options={navigationOptions()} name="Profile" component={Root} />
                  <Drawer.Screen options={navigationOptions()} name="Feedback" component={Feedback} />

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