<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 接口管理</el-breadcrumb-item>
        <el-breadcrumb-item>接口列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" placeholder="输入筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search" >搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="55" align="center"></el-table-column>

        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

        <el-table-column prop="name" label="接口名称" width="250">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>接口名: {{ scope.row.name }}</p>
              <p>用例数: {{ scope.row.testcases }}</p>
              <p>配置数: {{ scope.row.configures }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column prop="desc" label="描述" width="100" align="center">
        </el-table-column>

        <el-table-column prop="tester" label="测试人员" width="100" align="center">
        </el-table-column>

        <el-table-column prop="project" label="所属项目" width="250">
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" sortable align="center">
        </el-table-column>

        <el-table-column prop="update_time" label="更新时间" sortable align="center">
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleRun(scope.$index, scope.row)">运行</el-button>
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
    <el-dialog title="编辑接口" :visible.sync="editVisible" width="30%" center>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="接口名称">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>

        <el-form-item label="测试人员">
          <el-input v-model="form.tester" clearable></el-input>
        </el-form-item>

        <el-form-item label="所属项目">
          <el-input v-model="form.project" disabled></el-input>
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
    <el-dialog title="删除接口" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 运行项目弹出框 -->
    <el-dialog title="运行接口" :visible.sync="runVisible" width="30%" center>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="运行环境">

          <el-select v-model="env_id" clearable placeholder="请选择">  <!-- v-model收集的是value的值即item.id -->
            <el-option
                v-for="item in envs_id_names"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="runVisible = false">取 消</el-button>
                <el-button type="primary" @click="openFullScreen1" v-loading.fullscreen.lock="fullscreenLoading">运行</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import {listInterface, deleteInterface, editInterface, interfaceEnv, run_by_interface, deletInterface, detailInterface, run_by_testcase,} from '../api/api';
    //import { O_RDONLY } from 'constants';
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

                project_idx: -1,   // 在tableData数组中的索引值 
                project_id: -1,    // 在数据库中的真实索引值

                idx: -1,   // 在tableData数组中的索引值 
                id: -1,    // 在数据库中的真实索引值
                
                env_id: '',
                envs_id_names: [],  // 返回的环境变量数据
                fullscreenLoading: false
            }
        },
        created() {
            this.getData();     // 获取接口数据
            this.getEnvsIdNames();  // 获取环境变量ID和名称
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
            getData() {

              listInterface({
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
            detailInterface({
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
                this.idx = index;   // 当前修改的数据, 在tableData数组中的索引值
                this.id = row.id;   // 当前修改的数据在数据库中的真实索引值
                this.form = {...row};
                this.editVisible = true;
            },
            handleRun(index, row) {
                this.idx = index;   // 当前修改的数据, 在tableData数组中的索引值
                this.id = row.id;   // 当前修改的数据在数据库中的真实索引值
                this.form = row;
                this.runVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id;
                this.delVisible = true;
            },
          delAll() {
            deletInterface({
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
            //console.log(this.del_list)
            //this.multipleSelection = val;
          },
            // 保存编辑
            async saveEdit() {
                // var datas = this.form;
                var datas = Object.assign({}, this.form);
                delete datas.project;
                let response = await editInterface(this.id, datas)
                try{
                  if (response.data.hasOwnProperty('name')){
                    this.$message.error('接口名称已存在')
                  }
                  else {
                    this.$message.success('修改成功')
                    this.tableData = response.data.results
                    this.editVisible = false;
                  }
                }
                catch(error){
                    this.editVisible = false;
                    this.$message.error('服务器错误');
                }

            },
            // 确定删除
            deleteRow(){
              deleteInterface(this.id)
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
            // 获取所有环境变量的ID和名称
            getEnvsIdNames(){
              interfaceEnv()
                .then(response => {
                    this.envs_id_names = response.data;   // 将返回的环境变量数据赋值给envs_id_names
                })
                .catch(error => {
                    this.$message.error('服务器错误');
                })
            },
            open(response) {
              this.$confirm('用例执行完成，是否前往查看报告?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push({ path: `/reports_view/${response.data.id}` })
              }).catch(() => {
                return;
              });
            },
            async openFullScreen1() {
              if (this.env_id === ''){
                this.$message.error('请选择运行环境')
              }
              else {
                this.runVisible = false
                this.fullscreenLoading = true;
                let response = await run_by_interface({iid: this.id, env_id: this.env_id})
                console.log(response)
                if (response.data.message === '当前接口不存在用例无法运行'){
                  console.log('xxxxxxxxxxxxxx')
                  this.fullscreenLoading = false
                  this.$message.error('当前接口未添加用例无法执行')
                  return
                }
                if (response.status === 201){
                  this.fullscreenLoading = false
                  this.open(response)
                }
                else {
                  this.fullscreenLoading = false
                  this.open(response)
                }
              }
            }
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
</style>
