import React, { useEffect, useContext, useState, useRef } from 'react'
import { View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import {
    Title,
    Caption,
    Text,
    TouchableRipple,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../Components/context';
import AvatarText from '../../Components/AvatarText'
import { GetUserInstitueData } from '../../API/services'
import { themeColor, gradientColorArray } from '../../Components/colors'
const UserProfile = ({ navigation }) => {

    const isMountedRef = useRef(null);
    const { loginState } = useContext(AuthContext);
    const [youInstitueData, setInstitueData] = useState({})

    useEffect(() => {
        isMountedRef.current = true;
        GetUserInstitueData({
            collegeId: loginState.collegeId?._id,
            courseId: loginState.courseId?._id,
            departmentId: loginState.departmentId?._id
        })
            .then(data => {
                setInstitueData(data.data)
            })
            .catch(data => { console.log(error) })
        return () => isMountedRef.current = false;
    }, [])

    if (loginState == undefined) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={themeColor} />
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={themeColor} barStyle="light-content" />
            <ScrollView>
                {loginState && <>
                    <View style={styles.userInfoSection}>
                        <View style={{
                            flexDirection: 'row', marginTop: 15,
                        }}>
                            <AvatarText
                                size={80}
                                name={loginState.userName}
                            />
                            <View style={{
                                marginLeft: 10, borderBottomColor: 'black',
                                borderBottomWidth: 1,
                            }}>
                                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <Title style={[styles.title, {
                                        marginTop: 15,
                                        marginBottom: 5,
                                    }]}>{loginState.userName}</Title>

                                </View>
                                <Caption style={styles.caption}>{loginState.rollNumber}</Caption>
                            </View>
                        </View>

                        <View style={styles.button}>
                            <TouchableOpacity
                                onPress={() => { navigation.navigate('EditProfile', loginState) }}
                                style={[styles.signIn, {
                                    borderColor: 'black',
                                    borderWidth: 1,
                                    marginTop: 15
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: 'black'
                                }]}>Edit Profile</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View style={styles.menuWrapper}>
                        <TouchableRipple onPress={() => { }}>
                            <View style={styles.menuItem}>
                                <Icon name="email" color="#FF6347" size={25} />
                                <Text style={styles.menuItemText}>
                                    {loginState?.email}
                                </Text>
                            </View>
                        </TouchableRipple>

                        <TouchableRipple onPress={() => { }}>
                            <View style={styles.menuItem}>
                                <Icon name="phone" color="#FF6347" size={25} />
                                <Text style={styles.menuItemText}>
                                    {loginState.mobileNumber}
                                </Text>
                            </View>
                        </TouchableRipple>

                        <TouchableRipple onPress={() => { }}>
                            <View style={styles.menuItem}>
                                <Icon name="heart-outline" color="#FF6347" size={25} />
                                <Text style={styles.menuItemText}>
                                    {loginState.roleId?.roleName}
                                </Text>
                            </View>
                        </TouchableRipple>


                        <TouchableRipple onPress={() => { }}>
                            <View style={styles.menuItem}>
                                <Icon name="school" color="#FF6347" size={25} />
                                <Text style={styles.menuItemText}>
                                    {loginState.courseId ? loginState.courseId.courseName : null}
                                </Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple onPress={() => { }}>
                            <View style={styles.menuItem}>
                                <Icon name="google-classroom" color="#FF6347" size={25} />
                                <Text style={styles.menuItemText}>
                                    {loginState.collegeId ? loginState.collegeId.collegeName : null}
                                </Text>
                            </View>
                        </TouchableRipple>
                        {/* onPress={myCustomShare} */}
                        <TouchableRipple >
                            <View style={styles.menuItem}>
                                <Icon name="doorbell-video" color="#FF6347" size={25} />
                                <Text style={styles.menuItemText}>
                                    {loginState.departmentId ? loginState.departmentId.deptName : null}
                                </Text>
                            </View>
                        </TouchableRipple>
                    </View>

                    <View style={styles.infoBoxWrapper}>
                        <View style={[styles.infoBox, {
                            borderRightColor: '#dddddd',
                            borderRightWidth: 1
                        }]}>
                            <Title>{youInstitueData?.studentsCountOfDeptId}</Title>
                            <Caption>Your department count</Caption>
                        </View>
                        <View style={styles.infoBox}>
                            <Title>{youInstitueData?.studentsCountOfCollegeId}</Title>
                            <Caption>Your college count</Caption>
                        </View>
                    </View>
                    <View style={styles.infoBoxWrapper}>
                        <View style={[styles.infoBox, {
                            borderRightColor: '#dddddd',
                            borderRightWidth: 1
                        }]}>
                            <Title>{youInstitueData?.studentsCountOfCourseId}</Title>
                            <Caption> {loginState.courseId?.courseName} count</Caption>
                        </View>
                        <View style={styles.infoBox}>
                            <Title>{youInstitueData?.totalUsers}</Title>
                            <Caption>Total users</Caption>
                        </View>
                    </View>

                </>}
            </ScrollView>

        </SafeAreaView >
    )
}

export default UserProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    button: {
        alignItems: 'center',
        marginLeft: 1,
        marginRight: 2,
    },

    signIn: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    userInfoSection: {
        marginLeft: 5,
        marginBottom: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: '500',
        color: 'black'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoBoxWrapper: {
        marginTop: 20,
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 100,
        color: 'black',
    },
    infoBox: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuWrapper: {
        marginTop: 25,
    },
    menuItem: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 30,
    },
    menuItemText: {
        color: '#777777',
        marginLeft: 20,
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 26,
    },
});
