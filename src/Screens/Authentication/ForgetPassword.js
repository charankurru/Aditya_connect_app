import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    ToastAndroid
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { RequestOTP, UpdatePassword } from '../../API/services';
import { useTheme } from 'react-native-paper';

const ForgetPassword = ({ route, navigation }) => {
    const mail = route.params;
    const { colors } = useTheme();
    const [data, setData] = React.useState({
        email: mail.toLowerCase(),
        otp: '',
        dbOtp: '',
        check_emailInputChange: false,
        secureTextEntry: true,
        isValidEmail: true,
        isValidOTP: true,
        optVerified: false,
        password: '',
        confirm_password: '',
        isValidPasword: true,
        isValidCPasword: true,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });
    const [isLoad, setIsLoad] = useState(false);
    const [isOtpSent, setOptSent] = useState(false);

    const emailInputChange = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                email: val,
                check_emailInputChange: true,
                isValidEmail: true
            });
        } else {
            setData({
                ...data,
                email: val,
                check_emailInputChange: false,
                isValidEmail: false
            });
        }
    }

    const handleOTPChange = (val) => {
        if (val.trim().length >= 6) {
            setData({
                ...data,
                otp: val,
                isValidOTP: true
            });
        } else {
            setData({
                ...data,
                otp: val,
                isValidOTP: false
            });
        }
    }

    const reset = async () => {
        setIsLoad(true);
        const res = await RequestOTP(data.email)
        let { resCode, OTP } = res.data;
        console.log(OTP)
        if (resCode === "200") {
            setOptSent(true)
            setIsLoad(false)
            setData({
                ...data,
                dbOtp: OTP
            })
            ToastAndroid.showWithGravity(
                "OTP sent to your email",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        }
        else if (resCode === "400") {
            console.log("email not found")
        }
    }

    const validateOTP = () => {
        console.log(data.otp + " === ?" + data.dbOtp)
        if (data.otp == data.dbOtp) {
            console.log("otp Validated")
            setData({
                ...data,
                optVerified: true
            })
        }
        else {
            setData({
                ...data,
                isValidOTP: false

            })
            console.log("Incorrect otp")
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 6) {
            setData({
                ...data,
                password: val,
                isValidPasword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPasword: false
            });
        }

    }

    const handleConfirmPasswordChange = (val) => {
        if (val.trim() == data.password) {
            setData({
                ...data,
                confirm_password: val,
                isValidCPasword: true
            });
        }
        else {
            setData({
                ...data,
                confirm_password: val,
                isValidCPasword: false
            });
        }

    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    const updatePassword = async () => {
        setIsLoad(true)
        console.log(data.password)
        let res;
        try {
            res = await UpdatePassword({
                email: data.email,
                password: data.password
            })
            if (res.data.resCode === '200') {
                setIsLoad(false)
                navigation.navigate('SignInScreen')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <View style={styles.header}>
                <Animatable.View animation="fadeInLeft" duration={800}>
                    <Text style={styles.text_header}>Password Reset</Text>
                </Animatable.View>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}>
                {data.optVerified ?

                    <Animatable.View
                        animation="fadeInLeft"
                        style={styles.footer}
                    >
                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Password</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Password"
                                secureTextEntry={data.secureTextEntry ? true : false}
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handlePasswordChange(val)}
                            />
                            <TouchableOpacity
                                onPress={updateSecureTextEntry}
                            >
                                {data.secureTextEntry ?
                                    <Feather
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                    />
                                    :
                                    <Feather
                                        name="eye"
                                        color="grey"
                                        size={20}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                        {data.isValidPasword ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Password must be 6 characters long.</Text>
                            </Animatable.View>
                        }

                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>Confirm Password</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="Confirm Your Password"
                                secureTextEntry={data.confirm_secureTextEntry ? true : false}
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleConfirmPasswordChange(val)}
                            />
                            <TouchableOpacity
                                onPress={updateConfirmSecureTextEntry}
                            >
                                {data.confirm_secureTextEntry ?
                                    <Feather
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                    />
                                    :
                                    <Feather
                                        name="eye"
                                        color="grey"
                                        size={20}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                        {data.isValidCPasword ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Password doesnt match with above one</Text>
                            </Animatable.View>
                        }
                        <View style={styles.button}>
                            <TouchableOpacity
                                style={[styles.signIn, {
                                    marginTop: 15
                                }]}
                                onPress={() => updatePassword()}
                            >
                                <LinearGradient
                                    colors={['#08d4c4', '#01ab9d']}
                                    style={styles.signIn}
                                >
                                    {isLoad ?
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <ActivityIndicator size="large" color="#fff" />
                                        </View>
                                        :
                                        <Text style={[styles.textSign, {
                                            color: '#fff'
                                        }]}>Update Password</Text>
                                    }
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                    :
                    <View>
                        <Text style={[styles.text_footer, {
                            color: colors.text
                        }]}>Email</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Email"
                                placeholderTextColor="#666666"
                                style={styles.textInput}
                                autoCapitalize="none"
                                value={data.email}
                                onChangeText={(val) => emailInputChange(val)}

                            />
                            {data.check_emailInputChange ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="green"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null}
                        </View>
                        {data.isValidEmail ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>please provide valid email address</Text>
                            </Animatable.View>
                        }

                        {isOtpSent &&
                            <View style={{ marginTop: 20 }}>
                                <Text style={[styles.text_footer, {
                                    color: colors.text
                                }]}>OTP</Text>
                                <View style={styles.action}>
                                    <FontAwesome
                                        name="lock"
                                        color="#05375a"
                                        size={20}
                                    />
                                    <TextInput
                                        placeholder="Enter OTP"
                                        placeholderTextColor="#666666"
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        value={data.otp}
                                        onChangeText={(val) => handleOTPChange(val)}
                                    />
                                    {data.isValidOTP ?
                                        <Animatable.View
                                            animation="bounceIn"
                                        >
                                            <Feather
                                                name="check-circle"
                                                color="green"
                                                size={20}
                                            />
                                        </Animatable.View>
                                        : null}
                                </View>
                                {data.isValidOTP ? null :
                                    <Animatable.View animation="fadeInLeft" duration={500}>
                                        <Text style={styles.errorMsg}>In valid OTP</Text>
                                    </Animatable.View>
                                }
                                <TouchableOpacity onPress={() => reset()}>
                                    <Text style={{ color: '#009387', marginTop: 15 }}>Resend OTP ?</Text>
                                </TouchableOpacity>

                            </View>
                        }

                        <View style={styles.button}>
                            <TouchableOpacity
                                style={[styles.signIn, {
                                    marginTop: 15
                                }]}
                                onPress={() => { isOtpSent ? validateOTP() : reset() }}
                            >
                                <LinearGradient
                                    colors={['#08d4c4', '#01ab9d']}
                                    style={styles.signIn}
                                >
                                    {isLoad ?
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <ActivityIndicator size="large" color="#fff" />
                                        </View>
                                        :
                                        <Text style={[styles.textSign, {
                                            color: '#fff'
                                        }]}>{isOtpSent ? 'validate OTP' : 'send OTP'}</Text>
                                    }
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                    </View>
                }
            </Animatable.View>
        </View>
    )
}

export default ForgetPassword
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 3,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#05375a',
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 30
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});