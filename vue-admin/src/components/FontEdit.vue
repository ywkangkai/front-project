<template>
  <el-tabs type="border-card">
    <el-tab-pane label="仓库信息">
        <div class="container">
          <div class="form-box">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">

              <el-form-item label="git仓库地址" prop="git">
                <el-input v-model="form.git" suffix-icon="el-icon-menu" @focus="clearValidate('git')" clearable></el-input>
              </el-form-item>

              <el-form-item label="工程名称" prop="name">
                <el-input v-model="form.name" suffix-icon="el-icon-user-solid" @focus="clearValidate('name')" clearable></el-input>
              </el-form-item>

              <el-form-item label="服务器地址" prop="server">
                <el-input v-model="form.server" suffix-icon="el-icon-user-solid" @focus="clearValidate('server')" clearable></el-input>
              </el-form-item>

              <el-form-item label="工程类型" prop="type">
                <el-radio-group v-model="form.type" size="medium" clearable>
                  <el-radio border label="前端工程项目"></el-radio>
                  <el-radio border label="后端工程项目"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>
    </el-tab-pane>

    <el-tab-pane label="构建前步骤">
      <div class="table">

        <el-row>
          <editor
              style="font-size: 15px"
              v-model="setup_content"
              @init="editorInit"
              lang="dockerfile"
              theme="monokai"
              width="100%"
              height="600px"
              :options="{
                        enableSnippets:true,
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true
                    }">
          </editor>
        </el-row>
      </div>
    </el-tab-pane>

    <el-tab-pane label="构建后步骤">
      <div class="table">

        <el-row>
          <editor
              style="font-size: 15px"
              v-model="teardown_content"
              @init="editorInit"
              lang="dockerfile"
              theme="monokai"
              width="100%"
              height="600px"
              :options="{
                        enableSnippets:true,
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true
                    }">
          </editor>
        </el-row>
      </div>
    </el-tab-pane>

    <el-tab-pane label="通知到企业微信">
      <div class="container">
        <div class="form-box">
          <el-form ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="地址路径" prop="address">
              <el-input v-model="form.address" suffix-icon="el-icon-menu" @focus="clearValidate('address')" clearable></el-input>
            </el-form-item>

            <el-form-item label="是否通知">
              <el-switch v-model="form.send" @change="changestatus"></el-switch>
            </el-form-item>


          </el-form>
        </div>
      </div>
    </el-tab-pane>

    <el-row class="btn_class">
      <el-button type="primary" size="medium" style="margin-right: 10px;" @click="saveBuiltin">保存</el-button>
<!--      <el-button type="danger" size="medium" @click="toIndexPage">返回</el-button>-->
    </el-row>
  </el-tabs>


</template>

<script>
import { updateRepository, getrepository, getDeatil } from '../api/api';

export default {
  name: 'baseform',
  components: {
    editor: require('vue2-ace-editor'),
  },
  data: function(){
    return {
      setup_content: '',
      teardown_content: '',
      id:'',
      form: {
        name: '',           // 环境名称
        git: '',         // 仓库地址
        server: '',     // 简要描述
        type: '',
        address: '',
        send: '',
        build: ''
      },
      rules: {
        git: [
          { required: true, message: '请输入git仓库地址', trigger: 'blur' }
        ],
        name: [
          { trigger: 'blur', required: true, message: '请输入工程名称' }
        ],
        server: [
          { message: '请填写服务器地址', trigger: 'blur', required: true  }
        ],
        type:[
          { required: true}
        ],
        address:[
          { required: true, message: '请输入企业微信地址', trigger: 'blur'}
        ],
      },
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getData()
  },
  methods: {
    changestatus(){
      if (this.form.send === false){
        this.rules.address[0]['required'] = false
      }
      else {
        this.rules.address[0]['required'] = true
      }
    },
    async saveBuiltin() {
      if (this.form.git === ''){
        this.$message.error('请填写git仓库地址')
        return
      }
      let build = {setup:this.setup_content, teardown:this.teardown_content}
      this.form.build = JSON.stringify(build)
      if (this.form.name === ''){
        this.$message.error('请填写工程名称')
        return
      }
      if (this.form.type === ''){
        this.$message.error('请选择工程类型')
        return
      }
      if (this.form.server === ''){
        this.$message.error('请填写服务器地址')
        return
      }
      if (this.form.send === true){
        if (this.form.address === ''){
          this.$message.error('请填写企业微信通知地址')
          return
        }

      }

      updateRepository(this.form).then(response=>{
        if (response.data.hasOwnProperty('name')){
          this.$message.error('工程名称已存在')
        }

        if (response.data.message === 'success'){
          this.$message.success('项目修改成功')
          this.$router.push('/font_list')
        }
        if (response.data.message === 'faild'){
          this.$message.error('添加失败请检查')
        }
      })
      .catch(error=>{
        this.$message.error('服务器错误')
      })
    },

    clearValidate(prop_value) {
      this.$refs['form'].clearValidate(prop_value);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();   // 清空表单
    },
    editorInit() {
      require('brace/ext/language_tools');
      require('brace/mode/dockerfile');
      require('brace/theme/monokai');
      require('brace/snippets/dockerfile');
    },
    async getData(){
      let response = await getDeatil({id:this.id})
      this.form = response.data
      let build = this.form.build
      let content = JSON.parse(build)
      this.setup_content = content['setup']
      this.teardown_content = content['teardown']
    },
  },

}
</script>

<style scoped>
.btn_class{
  float: left;
  margin-top: 10px;
}

</style>