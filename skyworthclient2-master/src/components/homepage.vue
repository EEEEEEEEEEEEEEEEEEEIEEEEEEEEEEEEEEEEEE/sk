<template>
  <el-row class="homepage">
    <el-col class="homepage-sidebar" :span="4">
      <div class="homepage-sidebar__header">
        <img src="../assets/yidonglogo.svg" style="width: 15rem">
      </div>
      <ef-list style="width: 100%;height: 100%;" :wrap-height="'80%'" :list="categories">
        <div v-for="category in categories" class="homepage-sidebar__category" :class="{'is-active':category.active}"
             @click="toggleCategory(category)">{{category.Name}}
        </div>
      </ef-list>
    </el-col>
    <el-col :span="20" style="height: 100%">
      <div class="homepage-main-header">
        <i class="homepage-main-header__icon is-left sk-icon-return" @click="turnLeft()"
           v-if="iconsVisible&&curTags.length>=3" @mouseenter="iconsVisible=true"></i>
        <i class="homepage-main-header__icon is-right sk-icon-return" @click="turnRight()"
           v-if="iconsVisible&&curTags.length>=3" @mouseenter="iconsVisible=true"></i>
        <ef-list :orientation="'horizontal'" :wrap-width="'100%'" style="width: 96%" ref="EfTagList"
                 @mouseenter.native="iconsVisible=true"
                 @mouseleave.native="iconsVisible=false" :list="curTags">
          <div v-for="tag in curTags"
               :style="{background:tag.Icon!=null?'url('+tag.Icon.Uri+')':null}"
               class="homepage-main-header__tag animated fadeIn"
               :class="{'is-active':tag.active}" @click="toggleTag(tag)">
            <span style="margin-left: 1rem">{{tag.Name}}</span>
          </div>
        </ef-list>
      </div>
      <div class="homepage-main-list">
        <div class="homepage-main-list__title">课程列表</div>
        <el-scrollbar class="homepage-main-list__scrollbar" ref="elscrollbar">
          <el-row class="homepage-main-list__row" v-for="(row,index) in resources" :key="index">
            <el-col :span="6" v-for="(resource,index) in row" class="homepage-main-list__col" :key="index">
              <div class="homepage-main-list-item animated fadeIn" @click="toggleResource(resource)">
                <div class="homepage-main-list-item__pic">
                  <img :src="resource.Icon!=null?resource.Icon.Uri:require('../assets/ic_resource_default.png')" style="width: 100%;height: 100%;border-radius: .5rem;">
                  <i class="font_family sky-icon-resource_selected"
                     style="position: absolute;color: white;font-size: 2rem" v-if="resource.selected"></i>
                </div>
                <div class="homepage-main-list-item__title">{{resource.Name.length>30?resource.Name.substring(0,15)+'...':resource.Name}}</div>
              </div>
            </el-col>
          </el-row>
          <div class="page-container" v-if="resourcePages.visible">
            <el-pagination
              background
              layout="prev, pager, next"
              :current-page.sync="resourcePages.curPage"
              @current-change="handlePageChange"
              :page-count="resourcePages.totalPages">
            </el-pagination>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import EfList from "./common/ef-list/list";
  import {mapMutations} from 'vuex'

  export default {
    name: "homepage",
    components: {EfList},
    data() {
      return {
        categories: [],
        Tags: [],
        curCategory: {},
        curTags: [],
        curTag: {},
        resources: [],
        iconsVisible: false,
        selectedResource: {},
        resourcePages: {}
      }
    },
    created() {
      this.$nextTick(() => {
        console.log(this.$refs.EfTagList.nScrollbarData.visible);
      //:src="resource.Icon!=null?resource.Icon.Uri:'/assets/lib/ic_resource_default.png'"
      });
      this.init();
    },
    methods: {
      init() {
        this.fetchData();
      },
      turnLeft() {
        this.$refs.EfTagList.outSmoothScroll(-480, 200);
      },
      turnRight() {
        this.$refs.EfTagList.outSmoothScroll(480, 200);
      },
      fetchData() {
        this.categories = [];
        this.curCategory = {};
        this.Tags = [];
        this.curTags = [];
        this.curTag = {};
        this.resources = [];
        this.axios.get("/ccweb/api/categories/list").then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            this.categories.push(
              {
                Id: res.data[i].Id,
                Name: res.data[i].Name,
                active: false
              }
            );
          }
          this.categories[0].active = true;                //先默认开始选中为第一个
          this.curCategory = this.categories[0];
          this.axios.get("/ccweb/api/tags/list").then((res) => {
            for (let i = 0; i < res.data.length; i++) {
              this.Tags.push({
                Id: res.data[i].Id,
                active: false,
                Name: res.data[i].Name,
                Category: res.data[i].Category,
                Icon: res.data[i].Icon
              })
            }
            this.curTags = this.getCurTags();
            if (this.curTags.length != 0) {
              this.curTags[0].active = true;
              this.curTag = this.curTags[0];
              let catid = this.curCategory.Id;
              let tagid = this.curTag.Id;
              this.getResourcesFromServer(catid, tagid);
            }
          }).catch((err) => {
          });
        }).catch((err) => {
          console.log(err);
        });
      },

      getCurTags() {           //根据curCategory
        let curTags = [];
        for (let i = 0; i < this.Tags.length; i++) {
          if (this.Tags[i].Category.Id == this.curCategory.Id) {
            curTags.push(this.Tags[i]);
          }
        }
        return curTags;
      },

      toggleCategory(category) {
        for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].active) {
            this.categories[i].active = false;
            break;
          }
        }
        category.active = true;
        this.curCategory = category;
        this.curTags = this.getCurTags();
        if (this.curTags.length != 0) {
          let choosen = false;
          this.curTags.forEach((Tag) => {
            if (Tag.active) {
              this.curTag = Tag;
              choosen = true;
            }
          });
          if (!choosen) {
            this.curTags[0].active = true;
            this.curTag = this.curTags[0];
          }
          let catid = this.curCategory.Id;
          let tagid = this.curTag.Id;
          this.setSelected(false);
          this.resourcePages.visible = false;
          this.getResourcesFromServer(catid, tagid);
        }
      },

      getResourcesFromServer(catid, tagid) {
        this.resources = [];
        this.axios.get('/ccweb/api/resources/count', {
          params: {
            catid: catid,
            tagid: tagid
          }
        }).then((res) => {
          let count = res.data;
          let numsperpage = 32;
          if (count != 0) {
            this.axios.get('/ccweb/api/resources/list', {
              params: {
                page: 1,
                numsperpage: numsperpage,
                catid: catid,
                tagid: tagid
              }
            }).then((res) => {
              let mResources = [];
              res.data.forEach((resource) => {
                resource.selected = false;
                mResources.push(resource);
              })
              this.resources = this.groupArray(mResources, 4);
              let visible = false;
              let pages = parseInt(count / numsperpage) == count / numsperpage ? parseInt(count / numsperpage) : parseInt(count / numsperpage) + 1;
              if (pages != 1) {
                visible = true;
              }
              console.log(pages);
              this.resourcePages = {
                curPage: 1,
                totalPages: pages,
                visible: visible,
                numsperpage: numsperpage
              }
            }).catch((err) => {
              console.log(err);
            })
          }
        });
      },

      getResourceByPage(curPage, numsperpage) {
        this.axios.get('/ccweb/api/resources/list', {
          params: {
            page: curPage,
            numsperpage: numsperpage,
            catid: this.curCategory.Id,
            tagid: this.curTag.Id
          }
        }).then((res) => {
          let mResources = [];
          res.data.forEach((resource) => {
            resource.selected = false;
            mResources.push(resource);
          })
          this.resources = this.groupArray(mResources, 4);
          this.$nextTick(() => {
            this.$refs['elscrollbar'].$refs['wrap'].scrollTop = 0;
          });
        });
      },

      groupArray(arr, rowItems) {
        let row = [];
        let groupedArr = [];
        for (let i = 0; i < arr.length; i++) {
          row.push(arr[i]);
          if (row.length == rowItems || i == arr.length - 1) {
            groupedArr.push(row);
            row = [];
          }
        }
        return groupedArr;
      },

      toggleTag(Tag) {
        if (Tag.active) {
          return;
        }
        for (let i = 0; i < this.curTags.length; i++) {
          this.curTags[i].active = false;
        }
        Tag.active = true;
        this.curTag = Tag;
        let catid = this.curCategory.Id;
        let tagid = this.curTag.Id;
        this.setSelected(false);
        this.resourcePages.visible = false;
        this.getResourcesFromServer(catid, tagid);
      },

      toggleResource(resource) {
        this.resources.forEach((row) => {
          row.forEach((resource) => {
            resource.selected = false;
          })
        });
        resource.selected = true;
        this.selectedResource = resource;
        this.setCurResource(this.selectedResource);
        this.setCurUri(this.selectedResource.UriLowRes);
        this.setSelected(true);
      },

      handlePageChange() {
        console.log("curPage: " + this.resourcePages.curPage);
        this.getResourceByPage(this.resourcePages.curPage, this.resourcePages.numsperpage);
      },

      ...mapMutations({
        setCurUri: 'resource/setCurUri',
        setCurResource: 'resource/setCurResource',
        setSelected: 'resource/setSelected'
      })
    },

    destroyed() {
      this.setSelected(false);
    }
  }
</script>

<style scoped>
  .homepage {
    width: 100%;
    height: 100%;
    user-select: none;
  }

  .page-container {
    width: 92%;
    margin-left: 4%;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
</style>

<style>

  .homepage-main-list__scrollbar > .el-scrollbar__wrap {
    overflow-x: hidden;
  }


</style>
