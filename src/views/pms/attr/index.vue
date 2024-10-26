<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-card style="margin: 20px 0px">
        <!--三级下拉列表-->
        <CategorySelector
          @listenOnSelect="getAttrInfoList"
          :show="!isShowTable"
        />
      </el-card>
    </el-card>

    <div v-show="isShowTable">
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets" style="margin-top: 5px"></i>
        <span style="margin-top: 5px">数据列表</span>
        <el-button
          type="primary"
          class="btn-add"
          :disabled="!category3Id"
          @click="addAttr"
          size="mini"
          >添加平台属性</el-button
        >
      </el-card>

      <!-- 表格:展示平台属性 -->
      <el-table style="width: 100%" border :data="attrList">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column prop="attrName" label="属性是否可选" width="150">
        </el-table-column>
        <el-table-column prop="attrName" label="属性值录入方式" width="150">
        </el-table-column>
        <el-table-column prop="prop" label="属性值列表" width="width">
          <template slot-scope="{ row, $index }">
            <el-tag
              type="success"
              v-for="(attrValue, index) in row.attrValueList"
              :key="attrValue.id"
              style="margin: 0px 20px"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateAttr(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

     

    </div>
  </div>
</template>
  
  <script>
import prop from "@/api/baseinfo/prop";
import CategorySelector from "@/views/components/CategorySelector";

export default {
  productAttr: Object.assign({}, defaultProductAttr),
  components: { CategorySelector },
  data() {
    return {
      //这个属性控制table表格显示与隐藏的
      isShowTable: true,
      // 属性所属分类
      category1Id: 0,
      category2Id: 0,
      category3Id: "0",
      categoryId: 0,
      categoryLevel: 1,

      // 属性列表数据
      attrInfoList: null,
      attrInfoListLoading: false,

      // 属性表单数据
      showAttrInfoForm: false,
      attrValueListLoading: false,
      attrInfoForm: {
        id: null,
        attrName: null,
        category1Id: 0,
        category2Id: 0,
        category3Id: 0,
        attrValueList: [],
      },
    };
  },

  methods: {
    // 获取属性列表
    getAttrInfoList(categoryId, categoryLevel) {
      this.categoryId = categoryId;
      this.categoryLevel = categoryLevel;
      debugger;
      if (categoryLevel === 1) {
        this.category1Id = categoryId;
        this.category2Id = 0;
        this.category3Id = 0;
      }
      if (categoryLevel === 2) {
        this.category2Id = categoryId;
        this.category3Id = 0;
      }
      if (categoryLevel === 3) {
        this.category3Id = categoryId;
      }
      // 查询数据
      this.attrInfoListLoading = true;
      prop
        .getAttrInfoList(this.category1Id, this.category2Id, this.category3Id)
        .then((response) => {
          this.attrInfoList = response.data;
          this.attrInfoListLoading = false;
        });
    },

    // 添加平台属性
    addAttrInfo() {
      if (!this.confirmSelect()) {
        return;
      }

      // 初始化值
      this.attrInfoForm.id = null;
      this.attrInfoForm.attrName = null;
      this.attrInfoForm.attrValueList = [];

      // 显示表单
      this.showAttrInfoForm = true;
    },

    // 选择三级分类确认
    confirmSelect() {
      if (!this.category1Id) {
        this.$alert("请选择分类", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return false;
      }
      return true;
    },

    // 修改属性
    editAttrInfoById(attrId, attrName) {
      // 获取属性值列表
      this.attrValueListLoading = true;
      prop.getAttrValueList(attrId).then((response) => {
        this.attrInfoForm.id = attrId;
        this.attrInfoForm.attrName = attrName;
        this.attrInfoForm.attrValueList = response.data;
        this.attrValueListLoading = false;
      });
      // 显示表单
      this.showAttrInfoForm = true;
    },

    // 删除属性值
    deleteAttrValueByName(attrValueName) {
      const tempList = [];
      this.attrInfoForm.attrValueList.forEach((attrValue) => {
        if (attrValue.valueName !== attrValueName) {
          tempList.push(attrValue);
        }
      });
      this.attrInfoForm.attrValueList = tempList;
    },

    // 保存属性和属性值
    saveAttrInfo() {
      this.attrInfoForm.categoryId = this.categoryId;
      this.attrInfoForm.categoryLevel = this.categoryLevel;
      prop.saveAttrInfo(this.attrInfoForm).then((response) => {
        // 刷新属性列表
        this.getAttrInfoList(this.categoryId, this.categoryLevel);
        // 隐藏表单
        this.showAttrInfoForm = false;
      });
    },

    // 返回属性列表页面
    backToAttrList() {
      // 隐藏表单
      this.showAttrInfoForm = false;
    },

    // 添加属性值
    addAttrValue() {
      const attrValue = {
        valueName: null,
        edit: true,
      };
      this.attrInfoForm.attrValueList.push(attrValue);
    },

    // 保存属性值
    saveAttrValue(row) {
      row.edit = false;
    },

    // 编辑属性值
    editAttrValue(row) {
      row.edit = true;
    },
  
  },
};
</script>
  
  <style scoped>
.edit-input {
  padding-right: 60px;
}
.save-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
  
  