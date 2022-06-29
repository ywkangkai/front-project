<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> CICD</el-breadcrumb-item>
        <el-breadcrumb-item>工程列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" placeholder="按工程名称搜索" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search" >搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="55" align="center"></el-table-column>

        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

        <el-table-column prop="name" label="工程名称" width="250">
        </el-table-column>

        <el-table-column prop="git" label="git仓库" width="250">
        </el-table-column>

        <el-table-column prop="server" label="服务地址" width="250">
        </el-table-column>

        <el-table-column prop="type" label="工程类型" width="100" align="center">
        </el-table-column>

        <el-table-column prop="send" label="是否发送通知" width="100" align="center">
        </el-table-column>

        <el-table-column prop="address" label="企业微信地址" width="100" align="center">
        </el-table-column>


        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="normal" type="text" icon="el-icon-refresh-right" @click="handleBuild(scope.$index, scope.row)">构建</el-button>
            <el-button v-if="build" type="text" @click="handleBuild(scope.$index, scope.row)"><i class="el-icon-loading"></i>构建</el-button>
            <el-button type="text" icon="el-icon-share" @click="deploy(scope.row)">部署</el-button>
            <el-button type="text" icon="el-icon-edit" @click="linkTo(scope.row.id)">编辑</el-button>
            <el-button type="text" icon="el-icon-view" @click="views">详情</el-button>
