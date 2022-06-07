<template>
  <div class="crud-opts">
    <!--左侧插槽-->
    <div class="crud-opts-left">
      <el-input
        size="mini"
        v-model="query.keyword"
        clearable
        class="filter-item ui-w-160"
        :placeholder="placeholder"
        @keyup.enter.native="crud.toQuery()"
      ></el-input>
      <el-select
        v-if="crud.optShow.status"
        v-model="query.status"
        clearable
        size="mini"
        placeholder="状态"
        class="filter-item ui-w-100"
        @change="crud.toQuery()"
      >
        <el-option
          v-for="item in dict.sys_disabled_status"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <UserSelect
        v-if="crud.optShow.user"
        v-permission="permission.user"
        ref="user-select"
        placeholder="所属用户"
        :queryParam="query"
        @resetPage="crud.toQuery()"
        class="filter-item"
      />
      <slot name="left" />
    </div>
    <!--右侧-->
    <div class="crud-opts-right">
      <slot name="right" />
      <el-button
        v-if="crud.optShow.add"
        v-permission="permission.add"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="crud.toAdd"
      >
        新增
      </el-button>
      <!-- <el-button
        v-if="crud.optShow.edit"
        v-permission="permission.edit"
        size="mini"
        type="default"
        icon="el-icon-edit"
        :disabled="crud.selections.length !== 1"
        @click="crud.toEdit(crud.selections[0])"
      >
        修改
      </el-button> -->
      <el-button
        v-if="crud.optShow.enable"
        v-permission="permission.enable"
        size="mini"
        type="success"
        icon="el-icon-unlock"
        :disabled="crud.selections.length === 0"
        @click="crud.toEnable(crud.selections)"
      >
        启用
      </el-button>
      <el-button
        v-if="crud.optShow.disable"
        v-permission="permission.disable"
        size="mini"
        type="danger"
        icon="el-icon-lock"
        :disabled="crud.selections.length === 0"
        @click="crud.toDisable(crud.selections)"
      >
        禁用
      </el-button>
      <el-button
        v-if="crud.optShow.del"
        v-permission="permission.del"
        type="default"
        icon="el-icon-delete"
        size="mini"
        :loading="crud.delAllLoading"
        :disabled="crud.selections.length === 0"
        @click="toDelete(crud.selections)"
      >
        删除
      </el-button>
      <el-button
        v-if="crud.optShow.download"
        v-permission="permission.export"
        :loading="crud.downloadLoading"
        :disabled="!crud.data.length"
        size="mini"
        type="default"
        icon="el-icon-download"
        @click="crud.doExport"
        >导出</el-button
      >
      <!-- 暂时隐藏 - 未用到 -->
      <!-- <el-button-group>
        <el-button
          size="mini"
          plain
          type="info"
          icon="el-icon-search"
          @click="toggleSearch()"
        />
        <el-button
          size="mini"
          icon="el-icon-refresh"
          @click="crud.refresh()"
        />
        <el-popover
          placement="bottom-end"
          width="150"
          trigger="click"
        >
          <el-button
            slot="reference"
            size="mini"
            icon="el-icon-s-grid"
          >
            <i
              class="fa fa-caret-down"
              aria-hidden="true"
            />
          </el-button>
          <el-checkbox
            v-model="allColumnsSelected"
            :indeterminate="allColumnsSelectedIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox
            v-for="item in crud.props.tableColumns"
            :key="item.label"
            v-model="item.visible"
            @change="handleCheckedTableColumnsChange(item)"
          >
            {{ item.label }}
          </el-checkbox>
        </el-popover>
      </el-button-group> -->
    </div>
  </div>
</template>

<script>
import CRUD, { header, crud } from "@crud/crud";
export default {
  mixins: [header(), crud()],
  dicts: ["sys_disabled_status"],
  props: {
    permission: {
      type: Object,
      default: null,
    },
    placeholder: {
      type: String,
      default: "请输入关键词",
    },
  },
  data() {
    return {
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
    };
  },
  created() {
    this.crud.updateProp("searchToggle", true);
  },
  methods: {
    toDelete(datas) {
      this.$confirm(`确认删除选中的${datas.length}条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(datas);
        })
        .catch(() => {});
    },
    handleCheckAllChange(val) {
      if (val === false) {
        this.allColumnsSelected = true;
        return;
      }
      for (const key in this.crud.props.tableColumns) {
        this.crud.props.tableColumns[key].visible = val;
      }
      this.allColumnsSelected = val;
      this.allColumnsSelectedIndeterminate = false;
    },
    handleCheckedTableColumnsChange(item) {
      let totalCount = 0;
      let selectedCount = 0;
      for (const key in this.crud.props.tableColumns) {
        ++totalCount;
        selectedCount += this.crud.props.tableColumns[key].visible ? 1 : 0;
      }
      if (selectedCount === 0) {
        this.crud.notify("请至少选择一列", CRUD.NOTIFICATION_TYPE.WARNING);
        this.$nextTick(function () {
          item.visible = true;
        });
        return;
      }
      this.allColumnsSelected = selectedCount === totalCount;
      this.allColumnsSelectedIndeterminate =
        selectedCount !== totalCount && selectedCount !== 0;
    },
    toggleSearch() {
      this.crud.props.searchToggle = !this.crud.props.searchToggle;
    },
  },
};
</script>

