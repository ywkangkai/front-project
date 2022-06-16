<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 用例管理</el-breadcrumb-item>
                <el-breadcrumb-item>用例列表</el-breadcrumb-item>
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

                <el-table-column prop="name" label="用例名称" width="250">
                </el-table-column>

                <el-table-column prop="interface.project" label="所属项目" width="250">
                </el-table-column>

                <el-table-column prop="interface.name" label="所属接口" width="250">
                </el-table-column>

                <el-table-column prop="author" label="测试人员" width="100" align="center">
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleRun(scope.$index, scope.row)">运行</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="linkTo(scope.row.id)">编辑</el-button>
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

                    <el-select v-model="env_id" clearable placeholder="请选择">
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
import {testcase_list, delete_testcase, envs_names, run_by_testcase, detailTestcase, deletAllTestcase} from '../api/api';
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
                fullscreenLoading: false
            }
        },
        created() {
            this.getData();     // 获取项目数据
            this.getEnvsIdNames();  // 获取环境变量ID和名称
        },
        methods: {

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
                let response = await run_by_testcase({iid: this.id, env_id: this.env_id})
                if (response.status === 201){
                  this.fullscreenLoading = false
                  this.open(response)
                }
                else {
                  this.fullscreenLoading = false
                  this.open(response)
                }
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

              testcase_list({
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
            detailTestcase({
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
                this.form = row;
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
            deletAllTestcase({
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
                delete_testcase(this.id)
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
                envs_names()
                .then(response => {
                    this.envs_id_names = response.data;   // 将返回的环境变量数据赋值给envs_id_names
                })
                .catch(error => {
                    this.$message.error('服务器错误');
                })
            },
            linkTo(id) {
                this.$router.push({ path: `/testcases_edit/${id}` });
            },
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
