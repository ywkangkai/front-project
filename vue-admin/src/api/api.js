import axios from 'axios'

let host = 'http://127.0.0.1:8000'


//项目管理

export const projectList = (params) =>{
    return axios.get(`${host}/project/list/?page=`+ params.page + '&size=' + params.size,params)
}

export const projectDetail = (params) =>{
    return axios.post(`${host}/project/detail/`,params)
}

export const editProject = (id, params) =>{
    return axios.put(`${host}/project/edit/` + id + '/',params)
}

export const deleteProject = (id) =>{
    return axios.delete(`${host}/project/delete/` + id + '/')
}


export const deletAllProject = (params) =>{
    return axios.post(`${host}/project/deleteall/`, params)
}

export const addProject = (params) =>{
    return axios.post(`${host}/project/add/`, params)
}

export const projectName = () =>{
    return axios.get(`${host}/interface/project/name`)
}

export const envs_project = () =>{
    return axios.get(`${host}/project/get/env/`)
}

export const run_by_project = (params) =>{
    return axios.post(`${host}/project/run/`, params)
}





//接口管理
export const addInterface = (params) =>{
    return axios.post(`${host}/interface/add/`, params)
}

export const listInterface = (params) =>{
    return axios.get(`${host}/interface/list/?page=`+ params.page + '&size=' + params.size,params)
}

export const editInterface = (id, params) =>{
    return axios.put(`${host}/interface/edit/` + id + '/',params)
}

export const deleteInterface = (id) =>{
    return axios.delete(`${host}/interface/delete/` + id + '/')
}

export const deletInterface = (params) =>{
    return axios.post(`${host}/interface/deleteall/`, params)
}

export const detailInterface = (params) =>{
    return axios.post(`${host}/interface/detail/`,params)
}

export const interfaceEnv = () =>{
    return axios.get(`${host}/interface/env/`)
}

export const run_by_interface = (params) =>{
    return axios.post(`${host}/interface/run/`, params)
}


//环境管理
export const envsList = (params) =>{
    return axios.get(`${host}/env/list/?page=`+ params.page + '&size=' + params.size,params)
}

export const editEnvs = (id, params) =>{
    return axios.put(`${host}/env/edit/` + id + '/', params)
}

export const deleteEnv = (id) =>{
    return axios.delete(`${host}/env/delete/` + id + '/')
}

export const addEnv = (params) =>{
    return axios.post(`${host}/env/add/`, params)
}

export const detailEnv = (params) =>{
    return axios.post(`${host}/env/detail/`,params)
}

export const deletAllEnv = (params) =>{
    return axios.post(`${host}/env/deleteall/`, params)
}


//内置函数
export const debugList = (params) =>{
    return axios.get(`${host}/debugtalk/list/?page=`+ params.page + '&size=' + params.size,params)
}

export const detailDebug = (params) =>{
    return axios.post(`${host}/debugtalk/detail/`,params)
}

export const codeDebug = (id) =>{
    return axios.get(`${host}/debugtalk/code/` + id + '/')
}


export const updateDebug = (params) =>{
    return axios.put(`${host}/debugtalk/update/`, params)
}


//配置
export const nameProject = () =>{
    return axios.get(`${host}/config/project/name/`)
}

export const nameInterface = (params) =>{
    return axios.post(`${host}/config/interface/name/`, params)
}

export const addCofig = (params) =>{
    return axios.post(`${host}/config/save/`, params)
}

export const listCofig = (params) =>{
    return axios.get(`${host}/config/list/?page=`+ params.page + '&size=' + params.size,params)
}

export const detailConfig = (params) =>{
    return axios.post(`${host}/config/detail/`, params)
}

export const deleteConfig = (id) =>{
    return axios.delete(`${host}/config/delete/` + id + '/')
}

export const deletAllConfig = (params) =>{
    return axios.post(`${host}/config/deleteall/`, params)
}

export const get_detail_configure = (id) =>{
    return axios.get(`${host}/config/detail/` + id + '/')
}

export const update_configure = (id, params) =>{
    return axios.put(`${host}/config/update/` + id + '/', params)
}


//套件
export const projects_names = () =>{
    return axios.get(`${host}/testsuite/project/name/`)
}

export const interfaces_by_project_id = (params) =>{
    return axios.post(`${host}/testsuite/interface/name/`, params)
}

