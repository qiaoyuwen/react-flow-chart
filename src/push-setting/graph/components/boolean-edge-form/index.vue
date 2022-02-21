<template>
  <a-form ref="form" :model="form" label-width="120px">
    <a-form-item label="条件是否成立">
      <a-switch v-model="form.value"></a-switch>
    </a-form-item>
  </a-form>
</template>

<script>
import { BooleanEdge } from '../../edges/boolean-edge'

export default {
  name: 'BooleanEdgeForm',
  props: {
    edge: {
      type: BooleanEdge,
      default: null
    }
  },
  data () {
    return {
      form: {
        value: this.edge.value
      }
    }
  },
  watch: {
    edge () {
      this.form.value = this.edge.value
    },
    form: {
      handler () {
        this.edge.changeValue(this.form.value)
      },
      deep: true
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
</style>
