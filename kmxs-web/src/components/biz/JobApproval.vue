<template>
  <div class="view-container">
    <el-card v-for="(item, index) of list" :key="index" class="item-view">
      <div class="item-container">
        <div class="item-left">
          <template v-if="bizAction === '15'">
            <div class="approval-name">{{ item.user.nickName }} ({{ item.user.username }}) <span class="active middle-approval">岗位停用</span></div>
          </template>
          <template v-else>
            <div v-if="item.jobDef.stdTypeCode === '1'" class="approval-name"><span class="active label">申请人: </span> {{ item.user.nickName }} ({{ item.user.username }})</div>
            <div v-else-if="item.jobDef.stdTypeCode === '2'" class="approval-name"> {{ item.oldNickName }} ({{ item.oldUserName ? item.oldUserName : '原岗位无人' }}) <span class="active middle-approval">变更为</span> {{ item.user.nickName }} ({{ item.user.username }})</div>
          </template>
          <div class="dept-title">
            <span class="job-approval-label">申请岗位: </span>{{ item.jobDef.name }}
            <el-tag v-if="item.jobDef.stdTypeCode === '1'" size="mini" style="color: #159AFF;margin-left: 6px;">通用岗位(一岗多人)</el-tag>
            <el-tag v-else-if="item.jobDef.stdTypeCode === '2'" size="mini" style="margin-left: 6px;">专用岗位(一岗一人)</el-tag>
          </div>
          <div class="dept-name">
            <span class="job-approval-label">岗位所在部门: </span>{{ item.deptName }}
          </div>
        </div>
        <div class="item-right">
          <div><span class="job-approval-label">业务系统: </span>{{ item.jobDef.bizSys }}</div>
          <div class="remark-content">
            <div class="job-approval-remark-label">岗位描述: </div>
            <div class="remark-desc">
              {{ item.jobDef.remark }}
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'JobPreview',
  props: {
    list: {
      type: Array,
      default: function() {
        return []
      }
    },
    bizAction: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
  .view-container{
    margin: 0 10px;
  }
  .item-view{
    margin-bottom: 10px;
  }
  .approval-name{
    font-size: 16px;
  }
  .dept-title{
    color: #333;
    margin-top: 10px;
  }
  .dept-name{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .active{
    color: #FF6A05;
  }
  .job-approval-label,
  .remark-content  .job-approval-remark-label{
    width: 90px;
    text-align: right;
    margin-right: 6px;
  }
  .item-right>div{
    margin-top: 10px;
  }
  .middle-approval{
    margin: 0 4px;
  }
  .job-approval-label {
    display: inline-block;
  }
  .job-approval-remark-label{
    flex-basis: 90px;
    line-height: 20px;
  }
  .remark-content{
    display: flex;
    width:100%;
  }
  .remark-desc{
    flex: 1;
    line-height: 20px;
  }
</style>
