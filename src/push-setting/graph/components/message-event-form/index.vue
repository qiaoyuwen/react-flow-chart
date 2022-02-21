<template>
  <a-form :form="formRef" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <a-form-item label="触发类型">
      <div>
        <span v-if="form.component && form.component.name" style="margin-right: 12px;">{{ form.component.name }}</span>
        <a-button @click="showComponentsModal">选择</a-button>
      </div>
    </a-form-item>

    <component-selection-modal type="condition" :visible="visible" @cancel="visible = false" @confirm="selectCondition"/>
  </a-form>
</template>

<script>
import { MessageEventShape } from '../../shapes/message-event'
import ComponentSelectionModal from '../component-seletion-modal'

export default {
  name: 'MessageEventForm',
  components: { ComponentSelectionModal },
  props: {
    node: {
      type: MessageEventShape,
      default: null
    }
  },
  data () {
    return {
      formRef: this.$form.createForm(this),
      form: {
        component: {},
        ...this.node.values
      },
      visible: false
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
  },
  methods: {
    showComponentsModal () {
      this.visible = true
    },
    selectCondition (record) {
      this.form.component = record
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
</style>
