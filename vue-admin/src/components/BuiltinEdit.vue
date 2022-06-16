<template>
    <div class="table">

        <el-row>
            <editor
                style="font-size: 15px"
                v-model="content"
                @init="editorInit"
                lang="python"
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

        <el-row class="btn_class">
            <el-button type="primary" size="medium" style="margin-right: 10px;" @click="saveBuiltin">保存</el-button>
            <el-button type="danger" size="medium" @click="toIndexPage">回到主页</el-button>
        </el-row>

      <template>
        <el-button type="text" @click="open"></el-button>
      </template>

    </div>
</template>

<script>
    import { codeDebug, updateDebug } from '../api/api';
    
    export default {
        beforeRouteEnter (to, from, next) {
            // 在路由跳转页面实例化之前被调用, 此时还没有this实例, 但是可以通过next的回调中获取实例的引用
            // console.log("before route enter")
            // console.log(to);
            next(vm => {
                // console.log('xxxxxxxxxxxxxxx')
                // console.log(vm)
                // console.log(vm.$route.params)
                vm.debugtalk_id = vm.$route.params.id;
                // console.log("id = ", vm.debugtalk_id);
                vm.getCode();
            });
            next()
        },
        beforeRouteUpdate (to, from, next) {
            // 路由在同组件之间更新之前被调用
            console.log("before route update")
            let url_paths = to.path
            let url_path = url_paths.split('/')
            if (url_path[2].length < 3){
              this.debugtalk_id = to.params.id;
              next()
            }
            else {
              this.$router.push({path: `/${url_path[2]}`})
            }
        },
        beforeRouteLeave (to, from, next) {
            // 页面离开切换到其他组件之间被调用
            console.log("before route leave")
            this.open(next)
            // next()
        },
        // props: ['id'],
        components: {
            editor: require('vue2-ace-editor'),
        },
        name: 'basetable',
        data() {
            return {
                content: '',
                debugtalk_id: null
            }
        },
      methods: {
            editorInit() {
                require('brace/ext/language_tools');
                require('brace/mode/python');
                require('brace/theme/monokai');
                require('brace/snippets/python');
            },
            // 获取内置函数源码
            getCode() {
              codeDebug(this.debugtalk_id)
                .then(response => {
                    this.content = response.data.debugtalk;
                })
                .catch(error => {
                    this.$message.error('服务器错误');
                })
            },
            // 更新指定的内置函数源码
            saveBuiltin() {
                // builtins_update(this.$route.params.id, this.content)
                // builtins_update(this.id, this.content)
                updateDebug({id: this.debugtalk_id, debugtalk: this.content})
                .then(response => {
                    this.$message.success('更新成功');
                    // this.$router.go(-1);
                })
                .catch(error => {
                    this.$message.error('服务器错误');
                })
            },
            // 返回主页
            toIndexPage() {
                this.$router.push({name: 'index'})
            },

            async open(nextFn) {
              let response = await codeDebug(this.debugtalk_id)
              let current_content = response.data.debugtalk
              if (current_content === this.content){
                nextFn()
              }
              else {
                this.$confirm('当前内容未保存，是否离开？', '确认信息', {
                  distinguishCancelAndClose: true,
                  confirmButtonText: '保存并离开',
                  cancelButtonText: '放弃修改'
                })
                    .then(() => {
                      this.$message({
                        type: 'success',
                        message: '保存成功'
                      });
                      updateDebug({id: this.debugtalk_id, debugtalk: this.content})
                          .then(response => {

                          })
                          .catch(error => {
                            this.$message.error('服务器错误');
                          })
                      nextFn()
                    })
              }
            }
        },

    }
</script>

<style scoped>
    .btn_class{
        margin-top: 10px;
    }

</style>
