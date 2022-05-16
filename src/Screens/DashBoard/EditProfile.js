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
import {
    Avatar,
} from 'react-native-paper';
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
        email: editData.email,
        id: editData.id,
        rollNumber: editData.rollNumber ? editData.rollNumber : "",
        mobileNumber: editData.mobileNumber ? editData.mobileNumber : "",
        courseId: editData.courseId ? editData.courseId._id : "",
        collegeId: editData.collegeId ? editData.collegeId._id : "",
        deptId: editData.departmentId ? editData.departmentId._id : "",
        check_uIdInputChange: false,
        check_mobileInputChange: false,

    });

    useEffect(() => {
        getColleges();
        getCourses();
    }, [])

    const getColleges = () => {
        GetCollegesData()
            .then((data) => {
                // console.log(data.data.colleges);
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
        // console.log(course_Id)
        let cols = colleges.filter(college => college.courseId._id === course_Id)
        setFilteredColleges(cols)
    }

    const filterDepartment = (college_Id) => {
        // console.log(college_Id)
        setData({ ...data, collegeId: college_Id })
        setDepts(colleges.filter(college => college._id === college_Id)[0].departments)
    }

    const deptSelected = (dept) => {
        setData({ ...data, deptId: dept })
    }

    const updateUserProfile = async () => {
        console.log(data);
        setLoading(true);
        try {
            let res = await updateUser(data);
            setLoading(false);
            console.log(res);
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
                console.log("need To go back now")

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
                <View style={[styles.action, { marginTop: 25 }]}>
                    <FontAwesome
                        name="user-o"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        value={data.fullName}
                        placeholder="Your Id number"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => setData({ ...data, fullName: val })}
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


                <View style={[styles.action, { marginTop: 25 }]}>
                    <FontAwesome
                        name="envelope-o"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        value={data.email}
                        placeholder="Your Id number"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => setData({ ...data, email: val })}
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


                <View style={[styles.action, { marginTop: 25 }]}>
                    <FontAwesome
                        name="id-badge"
                        color="#05375a"
                        size={20}
                    />
                    <TextInput
                        value={data.rollNumber}
                        placeholder="Your Id number"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => setData({ ...data, rollNumber: val })}
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
                        onChangeText={(val) => setData({ ...data, mobileNumber: val })}
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
                        selectedValue={data.deptId._id}
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
