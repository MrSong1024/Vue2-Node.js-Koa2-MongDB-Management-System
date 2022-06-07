<template>
  <div id="userList">
    <!--工具栏-->
    <div class="head-container crud-opts">
      <slot name="left" />
      <div class="crud-opts-left">
        <!-- 搜索 -->
        <el-input
          v-model="queryParam.blurry"
          clearable
          size="mini"
          placeholder="姓名/账号/手机号"
          style="width: 100px"
          class="filter-item"
          @keyup.enter.native="getUserData()"
        />
        <el-select
          v-model="queryParam.status"
          clearable
          size="mini"
          placeholder="状态"
          class="filter-item"
          style="width: 80px"
          @change="getUserData()"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <template v-if="status !== 'query'">
          <el-select
            v-model="queryParam.type"
            clearable
            size="mini"
            placeholder="类型"
            class="filter-item"
            style="width: 140px"
            @change="getUserData()"
          >
            <el-option
              v-for="item in filterTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </template>
        <template v-else>
          <el-select
            v-model="queryParam.type"
            clearable
            size="mini"
            placeholder="类型"
            class="filter-item"
            style="width: 140px"
            @change="getUserData()"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </template>

        <el-select
          v-model="queryParam.filterAlmostExpire"
          clearable
          size="mini"
          placeholder="过期过滤"
          class="filter-item"
          style="width: 150px"
          @change="getUserData()"
        >
          <el-option
            v-for="item in expireOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <el-input
          v-if="mode === 'mgr' || mode === 'view'"
          v-model="queryParam.ownerUser"
          clearable
          size="mini"
          placeholder="管理人"
          style="width: 90px"
          class="filter-item"
          @keyup.enter.native="getUserData()"
        />
        <el-popover
          v-if="userListAdvancedFilter"
          :popper-class="sideBar ? 'report-popover' : 'hideSlideBar'"
          placement="bottom-start"
          width="100%"
          trigger="click"
        >
          <div class="more-search-content">
            <div style="display: flex; margin: 10px 0">
              <el-autocomplete
                v-if="mode !== 'select'"
                v-model="queryParam.projectName"
                clearable
                size="mini"
                :fetch-suggestions="queryProjects"
                placeholder="产品名称"
                style="width: 270px; margin-right: 10px"
                class="filter-item"
                @keyup.enter.native="getUserData()"
                @select="changeQueryProject"
              />
              <el-autocomplete
                v-if="mode !== 'select'"
                v-model="queryParam.supplierName"
                clearable
                size="mini"
                :fetch-suggestions="querySuppliers"
                placeholder="公司名称"
                style="width: 270px; margin-right: 10px"
                class="filter-item"
                @keyup.enter.native="getUserData()"
                @select="changeQuerySupplier"
              />
              <treeselect
                v-model="queryParam.projectCode"
                :options="projectList"
                style="width: 270px; height: 26px; margin-right: 10px"
                :max-height="200"
                size="mini"
                placeholder="项目名称"
                :disable-branch-nodes="true"
                :clearable="false"
                clear-value-text="false"
                @select="selectProjectName"
              />
              <treeselect
                v-model="queryParam.deptId"
                :options="deptList"
                style="width: 270px; height: 26px; margin-right: 10px"
                :max-height="200"
                size="mini"
                placeholder="部门名称"
                :clearable="false"
                clear-value-text="false"
                @select="selectDept"
              />
              <el-button
                class="filter-item"
                size="mini"
                type="default"
                icon="el-icon-search"
                @click="resetQuery"
                >重置</el-button
              >
            </div>
          </div>
          <el-button slot="reference" class="filter-item" size="mini"
            >高级筛选</el-button
          >
        </el-popover>
        <span>
          <el-button
            class="filter-item"
            size="mini"
            type="default"
            icon="el-icon-search"
            @click="getUserData()"
            >搜索</el-button
          >
        </span>
      </div>
      <slot name="right" />
      <div v-if="status === ''" class="crud-opts-right">
        <template v-if="mode === 'mgr'">
          <el-button
            v-permission="permission.add"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="crud.toAdd"
            >新增</el-button
          >
          <el-button
            slot="reference"
            v-permission="permission.del"
            class="filter-item"
            type="default"
            icon="el-icon-delete"
            size="mini"
            :loading="crud.delAllLoading"
            :disabled="crud.selections.length === 0"
            @click="toDisable(crud.selections)"
            >禁用</el-button
          >
          <el-button
            :loading="crud.downloadLoading"
            :disabled="!crud.data.length"
            class="filter-item"
            size="mini"
            type="default"
            icon="el-icon-download"
            @click="crud.doExport"
            >导出</el-button
          >
        </template>
        <template v-else-if="mode === 'my'">
          <el-button
            v-permission="permission.approvalAdd"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="toAppleyApproval()"
            >申请用户</el-button
          >
          <el-button
            slot="reference"
            v-permission="permission.approvalAdd"
            class="filter-item"
            type="default"
            icon
            size="mini"
            @click="toMofifyApproval(crud.selections, '2')"
            >延期用户</el-button
          >
          <!--el-button
            slot="reference"
            v-permission="permission.approvalAdd"
            class="filter-item"
            type="default"
            icon
            size="mini"
            @click="toMofifyApproval(crud.selections, '3')"
          >启用用户</el-button-->
          <el-button
            slot="reference"
            v-permission="permission.edit"
            class="filter-item"
            type="default"
            icon
            size="mini"
            @click="toEnrollUser()"
            >认领用户</el-button
          >
          <el-dropdown trigger="click">
            <el-button type="default" size="mini" class="filter-item"
              >更多</el-button
            >
            <el-dropdown-menu slot="dropdown" style="width: 150px">
              <el-dropdown-item v-permission="permission.disable">
                <el-button
                  class="filter-item"
                  type="text"
                  size="mini"
                  style="width: 150px; text-align: left"
                  :loading="crud.delAllLoading"
                  @click="toDisable(crud.selections)"
                  >禁用用户</el-button
                >
              </el-dropdown-item>
              <el-dropdown-item v-permission="permission.transfer">
                <el-button
                  class="filter-item"
                  type="text"
                  size="mini"
                  style="width: 150px; text-align: left"
                  :loading="crud.delAllLoading"
                  @click="toTransfer(crud.selections)"
                  >移交用户</el-button
                >
              </el-dropdown-item>
              <el-dropdown-item v-permission="permission.approvalList">
                <el-button
                  class="filter-item"
                  type="text"
                  size="mini"
                  @click="toApprovalList()"
                  >查看申请记录</el-button
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </div>
    </div>
    <!--表单渲染-->
    <el-dialog
      v-model="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="670px"
      class="my-dialog"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="用户姓名" prop="nickName">
          <el-input v-model="form.nickName" size="mini" style="width: 170px" />
        </el-form-item>
        <el-form-item v-if="!form.id" label="姓名拼音" prop="pinyin">
          <el-input v-model="form.pinyin" size="mini" style="width: 170px" />
        </el-form-item>
        <el-form-item
          v-if="mode === 'mgr' && !form.id"
          label="用户类型"
          prop="type"
        >
          <template v-if="status !== 'query'">
            <el-select
              v-model="form.type"
              clearable
              size="mini"
              placeholder="类型"
              class="filter-item"
              style="width: 170px"
            >
              <el-option
                v-for="item in filterTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
          </template>
          <template v-else>
            <el-select
              v-model="form.type"
              clearable
              size="mini"
              placeholder="类型"
              class="filter-item"
              style="width: 170px"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-radio-group v-model="form.sex" size="mini" style="width: 170px">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model.number="form.phone"
            size="mini"
            style="width: 170px"
          />
        </el-form-item>
        <el-form-item label="个人邮箱" prop="email">
          <el-input v-model="form.email" size="mini" style="width: 170px" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCardNum">
          <el-input v-model="form.idCardNum" size="mini" style="width: 170px" />
        </el-form-item>
        <el-form-item label="用户状态" prop="status" style="display: none">
          <el-input v-model="form.status" size="mini" style="width: 170px" />
        </el-form-item>
        <!-- O2 项目合作方用户 支持合作方变更-->
        <el-form-item
          v-if="form.type === 'O2'"
          class="O3-content"
          label="所属公司"
          prop="itSupplier.id"
        >
          <el-autocomplete
            v-model="form.itSupplier.name"
            size="mini"
            :fetch-suggestions="querySuppliers"
            placeholder="请输入公司名称搜索"
            style="width: 170px"
            disabled
            @select="handleSelectSupplier"
          />
          <el-button
            type="text"
            size="mini"
            class="O3-btn"
            @click="toItSupplier()"
            >选择公司</el-button
          >
        </el-form-item>
        <!-- E2 编外用户用户 用户属性和所属派遣方变更-->
        <el-form-item
          v-if="form.type === 'E2'"
          label="用户属性"
          prop="attributes"
        >
          <el-select
            v-model="form.attributes"
            size="mini"
            style="width: 170px"
            placeholder="请选择用户属性"
          >
            <el-option
              v-for="item in attrOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="直属上级" prop="leaderName">
          <el-autocomplete
            v-if="form.leaderName"
            v-model="form.leaderName"
            size="mini"
            :fetch-suggestions="queryUsers"
            placeholder="请输入用户名称搜索"
            style="width: 170px"
            disabled
            @select="handleSelectUser"
          />
          <el-autocomplete
            v-else
            v-model="form.leaderName"
            size="mini"
            :fetch-suggestions="queryUsers"
            placeholder="请输入用户名称搜索"
            style="width: 170px"
            disabled
            @select="handleSelectUser"
          />
        </el-form-item>
        <!--        <el-form-item v-if="form.type === 'E2' && mode==='my'" label="上级工号" prop="leaderEmployNum">-->
        <!--          <el-input-->
        <!--            v-model="form.leaderEmployNum"-->
        <!--            style="width:170px;"-->
        <!--            size="mini"-->
        <!--            placeholder="上级工号"-->
        <!--            :disabled="true"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <el-form-item
          v-if="form.type === 'E2' && mode === 'my'"
          label="职务名称"
          prop="leaderEmployNum"
        >
          <el-input
            v-model="form.dutyName"
            style="width: 170px"
            size="mini"
            placeholder="请输入职务名称"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type === 'O3'"
          class="O3-content"
          label="所属产品"
          prop="itProject.id"
        >
          <el-autocomplete
            v-model="form.itProject.name"
            size="mini"
            :fetch-suggestions="queryProjects"
            placeholder="请输入产品名称搜索"
            style="width: 170px"
            disabled
            @select="handleSelectProject"
          />
          <el-button
            type="text"
            size="mini"
            class="O3-btn"
            @click="toItProduct()"
            >选择产品</el-button
          >
        </el-form-item>
        <template v-if="mode === 'mgr'">
          <!-- 编外用户及合作方用户在编辑时，”所属岗位“属性不能编辑 -->
          <el-form-item label="所属岗位" prop="job.code">
            <el-select
              v-model="form.job.code"
              :disabled="['E2'].includes(form.type) ? 'disabled' : false"
              size="mini"
              style="width: 170px"
              placeholder="请先选择部门"
            >
              <el-option
                v-for="(item, index) in jobs"
                :key="item.name + index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.type === 'O2'" label="所属项目" prop="roles">
            <treeselect
              v-model="form.project.id"
              :options="projectList"
              style="width: 270px; height: 26px"
              :max-height="200"
              size="mini"
              placeholder="选择项目"
              :disable-branch-nodes="true"
              @select="selectProject"
            />
          </el-form-item>
          <el-form-item
            v-if="form.type === 'O3'"
            class="O3-content"
            label="所属公司"
            prop="itSupplier.id"
          >
            <el-autocomplete
              v-model="form.itSupplier.name"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请输入供方名称搜索"
              style="width: 170px"
              disabled
              @select="handleSelectSupplier"
            />
            <el-button
              type="text"
              size="mini"
              class="O3-btn"
              @click="toItSupplier()"
              >选择公司</el-button
            >
          </el-form-item>
          <el-form-item
            v-if="form.type === 'E2' && ['1', '3'].includes(form.attributes)"
            class="O3-content"
            label="所属公司"
            prop="itSupplier.id"
          >
            <el-autocomplete
              v-if="form.itSupplier && form.itSupplier.name"
              v-model="form.itSupplier.name"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请输入公司名称搜索"
              style="width: 170px"
              disabled
              @select="handleSelectSupplier"
            />
            <el-autocomplete
              v-else
              v-model="form.itSupplier"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请输入公司名称搜索"
              style="width: 170px"
              disabled
              @select="handleSelectSupplier"
            />
            <el-button
              type="text"
              size="mini"
              class="O3-btn"
              @click="toItSupplier()"
              >选择公司</el-button
            >
          </el-form-item>
          <el-form-item label="所属角色" prop="roles">
            <el-select
              v-model="form.roles"
              size="mini"
              style="width: 170px"
              multiple
              placeholder="请选择"
              @remove-tag="deleteTag"
              @change="changeRole"
            >
              <el-option
                v-for="item in roles"
                :key="item.name"
                :disabled="level !== 1 && item.level <= level"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="edit-dept-content"
            label="所属部门"
            prop="dept.id"
          >
            <template v-if="!editDeptStatus">
              <template v-if="form.dept && form.dept.name">
                <el-input
                  v-model="form.dept.name"
                  style="width: 434px"
                  size="mini"
                  :disabled="true"
                />
              </template>
              <template v-else>
                <el-input
                  style="width: 434px"
                  size="mini"
                  placeholder="暂无所属部门"
                  :disabled="true"
                />
              </template>
              <el-button
                type="text"
                size="mini"
                class="edit-dept"
                @click="editDept"
              >
                编辑部门
              </el-button>
            </template>
            <template v-if="editDeptStatus">
              <treeselect
                v-model="form.dept.id"
                :options="depts"
                style="width: 434px"
                size="mini"
                placeholder="选择部门"
                @select="selectFun"
              />
            </template>
          </el-form-item>
        </template>
        <template v-else-if="mode === 'my'">
          <!-- 编外用户及合作方用户在编辑时，”所属岗位“属性不能编辑-->
          <el-form-item label="所属岗位" prop="job.code">
            <el-select
              v-model="form.job.code"
              :disabled="
                ['E2', 'O2', 'O3'].includes(form.type) ? 'disabled' : false
              "
              size="mini"
              style="width: 170px"
              placeholder="请先选择部门"
            >
              <el-option
                v-for="(item, index) in jobs"
                :key="item.name + index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.type === 'O2'" label="所属项目" prop="roles">
            <treeselect
              v-model="form.project.id"
              :options="projectList"
              style="width: 270px; height: 26px"
              :max-height="200"
              size="mini"
              placeholder="选择项目"
              :disable-branch-nodes="true"
              @select="selectProject"
            />
          </el-form-item>
          <el-form-item label="角色" prop="roles" style="display: none">
            <el-select
              v-model="form.roles"
              size="mini"
              multiple
              style="width: 170px"
            >
              <el-option
                v-for="item in roles"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="form.type === 'O3'"
            class="O3-content"
            label="所属公司"
            prop="itSupplier.id"
          >
            <el-autocomplete
              v-model="form.itSupplier.name"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请输入供方名称搜索"
              style="width: 170px"
              disabled
              @select="handleSelectSupplier"
            />
            <el-button
              type="text"
              size="mini"
              class="O3-btn"
              @click="toItSupplier()"
              >选择公司</el-button
            >
          </el-form-item>
          <el-form-item
            v-if="form.type === 'E2' && ['1', '3'].includes(form.attributes)"
            class="O3-content"
            label="所属公司"
            prop="itSupplier.id"
          >
            <el-autocomplete
              v-if="form.itSupplier && form.itSupplier.name"
              v-model="form.itSupplier.name"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请输入公司名称搜索"
              style="width: 170px"
              disabled
              @select="handleSelectSupplier"
            />
            <el-autocomplete
              v-else
              v-model="form.itSupplier"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请输入公司名称搜索"
              style="width: 170px"
              disabled
              @select="handleSelectSupplier"
            />
            <el-button
              type="text"
              size="mini"
              class="O3-btn"
              @click="toItSupplier()"
              >选择公司</el-button
            >
          </el-form-item>
          <template v-if="['E2', 'O3', 'O2'].includes(form.type)">
            <el-form-item
              class="edit-dept-content"
              label="所属部门"
              prop="dept.id"
            >
              <template v-if="!editDeptStatus">
                <template v-if="form.dept && form.dept.name">
                  <el-input
                    v-model="form.dept.name"
                    style="width: 434px"
                    size="mini"
                    :disabled="true"
                  />
                </template>
                <template v-else>
                  <el-input
                    style="width: 434px"
                    size="mini"
                    placeholder="暂无所属部门"
                    :disabled="true"
                  />
                </template>
                <el-button
                  type="text"
                  size="mini"
                  class="edit-dept"
                  @click="editDept"
                >
                  编辑部门
                </el-button>
              </template>
              <template v-if="editDeptStatus">
                <treeselect
                  v-model="form.dept.id"
                  :options="depts"
                  style="width: 434px"
                  size="mini"
                  placeholder="选择部门"
                  @select="selectFun"
                />
              </template>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="所属部门" prop="dept.id">
              <template v-if="form.dept && form.dept.name">
                <el-input
                  v-model="form.dept.name"
                  style="width: 434px"
                  size="mini"
                  :disabled="true"
                />
              </template>
              <template v-else>
                <el-input
                  style="width: 434px"
                  size="mini"
                  placeholder="暂无所属部门"
                  :disabled="true"
                />
              </template>
            </el-form-item>
          </template>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.btnLoading"
          type="primary"
          @click="crud.submitCU"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      border
      :default-sort="{ prop: 'id', order: 'descending' }"
      @sort-change="sortChange"
      @selection-change="checkboxSelChange"
    >
      <el-table-column
        v-if="selectType === 'checkbox'"
        :selectable="checkboxT"
        type="selection"
      />
      <el-table-column v-else width="60px">
        <template slot-scope="scope">
          <el-radio
            v-model="radio"
            class="select-raido"
            :label="radioIdx(scope.row)"
            @change.native="radioSelChange(scope.row)"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        width="80"
        prop="nickName"
        label="用户姓名"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        width="100"
        prop="username"
        label="用户账号"
      />
      <el-table-column label="用户类型" align="left" width="110" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'E1'">编内用户</span>
          <span v-else-if="scope.row.type === 'O3'">供应商用户</span>
          <span v-else-if="scope.row.type === 'E2'">编外用户</span>
          <span v-else-if="scope.row.type === 'O2'">项目合作方用户</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        sortable="custom"
        prop="dept"
        label="部门"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.dept">{{ scope.row.dept.fullName }}</div>
          <div v-else />
        </template>
      </el-table-column>
      <!--      <el-table-column :show-overflow-tooltip="true" width="130" prop="job" label="岗位">-->
      <!--        <template slot-scope="scope">-->
      <!--          <div v-if="scope.row.job">{{ scope.row.job.name }}</div>-->
      <!--          <div v-else />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        v-if="mode === 'my'"
        :show-overflow-tooltip="true"
        sortable="custom"
        prop="itProject"
        label="所属产品"
        width="100"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.itProject && scope.row.itProject.name">
            {{ scope.row.itProject.name }}
          </div>
          <div v-else />
        </template>
      </el-table-column>
      <el-table-column
        v-if="mode === 'my'"
        :show-overflow-tooltip="true"
        sortable="custom"
        width="200"
        prop="project"
        label="所属项目"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.project && scope.row.project.fullName">
            {{ scope.row.project.fullName }}
          </div>
          <div v-else />
        </template>
      </el-table-column>
      <el-table-column
        v-if="mode === 'my'"
        :show-overflow-tooltip="true"
        sortable="custom"
        width="100"
        prop="itSupplier"
        label="所属公司"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.itSupplier && scope.row.itSupplier.name">
            {{ scope.row.itSupplier.name }}
          </div>
          <div v-else />
        </template>
      </el-table-column>
      <!--      <el-table-column v-if="mode==='my'" :show-overflow-tooltip="true" width="100" prop="leaderName" label="直属上级" />-->
      <!--      <el-table-column v-if="mode==='my'" :show-overflow-tooltip="true" width="100" prop="leaderEmployNum" label="直属上级工号" />-->
      <!--      <el-table-column v-if="mode==='my'" :show-overflow-tooltip="true" width="100" prop="dutyName" label="职务名称" />-->
      <el-table-column
        :show-overflow-tooltip="true"
        sortable
        width="100"
        prop="expireTime"
        label="过期日期"
      >
        <template slot-scope="scope">
          <span>{{ $utils.parseTime(scope.row.expireTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户状态" align="left" prop="status" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '1'">已启用</span>
          <span v-else-if="scope.row.status === '0'">已禁用</span>
          <span v-else-if="scope.row.status === '-1'" class="render-class2"
            >待启用</span
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="
          (mode === 'mgr' && status === '') || (mode === 'my' && status === '')
        "
        v-permission="['admin', 'user:edit', 'user:del']"
        label="操作"
        width="130"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <div>
            <el-button
              v-permission="permission.edit"
              size="mini"
              type="text"
              @click="crud.toEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.status === '-1'"
              v-permission="permission.edit"
              size="mini"
              type="text"
              @click="toReSync(scope.row.id)"
              >重新同步</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-else-if="status !== ''"
        label="操作"
        width="130"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <div>
            <el-button size="mini" type="text" @click="goDetail(scope.row)"
              >查看</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--查看 -->
    <el-drawer
      :append-to-body="true"
      :visible.sync="viewDrawer"
      :size="viewWidth"
      :show-close="false"
      :before-close="closeViewDrawer"
    >
      <div slot="title" class="view-drawer-title">
        <div class="my-title">查看</div>
        <div class="right-close" @click="closeViewDrawer">
          <i class="el-icon-close" />
        </div>
      </div>
      <div class="demo-drawer__content" style="padding: 10px">
        <UserDetail
          v-if="hackResetView"
          :id="currentId"
          @click="clickViewDrawer"
        />
      </div>
    </el-drawer>
    <!--选择公司-->
    <el-dialog
      v-if="supplierDialog.show"
      class="custom_el_dialog"
      :append-to-body="true"
      :visible.sync="supplierDialog.show"
      :title="supplierDialog.title"
      width="800px"
      height="100vh"
    >
      <SupplierList
        :key="timer"
        :radio-val="supplierRadioVal"
        :title="supplierTitle"
        @selectChange="handleSupplierChange"
      />
    </el-dialog>
    <!-- 选择产品 -->
    <el-dialog
      v-if="projectDialog.show"
      class="custom_el_dialog"
      :append-to-body="true"
      :visible.sync="projectDialog.show"
      :title="projectDialog.title"
      width="800px"
      height="100vh"
    >
      <ProductList
        :key="timer"
        :radio-val="projectRadioVal"
        @selectChange="handleProjectChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import crudUser, { disable, syncUser, getUsers } from "@http/system/user";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import { mapGetters } from "vuex";
import { validatePhone } from "@/utils/validate";
import { getProjects } from "@http/system/itProject";
import { getSuppliers } from "@http/system/itSupplier";
import { getDepts } from "@http/system/dept";
import { getAll, getLevel } from "@http/system/role";
import { getAllJob } from "@http/system/job";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getHrTypeCode } from "@http/system/dept";
// import rrOperation from '@crud/RR.operation'
// import crudOperation from '@crud/CRUD.operation'
// import udOperation from '@crud/UD.operation'
import pagination from "@crud/Pagination";
import UserDetail from "@/components/biz/UserDetail";
import SupplierList from "@/components/biz/SupplierList";
import ProductList from "@/components/biz/ProductList";

let userRoles = [];
// crud交由presenter持有
const defaultDeptCode = "6494050787";
const defaultJobCode = "920983";
const defaultRoleId = 2;
const defaultCrud = CRUD({
  title: "用户工作台",
  url: "api/users",
  crudMethod: { ...crudUser },
  queryOnPresenterCreated: false,
});
const defaultForm = {
  id: null,
  username: null,
  nickName: null,
  sex: "男",
  email: null,
  status: "-1",
  type: "O3",
  itProject: { id: null },
  itSupplier: { id: null },
  dept: { code: defaultDeptCode },
  job: { code: defaultJobCode },
  roles: [{ id: defaultRoleId }],
  phone: null,
  expireTime: null,
  idCardNum: null,
  project: {
    id: null,
  },
};
export default {
  name: "UserList",
  // crudOperation, rrOperation, udOperation,
  components: { pagination, Treeselect, UserDetail, SupplierList, ProductList },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ["user_status"],
  props: {
    selectType: {
      type: String,
      default: "radio",
    },
    mode: {
      type: String,
      default: "select",
    },
    passedInParam: {
      type: Object,
      default: undefined,
    },
    saveBtn: {
      type: Boolean,
      default: false,
    },
    radioVal: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    showAdvancedFilter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      statusOptions: [
        { key: "1", display_name: "已启用" },
        { key: "0", display_name: "已禁用" },
        { key: "-1", display_name: "待启用" },
      ],
      typeOptions: [
        { key: "E1", display_name: "编内用户" },
        { key: "E2", display_name: "编外用户" },
        { key: "O2", display_name: "项目合作方用户" },
        { key: "O3", display_name: "供应商用户" },
      ],
      expireOptions: [
        { key: true, display_name: "过滤临近过期" },
        { key: false, display_name: "不过滤临近过期" },
      ],
      radio: "",
      userListAdvancedFilter: this.showAdvancedFilter,
      queryParam: JSON.parse(JSON.stringify(this.passedInParam)),
      projectList: [],
      deptList: [],
      defaultProps: { children: "children", label: "name" },
      expandNodes: [],
      depts: [],
      jobs: [],
      level: 3,
      roles: [],
      permission: {
        list: ["admin", "user:list"],
        add: ["admin", "user:add"],
        edit: ["admin", "user:edit"],
        del: ["admin", "user:del"],
        disable: ["admin", "user:edit"],
        transfer: ["admin", "user:edit"],
        approvalList: ["admin", "approval:list"],
        approvalEdit: ["admin", "approval:edit"],
        approvalDel: ["admin", "approval:del"],
        approvalAdd: ["admin", "approval:add"],
      },
      rules: {
        nickName: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        pinyin: [
          { required: true, message: "请输入姓名拼音", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "请输入用户类型", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        sex: [
          { required: true, message: "请选择用户性别", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        itProject: [
          { required: true, message: "请选择所属IT项目", trigger: "blur" },
        ],
        itSupplier: [
          { required: true, message: "请选择所属供应商", trigger: "blur" },
        ],
      },
      dialogVisible: true,
      viewWidth: "1000px",
      viewDrawer: false,
      hackResetView: false,
      currentId: null,
      attrOptions: [
        { key: "1", display_name: "劳务派遣" },
        { key: "3", display_name: "劳务外包" },
        { key: "2", display_name: "实习生" },
      ],
      supplierDialog: { title: "选择公司", show: false },
      projectDialog: { title: "选择产品", show: false },
      userDialog: { title: "选择用户", show: false },
      timer: "",
      supplierTitle: "",
      editDeptStatus: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    sideBar() {
      return this.$store.state.app.sidebar.opened;
    },
    filterTypeOptions() {
      return this.typeOptions.filter((item) => item.key !== "E1");
    },
    supplierRadioVal() {
      return this.form.itSupplier && this.form.itSupplier.name
        ? this.form.itSupplier.name + "-" + this.form.itSupplier.id
        : "";
    },
    projectRadioVal() {
      return this.form.itProject && this.form.itProject.name
        ? this.form.itProject.name + "-" + this.form.itProject.id
        : "";
    },
  },
  created() {
    this.$nextTick(() => {
      this.getUserData();
      this.getHrTypeCode("20");
      this.getHrTypeCode("21");
      this.getDepts();
      this.getRoles();
      this.getRoleLevel();
    });
  },
  mounted: function () {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };
    if (this.$props.radioVal) {
      this.selectUserName = this.$props.radioVal;
      this.showSelect = true;
    }
  },
  methods: {
    radioIdx(row) {
      return row.username + "-" + row.id;
    },
    getUserData() {
      // 基于autocomplete查询特殊处理
      if (!this.queryParam.projectName) {
        this.queryParam.projectId = undefined;
      }
      if (!this.queryParam.supplierName) {
        this.queryParam.supplierId = undefined;
      }
      const delDeptId = JSON.parse(JSON.stringify(this.queryParam));
      delete delDeptId.deptId;
      this.crud.query = delDeptId;
      this.crud.toQuery();
    },
    selectDept(node) {
      this.queryParam.deptIds = node.id;
      this.getUserData();
    },
    selectProjectName(node) {
      this.queryParam.projectCode = node.code;
      this.getUserData();
    },
    resetQuery() {
      this.queryParam = JSON.parse(JSON.stringify(this.passedInParam));
      this.crud.query = JSON.parse(JSON.stringify(this.passedInParam));
      this.crud.toQuery();
    },
    // 升降序
    sortChange(obj) {
      if (["dept", "project", "itSupplier", "itProject"].includes(obj.prop)) {
        let propVal = "";
        const propObj = {
          dept: "deptId",
          project: "projectCode",
          itSupplier: "itSupplier",
          itProject: "itProjectId",
        };
        for (const k in propObj) {
          if (obj.prop === k) {
            propVal = propObj[k];
            if (obj.order.includes("desc")) {
              this.queryParam.sort = propVal + "," + "desc";
              this.crud.query = this.queryParam;
              this.crud.toQuery();
            } else {
              this.queryParam.sort = propVal + "," + "asc";
              this.crud.query = this.queryParam;
              this.crud.toQuery();
            }
          }
        }
      }
    },
    // 多选按钮事件
    checkboxSelChange(selection) {
      this.crud.selectionChangeHandler(selection);
      const data = [];
      if (selection && selection.length > 0) {
        for (let i = 0; i < selection.length; i++) {
          for (let j = 0; j < this.crud.data.length; j++) {
            if (selection[i].id === this.crud.data[j].id) {
              data.push(this.crud.data[j]);
              break;
            }
          }
        }
        this.$emit("selectChange", data);
      }
    },
    // 单选操作事件
    radioSelChange(data) {
      this.$emit("selectChange", data);
    },
    changeRole(value) {
      userRoles = [];
      value.forEach(function (data, index) {
        const role = { id: data };
        userRoles.push(role);
      });
    },
    // 获取弹窗内部门数据
    getDepts() {
      getDepts({ enabled: true }).then((res) => {
        this.expandNodes = res.content.length > 0 ? [res.content[0].id] : [];
        this.depts = res.content;
      });
    },
    // 获取弹窗内部门数据
    getHrTypeCode(hrTypeCode) {
      getHrTypeCode(hrTypeCode).then((res) => {
        this.expandNodes = res.content.length > 0 ? [res.content[0].id] : [];
        if (hrTypeCode === "21") {
          this.projectList = res.content;
        } else if (hrTypeCode === "20") {
          this.deptList = res.content;
        }
      });
    },
    // 获取弹窗内角色数据
    getRoles() {
      getAll()
        .then((res) => {
          this.roles = res;
        })
        .catch(() => {});
    },
    // 获取弹窗内岗位数据
    getJobs(id) {
      getAllJob(id)
        .then((res) => {
          this.jobs = res.content;
          console.log("岗位信息：", this.jobs);
        })
        .catch(() => {});
    },
    // 点击部门搜索对应的岗位
    selectFun(node, instanceId) {
      this.form.dept.code = node.code;
      this.getJobs(node.id);
      this.form.job.id = null;
      this.form.dept = node;
    },
    selectProject(node) {
      this.form.project = node;
    },
    // 获取权限级别
    getRoleLevel() {
      getLevel()
        .then((res) => {
          this.level = res.level;
        })
        .catch(() => {});
    },
    toAppleyApproval() {
      this.$router.push({
        path: "/workbench/users/userApprovalEdit",
        query: { bizAction: "1" },
      });
    },
    toMofifyApproval(ids, bizAction) {
      if (!ids || ids.length <= 0) {
        this.$message.error({
          message: "请先选择用户",
          duration: 2000,
        });
      } else {
        // 编外用户 用户必须是同一个部门 E2
        // 项目合作方 用户必须属于同一个项目 O2
        console.log(ids);
        const typeList = ids.map((item) => {
          return item.type;
        });
        if (Array.from(new Set(typeList)).length > 1) {
          this.$message.error({
            message: "请选择类型相同的用户",
            duration: 2000,
          });
          return false;
        } else {
          const E2TypeList = ids.every((item) => {
            return item.type === "E2";
          });
          const O2TypeList = ids.every((item) => {
            return item.type === "O2";
          });
          const O3TypeList = ids.every((item) => {
            return item.type === "O3";
          });
          if (E2TypeList) {
            const deptIdList = ids.map((item) => {
              return item.dept && item.dept.id;
            });
            if (Array.from(new Set(deptIdList)).length > 1) {
              this.$message.error({
                message: "编外用户延期必须是同一个部门！",
                duration: 2000,
              });
              return false;
            } else {
              this.delay(ids, bizAction);
            }
          }
          if (O2TypeList) {
            const projectIdList = ids.map((item) => {
              return item.project && item.project.id;
            });
            if (Array.from(new Set(projectIdList)).length > 1) {
              this.$message.error({
                message: "项目合作方用户延期必须是同一个项目！",
                duration: 2000,
              });
              return false;
            } else {
              this.delay(ids, bizAction);
            }
          }
          if (O3TypeList) {
            const projectIdList = ids.map((item) => {
              return item.itSupplier && item.itSupplier.id;
            });
            if (Array.from(new Set(projectIdList)).length > 1) {
              this.$message.error({
                message: "IT供应商请选择同一家供应商！",
                duration: 2000,
              });
              return false;
            } else {
              this.delay(ids, bizAction);
            }
          }
        }
      }
    },
    delay(ids, bizAction) {
      console.log(1003, ids, bizAction);
      this.getSelectUsers(ids)
        .then((res) => {
          if (res) {
            this.$router.push({
              name: "userApprovalEdit",
              query: { bizAction: bizAction },
              params: { users: res },
            });
          }
        })
        .catch(() => {});
    },
    toEnrollUser() {
      this.$router.push({
        path: "/workbench/users/userEnrollEdit",
        query: {},
      });
    },
    toReSync(id) {
      const params = {};
      params.id = id;
      syncUser(params)
        .then((res) => {
          this.$message.success({
            message: "同步用户成功",
            duration: 2000,
          });
          this.crud.toQuery();
        })
        .catch(() => {
          this.$message.error({
            message: "同步用户失败",
            duration: 2000,
          });
        });
    },
    getSelectUsers(ids) {
      return new Promise((resolve, reject) => {
        const data = [];
        for (let i = 0; i < ids.length; i++) {
          for (let j = 0; j < this.crud.data.length; j++) {
            if (ids[i].id === this.crud.data[j].id) {
              data.push(this.crud.data[j]);
              break;
            }
          }
        }
        // 判断是否都是同一种类型
        const type = data[0].type;
        let isSameType = true;
        for (let i = 0; i < data.length; i++) {
          if (data[i].type !== type) {
            isSameType = false;
          }
        }
        if (!isSameType) {
          this.$message.error({
            message: "请选择同一类型的用户",
            duration: 2000,
          });
          resolve(null);
        } else {
          resolve(data);
        }
      });
    },
    toDisable(ids) {
      if (!ids || ids.length <= 0) {
        this.$message.error({
          message: "请先选择用户",
          duration: 2000,
        });
      } else {
        this.$confirm(`确认禁用选中的${ids.length}条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            disable(ids)
              .then((res) => {
                this.$message.success({
                  message: "禁用用户成功",
                  duration: 2000,
                });
                this.crud.toQuery();
              })
              .catch(() => {
                this.$message.error({
                  message: "禁用用户失败",
                  duration: 2000,
                });
              });
          })
          .catch(() => {});
      }
    },
    toTransfer(ids) {
      if (!ids || ids.length <= 0) {
        this.$message.error({
          message: "请先选择用户",
          duration: 2000,
        });
      } else {
        this.getSelectUsers(ids)
          .then((res) => {
            if (res) {
              this.$router.push({
                name: "userTransferEdit",
                params: { users: res },
              });
            }
          })
          .catch(() => {});
      }
    },
    toApprovalList() {
      this.$router.push({
        path: "/workbench/users/userApprovalList",
        params: {},
      });
    },
    // 获取用户数据
    queryUsers(queryString, cb) {
      if (queryString) {
        var userData = [{}];
        const params = {};
        params.blurry = queryString;
        getUsers(params).then((res) => {
          for (const item of res.content) {
            item.value = item.nickName;
            userData.push(item);
          }
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(userData);
          }, 1000 * Math.random());
        });
      } else {
        cb([{}]);
      }
    },
    // 获取IT供应商数据
    querySuppliers(queryString, cb) {
      if (queryString) {
        var supplierData = [{}];
        const params = {};
        params.name = queryString;
        getSuppliers(params).then((res) => {
          for (const item of res.content) {
            item.value = item.name;
            supplierData.push(item);
          }
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(supplierData);
          }, 1000 * Math.random());
        });
      } else {
        cb([{}]);
      }
    },
    // 获取IT产品
    queryProjects(queryString, cb) {
      if (queryString) {
        var projectData = [{}];
        const params = {};
        params.name = queryString;
        getProjects(params).then((res) => {
          for (const item of res.content) {
            item.value = item.name;
            projectData.push(item);
          }
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(projectData);
          }, 1000 * Math.random());
        });
      } else {
        cb([{}]);
      }
    },
    handleSelectSupplier(item) {
      this.form.itSupplier = item;
    },
    handleSelectUser(item) {
      console.log("选中的用户：", item);
      this.form.leaderName = item.nickName;
      this.form.leaderEmployNum = item.employNum;
    },
    handleSelectProject(item) {
      this.form.itProject = item;
    },
    changeQuerySupplier(item) {
      this.queryParam.supplierName = item.name;
      this.queryParam.supplierId = item.id;
      this.queryParam.itSupplierId = item.id;
      this.getUserData();
    },
    changeQueryProject(item) {
      this.queryParam.projectName = item.name;
      this.queryParam.projectId = item.id;
      this.queryParam.itProjectId = item.id;
      this.getUserData();
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id;
    },
    [CRUD.HOOK.afterAddError](crud) {
      this.afterErrorMethod(crud);
    },
    [CRUD.HOOK.afterEditError](crud) {
      this.afterErrorMethod(crud);
    },
    afterErrorMethod(crud) {
      // 恢复select
      const initRoles = [];
      userRoles.forEach(function (role, index) {
        initRoles.push(role.id);
      });
      crud.form.roles = initRoles;
    },
    deleteTag(value) {
      userRoles.forEach(function (data, index) {
        if (data.id === value) {
          userRoles.splice(index, value);
        }
      });
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.editDeptStatus = false;
      // if (this.form.dept) {
      //   this.getJobs(this.form.dept.id)
      // } else {
      //   form.dept = {}
      // }
      if (!this.form.job) {
        form.job = {};
      }
      // O3-IT供应商O2-项目合作方
      if (this.form.type === "O3") {
        if (!this.form.itProject) {
          this.form.itProject = {};
        }
        if (this.form.itProject === null) {
          this.form.itProject = { name: "" };
        }
        if (!this.form.itSupplier) {
          this.form.itSupplier = {};
        }
        if (this.form.itSupplier === null) {
          this.form.itSupplier = { name: "", id: null };
        }
      }
      if (this.form.type === "O2") {
        if (this.form.project === null) {
          this.form.project = { id: null };
        }
        if (this.form.itSupplier === null) {
          this.form.itSupplier = { name: "", id: null };
        }
      }
      userRoles = [];
      const roles = [];
      form.roles.forEach(function (role, index) {
        roles.push(role.id);
        // 初始化编辑时候的角色
        const rol = { id: role.id };
        userRoles.push(rol);
      });
      form.roles = roles;
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (this.roles.length === 0) {
        this.$message({
          message: "角色不能为空",
          type: "error",
        });
        return false;
      }
      crud.form.roles = userRoles;
      if (
        (crud.form.itSupplier && crud.form.itSupplier.name === "") ||
        (crud.form.itSupplier && JSON.stringify(crud.form.itSupplier) === "{}")
      ) {
        crud.form.itSupplier = null;
      }
      if (
        (crud.form.itProject && crud.form.itProject.name === "") ||
        (crud.form.itProject && JSON.stringify(crud.form.itProject) === "{}")
      ) {
        crud.form.itProject = null;
      }
      return true;
    },
    // 查看
    goDetail(argument) {
      this.currentId = argument.id;
      this.viewDrawer = true;
      this.hackResetView = true;
    },
    clickViewDrawer(val) {
      this.viewDrawer = val;
      this.hackResetView = false;
    },
    closeViewDrawer() {
      this.viewDrawer = false;
      this.hackResetView = false;
    },
    // 选择公司
    toItSupplier() {
      const title = "公司";
      this.supplierTitle = title;
      this.supplierDialog.show = true;
      this.supplierDialog.title = "选择" + this.supplierTitle;
      this.timer = new Date().getTime();
    },
    // 选择供应商
    handleSupplierChange(params) {
      this.form.itSupplier = params;
      this.supplierDialog.show = false;
    },
    // 选择用户
    toUser() {
      this.timer = new Date().getTime();
    },
    toItProduct() {
      this.projectDialog.show = true;
      this.timer = new Date().getTime();
    },
    handleProjectChange(params) {
      this.form.itProject = params;
      this.projectDialog.show = false;
    },
    handleUserSelChange(data) {
      this.userDialog.show = false;
    },
    editDept() {
      this.editDeptStatus = true;
      if (this.form.dept) {
        this.getJobs(this.form.dept.id);
      }
    },
  },
};
</script>

<style scoped>
#userList .crud-opts {
  /*padding: 6px 0;*/
  padding: 0 0 10px 0;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
#userList .crud-opts .crud-opts-right {
  margin-left: auto;
}
.O3-content,
.edit-dept-content {
  /*position: relative;*/
}
.O3-btn,
.edit-dept {
  /*position: absolute;*/
  /*right: -60px;*/
  /*bottom: 2px;*/
  /*padding:7px 0;*/
}
/deep/ .el-form-item,
/deep/ .el-form-item--small,
/deep/ .el-form-item__content,
/deep/ .edit-dept-content,
/deep/ .el-form,
/deep/ .el-form--inline,
/deep/ .el-dialog__body {
  overflow: visible;
}
/deep/ .el-drawer__header {
  margin-bottom: 0px;
  padding-top: 16px;
  padding-left: 0px;
  color: #fff;
  background: #2761ff;
}
/deep/ .el-drawer__body {
  overflow-y: auto;
  background: #f5f5f5;
}
.view-drawer-title {
  display: flex;
  justify-content: space-between;
  padding: 0px 0px 16px 16px;
  text-align: justify;
}
.view-drawer-title .right-close {
  cursor: pointer;
}
.view-drawer-title .my-title,
/deep/ .demo-drawer__content {
  text-align: left;
}

.my-dialog /deep/ .el-dialog__body {
  /*overflow: visible;*/
  padding: 10px 20px;
}

/deep/ .vue-treeselect__control {
  height: 26px;
  line-height: 26px;
}
/deep/ .vue-treeselect__single-value,
/deep/ .vue-treeselect__placeholder {
  margin-top: -4px;
}
</style>
