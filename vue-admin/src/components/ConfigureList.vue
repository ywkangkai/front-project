<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 配置管理</el-breadcrumb-item>
                <el-breadcrumb-item>配置列表</el-breadcrumb-item>
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

                <el-table-column prop="name" label="配置名称" width="250">
                </el-table-column>

                <el-table-column prop="interface.project" label="所属项目" width="250">
                </el-table-column>

                <el-table-column prop="interface.name" label="所属接口" width="250">
                </el-table-column>

                <el-table-column prop="author" label="编辑人员" width="100" align="center">
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="linkTo(scope.row.id)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"
                               @size-change="handleSizeChange" :page-sizes="[4, 5, 8, 10, 20]"
                               layout="total, sizes, prev, pager, next, jumper" :total="total_nums"
                               :page-size="page_size">
                </el-pagination>
            </div>
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="删除配置" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import {listCofig, detailConfig, deleteConfig, deletAllConfig} from '../api/api';
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,    // 当前页
                page_size: 10,  // 每页显示的数量
                total_nums: 1, // 数据总条数

                multipleSelection: [],
                select_word: '',
                del_list: [],
                editVisible: false,
                delVisible: false,
                runVisible: false,
                form: {},

                idx: -1,   // 在tableData数组中的索引值
                id: -1,    // 在数据库中的真实索引值
            }
        },
        created() {
            this.getData();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            handleSizeChange(val) {
                // console.log('val', val);
                this.page_size = val;
                this.getData();
            },
            getData() {
              listCofig({
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
            detailConfig({
              'name': this.select_word
            }).then((response)=>{
              this.tableData = response.data.results
            })
          },
            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id;
                this.delVisible = true;
            },
          delAll() {
            deletAllConfig({
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
              deleteConfig(this.id)
                    .then(response => {
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
                this.$router.push({ path: `/configures_edit/${id}` });
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
