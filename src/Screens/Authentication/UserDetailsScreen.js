import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
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
import { GetCollegesData, GetCoursesData } from '../../API/services';
const UserDetailsScreen = ({ navigation }) => {

    const [isLoad, setIsLoad] = React.useState(false);

    const initState = {
        mobileNumber: '',
        empId: '',
        courseId: '',
        collegeId: '',
        DeptId: '',
    }

    const [data, setData] = React.useState({
        id: '',
        uId: '',
        mobileNumber: '',
        check_uIdInputChange: false,
        check_mobileInputChange: false,
        courseId: '',
        collegeId: '',
        deptId: '',

    });

    const { authContext: { detailsUpdate }, loginState } = React.useContext(AuthContext);

    const [colleges, setColleges] = React.useState([{}]);
    const [courses, setCourses] = React.useState([{}]);
    const [filteredColleges, setFilteredColleges] = React.useState([{}]);
    const [depts, setDepts] = React.useState([]);

    useEffect(() => {
        getColleges();
        getCourses();
    }, [])

    const getColleges = () => {
        GetCollegesData()
            .then((data) => {
                console.log(data.data.colleges);
                setColleges(data.data.colleges)
                let Engineering_colleges = data.data.colleges.filter(college => college.courseId.courseName === 'Engineering')
                setFilteredColleges(Engineering_colleges)
                setDepts(Engineering_colleges[0].departments)
            })
            .catch((error) => { console.log(error) })
    };

    const getCourses = () => {
        GetCoursesData()
            .then((data) => {
                console.log(data.data.result)
                setCourses(data.data.result)
            })
            .catch((error) => { console.log(error) })
    };

    const filterColleges = (course_Id) => {
        setData({ ...data, courseId: course_Id })
        console.log(course_Id)
        let cols = colleges.filter(college => college.courseId._id === course_Id)
        setFilteredColleges(cols)
    }

    const filterDepartment = (college_Id) => {
        console.log(college_Id)
        setData({ ...data, collegeId: college_Id })
        setDepts(colleges.filter(college => college._id === college_Id)[0].departments)
    }

    const deptSelected = (val) => {
        console.log(loginState)
        console.log(val);
        setData({ ...data, deptId: val, id: loginState.id });
    }



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


    const updateUserProfile = () => {
        setIsLoad(true)
        console.log(data);
        detailsUpdate(data);
        setIsLoad(false)
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
                                filterColleges(itemValue)}>
                            <Picker.Item label={"--Select Course--"} />
                            {
                                courses.length > 1 ? courses.map((course, myIndex) =>
                                    <Picker.Item key={myIndex} label={course.courseName} value={course._id} />
                                ) : null
                            }
                        </Picker>
                    </View>

                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Colleges</Text>
                    <View>
                        <Picker
                            selectedValue={data.collegeId}
                            onValueChange={(itemValue, itemIndex) =>
                                filterDepartment(itemValue)}>
                            <Picker.Item label={"--Select College--"} />
                            {
                                filteredColleges.length > 1 ? filteredColleges.map((coll, myIndex) =>
                                    <Picker.Item key={myIndex} label={coll.collegeName} value={coll._id} />
                                ) : null
                            }
                        </Picker>
                    </View>
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Department</Text>
                    <View>
                        <Picker
                            selectedValue={data.deptId}
                            onValueChange={(itemValue, itemIndex) =>
                                deptSelected(itemValue)}>
                            <Picker.Item label={"--Select Department--"} />
                            {
                                depts ? depts.map((dept, myIndex) =>
                                    <Picker.Item key={myIndex} label={dept.deptName} value={dept._id} />
                                ) : null
                            }
                        </Picker>
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={() => updateUserProfile()}
                            style={[styles.signIn, {
                                borderColor: '#009387',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            {isLoad ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', color: 'black' }}>
                                <ActivityIndicator size="large" color="#009387" />
                            </View> : <Text style={[styles.textSign, {
                                color: '#009387'
                            }]}>Submit</Text>}
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
        marginTop: 20,
        marginBottom: 30
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