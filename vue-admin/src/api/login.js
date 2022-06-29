import axios from 'axios'

let host = 'http://127.0.0.1:8000'

//登录
export const login = (params) =>{
    return axios.post(`${host}/user/login/`, params)
}

//注册—检查邮箱是否存在
export const check_email = (email) =>{
    return axios.get(`${host}/user/` + email + '/count/', )
}

//注册—检查用户名是否存在
export const check_username = (username) =>{
    return axios.get(`${host}/user/` + username + '/count/', )
}

//注册
export const register = (params) =>{
    return axios.post(`${host}/user/register/` ,params)
}