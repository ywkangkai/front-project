<template>
    <div class="reportShow">
        <h1>Test Report: {{html_report_name}}</h1>
        <h2>Summary</h2>
        <table id="summary">

            <tr>
                <th>START AT</th>
                <td colspan="4">{{time.start_datetime}}</td>
            </tr>
            <tr>
                <th>DURATION</th>
                <td colspan="4">{{ time.duration }} seconds</td>
            </tr>
            <tr>
                <th>PLATFORM</th>
                <td>HttpRunner {{ platform.httprunner_version }} </td>
                <td>{{ platform.python_version }} </td>
                <td colspan="2">{{ platform.platform }}</td>
            </tr>
            <tr>
              <th>STAT</th>
              <th colspan="2">TESTCASES (success/fail)</th>
              <th colspan="2">TESTSTEPS (success/fail/error/skip)</th>
            </tr>
            <tr>
              <td>total (details) =></td>
              <td colspan="2">{{stat.total}} ({{stat.success}}/{{stat.fail}})</td>
              <td colspan="2">{{stat2.total}} ({{stat2.successes}}/{{stat2.failures}}/{{stat2.errors}}/{{stat2.skipped}})</td>
            </tr>
            <tr>
                <th>TOTAL</th>
                <th>SUCCESS</th>
                <th>FAILED</th>
                <th>ERROR</th>
                <th>SKIPPED</th>
            </tr>
            <tr>
                <td>{{stat.total}}</td>
                <td>{{stat.success}}</td>
                <td>{{stat.fail}}</td>
                <td>{{stat2.errors}}</td>
                <td>{{stat2.skipped}}</td>
            </tr>
        </table>

        <h2>Details</h2>

        <template v-for="(test_suite_summary, suite_index) in details">
            <h3>{{test_suite_summary.name}}</h3>
            <table :id="'suite_' + suite_index" class="details">
              <tr>
                <td>TOTAL: {{stat.total}}</td>
                <td>SUCCESS: {{stat.success}}</td>
                <td>FAILED: {{stat.fail}}</td>
                <td>ERROR: {{stat2.errors}}</td>
                <td>SKIPPED: {{stat2.skipped}}</td>
              </tr>

              <tr>
                <th>Status</th>
                <th colspan="2">Name</th>
                <th>Response Time</th>
                <th>Detail</th>
              </tr>

              <template v-for="(record, record_index) in test_suite_summary.records" >
                <tr :id="'record_'+suite_index+'_'+record_index">
                  <th :class="record.status" style="width:5em;">{{record.status}}</th>
                  <td colspan="2">{{record.name}}</td>
                  <td style="text-align:center;width:6em;">{{ record.response_time }}</td>
                  <td class="detail">
                    <a class="button" :href="'#popup_log_'+suite_index+'_'+record_index+'_'+1">log-1</a>
                    <div :id="'popup_log_'+suite_index+'_'+record_index+'_'+1" class="overlay">
                      <div class="popup">
                        <h2>Request and Response data</h2>
                        <a class="close" :href="'#record_'+suite_index+'_'+record_index+'_'+1">&times;</a>
                        <div class="content">
                          <h3>Name: {{record.name}}</h3>
                          <h3>Request:</h3>
                          <div style="overflow: auto">
                            <table>
                              <tr>
                                <th>url</th>
                                <td>
                                  {{ record.meta_datas.data[0]['request']['url'] }}
                                </td>
                              </tr>
                              <tr>
                                <th>method</th>
                                <td>
                                  {{ record.meta_datas.data[0]['request']['method'] }}
                                </td>
                              </tr>
                              <tr>
                                <th>headers</th>
                                <td>
                                  <div>
                                    <strong>User-Agent</strong>: python-requests/2.25.1
                                  </div>
                                  <div>
                                    <strong>Accept-Encoding</strong>: gzip, deflate
                                  </div>
                                  <div>
                                    <strong>Accept</strong>: */*
                                  </div>
                                  <div>
                                    <strong>Connection</strong>: keep-alive
                                  </div>
                                </td>
                              </tr>
                              <tr v-if="record.meta_datas.data[0]['request']['body']">
                                <th>body</th>
                                <td>
                                  {{record.meta_datas.data[0]['request']['body']}}
                                </td>
                              </tr>
                            </table>
                          </div>

                          <h3>Response:</h3>
                          <div style="overflow: auto">
                            <table>
                              <tr>
                                <th>ok</th>
                                <td>
                                  {{ record.meta_datas.data[0]['response']['ok'] }}
                                </td>
                              </tr>
                              <tr>
                                <th>url</th>
                                <td>
                                  {{ record.meta_datas.data[0]['response']['url'] }}
                                </td>
                              </tr>
                              <tr>
                                <th>status_code</th>
                                <td>
                                  {{ record.meta_datas.data[0]['response']['status_code'] }}
                                </td>
                              </tr>
                              <tr>
                                <th>reason</th>
                                <td>
                                  {{ record.meta_datas.data[0]['response']['reason'] }}
                                </td>
                              </tr>
                              <tr>
                                <th>cookies</th>
                                <td>
                                  {{ record.meta_datas.data[0]['response']['cookies'] }}
                                </td>
                              </tr>
                              <tr>
                                <th>encoding</th>
                                <td>
                                  {{ record.meta_datas.data[0]['response']['encoding'] }}
                                </td>
                              </tr>
                              <tr>
                                <th>headers</th>
                                <td>
                                  <div>
                                    <strong>Date</strong>: {{ record.meta_datas.data[0]['response']['headers']['Date'] }}
                                  </div>
                                  <div>
                                    <strong>Server</strong>: WSGIServer/0.2 CPython/3.7.1
                                  </div>
                                  <div>
                                    <strong>Content-Type</strong>: application/json
                                  </div>
                                  <div>
                                    <strong>Vary</strong>: Accept, Origin, Cookie
                                  </div>
                                  <div>
                                    <strong>Allow</strong>: GET, POST, PUT, DELETE, HEAD, OPTIONS
                                  </div>
                                  <div>
                                    <strong>X-Frame-Options</strong>: DENY
                                  </div>
                                  <div>
                                    <strong>Content-Length</strong>: 2179
                                  </div>
                                  <div>
                                    <strong>X-Content-Type-Options</strong>: nosniff
                                  </div>
                                  <div>
                                    <strong>Referrer-Policy</strong>: same-origin
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <th>content_type</th>
                                <td>
                                  {{ record.meta_datas.data[0]['response']['Content-Type'] }}
                                </td>
                              </tr>
                              <tr>
                                <th>json</th>
                                <td>
                                  {{ record.meta_datas.data[0]['response']['json'] }}
                                </td>
                              </tr>
                            </table>
                          </div>
                          <h3>Validators:</h3>
                          <div style="overflow: auto">
                            <table>
                              <tr>
                                <th>check</th>
                                <th>comparator</th>
                                <th>expect value</th>
                                <th>actual value</th>
                              </tr>
                              <tr>
                                <td class="passed">
                                  {{ record.meta_datas.validators[0]['check']}}
                                </td>
                                <td>{{ record.meta_datas.validators[0]['comparator']}}</td>
                                <td>{{ record.meta_datas.validators[0]['expect_value']}}</td>
                                <td>{{ record.meta_datas.validators[0]['check_value']}}</td>
                              </tr>
                            </table>
                          </div>
                          <h3>Statistics:</h3>
                          <div style="overflow: auto">
                            <table>
                              <tr>
                                <th>content_size(bytes)</th>
                                <td>{{ record.meta_datas.stat.content_size}}</td>
                              </tr>
                              <tr>
                                <th>response_time(ms)</th>
                                <td>{{ record.meta_datas.stat.response_time_ms}}</td>
                              </tr>
                              <tr>
                                <th>elapsed(ms)</th>
                                <td>{{ record.meta_datas.stat.elapsed_ms}}</td>
                              </tr>

                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <a v-if="record.attachment" class="button" :href="'#popup_attachment_'+suite_index+'_'+record_index">traceback</a>
                    <div :id="'popup_attachment_'+suite_index+'_'+record_index" class="overlay">
                      <div class="popup">
                        <a class="close" :href="'#record_'+suite_index+'_'+record_index">&times;</a>
                        <div class="content">
                          <pre><{{record.attachment}}</pre>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>

            </table>
        </template>

    </div>
</template>

<script>
    import { report_view } from '../api/api';
    export default {
        name: 'reportShow',
        data() {
            return {
                report_id: null,
                html_report_name: '',
                time: Object,
                stat: Object,
                stat2: Object,
                platform: Object,
                details: Array,
            }
        },
        // created() {
        //   this.report_id = this.$route.params.id;
        //   this.getData()
        // },
        methods: {
              getData() {
                  report_view(this.report_id)
                      .then(response => {
                          let summary = JSON.parse(response.data.summary)
                          this.html_report_name = summary.html_report_name;
                          this.time = summary.time;
                          this.stat = summary.stat.testcases;
                          this.stat2 = summary.stat.teststeps
                          this.platform = summary.platform;
                          this.details = summary.details;
                          console.log(this.details)
                      })
                      .catch(error => {
                          if (typeof error === 'object' && error.hasOwnProperty('status_code')) {
                              if (error.status_code === 404) {
                                  this.$router.push({ name: '404' })
                              }
                          } else {
                              this.$message.error('服务器错误');
                          }
                      })
              },
          },
        mounted() {
            // this.showData();
          this.report_id = this.$route.params.id;
          this.getData()
        }
    };

</script>

<style scoped>
    .reportShow {
        background-color: #f2f2f2;
        color: #333;
        margin: 20px auto;
        width: 960px;
    }
    #summary {
        width: 960px;
        margin-bottom: 20px;
    }
    #summary th {
        background-color: skyblue;
        padding: 5px 12px;
    }
    #summary td {
        background-color: lightblue;
        text-align: center;
        padding: 4px 8px;
    }
    .details {
        width: 960px;
        margin-bottom: 20px;
    }
    .details th {
        background-color: skyblue;
        padding: 5px 12px;
    }
    .details tr .passed {
        background-color: lightgreen;
    }
    .details tr .failed {
        background-color: red;
    }
    .details tr .unchecked {
        background-color: gray;
    }
    .details td {
        background-color: lightblue;
        padding: 5px 12px;
    }
    .details .detail {
        background-color: lightgrey;
        font-size: smaller;
        padding: 5px 10px;
        text-align: center;
    }
    .details .success {
        background-color: greenyellow;
    }
    .details .error {
        background-color: red;
    }
    .details .failure {
        background-color: salmon;
    }
    .details .skipped {
        background-color: gray;
    }

    .button {
        font-size: 1em;
        padding: 6px;
        width: 4em;
        text-align: center;
        background-color: #06d85f;
        border-radius: 20px/50px;
        cursor: pointer;
        transition: all 0.3s ease-out;
    }
    a.button{
        color: gray;
        text-decoration: none;
    }
    .button:hover {
        background: #2cffbd;
    }

    .overlay {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        transition: opacity 500ms;
        visibility: hidden;
        opacity: 0;
    }
    .overlay:target {
        visibility: visible;
        opacity: 1;
        overflow: scroll;
    }

    .popup {
        margin: 70px auto;
        padding: 20px;
        background: #fff;
        border-radius: 10px;
        width: 50%;
        position: relative;
        transition: all 3s ease-in-out;
    }

    .popup h2 {
        margin-top: 0;
        color: #333;
        font-family: Tahoma, Arial, sans-serif;
    }
    .popup .close {
        position: absolute;
        top: 20px;
        right: 30px;
        transition: all 200ms;
        font-size: 30px;
        font-weight: bold;
        text-decoration: none;
        color: #333;
    }
    .popup .close:hover {
        color: #06d85f;
    }
    .popup .content {
        max-height: 80%;
        overflow: auto;
        text-align: left;
        padding-bottom: 20px;
    }

    @media screen and (max-width: 700px) {
        .box {
            width: 70%;
        }
        .popup {
            width: 70%;
        }
    }

</style>