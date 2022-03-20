import React from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
//import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../Components/context';

const UserDetailsScreen = ({ navigation }) => {
    const courseOptions = [
        {
            "id": 1,
            "name": "btech"
        },
        {
            "id": 2,
            "name": "BBA"
        },
        {
            "id": 3,
            "name": "BBM"
        },
        {
            "id": 4,
            "name": "Pharmacy"
        }
    ]

    const collegeOptions = [
        {
            "id": 1,
            "name": "AEC",
            "cId": 1
        },
        {
            "id": 2,
            "name": "ACET",
            "cId": 1
        },
        {
            "id": 3,
            "name": "ACE",
            "cId": 1
        },
        {
            "id": 4,
            "name": "BBA Aditya1",
            "cId": 2
        },
        {
            "id": 5,
            "name": "BBA Aditya2",
            "cId": 2
        },
        {
            "id": 6,
            "name": "BBM Aditya1",
            "cId": 3
        },
        {
            "id": 7,
            "name": "BBM Aditya2",
            "cId": 3
        },
        {
            "id": 8,
            "name": "Pharmacy Aditya1",
            "cId": 4
        },
        {
            "id": 9,
            "name": "Pharmacy Aditya2",
            "cId": 4
        }
    ]

    const departmentOptions = [
        {
            "id": 1,
            "name": "",
            "cId": 1
        },
        {
            "id": 2,
            "name": "ACET",
            "cId": 1
        },
        {
            "id": 3,
            "name": "ACE",
            "cId": 1
        },
        {
            "id": 4,
            "name": "BBA Aditya1",
            "cId": 2
        },
        {
            "id": 5,
            "name": "BBA Aditya2",
            "cId": 2
        },
        {
            "id": 6,
            "name": "BBM Aditya1",
            "cId": 3
        },
        {
            "id": 7,
            "name": "BBM Aditya2",
            "cId": 3
        },
        {
            "id": 8,
            "name": "Pharmacy Aditya1",
            "cId": 4
        },
        {
            "id": 9,
            "name": "Pharmacy Aditya2",
            "cId": 4
        }
    ]


    const [colleges, setColleges] = React.useState([{}]);

    const [data, setData] = React.useState({
        uId: '',
        mobileNumber: '',
        check_uIdInputChange: false,
        check_mobileInputChange: false,
        courseId: '',
        collegeId: '',
        deptId: '',

    });

    const uIdInputChange = (val) => {
        if (val.length == 10) {
            setData({
                ...data,
                uId: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                uId: val,
                check_textInputChange: false
            });
        }
    }

    const mobileInputChange = (val) => {
        if (val.length == 10) {
            setData({
                ...data,
                mobileNumber: val,
                check_mobileInputChange: true
            });
        } else {
            setData({
                ...data,
                mobileNumber: val,
                check_mobileInputChange: false
            });
        }
    }

    const courseInputChange = (val) => {
        setData({
            ...data,
            courseId: val
        });
        var temp = collegeOptions.filter(college => college.cId === val);
        setColleges(temp);
    }

    const collegeInputChange = (val) => {
        setData({
            ...data,
            collegeId: val
        });
    }

    const { detailsUpdate } = React.useContext(AuthContext);

    const updateUserProfile = () => {
        console.log(data);
        detailsUpdate();
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Few Moments..... Please provide you information</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>
                    <Text style={styles.text_footer}>Id</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Id number"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => uIdInputChange(val)}
                        />
                        {data.check_textInputChange ?
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

                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Mobile</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Mobile Number"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => mobileInputChange(val)}
                        />
                        {data.check_mobileInputChange ?
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
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Course</Text>
                    <View>
                        <Picker
                            selectedValue={data.courseId}
                            onValueChange={(itemValue, itemIndex) =>
                                courseInputChange(itemValue)}>
                            {
                                courseOptions.map((course, myIndex) =>
                                    <Picker.Item key={myIndex} label={course.name} value={course.id} />
                                )
                            }
                        </Picker>
                    </View>

                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Colleges</Text>
                    <View>
                        <Picker
                            selectedValue={data.collegeId}
                            onValueChange={(itemValue, itemIndex) =>
                                collegeInputChange(itemValue)}>
                            {
                                colleges.map((coll, myIndex) =>
                                    <Picker.Item key={myIndex} label={coll.name} value={coll.id} />
                                )
                            }
                        </Picker>
                    </View>

                    {/* <Text style={[styles.text_footer, { marginTop: 35 }]}>Department</Text>
                    <View>
                        <Picker
                            selectedValue={data.collegeId}
                            onValueChange={(itemValue, itemIndex) =>
                                courseInputChange(itemValue)}>
                            {
                                colleges.map((coll, myIndex) =>
                                    <Picker.Item key={myIndex} label={coll.name} value={coll.id} />
                                )
                            }
                        </Picker>
                    </View> */}

                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={() => updateUserProfile()}
                            style={[styles.signIn, {
                                borderColor: '#009387',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#009387'
                            }]}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View >
    );
}

export default UserDetailsScreen

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
        flex: Platform.OS === 'ios' ? 3 : 5,
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
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
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
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    },

    dropdown2DropdownStyle: { backgroundColor: "#EFEFEF" },
    dropdown2RowStyle: {
        backgroundColor: "#EFEFEF",
        borderBottomColor: "#C5C5C5",
    },
    dropdown2RowTxtStyle: { color: "#444", textAlign: "left" },
});