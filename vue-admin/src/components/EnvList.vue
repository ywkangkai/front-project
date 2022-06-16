<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 环境管理</el-breadcrumb-item>
                <el-breadcrumb-item>环境列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="按环境名称查询" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search" >搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" stripe>
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="name" label="环境名称" width="200">
                </el-table-column>

                <el-table-column prop="base_url" label="base_url" width="350" align="center">
                </el-table-column>

                <el-table-column prop="desc" label="描述" width="200">
                </el-table-column>

                <el-table-column prop="create_time" label="创建时间" sortable align="center">
                </el-table-column>

                <el-table-column prop="update_time" label="更新时间" sortable align="center">
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑环境" :visible.sync="editVisible" width="35%" center>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="接口名称">
                    <el-input v-model="form.name" clearable></el-input>
                </el-form-item>

                <el-form-item label="base_url">
                    <el-input v-model="form.base_url" clearable></el-input>
                </el-form-item>

                <el-form-item label="简要描述">
                    <el-input v-model="form.desc" clearable></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="删除环境" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import {envsList, deletAllEnv, editEnvs, projectList, detailEnv, deletAllProject, editProject, deleteEnv} from '../api/api';

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

      idx: -1,   // 在tableData数组中的索引值
      id: -1,    // 在数据库中的真实索引值

      env_id: '',
      envs_id_names: [],  // 返回的环境变量数据
    }
  },
  created() {
    this.getData();     // 获取项目数据
    // this.getEnvsIdNames();  // 获取环境变量ID和名称
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.page_size = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {

      envsList({
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
      detailEnv({
        'name': this.select_word
      }).then((response)=>{
        this.tableData = response.data.results
      })
    },
    handleEdit(index, row) {
      this.idx = index;   // 当前修改的数据, 在tableData数组中的索引值
      this.id = row.id;   // 当前修改的数据在数据库中的真实索引值
      this.form = {...row}; //潜度clone，数据不会从页面流向vue
      this.editVisible = true;
    },
    handleDelete(index, row) {

      this.idx = index;
      this.id = row.id;
      this.delVisible = true;
    },
    delAll() {
      deletAllEnv({
        idlist: this.del_list
      }).then(response => {
        // 项目删除成功
        this.$message.success('删除成功');
        this.tableData = response.data.results
      })
          .catch(error => {
            this.$message.error('服务器错误');
          })
      // this.$message.error('删除了' + str);
      // this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      let lists = val
      let ids = []
      for (var i=0; i<lists.length; i++){
        ids.push(lists[i]['id'])
      }
      this.del_list = ids
      //console.log(this.del_list)
      //this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit() {

      if (this.form.name === ''){
        this.$message.error('请填写项目名称')
        return
      }
      else if ((this.form.name).length > 20){
        this.$message.error('项目名称不能超过20个字符')
        return
      }
      editEnvs(this.id, this.form)
          .then(response => {
            this.editVisible = false;
            this.$message.success(`修改成功`);
            this.tableData = response.data.results
          })
          .catch(error => {
            this.editVisible = false;
            this.$message.error('服务器错误');
          })

    },
    // 确定删除
    deleteRow(){
      deleteEnv(this.id)
          .then(response => {
            // 项目删除成功
            this.$message.success('删除成功');
            this.tableData = response.data.results;
            this.cur_page = response.data.current_page_num || 1;
            this.total_nums = response.data.count || 1;
            this.delVisible = false;
          })
          .catch(error => {
            this.$message.error('服务器错误');
          })
    },
  }
}

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
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
</style>
