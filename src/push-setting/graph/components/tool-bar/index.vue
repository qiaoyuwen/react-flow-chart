<template>
  <div class="tool-bar">
    <a-tooltip class="item" placement="bottom">
      <template slot="title">
        <span>快捷键</span>
      </template>
      <div class="item" @click="visible=true">
        <a-icon type="question-circle" />
      </div>
    </a-tooltip>

    <a-modal
      title="快捷键"
      :visible="visible"
      :mask="false"
      @cancel="handleClose"
      :footer="null">
      <div class="shortcut-item">
        <span class="title">复制</span>
        <span class="content">ctrl + c</span>
      </div>

      <div class="shortcut-item">
        <span class="title">剪切</span>
        <span class="content">ctrl + x</span>
      </div>

      <div class="shortcut-item">
        <span class="title">粘贴</span>
        <span class="content">ctrl + v</span>
      </div>

      <div class="shortcut-item">
        <span class="title">撤销</span>
        <span class="content">ctrl + z</span>
      </div>

      <div class="shortcut-item">
        <span class="title">重做</span>
        <span class="content">ctrl + shift + z</span>
      </div>

      <div class="shortcut-item">
        <span class="title">全选</span>
        <span class="content">ctrl + a</span>
      </div>

      <div class="shortcut-item">
        <span class="title">删除</span>
        <span class="content">backspace | delete</span>
      </div>

      <div class="shortcut-item">
        <span class="title">移动画布</span>
        <span class="content">alt + 鼠标左键</span>
      </div>

      <div class="shortcut-item">
        <span class="title">缩放画布</span>
        <span class="content">alt + 鼠标滚轮</span>
      </div>

    </a-modal>
  </div>
</template>

<script>
import '../../../bpmn/bpmn.css'

export default {
  name: 'ToolBar',
  data () {
    return {
      visible: false
    }
  },
  mounted () {
  },
  methods: {
    handleClose () {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
  .tool-bar {
    display: flex;
    align-items: center;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 38px;
      background: #FAFAFA;
      border-radius: 2px;
      border: solid 1px #E0E0E0;
      color: #555;
      font-size: 20px;
    }

    .item:hover {
      color: #333;
    }
  }

  .shortcut-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-size: 16px;

    .title {
      width: 100px;
    }
  }
</style>
