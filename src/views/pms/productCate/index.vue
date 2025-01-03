<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="handleAddProductCate()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productCateTable"
        style="width: 100%"
        :data="list"
        v-loading="listLoading"
        border
      >
        <el-table-column label="序号" width="100" align="center">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>

        <el-table-column label="设置" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.parentId === 0"
              @click="handleShowLastLevel(scope.row.parentId)"
              >查看上级
            </el-button>
            <el-button
              size="mini"
              :disabled="!scope.row.existChild"
              @click="handleShowNextLevel(scope.row.id)"
              >查看下级
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.row.id, scope.row)"
              >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
   
  </div>
</template>

<script>
import {
  fetchList,
  deleteProductCate,
  updateShowStatus,
  updateNavStatus,
} from "@/api/productCate";
import productCategory from "@/api/pms/productCategory";
export default {
  name: "productCateList",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      parentId: 0,
      id:0,
      type:'down',
      level:1
    };
  },
  created() {
    this.resetLevel();
    this.resetParentId();
    this.getList();
  },
  watch: {
    $route(route) {
      this.resetLevel();
      this.resetParentId();
      this.resetId();
      this.resetType();
      this.getList();
    },
  },
  methods: {
    resetType(){
      if (this.$route.query.type != null) {
        this.type = this.$route.query.type;
      } else {
        this.type = 'down';
      }
    },
    resetLevel() {
      if (this.$route.query.level != null) {
        this.level = this.$route.query.level;
      } else {
        this.level = 1;
      }
    },
    resetId() {
      if (this.$route.query.id != null) {
        this.id = this.$route.query.id;
      } else {
        this.id = 0;
      }
    },
    resetParentId(){
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId;
      } else {
        this.parentId = 0;
      }
    },
    handleAddProductCate() {
      this.$router.push("/pms/addProductCate");
    },
    getList() {
      this.listLoading = true;
      productCategory.fetchListByParentId(this.type,this.parentId)
        .then((response) => {
          this.listLoading = false;
          this.list = response.data;
        });
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleNavStatusChange(index, row) {
      let data = new URLSearchParams();
      let ids = [];
      ids.push(row.id);
      data.append("ids", ids);
      data.append("navStatus", row.navStatus);
      updateNavStatus(data).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      });
    },
    handleShowStatusChange(index, row) {
      let data = new URLSearchParams();
      let ids = [];
      ids.push(row.id);
      data.append("ids", ids);
      data.append("showStatus", row.showStatus);
      updateShowStatus(data).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      });
    },
    // 查看下一层级
    handleShowNextLevel(id) {
      this.$router.push({
        path: "/pms/productCate",
        query: { type: 'down',parentId:id},
      });
    },
    //查看上一层级
    handleShowLastLevel(parentId) {
      this.$router.push({
        path: "/pms/productCate",
        query: { type: 'up',parentId:parentId },
      });
    },
    handleTransferProduct(index, row) {
      console.log("handleAddProductCate");
    },
    handleUpdate(index, row) {
      this.$router.push({
        path: "/pms/updateProductCate",
        query: { id: row.id },
      });
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该品牌", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteProductCate(row.id).then((response) => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000,
          });
          this.getList();
        });
      });
    },
  },
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return "一级";
      } else if (value === 1) {
        return "二级";
      }
    },
    disableNextLevel(value) {
      if (value === 0) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped>
</style>
