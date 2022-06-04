import { useState, useEffect, useContext } from 'react'
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    ToastAndroid
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../Components/context';
import { GetCollegesData, GetCoursesData } from '../../API/services';
import AvatarText from '../../Components/AvatarText'
import { updateUser } from "../../API/services";
import { LinearGradient } from 'expo-linear-gradient';

const EditProfile = ({ route, navigation }) => {

    const { authContext: { editProfileUpdate } } = useContext(AuthContext);
    const editData = route.params;
    const [colleges, setColleges] = useState([{}]);
    const [courses, setCourses] = useState([{}]);
    const [filteredColleges, setFilteredColleges] = useState([{}]);
    const [depts, setDepts] = useState([{}]);
    const [isLoading, setLoading] = useState(false);

    const [data, setData] = useState({
        fullName: editData.userName,
        isValidUser: true,
        email: editData.email,
        isValidEmail: true,
        id: editData.id,
        rollNumber: editData.rollNumber ? editData.rollNumber : "",
        isValidRollNumber: true,
        mobileNumber: editData.mobileNumber ? editData.mobileNumber : "",
        isValidMobileNumber: true,
        courseId: editData.courseId ? editData.courseId?._id : "",
        collegeId: editData.collegeId ? editData.collegeId?._id : "",
        deptId: editData.departmentId ? editData.departmentId?._id : "",

    });

    useEffect(() => {
        getColleges();
        getCourses();
    }, [])

    const getColleges = () => {
        GetCollegesData()
            .then((data) => {
                setColleges(data.data.colleges)
                let Engineering_colleges = data.data.colleges.filter(college => college.courseId.courseName === 'Engineering')
                setFilteredColleges(Engineering_colleges)
                setDepts(Engineering_colleges[0].departments)
            })
            .catch((error) => { console.log(error) })
    };

    const getCourses = async () => {
        GetCoursesData()
            .then((data) => {
                setCourses(data.data.result)
            })
            .catch((error) => { console.log(error) })

    };

    const filterColleges = (course_Id) => {
        setData({ ...data, courseId: course_Id })
        let cols = colleges.filter(college => college.courseId._id === course_Id)
        setFilteredColleges(cols)
    }

    const filterDepartment = (college_Id) => {
        setData({ ...data, collegeId: college_Id })
        setDepts(colleges.filter(college => college._id === college_Id)[0].departments)
    }

    const deptSelected = (dept) => {
        setData({ ...data, deptId: dept })
    }

    // validations for userName
    const userInputChange = (val) => {
        val = val.trim()
        if (val.length >= 6) {
            setData({
                ...data,
                fullName: val,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                fullName: val,
                isValidUser: false
            });
        }
    }

    // validations for email
    const emailValidation = (email) => {
        let emailRegex = /^([a-zA-Z0-9\.-]+)@(aec|acet|acoe).(edu).(in)$/
        return emailRegex.test(email)
    }

    const emailInputChange = (val) => {
        if (emailValidation(val)) {
            setData({
                ...data,
                email: val,
                isValidEmail: true
            });
        } else {
            setData({
                ...data,
                email: val,
                isValidEmail: false
            });
        }
    }

    // validatiosn for yser rollNumber
    const uIdInputChange = (val) => {
        val = val.trim()
        if (val.length >= 4) {
            setData({
                ...data,
                rollNumber: val,
                isValidRollNumber: true
            });
        } else {
            setData({
                ...data,
                rollNumber: val,
                isValidRollNumber: false
            });
        }
    }

    // validations for mobile Number
    const mobileInputChange = (val) => {
        val = val.trim()
        if (val.length == 10) {
            setData({
                ...data,
                mobileNumber: val,
                isValidMobileNumber: true
            });
        } else {
            setData({
                ...data,
                mobileNumber: val,
                isValidMobileNumber: false
            });
        }
    }


    const updateUserProfile = async () => {
        if (!data.isValidUser || !data.isValidEmail || !data.isValidRollNumber || !data.isValidMobileNumber) {
            return
        }
        setLoading(true);
        try {
            let res = await updateUser(data);
            setLoading(false);
            if (res.data.token) {
                let { collegeId, courseId, departmentId } = res.data.userRecord
                navigation.goBack()
                editProfileUpdate({
                    username: data.fullName,
                    email: data.email,
                    collegeId: collegeId,
                    courseId: courseId,
                    departmentId: departmentId,
                    rollNumber: data.rollNumber,
                    mobileNumber: data.mobileNumber
                })
                ToastAndroid.showWithGravity(
                    "updated successfully !",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );

            }

        }
        catch (e) {
            console.log(e)
        }


    }

    if (courses.length <= 1) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#009387" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <View style={styles.userInfoSection}>
                <View style={{
                    flexDirection: 'row', marginTop: 15,
                }}>
                    <AvatarText
                        name={data.fullName}
                        size={80}
                    />

                </View>
            </View>

            <ScrollView>

                {/* username */}
                <View style={[styles.action, { marginTop: 25 }]}>
                    <FontAwesome
                        name="user-o"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        value={data.fullName}
                        placeholder="username"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={userInputChange}
                    />
                </View>
                {data.isValidUser ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>UserName Should consists Of 6 Characters or More</Text>
                    </Animatable.View>
                }

                {/* email */}
                <View style={[styles.action, { marginTop: 25 }]}>
                    <FontAwesome
                        name="envelope-o"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        value={data.email}
                        placeholder="Your email"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={emailInputChange}
                    />
                </View>
                {data.isValidEmail ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Please enter valid college email Id</Text>
                    </Animatable.View>
                }

                {/* roll number */}
                <View style={[styles.action, { marginTop: 25 }]}>
                    <FontAwesome
                        name="id-badge"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        value={data.rollNumber}
                        placeholder="Your roll number"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={uIdInputChange}
                    />
                </View>
                {data.isValidRollNumber ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Please enter valid Roll Number</Text>
                    </Animatable.View>
                }

                {/* mobile number */}
                <View style={[styles.action, { marginTop: 25 }]}>
                    <FontAwesome
                        name="phone"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        value={data.mobileNumber}
                        placeholder="Your Mobile Number"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={mobileInputChange}
                    />
                </View>
                {data.isValidMobileNumber ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Please enter valid Mobile Number</Text>
                    </Animatable.View>
                }


                <Text style={[styles.text_footer, { marginTop: 25 }]}>Course</Text>
                <View>
                    <Picker
                        selectedValue={data.courseId}
                        onValueChange={(itemValue, itemIndex) =>
                            filterColleges(itemValue)}>
                        {
                            courses.length > 1 ? courses.map((course, myIndex) =>
                                <Picker.Item key={myIndex} label={course.courseName} value={course._id} />
                            ) : null
                        }
                    </Picker>
                </View>

                <Text style={[styles.text_footer, { marginTop: 25 }]}>Colleges</Text>
                <View>
                    <Picker
                        selectedValue={data.collegeId}
                        onValueChange={(itemValue, itemIndex) =>
                            filterDepartment(itemValue)}>

                        {
                            filteredColleges.length > 1 ? filteredColleges.map((coll, myIndex) =>
                                <Picker.Item key={myIndex} label={coll.collegeName} value={coll._id} />
                            ) : null
                        }
                    </Picker>
                </View>

                <Text style={[styles.text_footer, { marginTop: 25 }]}>Department</Text>
                <View>
                    <Picker
                        selectedValue={data?.deptId}
                        onValueChange={(itemValue, itemIndex) =>
                            deptSelected(itemValue)}>

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
                        style={styles.signIn}
                    >
                        <LinearGradient
                            colors={['#08d4c4', '#01ab9d']}
                            style={styles.signIn}
                        >
                            {isLoading ?
                                <ActivityIndicator size="large" color="#fff" />
                                : <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Submit</Text>}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 10,
        backgroundColor: '#fff'
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 5,
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
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 3,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : -4,
        flex: 1,
        paddingLeft: 10,
        color: '#05375a',
        fontSize: 18,
        fontWeight: 'bold'
    },
    button: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
        paddingRight: 10
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 5,
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
