<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 项目管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增项目</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="formss" :rules="rules" :model="form" label-width="100px">
                    <el-form-item label="项目名称" prop="projectname">
                        <el-input v-model="form.projectname" suffix-icon="el-icon-menu"  @focus="clearValidate('projectname')" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="负责人" prop="leader">
                        <el-input v-model="form.leader" suffix-icon="el-icon-s-custom" @focus="clearValidate('leader')" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="测试人员" prop="test">
                        <el-input v-model="form.test" suffix-icon="el-icon-user-solid" @focus="clearValidate('test')" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="应用名称" prop="appname">
                        <el-input v-model="form.appname" suffix-icon="el-icon-s-promotion" @focus="clearValidate('appname')" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                      <div>
                        <el-button type="primary" @click="onSubmit('formss')">提交</el-button>
                        <el-button @click="resetForm('form')">取消</el-button>
                      </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    import { addProject, projects_names } from '../api/api';

    export default {
        name: 'baseform',
        data: function(){
            var validateName = (rule, value, callback) => {
                var len = value.length;
                if(len <= 0){
                    callback(new Error('请输入项目名称'));
                }
                else if (len > 20) {
                  callback(new Error('项目名称不能超过20个字符'))
                }else {
                  callback()
                }
            };
            return {
                form: {
                    projectname: '',
                    leader: '',
                    test: '',
                    appname: '',
                },
              rules: {
                    projectname: [
                        { validator: validateName, trigger: 'blur',required: true }
                    ],
                    leader: [
                        { required: true, message: '请输入项目负责人', trigger: 'blur' }
                    ],
                    test: [
                        { required: true, message: '请输入测试人员', trigger: 'blur' }
                    ],
                    appname: [
                        { required: true, message: '请输入发布应用', trigger: 'blur' }
                    ],
                },
                // project_names: []
            }
        },
        created() {
            this.getProjectNames();
        },
        methods: {
            onSubmit(formName) {
              console.log('触发')
                this.$refs[formName].validate((valid) => {
                   debugger;
                    if (valid) {
                        let that = this;
                      addProject(this.form)
                        .then((response)=> {
                            this.$message.success('新增项目成功！');
                            // 1秒钟之后, 执行刷新
                            setInterval(function () {
                                that.$router.go();
                            }, 1000);
                            // this.$refs['form'].resetFields();   // 清空提示信息
                        })
                        .catch(error => {
                            console.log(error);
                            this.$message.error('服务器错误');
                        });
                    }
                    else {
                        this.$message.error('参数有误');
                        return false;
                    }
                    return
                });
            },
            clearValidate(prop_value) {
                this.$refs['form'].clearValidate(prop_value);
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();   // 清空表单
            },
            // getProjectNames() {
            //     projects_names()
            //     .then((response)=> {
            //         this.project_names = response.data;
            //     })
            //     .catch(error => {
            //         that.$message.error('服务器错误');
            //     });
            // }
        }
    }
</script>