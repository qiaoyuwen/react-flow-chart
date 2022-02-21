<template>
  <div class="container">
    <div class="toolbar">
      <a-button type="primary" @click="exportToJson" :loading="loading">保存</a-button>
      <a-button @click="goBack()" style="margin-left: 20px;">返回</a-button>
    </div>
    <div class="content">
      <div class="canvas-content" :style="{width: !!selectedCell ? `calc(100% - ${configSiderWidth}px)` : '100%'}">
        <stencil class="stencil-container" @drag="onDrag"/>
        <tool-bar class="tool-bar-container" />
        <div class="canvas" ref="canvasRef" style="flex: 1;" />
      </div>
      <config-sider
        :style="{width: `${configSiderWidth}px`}"
        v-if="!!selectedCell"
        :cell="selectedCell"
        @confirm="configConfirm"
        @startMove="startMove"
        @moving="moving"/>
    </div>
  </div>
</template>

<script>
import { createDnd, createGraph } from './graph'
import ConfigSider from './graph/components/config-sider'
import Stencil from './graph/components/stencil'
import ToolBar from './graph/components/tool-bar'
import { exportX6GraphToBpmnXml } from './bpmn'
import WorkflowApi from '../service'
import { StartEventShape } from './graph/shapes/start-event'
import { EndEventShape } from './graph/shapes/end-event'
import { MessageEventShape } from './graph/shapes/message-event'
import { ConditionTaskShape } from './graph/shapes/condition-task'
import { CouponTaskShape } from './graph/shapes/coupon-task'
import { MessageEventGroupShape } from './graph/shapes/message-event-group'

export default {
  name: 'PushSetting',
  components: { ConfigSider, Stencil, ToolBar },
  data () {
    return {
      graph: null,
      dnd: null,
      selectedCell: null,
      bizCode: this.$route.params.bizCode,
      loading: false,
      configSiderWidth: 350,
      startConfigSiderWidth: 350,
      startMoveClientX: 0
    }
  },
  mounted () {
    this.initGraph()
    this.initData()
  },
  methods: {
    initGraph () {
      if (
        !this.$refs.canvasRef ||
        (this.graph && this.dnd)
      ) {
        return
      }
      this.graph = createGraph(this.$refs.canvasRef)
      this.graph.on('node:selected', ({ node }) => {
        const parent = node.getParent()
        if (parent) {
          this.selectedCell = parent
          this.graph.cleanSelection()
          this.graph.select(parent)
        } else {
          this.selectedCell = node
        }
      })
      this.graph.on('edge:selected', ({ edge }) => {
        this.selectedCell = edge
      })
      this.graph.on('blank:click', ({ x, y }) => {
        this.selectedCell = null
      })
      this.graph.on('node:removed', () => {
        this.selectedCell = null
      })
      this.graph.on('edge:removed', () => {
        this.selectedCell = null
      })

      this.dnd = createDnd(this.graph)
    },
    initData () {
      if (this.bizCode) {
        WorkflowApi.qryDefaultDefinition({
          bizCode: this.bizCode
        }).then((data) => {
          if (data && data.defBpmndi) {
            this.graph.fromJSON(JSON.parse(data.defBpmndi))
            this.updateEdges()
            this.graph.zoomToFit({
              maxScale: 1,
              padding: {
                top: 20,
                bottom: 20,
                left: 80,
                right: 80
              }
            })
          }
        })
      }
    },
    updateEdges () {
      const edges = this.graph.getEdges()
      edges.forEach((edge) => {
        const edgeView = this.graph.findViewByCell(edge)
        if (edgeView) {
          edgeView.update()
        }
      })
    },
    async exportToJson () {
      if (!this.graph) {
        return
      }

      this.loading = true
      const data = await exportX6GraphToBpmnXml(this.graph).catch((e) => {
        this.$message.warning('数据导出失败')
        this.loading = false
        throw e
      })

      console.log('post data', {
        ...data,
        bizCode: this.bizCode
      })

      WorkflowApi.saveDefinition({
        bizCode: this.bizCode,
        name: 'qyw-test',
        ...data
      }).then(() => {
        this.$message.success('保存成功')
      }).catch(() => {
        this.$message.warning('保存失败')
      }).finally(() => {
        this.loading = false
      })
    },
    goBack () {
      this.$router.back()
    },
    onDrag (e, dataType) {
      let node
      const cells = this.graph.toJSON().cells
      if (dataType === StartEventShape.ShapeKey) {
        const find = cells.find((cell) => cell.shape === 'StartEventShape')
        if (find) {
          this.$message.warning('已存在开始节点')
          return
        }
        node = new StartEventShape()
      }
      if (dataType === EndEventShape.ShapeKey) {
        const find = cells.find((cell) => cell.shape === 'EndEventShape')
        if (find) {
          this.$message.warning('已存在开始节点')
          return
        }
        node = new EndEventShape()
      }
      if (dataType === MessageEventShape.ShapeKey) {
        node = new MessageEventShape()
      }
      if (dataType === ConditionTaskShape.ShapeKey) {
        node = new ConditionTaskShape()
      }
      if (dataType === CouponTaskShape.ShapeKey) {
        node = new CouponTaskShape()
      }
      if (dataType === MessageEventGroupShape.ShapeKey) {
        node = new MessageEventGroupShape()
      }

      if (node) {
        this.dnd.start(node, e)
      }
    },
    configConfirm () {
      this.graph.unselect(this.selectedCell)
      this.selectedCell = null
    },
    startMove (e) {
      this.startConfigSiderWidth = this.configSiderWidth
      this.startMoveClientX = e.clientX
    },
    moving (e) {
      const diff = (this.startMoveClientX - e.clientX)
      if (diff < -100) {
        return
      }
      this.configSiderWidth = this.startConfigSiderWidth + diff
    }
  }
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .toolbar {
    display: flex;
    padding: 24px;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fff;
  }

  .content {
    position: relative;
    display: flex;
    flex: 1;
    min-height: 0;

    .canvas-content {
      position: relative;
      display: flex;
    }
  }
}

.stencil-container {
  position: absolute;
  top: 50px;
  left: 20px;
  z-index: 1;
}

.tool-bar-container {
  position: absolute;
  top: 20px;
  right: 50px;
  z-index: 1;
}

</style>
