<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-card style="margin: 10px 0px">
        <!--三级下拉列表-->
        <CategorySelector @listenOnSelect="getAttrInfoList" :show="!isShowTable" />
      </el-card>
    </el-card>

    <!-- 平台属性列表 -->
    <div v-show="isShowTable">
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets" style="margin-top: 5px"></i>
        <span style="margin-top: 5px">数据列表</span>
        <el-button type="primary" class="btn-add" :disabled="!category3Id" @click="addBaseAttr"
          size="mini">添加平台属性</el-button>
      </el-card>

      <!-- 表格:展示平台属性 -->
      <el-table ref="productAttrTable" :data="baseAttrList" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="序号" width="100" align="center">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="属性名称" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.attrName }}</template>
        </el-table-column>
        <el-table-column label="属性是否可选" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.selectType | selectTypeFilter }}</template>
        </el-table-column>
        <el-table-column label="属性值的录入方式" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.inputType | inputTypeFilter }}</template>
        </el-table-column>
        <el-table-column label="可选值列表" align="center">
          <template slot-scope="scope">{{ scope.row.inputList }} {{ scope.row }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <!-- 添加属性|修改属性的结构 -->
    <div v-show="!isShowTable">
      <el-card class="form-container" shadow="never">
        <el-form :model="baseAttr" :rules="rules" ref="baseAttrFrom" label-width="150px">
          <el-form-item label="平台属性名称：" prop="name">
            <el-input v-model="baseAttr.name"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            {{ category3Id }}
            <el-select v-model="baseAttr.baseAttributeCategoryId" placeholder="请选择">
              <el-option v-for="item in productAttrCateList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="属性是否可选:">
            <el-radio-group v-model="baseAttr.selectType">
              <el-radio :label="0">唯一</el-radio>
              <el-radio :label="1">单选</el-radio>
              <el-radio :label="2">复选</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="属性值的录入方式:">
            <el-radio-group v-model="baseAttr.inputType">
              <el-radio :label="0">手工录入</el-radio>
              <el-radio :label="1">从下面列表中选择</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="属性值可选值列表:">
            <el-input :autosize="true" type="textarea" v-model="inputListFormat"></el-input>
          </el-form-item>
          <el-form-item label="是否支持手动新增:">
            <el-radio-group v-model="baseAttr.handAddStatus">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('baseAttrFrom')">保存</el-button>
            <el-button type="warning" v-if="!isEdit" @click="resetForm('baseAttrFrom')">重置</el-button>
            <el-button  @click="isShowTable = true">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import CategorySelector from "@/views/components/CategorySelector";
import prop from "@/api/pms/baseAttr";
import baseAttr from "../../../api/pms/baseAttr";

//默认平台属性值
const defaultBaseAttr = {
  id: 0,
  filterType: 0,
  handAddStatus: 0,
  inputList: [],
  inputType: 0,
  name: "",
  categoryId: 0,
  relatedStatus: 0,
  searchType: 0,
  selectType: 0,
  sort: 0,
  type: 0,
};

export default {
  name: "baseAttr",
  components: { CategorySelector },
  data() {
    return {
      //这个属性控制table表格显示与隐藏的
      isShowTable: true,
      // 属性所属分类
      category1Id: 0,
      category2Id: 0,
      category3Id: 0,
      categoryId: 0,
      categoryLevel: 1,
      //接受平台属性的数据
      baseAttrList: [],
      spuSaleAttrValueList: [],
      baseAttr: Object.assign({}, defaultBaseAttr),
      rules: {
        name: [
          { required: true, message: "请输入属性名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur",
          },
        ],
      },
      productAttrCateList: [],
      //收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    };
  },
  created() {
    this.getAllBaseAttr();
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
    //添加平台属性
    addBaseAttr() {
      //切换table显示与隐藏
      this.isShowTable = false;
      //清除数据
      //收集三级分类的id
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      };
    },
    //获取所有平台属性
    getAllBaseAttr() {
      this.listLoading = true;
      prop.getfindAllBaseAttr().then((response) => {
        this.listLoading = false;
        this.baseAttrList = response.data;
      });
    },
    // 保存平台属性值
    saveAttrValue(row) {
      if (!row.spuSaleAttrValueList) {
        row.spuSaleAttrValueList = [];
      }
    },
    // 添加销售属性值
    editAttrValue(row) {
      row.edit = true;
    },
    // 删除销售属性值
    handleTagClose(tag, row) {
      const index = row.spuSaleAttrValueList.indexOf(tag);
      row.spuSaleAttrValueList.splice(index, 1);
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              prop.updateBasetAttr(this.baseAttr.id, this.baseAttr).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.back();
              });
            } else {
              prop.addBaseAttr(this.baseAttr).then(response => {
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                });
                //this.resetForm('baseAttrFrom');
                this.$router.back();
              });
            }
          });

        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.resetProductAttr();
    },
    //编辑平台属性
    handleUpdate(index, row) {
      this.isEdit = true;
      this.isShowTable = false;
      prop.getBaseAttrInfoById(row.id).then(response => {
        this.baseAttr = response.data;
        this.baseAttr.name = response.data.attrName;
      });
    }
  },
  filters: {
    inputTypeFilter(value) {
      if (value === 1) {
        return '从列表中选取';
      } else {
        return '手工录入'
      }
    },
    selectTypeFilter(value) {
      if (value === 1) {
        return '单选';
      } else if (value === 2) {
        return '多选';
      } else {
        return '唯一'
      }
    },
  }
};
</script>
<style></style>