<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 套件管理</el-breadcrumb-item>
                <el-breadcrumb-item>套件列表</el-breadcrumb-item>
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

                <el-table-column prop="name" label="套件名称" width="250">
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑套件" :visible.sync="editVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="套件名称">
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
        <el-dialog title="删除套件" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 运行项目弹出框 -->
        <el-dialog title="运行套件" :visible.sync="runVisible" width="30%" center>
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
                <el-button type="primary" @click="confirmRun">运 行</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {testsuite_list, deleteTestsuite, envs_names, run_by_testsuite, detailTestsuite, deletAllTestsuite} from '../api/api';
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
                editVisible: false,
                delVisible: false,
                runVisible: false,
                form: {},

                idx: -1,   // 在tableData数组中的索引值 
                id: -1,    // 在数据库中的真实索引值
                
                env_id: '',
                envs_id_names: [],  // 返回的环境变量数据
            }
        },
        created() {
            this.getData();     // 获取项目数据
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

              testsuite_list({
                    'page': this.cur_page,
                    'size': this.page_size
                })
                .then(response => {
                    this.tableData = response.data.results;
                    this.cur_page = response.data.current_page_num || 1;
                    this.total_nums = response.data.count || 1;
                })
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
            deletAllTestsuite({
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
            // 确定删除
            deleteRow(){
              deleteTestsuite(this.id)
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
            confirmRun(){
                run_by_testsuite(this.id, this.env_id)
                .then(response => {
                    // console.log(response.data);   // 通过套件运行用例
                    this.$router.push({ path: `/reports_view/${response.data.id}` })
                })
                .catch(error => {
                    // console.log(error);
                    if (typeof error === 'object' && error.hasOwnProperty('msg') ){
                        this.$message.error(error.msg);
                    } else {
                        this.$message.error('服务器错误');
                    }
                })
            },
            linkTo(id) {
                this.$router.push({ path: `/testsuites_edit/${id}` });
            },
          search(){
            detailTestsuite({
              'name': this.select_word
            }).then((response)=>{
              this.tableData = response.data.results
            })
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
