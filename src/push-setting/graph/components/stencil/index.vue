<template>
  <div class="stencil" @mousedown="onMouseDown">
    <a-tooltip class="item" content="开始" placement="right">
      <template slot="title">
        <span>开始</span>
      </template>
      <div :data-type="StartEventShape.ShapeKey" class="item bpmn-icon-start-event-none"/>
    </a-tooltip>

    <a-tooltip class="item" content="结束" placement="right">
      <template slot="title">
        <span>结束</span>
      </template>
      <div :data-type="EndEventShape.ShapeKey" class="item bpmn-icon-end-event-none"/>
    </a-tooltip>

    <a-tooltip class="item" content="触发器组" placement="right">
      <template slot="title">
        <span>触发器组</span>
      </template>
      <div :data-type="MessageEventGroupShape.ShapeKey" class="item bpmn-icon-intermediate-event-none"/>
    </a-tooltip>

    <a-tooltip class="item" content="任务框" placement="right">
      <template slot="title">
        <span>任务框</span>
      </template>
      <div :data-type="CouponTaskShape.ShapeKey" class="item bpmn-icon-task"/>
    </a-tooltip>
  </div>
</template>

<script>
import '../../../bpmn/bpmn.css'
import { StartEventShape } from '../../../graph/shapes/start-event'
import { EndEventShape } from '../../../graph/shapes/end-event'
import { MessageEventShape } from '../../../graph/shapes/message-event'
import { ConditionTaskShape } from '../../../graph/shapes/condition-task'
import { CouponTaskShape } from '../../../graph/shapes/coupon-task'
import { MessageEventGroupShape } from '../../../graph/shapes/message-event-group'

export default {
  name: 'Stencil',
  data () {
    return {
      StartEventShape,
      EndEventShape,
      MessageEventShape,
      ConditionTaskShape,
      CouponTaskShape,
      MessageEventGroupShape
    }
  },
  mounted () {
  },
  methods: {
    onMouseDown (e) {
      const el = e.target
      if (!el) {
        return
      }
      const DataTypeProperty = 'data-type'
      const dataType = el.getAttribute(DataTypeProperty)
      if (dataType) {
        this.$emit('drag', e, dataType)
      }
    }
  }
}
</script>

<style scoped lang="less">
  .stencil {
    width: 48px;
    min-height: 500px;
    background: #fafafa;
    border: solid 1px #ccc;
    border-radius: 2px;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 46px;
      height: 46px;
      font-size: 30px;
      cursor: grab;
    }

    .item:hover {
      color: #E25A41;
    }
  }
</style>