export const addTestsuite = (params) =>{
    return axios.post(`${host}/testsuite/add/`, params)
}

export const testsuite_list = (params) =>{
    return axios.get(`${host}/testsuite/list/?page=`+ params.page + '&size=' + params.size,params)
}

export const detailTestsuite = (params) =>{
    return axios.post(`${host}/testsuite/detail/`, params)
}

export const get_detail_testsuite = (id) =>{
    return axios.get(`${host}/testsuite/detail/` + id + '/')
}


export const update_testsuite = (id, params) =>{
    return axios.put(`${host}/testsuite/update/` + id + '/', params)
}

export const deletAllTestsuite = (params) =>{
    return axios.post(`${host}/testsuite/deleteall/`, params)
}


export const deleteTestsuite = (id) =>{
    return axios.delete(`${host}/testsuite/delete/` + id + '/')
}


//用例

export const get_projects_names = () =>{
    return axios.get(`${host}/testcase/project/name/`)
}

export const get_interfaces_by_project_id = (params) =>{
    return axios.post(`${host}/testcase/interface/name/`, params)
}

export const configures_by_interface_id = (params) =>{
    return axios.post(`${host}/testcase/configure/name/`, params)
}

export const testcases_by_interface_id = (params) =>{
    return axios.post(`${host}/testcase/name/`, params)
}

export const add_testcase = (params) =>{
    return axios.post(`${host}/testcase/add/`, params)
}

export const testcase_list = (params) =>{
    return axios.get(`${host}/testcase/list/?page=`+ params.page + '&size=' + params.size)
}

export const detailTestcase = (params) =>{
    return axios.post(`${host}/testcase/detail/`, params)
}

export const delete_testcase = (id) =>{
    return axios.delete(`${host}/testcase/delete/` + id + '/')
}

export const deletAllTestcase = (params) =>{
    return axios.post(`${host}/testcase/deleteall/`, params)
}

export const get_detail_testcase = (id) =>{
    return axios.get(`${host}/testcase/get/detail/` + id +'/')
}

export const update_testcase = (params) =>{
    return axios.put(`${host}/testcase/update/`, params)
}

export const envs_names = () =>{
    return axios.get(`${host}/testcase/get/env/`)
}

export const run_by_testcase = (params) =>{
    return axios.post(`${host}/testcase/run/`, params)
}


//报告
export const reports_list = (params) =>{
    return axios.get(`${host}/report/list/?page=`+ params.page + '&size=' + params.size)
}

export const report_view = (id) =>{
    return axios.get(`${host}/report/view/` + id + '/')
}

export const report_download = (id) =>{
    return axios.post(`${host}/report/download/` + id + '/')
}

export const delete_report = (id) =>{
    return axios.delete(`${host}/report/delete/` + id + '/')
}

export const deletReports = (params) =>{
    return axios.post(`${host}/report/deleteall/`, params)
}

export const openReports = (params) =>{
    return axios.post(`${host}/report/open/`, params)
}




//汇总
export const summary = () =>{
    return axios.get(`${host}/summary/data/`)
}


//CICD

export const addrepository = (params) =>{
    return axios.post(`${host}/repository/add/`, params)
}

export const getrepository = (params) =>{
    return axios.get(`${host}/repository/list/?page=`+ params.page + '&size=' + params.size)
}

export const getDeatil = (params) =>{
    return axios.post(`${host}/repository/detail/`,params)
}

export const updateRepository = (params) =>{
    return axios.put(`${host}/repository/update/`,params)
}

export const deleteRepository = (id) =>{
    return axios.delete(`${host}/repository/delete/` + id + '/' )
}

export const deleteAllRepository = (params) =>{
    return axios.post(`${host}/repository/deleteall/`, params)
}

export const searchRepository = (params) =>{
    return axios.post(`${host}/repository/search/`, params)
}

export const getGit = (params) =>{
    return axios.post(`${host}/repository/git/`, params)
}

export const buildBefore = (params) =>{
    return axios.post(`${host}/repository/compile/`, params)
}

export const buildAfter = (params) =>{
    return axios.post(`${host}/repository/after/`, params)
}

export const getHarbor = (params) =>{
    return axios.post(`${host}/harbor/list/`, params)
}











