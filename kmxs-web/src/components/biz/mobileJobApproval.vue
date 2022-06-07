<template>
  <div class="user-jobs">
    <div v-for="(item, index) of list" :key="index" class="jobs-item">
      <div class="jobs-title">
        <div class="dept-title">
          {{ item.jobDef.name }}
          <el-tag v-if="item.jobDef.stdTypeCode === '1'" size="mini" style="color: #159AFF;margin-left: 6px;">通用岗位(一岗多人)</el-tag>
          <el-tag v-else-if="item.jobDef.stdTypeCode === '2'" size="mini" style="margin-left: 6px;">专用岗位(一岗一人)</el-tag>
          <!--          <el-tag size="mini" style="margin-left: 6px;">岗位停用</el-tag>-->
        </div>
        <div class="dept-desc">
          {{ item.deptName }}
        </div>
        <template v-if="bizAction === '15'">
          <div class="approval-name">{{ item.user.nickName }} ({{ item.user.username }}) <span class="active middle-approval">岗位停用</span></div>
        </template>
        <template v-else>
          <div v-if="item.jobDef.stdTypeCode === '1'" class="approval-name"><span class="active">申请人</span> {{ item.user.nickName }} ({{ item.user.username }})</div>
          <div v-else-if="item.jobDef.stdTypeCode === '2'" class="approval-name"> {{ item.oldNickName }} ({{ item.oldUserName ? item.oldUserName : '原岗位无人' }}) <span>变更为</span> {{ item.user.nickName }} ({{ item.user.username }})</div>
        </template>
        <div class="job-desc">
          <div class="label">业务系统：</div>
          <div class="value">{{ item.jobDef.bizSys }}</div>
        </div>
        <div class="job-desc">
          <div class="label">岗位描述：</div>
          <div class="value">{{ item.jobDef.remark }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileJobApproval',
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
  .jobs-item{
    margin:0 15px;
    padding:15px 0 20px;
    position: relative;
  }
  .jobs-item::after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #EFEFEF;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .jobs-item:last-child::after{
    border: none;
  }
.dept-title{
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}
  .dept-desc{
    color: #666666;
    font-size: 12px;
  }
  .approval-name{
    padding-left: 10px;
    margin-top: 10px;
    height: 24px;
    line-height: 24px;
    background:rgba(255,241,232,1);
    border-radius:2px;
    color: #333333;
  }
  .job-desc{
    display: flex;
    margin-top: 10px;
    color: #333;
  }
  .job-desc .label {
    flex-basis: 70px;
    width: 70px;
    color: #666;
    line-height: 20px;
  }
  .job-desc .value{
    flex: 1;
    line-height: 20px;
  }
</style>
