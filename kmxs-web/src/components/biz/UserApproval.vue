<template>
  <div
    id="userApproval"
    :class="[mode === 'edit' ? 'multi-card' : 'multi-card view']"
  >
    <el-form ref="form" :model="approvalContent" :rules="rules">
      <!-- approval content -->
      <el-card class="box-card my-box-card clearfix">
        <div slot="header">
          <span class="title">基本信息</span>
        </div>
        <div
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >用户类型：</label
          >
          <el-select
            v-if="mode === 'edit' && approvalContent.approvalType === '1'"
            v-model="userType"
            clearable
            size="mini"
            placeholder="用户类型"
            class="filter-item"
            style="width: 270px"
            @change="selectUserType"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <div v-else class="el-form-item__content">
            <template v-if="userType === 'O3'">供应商用户</template>
            <template v-else-if="userType === 'E2'">编外用户</template>
            <template v-else-if="userType === 'O2'">项目合作方用户</template>
          </div>
        </div>
        <div
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >申请类型：</label
          >
          <div
            v-if="mode === 'edit'"
            class="el-form-item__content"
            style="width: 270px"
          >
            <template v-if="approvalContent.approvalType === '1'"
              >新增</template
            >
            <template v-else-if="approvalContent.approvalType === '2'"
              >延期</template
            >
            <template v-else-if="approvalContent.approvalType === '3'"
              >启用</template
            >
          </div>
          <div v-else class="el-form-item__content">
            <template v-if="approvalContent.approvalType === '1'"
              >新增</template
            >
            <template v-else-if="approvalContent.approvalType === '2'"
              >延期</template
            >
            <template v-else-if="approvalContent.approvalType === '3'"
              >启用</template
            >
          </div>
        </div>
        <div
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >过期时间：</label
          >
          <el-date-picker
            v-if="mode === 'edit'"
            v-model="approvalContent.expireTime"
            type="date"
            size="mini"
            class="date-item"
            style="width: 270px"
            :picker-options="pickerOptions0"
          />
          <div v-else class="el-form-item__content">
            {{ $utils.parseTime(approvalContent.expireTime) }}
          </div>
        </div>
        <div
          v-if="approvalContent.approvalType === '1' && userType === 'O3'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >用户属性：</label
          >
          <el-select
            v-if="mode === 'edit'"
            v-model="userAttr"
            clearable
            size="mini"
            placeholder="用户属性"
            class="filter-item"
            style="width: 270px"
            @change="selectSupplierUserAttr"
          >
            <el-option
              v-for="item in supplierAttrOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <div v-else class="el-form-item__content">
            {{ userAttr === "4" ? "IT" : "非IT" }}
          </div>
        </div>
        <div
          v-if="
            approvalContent.approvalType === '1' &&
            userType === 'O3' &&
            approvalContent.attributes === 4
          "
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属产品：</label
          >
          <template v-if="mode === 'edit'">
            <el-autocomplete
              v-model="approvalContent.itProject.name"
              size="mini"
              :fetch-suggestions="queryProjects"
              placeholder="请选择产品名称"
              style="width: 200px"
              disabled
              @select="handleSelectProject"
            />
            <el-button
              type="text"
              size="mini"
              style="
                float: right;
                with: 60px;
                margin: 0 0 0 10px;
                padding: 7px 0;
              "
              @click="toItProduct()"
              >选择IT产品</el-button
            >
          </template>
          <div v-else class="el-form-item__content">
            {{ approvalContent.itProject.name }}
          </div>
        </div>
        <div
          v-if="approvalContent.approvalType === '1' && userType === 'O3'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属供方：</label
          >
          <template v-if="mode === 'edit'">
            <el-autocomplete
              v-model="approvalContent.itSupplier.name"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请选择供方"
              style="width: 200px"
              disabled
              @select="handleSelectSupplier"
            />
            <el-button
              type="text"
              size="mini"
              style="
                float: right;
                with: 60px;
                margin: 0 0 0 10px;
                padding: 7px 0;
              "
              @click="toItSupplier('supplier')"
              >选择供方</el-button
            >
          </template>
          <div v-else class="el-form-item__content">
            {{ approvalContent.itSupplier.name }}
          </div>
        </div>
        <!--项目合作方-->
        <div
          v-if="approvalContent.approvalType === '1' && userType === 'O2'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属项目：</label
          >
          <div class="el-form-item__content">
            <template v-if="mode === 'preview' || mode === 'view'">
              <a
                :class="autoClass ? 'autoClass' : 'full-content'"
                :title="
                  approvalContent.project && approvalContent.project.fullName
                "
              >
                {{
                  approvalContent.project && approvalContent.project.fullName
                }}
              </a>
            </template>
            <template v-else>
              <treeselect
                v-model="approvalContent.project.id"
                :options="depts"
                style="width: 270px; height: 26px"
                size="mini"
                placeholder="选择项目"
                :disable-branch-nodes="true"
                @select="selectProject"
              />
            </template>
          </div>
        </div>
        <!-- 项目合作方 -->
        <div
          v-if="approvalContent.approvalType === '1' && userType === 'O2'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属合作方：</label
          >
          <template v-if="mode === 'edit'">
            <el-autocomplete
              v-model="approvalContent.itSupplier.name"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请选择合作方"
              style="width: 200px"
              disabled
              @select="handleSelectSupplier"
            />
            <el-button
              type="text"
              size="mini"
              style="
                float: right;
                with: 60px;
                margin: 0 0 0 10px;
                padding: 7px 0;
              "
              @click="toItSupplier('partner')"
              >选择合作方</el-button
            >
          </template>
          <div v-else class="el-form-item__content">
            {{ approvalContent.itSupplier.name }}
          </div>
        </div>
        <!--编外   v-if="approvalContent.approvalType !=='1'  && userType ==='E2'"  所在部门-->
        <div
          v-if="approvalContent.approvalType === '1' && userType === 'E2'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >用户属性：</label
          >
          <el-select
            v-if="mode === 'edit'"
            v-model="userAttr"
            clearable
            size="mini"
            placeholder="用户属性"
            class="filter-item"
            style="width: 270px"
            @change="selectUserAttr"
          >
            <el-option
              v-for="item in attrOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <div v-else class="el-form-item__content">
            {{
              userAttr === "1"
                ? "劳务派遣"
                : userAttr === "2"
                ? "实习生"
                : "劳务外包"
            }}
          </div>
        </div>
        <div
          v-if="approvalContent.approvalType === '1' && userType === 'E2'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属部门：</label
          >
          <div class="el-form-item__content">
            <template v-if="mode === 'preview' || mode === 'view'">
              <a
                :class="autoClass ? 'autoClass' : 'full-content'"
                :title="approvalContent.dept && approvalContent.dept.fullName"
              >
                {{ approvalContent.dept && approvalContent.dept.fullName }}
              </a>
            </template>
            <template v-else>
              <treeselect
                v-model="approvalContent.dept.id"
                :options="depts"
                style="width: 270px; height: 26px"
                size="mini"
                placeholder="选择部门"
                @select="selectFun"
              />
            </template>
          </div>
        </div>
        <!-- 编外用户 劳务派遣和劳务外包的时候 增加所属派遣方 -->
        <div
          v-if="
            approvalContent.approvalType === '1' &&
            userType === 'E2' &&
            ['1', '3'].includes(userAttr)
          "
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属派遣方：</label
          >
          <template v-if="mode === 'edit'">
            <el-autocomplete
              v-model="approvalContent.itSupplier.name"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请选择派遣方"
              style="width: 200px"
              disabled
              @select="handleSelectSupplier"
            />
            <el-button
              type="text"
              size="mini"
              style="
                float: right;
                with: 60px;
                margin: 0 0 0 10px;
                padding: 7px 0;
              "
              @click="toItSupplier('sender')"
              >选择派遣方</el-button
            >
          </template>
          <div v-else class="el-form-item__content">
            {{ approvalContent.itSupplier.name }}
          </div>
        </div>
        <!-- 编外用户增加 上级名称和工号和职能名称-->
        <div
          v-if="approvalContent.approvalType === '1' && userType === 'E2'"
          class="el-form-item el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >直属上级：</label
          >
          <template v-if="mode === 'edit'">
            <el-autocomplete
              v-model="approvalContent.leaderName"
              size="mini"
              :fetch-suggestions="queryUsers"
              placeholder="请选择直属上级"
              style="width: 160px"
              disabled
              @select="handleSelectUser"
            />
            <el-button
              type="text"
              size="mini"
              style="
                float: right;
                with: 60px;
                margin: 0 0 0 10px;
                padding: 7px 0;
              "
              @click="toUser()"
              >选择直属上级</el-button
            >
          </template>
          <div v-else class="el-form-item__content">
            {{ approvalContent.leaderName }}
          </div>
        </div>
        <!-- 编外用户E2：配置电脑, 编外用户、项目合作方O2: 开通BPM账号，开通金蝶账号 -->
        <div
          v-if="
            approvalContent.approvalType === '1' && ['E2'].includes(userType)
          "
          :class="
            autoClass
              ? 'compute-label ' +
                'E2-label el-form-item is-required el-form-item--mini'
              : 'E2-label el-form-item is-required el-form-item--mini'
          "
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >配置电脑：</label
          >
          <template v-if="mode === 'edit'">
            <el-radio-group
              v-model="approvalContent.isConfigItAssets"
              style="width: 270px"
            >
              <el-radio :label="'0'">否</el-radio>
              <el-radio :label="'1'">是</el-radio>
            </el-radio-group>
          </template>
          <div v-else class="el-form-item__content">
            {{ approvalContent.isConfigItAssets === "0" ? "否" : "是" }}
          </div>
        </div>
        <div
          v-if="
            approvalContent.approvalType === '1' &&
            ['E2', 'O2'].includes(userType)
          "
          :class="
            autoClass
              ? 'compute-label ' +
                'E2-label el-form-item is-required el-form-item--mini'
              : 'E2-label el-form-item is-required el-form-item--mini'
          "
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >开通BPM账号：</label
          >
          <template v-if="mode === 'edit'">
            <el-radio-group
              v-model="approvalContent.isCreateBpmAcct"
              style="width: 270px"
            >
              <el-radio :label="'0'">否</el-radio>
              <el-radio :label="'1'">是</el-radio>
            </el-radio-group>
          </template>
          <div v-else class="el-form-item__content">
            {{ approvalContent.isCreateBpmAcct === "0" ? "否" : "是" }}
          </div>
        </div>
        <!--div v-if="approvalContent.approvalType === '1' && ['E2', 'O2'].includes(userType)" style="float:left;" :class="userType === 'O2' ? 'O2-label el-form-item is-required el-form-item--mini' : 'E2-label el-form-item is-required el-form-item--mini'">
          <label class="el-form-item__label" style="width:120px">开通金蝶账号：</label>
          <template v-if="mode === 'edit'">
            <el-radio-group v-model="approvalContent.isCreateKingdeeAcct" style="width: 270px;">
              <el-radio :label="'0'">否</el-radio>
              <el-radio :label="'1'">是</el-radio>
            </el-radio-group>
          </template>
          <div v-else class="el-form-item__content">{{ approvalContent.isCreateKingdeeAcct === '0' ? '否' :'是' }}</div>
        </div-->
        <!-- 开通BPM账号，开通金蝶账号 结束-->
        <div
          class="el-form-item is-required el-form-item--mini"
          style="float: left; width: 100%"
        >
          <label class="el-form-item__label" style="width: 120px"
            >申请原因：</label
          >
          <div
            v-if="mode === 'edit'"
            class="el-form-item__content"
            style="width: 90%"
          >
            <el-input
              v-model="approvalContent.remark"
              clearable
              type="textarea"
              size="mini"
              maxlength="400"
              placeholder="请填写申请原因"
              style="resize: none; min-height: 50px"
              rows="3"
              show-word-limit
              class="filter-item"
            />
          </div>
          <div v-else class="el-form-item__content">
            {{ approvalContent.remark }}
          </div>
        </div>
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
        <el-dialog
          class="custom_el_dialog"
          :append-to-body="true"
          :visible.sync="userSelDialog.show"
          :title="userSelDialog.title"
          width="1200px"
          height="100vh"
        >
          <user-selector
            :key="timer"
            ref="userSelector"
            :select-type="userListSelectType"
            :passed-in-param="userListQueryParam"
            :show-advanced-filter="userListAdvancedFilter"
            @selectChange="handleUserSelChange"
          />
        </el-dialog>
      </el-card>
      <el-card class="box-card">
        <div slot="header">
          <span class="title">用户信息</span>
          <el-button
            v-if="approvalContent.approvalType === '1' && mode === 'edit'"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="float: right"
            @click="addUser()"
            >新增</el-button
          >
        </div>
        <div>
          <el-table
            ref="table"
            :data="approvalContent.users"
            style="width: 100%"
            :stripe="true"
          >
            <el-table-column
              type="index"
              align="center"
              width="60px"
              label="序号"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="nickName"
              width="120px"
            >
              <template slot="header">
                <template v-if="bizAction !== '2'">
                  <span class="star">*</span>
                </template>
                <span>用户姓名</span>
              </template>
              <template slot-scope="scope">
                <el-form-item
                  v-if="approvalContent.approvalType === '1' && mode === 'edit'"
                  :prop="'users.' + scope.$index + '.nickName'"
                  :rules="rules.nickName"
                >
                  <el-input
                    v-model="scope.row.nickName"
                    clearable
                    size="mini"
                    maxlength="20"
                    placeholder
                    style="width: 100px"
                    class="filter-item"
                    @keyup.enter.native="crud.toQuery"
                  />
                </el-form-item>
                <span v-else>{{ scope.row.nickName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="90"
              :show-overflow-tooltip="true"
              prop="username"
            >
              <template slot="header">
                <span>用户账号</span>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.username }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="
                approvalContent.approvalType !== '1' &&
                userType === 'O3' &&
                attributes === '4'
              "
              :show-overflow-tooltip="true"
              prop="itProject.id"
            >
              <template slot="header">
                <template v-if="bizAction !== '2'">
                  <span class="star">*</span>
                </template>
                <span>所属产品</span>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.itProject.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="approvalContent.approvalType !== '1' && userType === 'O3'"
              :show-overflow-tooltip="true"
              prop="itSupplier.id"
            >
              <template slot="header">
                <template v-if="bizAction !== '2'">
                  <span class="star">*</span>
                </template>
                <span>所属供方</span>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.itSupplier.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="mode !== 'preview'"
              :show-overflow-tooltip="true"
              prop="pinyin"
              width="160px"
            >
              <template slot="header">
                <template v-if="bizAction !== '2'">
                  <span class="star">*</span>
                </template>
                <span>姓名拼音</span>
              </template>
              <template slot-scope="scope">
                <el-form-item
                  v-if="approvalContent.approvalType === '1' && mode === 'edit'"
                  :prop="'users.' + scope.$index + '.pinyin'"
                  :rules="rules.pinyin"
                >
                  <el-input
                    v-model="scope.row.pinyin"
                    clearable
                    size="mini"
                    maxlength="20"
                    placeholder
                    style="width: 140px"
                    class="filter-item"
                  />
                </el-form-item>
                <span v-else>{{ scope.row.pinyin }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="mode !== 'preview'"
              :show-overflow-tooltip="true"
              prop="sex"
              width="160px"
            >
              <template slot="header">
                <template v-if="bizAction !== '2'">
                  <span class="star">*</span>
                </template>
                <span>用户性别</span>
              </template>
              <template slot-scope="scope">
                <el-form-item
                  v-if="approvalContent.approvalType === '1' && mode === 'edit'"
                  :prop="'users.' + scope.$index + '.sex'"
                  :rules="rules.sex"
                >
                  <el-radio-group v-model="scope.row.sex" style="width: 100px">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <span v-else>{{ scope.row.sex }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              width="200"
              prop="idCardNum"
            >
              <template slot="header">
                <template v-if="bizAction !== '2'">
                  <span class="star">*</span>
                </template>
                <span>身份证号</span>
              </template>
              <template slot-scope="scope">
                <el-form-item
                  v-if="approvalContent.approvalType === '1' && mode === 'edit'"
                  :prop="'users.' + scope.$index + '.idCardNum'"
                  :rules="rules.idCardNum"
                >
                  <el-input
                    v-model="scope.row.idCardNum"
                    clearable
                    size="mini"
                    maxlength="18"
                    placeholder
                    style="width: 180px"
                    class="filter-item"
                  />
                </el-form-item>
                <span v-else>{{ scope.row.idCardNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              width="150"
              prop="phone"
            >
              <template slot="header">
                <template v-if="bizAction !== '2'">
                  <span class="star">*</span>
                </template>
                <span>手机号码</span>
              </template>
              <template slot-scope="scope">
                <el-form-item
                  v-if="approvalContent.approvalType === '1' && mode === 'edit'"
                  :prop="'users.' + scope.$index + '.phone'"
                  :rules="rules.phone"
                >
                  <el-input
                    v-model="scope.row.phone"
                    clearable
                    size="mini"
                    maxlength="11"
                    placeholder
                    style="width: 130px"
                    class="filter-item"
                  />
                </el-form-item>
                <span v-else>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="email"
              min-width="200"
            >
              <template slot="header">
                <!-- 1.新增2.延期-->
                <template v-if="bizAction !== '2'">
                  <span class="star">*</span>
                </template>
                <span>个人邮箱</span>
              </template>
              <template slot-scope="scope">
                <el-form-item
                  v-if="approvalContent.approvalType === '1' && mode === 'edit'"
                  :prop="'users.' + scope.$index + '.email'"
                  :rules="rules.email"
                >
                  <el-input
                    v-model="scope.row.email"
                    clearable
                    size="mini"
                    maxlength="40"
                    placeholder
                    style="width: 180px"
                    class="filter-item"
                  />
                </el-form-item>
                <span v-else>{{ scope.row.email }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userType === 'E2'"
              :show-overflow-tooltip="true"
              prop="dutyName"
            >
              <template slot="header">
                <span>职务名称</span>
              </template>
              <template slot-scope="scope">
                <el-form-item
                  v-if="approvalContent.approvalType === '1' && mode === 'edit'"
                >
                  <el-input
                    v-model="scope.row.dutyName"
                    clearable
                    size="mini"
                    maxlength="30"
                    placeholder
                    style="width: 180px"
                    class="filter-item"
                  />
                </el-form-item>
                <span v-else>{{ scope.row.dutyName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="mode === 'edit'"
              label="操作"
              width="120"
              align="left"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="approvalContent.approvalType === '1'"
                  size="mini"
                  type="text"
                  @click="copyUser(scope.$index, scope.row.id)"
                  >复制</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  @click="deleteUser(scope.$index, scope.row.id)"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-form>
    <div
      v-if="mode === 'edit' || mode === 'view'"
      slot="footer"
      class="bottom-btn-groups"
    >
      <el-button
        v-if="
          mode === 'edit' &&
          approval.status !== '3' &&
          approval.status !== '4' &&
          approval.status !== '7'
        "
        type="primary"
        size="mini"
        @click="doSave()"
        >保存</el-button
      >
      <el-button
        v-if="
          mode === 'edit' &&
          approval.status !== '3' &&
          approval.status !== '4' &&
          approval.status !== '7'
        "
        type="warning"
        size="mini"
        @click="doSubmitFlow()"
        >预览并提交</el-button
      >
      <el-button
        v-if="mode === 'edit' && showDisableBtn"
        type="danger"
        size="mini"
        @click="delApproval"
      >
        作废
      </el-button>
      <el-button
        v-if="
          mode === 'view' &&
          user.username === approval.ownerUser &&
          approval.status !== null &&
          approval.status !== undefined &&
          approval.status !== '1' &&
          approval.status !== '2'
        "
        type="primary"
        size="mini"
        @click="toViewFlow()"
        >查看审批状态</el-button
      >
      <el-button
        v-if="user.username === approval.ownerUser"
        type="default"
        size="mini"
        @click="goBack()"
        >返回</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  getApproval,
  add,
  edit,
  submitFlow,
  viewFlow,
  del,
} from "@http/system/approval";
import {
  validatePhoneExist,
  validateMailExist,
  validateIdCardNumExist,
  getUsers,
} from "@http/system/user";
import { isValidPhone, isValidMail, isValidIdNo } from "@/utils/validate";
import { getProjects } from "@http/system/itProject";
import { getSuppliers } from "@http/system/itSupplier";
import CRUD from "@crud/crud";
import { mapGetters } from "vuex";
import { $utils.parseTime } from "@/utils/index";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getHrTypeCode } from "@http/system/dept";
import SupplierList from "@/components/biz/SupplierList";
import ProductList from "@/components/biz/ProductList";
import UserSelector from "@/components/biz/UserSelector";

const defaultDeptCode = "6494050787";
const defaultJobCode = "920983";
const defaultRoleId = 2;
const defaultSex = "男";
const defaultStatus = "-1";
const defaultUserType = "O3";
const defaultUser = {
  id: null,
  username: null,
  nickName: null,
  pinyin: null,
  sex: defaultSex,
  email: null,
  status: defaultStatus,
  type: defaultUserType,
  itProject: { id: null },
  itSupplier: { id: null },
  dept: { code: defaultDeptCode },
  job: { code: defaultJobCode },
  roles: [{ id: defaultRoleId }],
  phone: null,
  expireTime: null,
  idCardNum: null,
};
export default {
  name: "UserApproval",
  components: { Treeselect, SupplierList, ProductList, UserSelector },
  props: {
    mode: {
      type: String,
      default: "edit",
    },
    approvalId: {
      type: String,
      default: undefined,
    },
    selectedUsers: {
      type: Array,
      default: undefined,
    },
    bizAction: {
      type: String,
      default: "",
    },
  },
  data() {
    // 自定义验证手机号
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号码"));
      } else if (!isValidPhone(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        validatePhoneExist(value).then((res) => {
          if (res) {
            callback(new Error("手机号码已存在"));
          } else {
            callback();
          }
        });
      }
    };
    // 自定义验证手机号
    const validMail = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入邮箱"));
      } else if (!isValidMail(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        validateMailExist(value).then((res) => {
          if (res) {
            callback(new Error("邮箱已存在"));
          } else {
            callback();
          }
        });
      }
    };
    // 自定义验证身份证号
    const validIdCardNo = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入身份证号"));
      } else if (!isValidIdNo(value)) {
        callback(new Error("请输入正确的身份证号"));
      } else {
        validateIdCardNumExist(value).then((res) => {
          if (res) {
            callback(new Error("身份证号已存在"));
          } else {
            callback();
          }
        });
      }
    };
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      defaultProps: { children: "children", label: "name" },
      userType: "",
      projects: [],
      suppliers: [],
      roles: [],
      timeout: null,
      typeOptions: [
        { key: "O3", display_name: "供应商用户" },
        { key: "E2", display_name: "编外用户" },
        { key: "O2", display_name: "项目合作方用户" },
      ],
      attrOptions: [
        { key: "1", display_name: "劳务派遣" },
        { key: "3", display_name: "劳务外包" },
        { key: "2", display_name: "实习生" },
      ],
      supplierAttrOptions: [
        { key: "4", display_name: "IT" },
        { key: "5", display_name: "非IT" },
      ],
      userAttr: "",
      approval: {
        id: null,
        flowKey: "",
        instanceId: null,
        taskId: null,
        subject: "",
        content: null,
        status: "1",
        ownerUser: null,
        ownerDept: null,
        bizAction: this.bizAction,
      },
      approvalContent: {
        itProject: {},
        itSupplier: {},
        users: [],
        expireTime: undefined,
        remark: "",
        approvalType: this.bizAction,
        dept: {
          id: null,
        },
        project: {
          id: null,
        },
        attributes: "",
        dutyName: "",
        leaderEmployNum: "",
        leaderName: "",
        isConfigItAssets: "0",
        isCreateBpmAcct: "0",
        isCreateKingdeeAcct: "0",
      },
      permission: {
        userList: ["admin", "user:list"],
        approvalList: ["admin", "approval:list"],
        approvalEdit: ["admin", "approval:edit"],
        approvalDel: ["admin", "approval:del"],
        approvalAdd: ["admin", "approval:add"],
      },
      // 日期选择器时间范围控制
      pickerOptions0: {
        disabledDate(time) {
          const curDate = new Date().getTime();
          const three = 90 * 24 * 3600 * 1000;
          const threeMonths = curDate + three;
          return time.getTime() < Date.now() || time.getTime() > threeMonths;
        },
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
          { required: true, message: "请输入用户拼音", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        sex: [{ required: true, message: "请选择用户性别", trigger: "blur" }],
        idCardNum: [
          { required: true, trigger: "blur", validator: validIdCardNo },
        ],
        phone: [{ required: true, trigger: "blur", validator: validPhone }],
        email: [{ required: true, trigger: "blur", validator: validMail }],
      },
      expandNodes: [],
      depts: [],
      supplierDialog: { title: "选择", show: false },
      projectDialog: { title: "选择产品", show: false },
      userSelDialog: { title: "选择用户", show: false },
      timer: "",
      supplierTitle: "",
      approvalStatus: null,
      showDisableBtn: false,
      userListSelectType: "radio",
      userListQueryParam: { deptCode: "", deptId: undefined },
      userListAdvancedFilter: false,
      autoClass: null,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    supplierRadioVal() {
      return this.approvalContent.itSupplier &&
        this.approvalContent.itSupplier.name
        ? this.approvalContent.itSupplier.name +
            "-" +
            this.approvalContent.itSupplier.id
        : "";
    },
    projectRadioVal() {
      return this.approvalContent.itProject &&
        this.approvalContent.itProject.name
        ? this.approvalContent.itProject.name +
            "-" +
            this.approvalContent.itProject.id
        : "";
    },
  },
  created() {
    this.initApproval();
  },
  mounted: function () {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };
    this.flexColumnWidth();
  },
  methods: {
    flexColumnWidth() {
      // 获取设备宽度
      const width = window.screen.availWidth;
      if (width < 768) {
        // 手机端 full-content
        this.autoClass = "autoClass";
      }
    },
    // 获取弹窗内部门数据
    getHrTypeCode(hrTypeCode) {
      getHrTypeCode(hrTypeCode).then((res) => {
        this.expandNodes = res.content.length > 0 ? [res.content[0].id] : [];
        this.depts = res.content;
        console.log("this.depts", this.depts);
      });
    },
    // 点击部门搜索对应的岗位
    selectFun(node) {
      this.approvalContent.dept = node;
    },
    selectProject(node) {
      this.approvalContent.project = node;
    },
    toItProduct() {
      this.projectDialog.show = true;
      this.timer = new Date().getTime();
    },
    toItSupplier(argument) {
      let title = "";
      switch (argument) {
        case "supplier":
          title = "供方";
          break;
        case "partner":
          title = "合作方";
          break;
        case "sender":
          title = "派遣方";
          break;
      }
      this.supplierTitle = title;
      this.supplierDialog.title = "选择" + this.supplierTitle;
      this.supplierDialog.show = true;
      this.timer = new Date().getTime();
    },
    // 选择用户
    toUser() {
      this.userSelDialog.show = true;
      this.timer = new Date().getTime();
    },
    handleSelectUser(item) {
      this.approvalContent.leaderName = item.nickName;
      this.approvalContent.leaderEmployNum = item.employNum;
    },
    // 选择供应商
    handleSupplierChange(params) {
      this.approvalContent.itSupplier = params;
      this.supplierDialog.show = false;
    },
    // 选择用户
    handleUserSelChange(params) {
      const data = params[0];
      this.approvalContent.leaderName = data.nickName;
      this.approvalContent.leaderEmployNum = data.employNum;
      this.userSelDialog.show = false;
    },
    handleProjectChange(params) {
      this.approvalContent.itProject = params;
      this.projectDialog.show = false;
    },
    selectUserType(e) {
      // 外包人员(项目合作方用户(21))
      if (e === "O2") {
        this.approvalContent.itProject = {};
        this.approvalContent.itSupplier = {};
        this.getHrTypeCode("21");
      } else if (e === "E2") {
        this.approvalContent.itProject = {};
        this.approvalContent.itSupplier = {};
        this.getHrTypeCode("20");
      } else if (e === "O3") {
        this.approvalContent.dept = { id: null };
        this.approvalContent.project = { id: null };
      }
      this.userAttr = null;
      //  判断用户类型，并展示额外属性
      // if (this.userType === "O3") {
      //   this.getProjects();
      //   this.getSuppliers();
      // }
    },
    selectUserAttr(e) {
      if (e === "1") {
        // 劳务派遣
        this.approvalContent.attributes = 1;
      } else if (e === "2") {
        // 实习生
        this.approvalContent.attributes = 2;
      } else {
        // 劳务外包
        this.approvalContent.attributes = 3;
      }
    },
    selectSupplierUserAttr(e) {
      if (e === "4") {
        // IT
        this.approvalContent.attributes = 4;
      } else if (e === "5") {
        // 非IT
        this.approvalContent.attributes = 5;
        this.approvalContent.itProject = {};
      }
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
      this.approvalContent.itSupplier = item;
    },
    handleSelectProject(item) {
      this.approvalContent.itProject = item;
    },
    initApproval() {
      if (this.approvalId) {
        // 新用户申请/编辑/查看/预览场景
        getApproval(this.approvalId, this.mode)
          .then((res) => {
            if (res) {
              this.approval = res;
              this.approvalStatus = res.status;
              const statusList = ["5", "6"]; // 撤销或者作废
              if (statusList.includes(this.approvalStatus)) {
                // 显示作废按钮
                this.showDisableBtn = true;
              }
              if (res.content) {
                this.approvalContent = JSON.parse(res.content);
                this.userType = this.approvalContent.users[0].type;
                this.userAttr = this.approvalContent.attributes.toString();
                if (this.mode === "edit") {
                  if (this.userType === "O2") {
                    this.getHrTypeCode("21");
                  } else if (this.userType === "E2") {
                    this.getHrTypeCode("20");
                  }
                }
              }
            }
          })
          .catch(() => {});
      } else if (this.selectedUsers) {
        // 延期/启用申请场景，传递待审批用户参数
        this.approvalContent.users = this.selectedUsers;
        this.userType = this.approvalContent.users[0].type;
        this.userAttr = this.approvalContent.attributes;
      }
    },
    // 新增用户
    addUser() {
      const user = JSON.parse(JSON.stringify(defaultUser));
      this.approvalContent.users.push(user);
    },
    // 复制用户
    copyUser(index) {
      const user = JSON.parse(
        JSON.stringify(this.approvalContent.users[index])
      );
      this.approvalContent.users.push(user);
    },
    // 删除用户
    deleteUser(index) {
      this.approvalContent.users.splice(index, 1);
    },
    selectUser(data) {
      for (let i = 0; i < data.length; i++) {
        let existed = false;
        for (let j = 0; j < this.approvalContent.users.length; j++) {
          if (data[i].id === this.approvalContent.users[j].id) {
            existed = true;
            break;
          }
        }
        if (!existed) {
          this.approvalContent.users.push(data[i]);
        }
      }
    },
    // 提交前验证
    validate() {
      return new Promise((resolve, reject) => {
        if (!this.userType) {
          this.$message.error({
            message: "请选择用户类型",
            duration: 2000,
          });
          resolve(false);
        } else if (!this.approvalContent.expireTime) {
          this.$message.error({
            message: "请选择过期时间",
            duration: 2000,
          });
          resolve(false);
        } else if (
          (this.userType === "O3" &&
            this.approvalContent.attributes === 4 &&
            this.approvalContent.approvalType === "1" &&
            (!this.approvalContent.itProject.id ||
              !this.approvalContent.itProject.name)) ||
          (this.userType === "O3" &&
            this.approvalContent.attributes === 4 &&
            this.approvalContent.approvalType === "1" &&
            this.approvalContent.itProject === null)
        ) {
          this.$message.error({
            message: "请选择所属产品",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "O3" &&
          this.approvalContent.approvalType === "1" &&
          (!this.approvalContent.itSupplier.id ||
            !this.approvalContent.itSupplier.name)
        ) {
          this.$message.error({
            message: "请选择所属供方",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "O2" &&
          this.approvalContent.approvalType === "1" &&
          (!this.approvalContent.project.id ||
            !this.approvalContent.project.name)
        ) {
          this.$message.error({
            message: "请选择所属项目",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "O2" &&
          this.approvalContent.approvalType === "1" &&
          (!this.approvalContent.itSupplier.id ||
            !this.approvalContent.itSupplier.name)
        ) {
          this.$message.error({
            message: "请选择所属合作方",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "E2" &&
          this.approvalContent.approvalType === "1" &&
          (!this.approvalContent.dept.id || !this.approvalContent.dept.name)
        ) {
          this.$message.error({
            message: "请选择所属部门",
            duration: 2000,
          });
          resolve(false);
        } else if (
          ["E2", "O3"].includes(this.userType) &&
          this.approvalContent.approvalType === "1" &&
          this.approvalContent.attributes === ""
        ) {
          this.$message.error({
            message: "请选择用户属性",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "E2" &&
          this.approvalContent.approvalType === "1" &&
          this.approvalContent.attributes === 1 &&
          (!this.approvalContent.itSupplier.id ||
            !this.approvalContent.itSupplier.name)
        ) {
          this.$message.error({
            message: "请选择所属派遣方",
            duration: 2000,
          });
          resolve(false);
        } else if (
          !this.approvalContent.users ||
          this.approvalContent.users.length <= 0
        ) {
          this.$message.error({
            message: "请添加用户信息",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.approvalContent.users.length > 1 &&
          this.bizAction !== "2"
        ) {
          const users = this.approvalContent.users;
          users.forEach((item) => {
            item.email = item.email === null ? "" : item.email;
            item.phone = item.phone === null ? "" : item.phone;
            item.idCardNum = item.idCardNum === null ? "" : item.idCardNum;
          });
          if (
            users.filter((item) => {
              return (
                item.email === "" || item.phone === "" || item.idCardNum === ""
              );
            }).length
          ) {
            this.$message.error({
              message: "请添加用户完整信息",
              duration: 2000,
            });
            resolve(false);
            return false;
          }
          console.log(1178, users);
          resolve(this.isExitProperty(users));
        } else if (this.approvalContent.remark === "") {
          this.$message.error({
            message: "请填写申请原因",
            duration: 2000,
          });
          resolve(false);
        } else {
          // 创建申请时，校验用户信息，基于form验证
          if (this.approvalContent.approvalType === "1") {
            this.$refs.form.validate((valid) => {
              if (!valid) {
                this.$message.error({
                  message: "用户信息不正确",
                  duration: 2000,
                });
                resolve(false);
              } else {
                resolve(true);
              }
            });
          } else {
            resolve(true);
          }
        }
      });
    },
    isExitProperty(users) {
      // 重复数据处理
      const newEmail = {};
      const newPhone = {};
      const newIdCard = {};
      users.forEach((item) => {
        // 新建属性名
        if (Object.keys(newEmail).indexOf(item.email) === -1) {
          newEmail[item.email] = [];
        }
        newEmail[item.email].push(item);
        if (Object.keys(newPhone).indexOf(item.phone) === -1) {
          newPhone[item.phone] = [];
        }
        newPhone[item.phone].push(item);
        if (Object.keys(newIdCard).indexOf(item.idCardNum) === -1) {
          newIdCard[item.idCardNum] = [];
        }
        newIdCard[item.idCardNum].push(item);
      });
      for (const k in newEmail) {
        console.log(newEmail[k], newEmail[k].length);
        if (k !== "" && newEmail[k].length > 1) {
          this.$message.error({
            message: "邮箱重复",
            duration: 2000,
          });
          return false;
        }
      }
      for (const p in newPhone) {
        if (p !== "" && newPhone[p].length > 1) {
          this.$message.error({
            message: "手机号码重复",
            duration: 2000,
          });
          return false;
        }
      }
      for (const c in newIdCard) {
        if (c !== "" && newIdCard[c].length > 1) {
          this.$message.error({
            message: "身份证号码重复",
            duration: 2000,
          });
          return false;
        }
      }
      return true;
    },
    // 保存申请
    saveApproval() {
      return new Promise((resolve, reject) => {
        this.validate()
          .then((res) => {
            if (res) {
              // START--校验成功后执行保存逻辑

              // 1, 设置审批标题及flowkey
              const approvalSub0 = "【用户审核】";
              let approvalSub1 = "";
              let approvalSub2 = "";
              if (this.userType === "O3") {
                approvalSub1 = "供应商用户";
                this.approval.flowKey = "IT_SUPPLIER_USER_APPLY";
              } else if (this.userType === "E2") {
                approvalSub1 = "编外用户";
                this.approval.flowKey = "OFF_STAFF_USER_APPLY";
              } else if (this.userType === "O2") {
                approvalSub1 = "项目合作方用户";
                this.approval.flowKey = "PROJ_PARTNER_USER_APPLY";
              }
              if (this.approvalContent.approvalType === "1") {
                approvalSub2 = "新增";
              } else if (this.approvalContent.approvalType === "2") {
                approvalSub2 = "延期";
              } else if (this.approvalContent.approvalType === "3") {
                approvalSub2 = "启用";
              }
              this.approval.subject = approvalSub0
                .concat(approvalSub1)
                .concat(approvalSub2)
                .concat("申请");
              // 2, 设置其他属性
              for (let i = 0; i < this.approvalContent.users.length; i++) {
                if (
                  this.approvalContent.approvalType === "1" &&
                  this.userType === "O3"
                ) {
                  this.approvalContent.users[i].itProject =
                    this.approvalContent.itProject;
                  this.approvalContent.users[i].itSupplier =
                    this.approvalContent.itSupplier;
                }
                this.approvalContent.users[i].expireTime =
                  this.approvalContent.expireTime;
                this.approvalContent.users[i].type = this.userType;
              }
              if (this.approvalContent.attributes === 2) {
                this.approvalContent.itSupplier = null;
              }
              if (JSON.stringify(this.approvalContent.itProject) === "{}") {
                this.approvalContent.itProject = null;
              }
              if (JSON.stringify(this.approvalContent.itSupplier) === "{}") {
                this.approvalContent.itSupplier = null;
              }
              this.approval.content = JSON.stringify(this.approvalContent);
              // 3, 保存或更新
              if (!this.approval.id) {
                console.log("this.approval: ", this.approval);
                add(this.approval)
                  .then((res) => {
                    this.approval.id = res.id;
                    resolve(true);
                  })
                  .catch(() => {
                    this.$message.error({
                      message: "保存审批信息失败",
                      duration: 2000,
                    });
                    resolve(false);
                  });
              } else {
                console.log("edit this.approval: ", this.approval);
                edit(this.approval)
                  .then((res) => {
                    resolve(true);
                  })
                  .catch(() => {
                    this.$message.error({
                      message: "保存审批信息失败",
                      duration: 2000,
                    });
                    resolve(false);
                  });
              }
              // END --校验成功后执行保存逻辑
            } else {
              resolve(false);
            }
          })
          .catch(() => {
            resolve(false);
          });
      });
    },
    doSave() {
      this.saveApproval()
        .then((res) => {
          if (res) {
            this.$message.success({
              message: "保存审批信息成功",
              duration: 2000,
            });
          }
        })
        .catch(() => {});
    },
    // 预览并提交到OA
    doSubmitFlow() {
      this.saveApproval()
        .then((res) => {
          if (res) {
            submitFlow(this.approval.id, false)
              .then((res) => {
                window.location.href = res;
              })
              .catch(() => {
                this.$message.error({
                  message: "提交流程失败",
                  duration: 2000,
                });
              });
          }
        })
        .catch(() => {
          this.$message.error({
            message: "提交流程失败",
            duration: 2000,
          });
        });
    },
    // 作废
    delApproval() {
      this.$confirm("确定要作废吗？")
        .then((_) => {
          del(new Array(this.approvalId))
            .then((res) => {
              console.log("作废", res);
              this.$message.success({
                message: "作废成功!",
                duration: 2000,
              });
              this.$router.push({ path: "/workbench/users" });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((_) => {});
    },
    toViewFlow() {
      viewFlow(this.approvalId)
        .then((res) => {
          if (res) {
            window.open(res);
          }
        })
        .catch(() => {});
    },
    // 取消返回申请页
    goBack() {
      // if(!this.approvalId){
      //   this.$router.push({ path: "/workbench/users", params: {} });
      // } else {
      this.$router.push({
        path: "/workbench/users/userApprovalList",
        params: {},
      });
      // }
    },
    [CRUD.HOOK.afterAddError](crud) {
      this.afterErrorMethod(crud);
    },
    [CRUD.HOOK.afterEditError](crud) {
      this.afterErrorMethod(crud);
    },
    afterErrorMethod(crud) {},
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {},
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {},
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {},
  },
};
</script>

<style scoped>
#userApproval .crud-opts {
  /*padding: 6px 0;*/
  padding: 0 0 10px 0;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
#userApproval .crud-opts .crud-opts-right {
  margin-left: auto;
}
.my-box-card {
  overflow: visible;
}
.clearfix::after {
  display: block;
  height: 0;
  clear: both;
  font-size: 0;
  visibility: hidden;
  content: " ";
}
.O2-label {
  width: 50%;
  margin-bottom: 10px;
}
.E2-label {
  margin-bottom: 10px;
}
.O2-label .el-radio-group,
.E2-label .el-radio-group {
  line-height: 40px;
}
.full-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 120px;
}
.autoClass {
  display: inline-block;
  width: 200px;
  overflow-x: auto;
}
.compute-label {
  width: 100%;
}
/deep/ .my-box-card .vue-treeselect__control {
  height: 26px;
  line-height: 26px;
}
/deep/ .vue-treeselect__single-value,
/deep/ .vue-treeselect__placeholder {
  margin-top: -4px;
}
/deep/ .el-dialog__body {
  padding: 0px 20px 20px;
}
</style>
