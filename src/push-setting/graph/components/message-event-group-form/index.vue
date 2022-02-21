<template>
  <div>
    <message-event-form v-if="messageEventNode" :node="messageEventNode" />
    <condition-task-form v-if="conditionTaskNode" :node="conditionTaskNode" />
  </div>
</template>

<script>
import { MessageEventShape } from '../../shapes/message-event'
import { MessageEventGroupShape } from '../../shapes/message-event-group'
import MessageEventForm from '../message-event-form'
import ConditionTaskForm from '../condition-task-form'
import { ConditionTaskShape } from '../../shapes/condition-task'

export default {
  name: 'MessageEventGroupForm',
  components: { MessageEventForm, ConditionTaskForm },
  props: {
    node: {
      type: MessageEventGroupShape,
      default: null
    }
  },
  data () {
    return {
      messageEventNode: null,
      conditionTaskNode: null
    }
  },
  watch: {
    node () {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (!this.node) {
        return
      }
      const children = this.node.getChildren()
      children.forEach((child) => {
        if (child instanceof MessageEventShape) {
          this.messageEventNode = child
        }
        if (child instanceof ConditionTaskShape) {
          this.conditionTaskNode = child
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