<!--            <el-button type="text" icon="el-icon-close" @click="clears">清除构建</el-button>-->
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-dialog
                title="构建流程"
                :visible.sync="dialogVisible"
                width="80%"
                :before-close="handleClose">
              <el-steps  align-center>
                <el-step :status="scope.row.status.git_status1" :title="scope.row.status.git" icon="el-icon-loading" :description="scope.row.status.git_description"></el-step>
                <el-step :status="scope.row.status.build_before_status2" :title="scope.row.status.build_before" icon="el-icon-loading" :description="scope.row.status.build_before_description"></el-step>
                <el-step :status="scope.row.status.build_after_status4" :title="scope.row.status.build_after" icon="el-icon-loading" :description="scope.row.status.build_after_description"></el-step>
              </el-steps>
              <span slot="footer" class="dialog-footer">
              </span>
            </el-dialog>

          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange"
                       @size-change="handleSizeChange" :page-sizes="[4, 5, 8, 10, 20]"
                       layout="total, sizes, prev, pager, next, jumper" :total="total_nums" :page-size="page_size">
        </el-pagination>
      </div>
    </div>

    <!-- 删除提示框 -->
    <el-dialog title="删除接口" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 部署项目 -->
    <el-dialog title="部署项目" :visible.sync="runVisible" width="30%" center>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="选择镜像">

          <el-select v-model="harbor_name" clearable placeholder="请选择">
            <el-option
                v-for="item in harbor_id_names"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>

        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button>取 消</el-button>
                <el-button type="primary" @click="openFullScreen1" v-loading.fullscreen.lock="fullscreenLoading">运行</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getrepository,
  deleteRepository,
  getGit,
  searchRepository,
  deleteAllRepository,
  buildBefore,
  run_by_project,
  getHarbor,
  buildAfter
} from '../api/api';
export default {
  name: 'basetable',
  data() {
    return {
      tableData: [],
      cur_page: 1,    // 当前页
      page_size: 10,  // 每页显示的数量
      total_nums: 1, // 数据总条数

      multipleSelection: [],
      // select_cate: '',
      select_word: '',
      del_list: [],
      // is_search: false,
      editVisible: false,   // 新增项目弹框是否显示标识
      delVisible: false,    // 删除项目弹框是否显示标识
      runVisible: false,    // 运行项目弹框是否显示标识
      form: {},
      harbor_name: '',
      harbor_id_names: [],

      idx: -1,   // 在tableData数组中的索引值
      id: -1,    // 在数据库中的真实索引值

      env_id: '',
      envs_id_names: [],  // 返回的环境变量数据
      fullscreenLoading: false,
      normal: true,
      build:false,
      is_build: false,
      dialogVisible:false,
      active: 1,
    }
  },
  created() {
    this.getData();

  },
  methods: {
    //强制等待
    wait(){
      var timeOut = new Date().getTime() + parseInt(time, 10);
      while (new Date().getTime() <= timeOut){

      }
    },
    async deploy(row){
      this.runVisible = true
      let response = await getHarbor({id: row.id})
      this.harbor_id_names = response.data
    },
    async openFullScreen1() {
      console.log(this.harbor_name)
      if (this.harbor_name === ''){
        this.$message.error('请选择镜像版本')
      }
      else {

      }
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.page_size = val;
      this.getData();
    },
    getData() {

      getrepository({
        'page': this.cur_page,
        'size': this.page_size
      })
          .then(response => {
            this.tableData = response.data.results;
            this.cur_page = response.data.current_page_num || 1;
            this.total_nums = response.data.count || 1;

          })
    },
    search(){
      searchRepository({
        'name': this.select_word
      }).then((response)=>{
        this.tableData = response.data.results
      })
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.idx = index;
      this.id = row.id;
      this.form = row;
      this.editVisible = true;
    },
    async handleBuild(index, row) {
      if (this.build === true){
        this.$message.warning('当前已有任务在构建中, 请稍等......')
        return
      }
      else {
        this.$message.info('任务构建已开始，请在详情中查看......')
        this.build = true
        this.normal = false
        this.idx = index;
        this.id = row.id;
        row.status.git_status1 = 'finish'
        row.status.git = '进行中'
        row.status.git_description = '正在拉取代码'
        row.status.build_before_status2 = 'wait'
        row.status.build_before_description = '构建镜像'
        row.status.build_before = '未开始'
        row.status.build_after_status4 = 'wait'
        row.status.build_after_description = '构建后步骤'
        row.status.build_after = '未开始'
      }
      let response = await getGit({id:this.id})
      let re = new RegExp('文件夹')
      let result = re.test(response.data.message)
      let git_re = new RegExp('already exists and is not an empty directory')
      let git_result = git_re.test(response.data.message)
      if (response.data.message === '项目拉取完成'){
        row.status.git_status1 = 'success'
        row.status.build_before_status2 = 'finish'
        row.status.git = '已完成'
        row.status.build_before = '进行中'
        row.status.git_description = '代码已存在服务区指定路径中'
        row.status.build_before_description = '执行构建步骤'
        this.normal = true
        this.build = false
      }
      else if (response.data.message === '服务器链接失败'){
        row.status.git_status1 = 'error'
        row.status.git = '已完成'
        row.status.git_description = '服务器链接失败'
        this.normal = true
        this.build = false
        return
      }
      else if (result){
        row.status.git_status1 = 'error'
        row.status.git = '已完成'
        row.status.git_description = response.data.message
        this.normal = true
        this.build = false
        return
      }
      else if (git_result){
        row.status.git_status1 = 'error'
        row.status.git = '已完成'
        row.status.git_description = response.data.message
        this.normal = true
        this.build = false
        return
      }
      else if (response.data.message === '项目拉取失败'){
        row.status.git_status1 = 'error'
        row.status.git = '已完成'
        row.status.git_description = response.data.message
        this.normal = true
        this.build = false
        return
      }


      let compile_response = await buildBefore({id:this.id})
      if (compile_response.data.message === '镜像构建成功'){
        row.status.build_before_status2 = 'success'
        row.status.build_before = '已完成'
        row.status.build_before_description = '镜像构建成功'
        row.status.build_after_status4 = 'finish'
        row.status.build_after_description = '正在执行构建后步骤'
        row.status.build_after = '进行中'
      }
      else if (compile_response.data.message === '服务器链接失败'){
        row.status.build_before_status2 = 'error'
        row.status.build_before = '已完成'
        row.status.build_before_description = '服务器链接失败'
        this.normal = true
        this.build = false
        return
      }
      else if (compile_response.data.message === '镜像构建失败'){
        row.status.build_before_status2 = 'error'
        row.status.build_before = '已完成'
        row.status.build_before_description = '镜像构建失败'
        this.normal = true
        this.build = false
        return
      }
      else if (response.data.message === '缺少dockerfile文件'){
        row.status.git_status1 = 'error'
        row.status.git = '已完成'
        row.status.git_description = response.data.message
        this.normal = true
        this.build = false
        return
      }

      let build_after_response = await buildAfter({id:this.id})
      if (build_after_response.data.message === '构建后步骤执行成功'){
        row.status.build_after = '已完成'
        row.status.build_after_status4 = 'success'
        row.status.build_after_description = build_after_response.data.message
        this.normal = true
        this.build = false
        return
      }
      else if (build_after_response.data.message === '服务器链接失败'){
        row.status.build_after = '已完成'
        row.status.build_after_status4 = 'error'
        row.status.build_after_description = '服务器链接失败'
        this.normal = true
        this.build = false
        return
      }
      else if (build_after_response.data.message === '构建后步骤执行失败'){
        row.status.build_after = '已完成'
        row.status.build_after_status4 = 'error'
        row.status.build_after_description = '构建后步骤执行失败'
        this.normal = true
        this.build = false
        return
      }




    },
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.id;
      this.delVisible = true;
    },
    delAll() {
      deleteAllRepository({
        idlist: this.del_list
      }).then(response => {
        // 项目删除成功
        this.$message.success('删除成功');
        this.tableData = response.data.results
      })
          .catch(error => {
            this.$message.error('服务器错误');
          })
    },
    handleSelectionChange(val) {
      let lists = val
      let ids = []
      for (var i=0; i<lists.length; i++){
        ids.push(lists[i]['id'])
      }
      this.del_list = ids
    },
    // 确定删除
    deleteRow(){
      if (this.build === true){
        this.$message.warning('当前有构建任务无法删除')
        return
      }
      deleteRepository(this.id)
          .then(response => {
            // 项目删除成功
            this.$message.success('删除成功');
            this.delVisible = false;
            this.tableData = response.data.results;
            this.cur_page = response.data.current_page_num || 1;
            this.total_nums = response.data.count || 1;
          })
          .catch(error => {
            this.$message.error('服务器错误');
          })
    },

    linkTo(id) {
      this.$router.push({ path: `/font_edit/${id}` });
    },
    handleClose(done) {
      done()
    },
    views(){
      this.dialogVisible = true
    },
    // clears(){
    //   this.is_build = false
    // }
  }
}

</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt{
  font-size: 16px;
  text-align: center
}
.table{
  width: 100%;
  font-size: 14px;
}
.red{
  color: #ff0000;
}
.mr10{
  margin-right: 10px;
}
.el-icon-loading{
  color: red;
  margin-right: 5px;
}
</style>
