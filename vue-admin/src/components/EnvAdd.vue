<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 环境管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增环境</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                    <el-form-item label="环境名称" prop="name">
                        <el-input v-model="form.name" suffix-icon="el-icon-menu" @focus="clearValidate('name')" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="请求base url" prop="base_url">
                        <el-input v-model="form.base_url" suffix-icon="el-icon-user-solid" @focus="clearValidate('tester')" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="简要描述" prop="desc">
                        <el-input type="textarea" rows="4" v-model="form.desc" clearable></el-input>
                    </el-form-item>

                    
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                        <el-button @click="resetForm('form')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    import { addEnv, envs_names } from '../api/api';

    export default {
        name: 'baseform',
        data: function(){
            let validateName = (rule, value, callback) => {
                let len = value.length;
                if(len <= 0){
                    callback(new Error('请输入环境名称'));
                }
                else {
                    callback();
                }
            };
            return {
                form: {
                    name: '',           // 环境名称
                    base_url: '',         // base_url
                    desc: '',     // 简要描述
                },
                rules: {
                    name: [
                        { validator: validateName, trigger: 'blur' }
                    ],
                    base_url: [
                        { required: true, message: '请输入请求base url', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入简要描述', trigger: 'blur' }
                    ],
                },
            }
        },
        methods: {
             onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let that = this;
                      addEnv(this.form)
                        .then((response)=> {
                          if (response.data.hasOwnProperty('name')){
                            this.$message.error('环境名称已存在！');
                          }
                          else if (response.data.hasOwnProperty('base_url')){
                            this.$message.error('请输入合法URL！');
                          }
                          else {
                            this.$message.success('新增配置成功！');
                            // this.$refs['form'].resetFields();   // 清空提示信息
                            // 1秒钟之后, 执行刷新
                            setInterval(function () {
                              that.$router.go();
                            }, 1000);
                          }
                        })
                        .catch(error => {
                          this.$message.error('服务器错误');
                        });
                                
                    } else {
                        this.$message.error('参数有误');
                        return false;
                    }
                });
            },
            clearValidate(prop_value) {
                this.$refs['form'].clearValidate(prop_value);
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();   // 清空表单
            },
        }
    }
</script>