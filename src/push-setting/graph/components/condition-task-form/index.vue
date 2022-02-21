<template>
  <a-form :form="formRef" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-form-item label="比较类型">
      <a-select v-model="form.compareType" placeholder="请选择比较类型">
        <a-select-option :key="option.value" v-for="option of CompareTypeOptions" :value="option.value">{{ option.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="条件值">
      <a-input-number v-model="form.value" controls-position="right" :min="0" style="max-width: 166px;" />
    </a-form-item>
  </a-form>
</template>

<script>
import { ConditionTaskShape } from '../../shapes/condition-task'
import {
  CompareTypeOptions
} from './constant'

export default {
  name: 'ConditionTaskForm',
  props: {
    node: {
      type: ConditionTaskShape,
      default: null
    }
  },
  data () {
    return {
      formRef: this.$form.createForm(this),
      CompareTypeOptions,
      form: {
        ...this.node.values
      }
    }
  },
  watch: {
    node () {
      this.form = { ...this.node.values }
    },
    form: {
      handler () {
        this.node.changeValues(this.form)
      },
      deep: true
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
</style>
