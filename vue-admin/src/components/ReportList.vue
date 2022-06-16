<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 报告管理</el-breadcrumb-item>
                <el-breadcrumb-item>报告列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="输入筛选关键词" class="handle-input mr10"></el-input>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" stripe>
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="name" label="报告名称" width="350">
                </el-table-column>

                <el-table-column prop="result" label="执行结果" width="80">
                </el-table-column>

                <el-table-column prop="count" label="用例总数" width="80">
                </el-table-column>

                <el-table-column prop="success" label="成功总数" width="80">
                </el-table-column>

                <el-table-column prop="failed" label="失败总数" width="80">
                </el-table-column>

                <el-table-column prop="create_time" label="创建时间" sortable align="center">
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" @click="handleOpen(scope.$index, scope.row)">打开</el-button>
                        <el-button type="text" icon="el-icon-download" @click="handleDownload(scope.$index, scope.row)">下载</el-button>
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
        <el-dialog title="删除套件" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
<!--      <iframe v-if="html" :src="content" width="100%" height="100%"></iframe>-->
      <div v-if="reportType" v-html="htmlContent"
           width="auto" height="auto"
           scrolling="yes"
           style="position:absolute;top:80px;left: 30px;">
      </div>
    </div>

</template>

<script>
import {reports_list, delete_report, report_download, deletReports, openReports} from '../api/api';
    export default {
        // beforeRouteEnter (to, from, next) {
        //     // 在路由跳转页面实例化之前被调用, 此时还没有this实例, 但是可以通过next的回调中获取实例的引用
        //     next(vm => {
        //         vm.getData();
        //     });
        //     next()
        // },
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
                // editVisible: false,
                delVisible: false,
                // runVisible: false,
                form: {},

                idx: -1,   // 在tableData数组中的索引值
                id: -1,    // 在数据库中的真实索引值

                env_id: '',
                envs_id_names: [],  // 返回的环境变量数据
                html: false,
                htmlContent: '',
                reportType: true
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
                this.page_size = val;
                this.getData();
            },
            getData() {
                reports_list({
                    'page': this.cur_page,
                    'size': this.page_size
                })
                    .then(response => {
                        this.tableData = response.data.results;
                        this.cur_page = response.data.current_page_num || 1;
                        this.total_nums = response.data.count || 1;
                    })
            },
            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id;
                this.delVisible = true;
            },
            handleDownload(index, row){
                this.idx = index;
                this.id = row.id;
                let full_filename = row.name + '.html';
                report_download(this.id)
                    .then(response => {
                        // console.log(response.data);
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', full_filename);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                    })
                    .catch(error => {
                        this.$message.error('服务器错误');
                    })
            },
            handleOpen(index, row){
                this.idx = index;
                this.id = row.id;
                openReports({
                  id:this.id
                }).then(response => {
                  let content = response.data.html
                  this.htmlContent = content
                  this.html = true


                  //alert(html)
                })
                .catch(error => {
                  this.$message.error('服务器错误');
                })
                //this.$router.push({ path: `/reports_view/${this.id}`})
            },

            delAll() {
              deletReports({
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
              delete_report(this.id)
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
