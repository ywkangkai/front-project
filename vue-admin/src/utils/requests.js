import axios from 'axios'
//创建拦截器
const service = axios.create()

//添加请求拦截器
service.interceptors.request.use(function (config) {
    //在发送请求前需要做什么处理
    return config
},function (error) {
    //对请求错误做些什么
    return Promise.reject(error)
})


//添加响应拦截器
service.interceptors.response.use(function (response){
    //对相应数据做什么
    return response
},function (error){
    //对相应错误做什么
    return Promise.reject(error)
})

export default service