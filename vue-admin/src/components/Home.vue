<template>
    <div class="wrapper">
      <Header></Header>
      <Sidebar></Sidebar>
      <div class="content-box" :class="{'content-collapse':collapse}">
        <tags></tags>
        <div class="content">
          <transition name="move" mode="out-in">
            <keep-alive :include="tagsList">
              <router-view></router-view>
            </keep-alive>
          </transition>
        </div>

      </div>
    </div>
</template>

<script>
    import Header from "@/components/Header";
    import Sidebar from "@/components/Sidebar";
    import Tags from "@/components/Tags";
    import bus from "@/components/common/bus";
    export default {
      data(){
        return{
          tagsList: [],
          collapse: false
        }
      },
      components:{Header, Sidebar,Tags},
      created(){
        bus.$on('collapse', msg => {  //在header中会调用此函数
          this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {   //此处是msg为Tag组件中的tagsList
          let arr = [];
          for(let i = 0, len = msg.length; i < len; i ++){
            msg[i].name && arr.push(msg[i].name);
          }
          this.tagsList = arr;
        })
      }
    }
</script>
