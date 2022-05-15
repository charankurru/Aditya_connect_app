import API from '../API/api';
import { REACT_APP_API_KEY } from '@env'

export const Login = (user) => {
    console.log(REACT_APP_API_KEY)
    return API.post('/users/login', user);
}
export const SignUp = (user) => {
    console.log(user);
    return API.post('/users/register', user);
}

export const updateUser = (userdata) => {
    return API.post('/users/update-details', userdata);
}

export const GetCollegesData = () => {
    return API.get('/ccd/get-colleges');
}

export const GetCoursesData = async () => {
    return await API.get('/ccd/get-courses');
}

export const GetCategoriesData = async () => {
    return await API.get('/ccd/get-category');
}

export const GetUSersData = async () => {
    return await API.get('/users/get-users')
}

export const GetAdminsData = async () => {
    return await API.get('/admin/get-admins')
}

export const InsertAdminData = async (admin) => {
    return await API.post('/admin/addAdmin', admin)
}

export const GetUserbyId = (userId) => {
    return API.get(`/users/get-user/${userId}`)
}

export const GetPosts = async (queryData) => {
    return await API.get("/users/fetchposts", { params: queryData });
}

export const SendMessage = (data) => {
    return API.post("/users/post-message", data)
}

export const GetMessage = (id) => {
    return API.get(`/users/get-messages/${id}`)
}

export const RequestOTP = (email) => {
    console.log(email)
    return API.post('/users/send-otp', { email })
}

export const ValidateOTP = (data) => {
    return API.post('/users/validate-otp', data)
}

export const UpdatePassword = (data) => {
    return API.post('/users/update-password', data)
}
