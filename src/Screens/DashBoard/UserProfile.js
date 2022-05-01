import React, { useEffect, Component, useState } from 'react'
import { View, SafeAreaView, StyleSheet } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../Components/context';
import { GetUserbyId } from '../../API/services'
import avatar7 from '../../../assets/avatar7.png';


const UserProfile = ({ navigation }) => {

    const [data, setData] = useState({});

    const { loginState } = React.useContext(AuthContext);
    useEffect(() => {
        console.log(loginState)
        getUserdata();
    }, [])

    const getUserdata = async () => {
        GetUserbyId(loginState.id)
            .then(res => {
                console.log(res);
                setData(res.data[0])
            })
            .catch(err => console.log(err))
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.userInfoSection}>
                <View style={{
                    flexDirection: 'row', marginTop: 15,
                }}>
                    <Avatar.Image
                        source={avatar7}
                        size={80}
                    />
                    <View style={{
                        marginLeft: 20, borderBottomColor: 'black',
                        borderBottomWidth: 1,
                    }}>
                        <Title style={[styles.title, {
                            marginTop: 15,
                            marginBottom: 5,
                        }]}>{data ? data.fullName : null}</Title>
                        <Caption style={styles.caption}>{data ? data.rollNumber : null}</Caption>
                    </View>


                    <View style={{
                        marginLeft: 20
                    }}>
                        <Title style={[styles.title, {
                            marginTop: 15,
                            marginBottom: 5,
                        }]}>
                            <TouchableRipple onPress={() => { navigation.navigate('EditProfile', data) }}>
                                <Icon name="account-edit" color="#FF6347" size={40} />
                            </TouchableRipple>
                        </Title>
                    </View>



                </View>
            </View>

            <View style={styles.menuWrapper}>
                <TouchableRipple onPress={() => { }}>
                    <View style={styles.menuItem}>
                        <Icon name="email" color="#FF6347" size={25} />
                        <Text style={styles.menuItemText}>
                            {data ? data.email : null}
                        </Text>
                    </View>
                </TouchableRipple>

                <TouchableRipple onPress={() => { }}>
                    <View style={styles.menuItem}>
                        <Icon name="phone" color="#FF6347" size={25} />
                        <Text style={styles.menuItemText}>
                            {data ? data.mobileNumber : null}
                        </Text>
                    </View>
                </TouchableRipple>

                <TouchableRipple onPress={() => { }}>
                    <View style={styles.menuItem}>
                        <Icon name="heart-outline" color="#FF6347" size={25} />
                        <Text style={styles.menuItemText}>
                            {data.roleId ? data.roleId.roleName : null}
                        </Text>
                    </View>
                </TouchableRipple>


                <TouchableRipple onPress={() => { }}>
                    <View style={styles.menuItem}>
                        <Icon name="school" color="#FF6347" size={25} />
                        <Text style={styles.menuItemText}>
                            {data.courseId ? data.courseId.courseName : null}
                        </Text>
                    </View>
                </TouchableRipple>
                <TouchableRipple onPress={() => { }}>
                    <View style={styles.menuItem}>
                        <Icon name="google-classroom" color="#FF6347" size={25} />
                        <Text style={styles.menuItemText}>
                            {data.collegeId ? data.collegeId.collegeName : null}
                        </Text>
                    </View>
                </TouchableRipple>
                {/* onPress={myCustomShare} */}
                <TouchableRipple >
                    <View style={styles.menuItem}>
                        <Icon name="doorbell-video" color="#FF6347" size={25} />
                        <Text style={styles.menuItemText}>
                            {data.departmentId ? data.departmentId.deptName : null}
                        </Text>
                    </View>
                </TouchableRipple>
            </View>

            <View style={styles.infoBoxWrapper}>
                <View style={[styles.infoBox, {
                    borderRightColor: '#dddddd',
                    borderRightWidth: 1
                }]}>
                    <Title>₹140.50</Title>
                    <Caption>Wallet</Caption>
                </View>
                <View style={styles.infoBox}>
                    <Title>12</Title>
                    <Caption>Orders</Caption>
                </View>
            </View>
            <View style={styles.infoBoxWrapper}>
                <View style={[styles.infoBox, {
                    borderRightColor: '#dddddd',
                    borderRightWidth: 1
                }]}>
                    <Title>₹140.50</Title>
                    <Caption>Wallet</Caption>
                </View>
                <View style={styles.infoBox}>
                    <Title>12</Title>
                    <Caption>Orders</Caption>
                </View>
            </View>
        </SafeAreaView >
    )
}

export default UserProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 5,
    },
    title: {
        fontSize: 24,
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