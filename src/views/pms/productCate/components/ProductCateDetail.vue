<template>
  <el-card class="form-container" shadow="never">
    <el-form
      :model="productCate"
      :rules="rules"
      ref="productCateFrom"
      label-width="150px"
    >
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="productCate.name"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-cascader
        ref="clearCheckedNodes"
          v-model="productCate.parentId"
          :options="selectProductCateList"
          :props="{ checkStrictly: true }"
          :show-all-levels="false"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productCateFrom')"
          >提交</el-button
        >
        <el-button
          type="warning"
          v-if="!isEdit"
          @click="resetForm('productCateFrom')"
          >重置</el-button
        >
        <el-button @click="cancelCtegory()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updateProductCate, getProductCate } from "@/api/productCate";
import productCategory from "@/api/pms/productCategory";
import SingleUpload from "@/components/Upload/singleUpload";

const defaultProductCate = {
  name: "",
  parentId: 0,
  level: 1,
};
export default {
  name: "ProductCateDetail",
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      productCate: Object.assign({}, defaultProductCate),
      selectProductCateList: [],
      rules: {
        name: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur",
          },
        ],
      },
      filterAttrs: [],
      filterProductAttrList: [
        {
          value: [],
        },
      ],
    };
  },
  created() {
    if (this.isEdit) {
      getProductCate(this.$route.query.id).then((response) => {
        this.productCate = response.data;
      });
    } else {
      this.productCate = Object.assign({}, defaultProductCate);
    }
    this.getSelectProductCateList();
  },
  methods: {
    handleChange(value) {
      console.log(value)
      if(value && value.length>0){
        this.productCate.parentId = value[value.length - 1];
      }else{
        his.productCate.parentId =0
      }
    },
    getSelectProductCateList() {
      productCategory.fetchAllCategoryList().then((response) => {
        const data = response.data.map((item) => {
          return {
            value: item.id,
            label: item.name,
            children:
              item.children && item.children.length > 0 // 检查 item.children 是否为非空数组
                ? item.children.map((child) => ({
                    value: child.id,
                    label: child.name,
                    children:
                      child.children && child.children.length > 0
                        ? child.children.map((subChild) => ({
                            value: subChild.id,
                            label: subChild.name,
                            children:
                              (subChild.children && subChild.length > 0) ||
                              null, // 确保这里是数组，即使没有子节点
                          }))
                        : null,
                  }))
                : null,
          };
        });
        this.selectProductCateList = data; // 赋值给selectProductCateList
        
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            if (this.isEdit) {
              updateProductCate(this.$route.query.id, this.productCate).then(
                (response) => {
                  console.log(this.productCate);
                  this.$message({
                    message: "修改成功",
                    type: "success",
                    duration: 1000,
                  });
                  this.$router.back();
                }
              );
            } else {
              console.log("parentId:",this.productCate.parentId);
              productCategory
                .createProductCate(this.productCate)
                .then((response) => {
                  this.$refs[formName].resetFields();
                  this.resetForm(formName);
                  this.$message({
                    message: "提交成功",
                    type: "success",
                    duration: 1000,
                  });
                  this.$router.back();
                });
            }
          });
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.productCate = Object.assign({}, defaultProductCate);
      this.getSelectProductCateList();
      this.filterProductAttrList = [
        {
          value: [],
        },
      ];
    },
    removeFilterAttr(productAttributeId) {
      if (this.filterProductAttrList.length === 1) {
        this.$message({
          message: "至少要留一个",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      var index = this.filterProductAttrList.indexOf(productAttributeId);
      if (index !== -1) {
        this.filterProductAttrList.splice(index, 1);
      }
    },
    handleAddFilterAttr() {
      if (this.filterProductAttrList.length === 3) {
        this.$message({
          message: "最多添加三个",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.filterProductAttrList.push({
        value: null,
        key: Date.now(),
      });
    },
    //取消添加分类
    cancelCtegory() {
      this.$router.push({ path: "/pms/productCate" });
    },
  },
  filters: {
    filterLabelFilter(index) {
      if (index === 0) {
        return "筛选属性：";
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped></style>
