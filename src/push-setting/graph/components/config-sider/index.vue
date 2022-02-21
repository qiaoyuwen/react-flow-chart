<template>
  <div class="sider">
    <div class="title">配置栏</div>
    <div class="content">
      <boolean-edge-form v-if="isBooleanEdge()" :edge="cell" />
      <condition-task-form v-if="isConditionTaskShape()" :node="cell" />
      <coupon-task-form v-if="isCouponTaskShape()" :node="cell" />
      <message-event-form v-if="isMessageEventShape()" :node="cell" />
      <message-event-group-form v-if="isMessageEventGroupShape()" :node="cell" />
    </div>
    <div class="bottom">
      <a-button type="primary" @click="confirm">确定</a-button>
    </div>
    <div class="drag-line" @mousedown="startMove" />
  </div>
</template>

<script>
import { Cell } from '@antv/x6'
import BooleanEdgeForm from '../boolean-edge-form'
import { BooleanEdge } from '../../edges/boolean-edge'
import ConditionTaskForm from '../condition-task-form'
import MessageEventForm from '../message-event-form'
import { ConditionTaskShape } from '../../shapes/condition-task'
import { CouponTaskShape } from '../../shapes/coupon-task'
import { MessageEventShape } from '../../shapes/message-event'
import CouponTaskForm from '../coupon-task-form'
import MessageEventGroupForm from '../message-event-group-form'
import { MessageEventGroupShape } from '../../shapes/message-event-group'

export default {
  name: 'ConfigSider',
  components: { BooleanEdgeForm, ConditionTaskForm, CouponTaskForm, MessageEventForm, MessageEventGroupForm },
  props: {
    cell: {
      type: Cell,
      default: null
    }
  },
  data () {
    return {
      isMoving: false
    }
  },
  mounted () {
    document.addEventListener('mousemove', this.moving)
    document.addEventListener('mouseup', this.endMove)
  },
  destroyed () {
    document.removeEventListener('mousemove', this.moving)
    document.removeEventListener('mouseup', this.endMove)
  },
  methods: {
    isBooleanEdge () {
      return this.cell instanceof BooleanEdge
    },
    isConditionTaskShape () {
      return this.cell instanceof ConditionTaskShape
    },
    isCouponTaskShape () {
      return this.cell instanceof CouponTaskShape
    },
    isMessageEventShape () {
      return this.cell instanceof MessageEventShape
    },
    isMessageEventGroupShape () {
      return this.cell instanceof MessageEventGroupShape
    },
    confirm () {
      this.$emit('confirm')
    },
    startMove (e) {
      this.isMoving = true
      this.$emit('startMove', e)
    },
    moving (e) {
      if (!this.isMoving) {
        return
      }
      this.$emit('moving', e)
    },
    endMove () {
      if (!this.isMoving) {
        return
      }
      this.isMoving = false
    }
  }
}
</script>

<style scoped lang="less">
.sider {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 100%;
  border: 1px solid #f0f0f0;
  background-color: #fff;
  user-select: none;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    color: #666;
    font-size: 16px;
    background-color: #f5f5f5;
  }

  .content {
    flex: 1;
    padding: 16px;
    overflow: auto;
  }

  .bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }

  .drag-line {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 5px;
    cursor: move;
  }
}
</style>
