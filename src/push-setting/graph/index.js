/* eslint-disable no-param-reassign */
import { Addon, Graph, Shape } from '@antv/x6'
import { BooleanEdge } from './edges/boolean-edge'
import { BaseShape } from './shapes/base'
import { ConditionTaskShape } from './shapes/condition-task'
import { CouponTaskShape } from './shapes/coupon-task'
import { EndEventShape } from './shapes/end-event'
import { StartEventShape } from './shapes/start-event'
import { MessageEventShape } from './shapes/message-event'
import { MessageEventGroupShape } from './shapes/message-event-group'
import { uid } from './uid'
import { PortGroup } from './ports/types'

// 注册节点
Graph.registerNode(StartEventShape.ShapeKey, StartEventShape)
Graph.registerNode(EndEventShape.ShapeKey, EndEventShape)
Graph.registerNode(ConditionTaskShape.ShapeKey, ConditionTaskShape)
Graph.registerNode(CouponTaskShape.ShapeKey, CouponTaskShape)
Graph.registerNode(MessageEventShape.ShapeKey, MessageEventShape)
Graph.registerNode(MessageEventGroupShape.ShapeKey, MessageEventGroupShape)

// 注册边
Graph.registerEdge(BooleanEdge.ShapeKey, BooleanEdge)

export const createGraph = (container) => {
  const graph = new Graph({
    container,
    autoResize: true,
    background: {
      color: '#fff' // 设置画布背景颜色
    },
    grid: {
      size: 10, // 网格大小 10px
      visible: true // 渲染网格背景
    },
    snapline: true, // 对齐线
    // 限制子节点移动
    translating: {
      restrict (view) {
        if (!view) {
          return null
        }
        const cell = view.cell
        if (!cell) {
          return null
        }
        if (cell.isNode()) {
          const parent = cell.getParent()
          if (parent) {
            return parent.getBBox()
          }
        }
        return null
      }
    },
    selecting: {
      // 点选、框选
      enabled: true,
      rubberband: true,
      showNodeSelectionBox: true,
      showEdgeSelectionBox: true
    },
    highlighting: {
      // 高亮
      magnetAvailable: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#47C769'
          }
        }
      },
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#31d0c6'
          }
        }
      }
    },
    connecting: {
      // 连线
      snap: {
        radius: 30
      },
      allowBlank: false,
      allowMulti: true,
      allowLoop: false,
      highlight: true,
      connector: {
        name: 'rounded',
        args: {
          radius: 8
        }
      },
      router: 'manhattan',
      anchor: 'center',
      connectionPoint: 'anchor',
      createEdge ({ sourceCell }) {
        if (sourceCell instanceof ConditionTaskShape) {
          const edge = (graph.getOutgoingEdges(sourceCell) || [])[0]
          if (edge instanceof BooleanEdge) {
            return new BooleanEdge({
              value: !edge.value
            })
          }
          return new BooleanEdge()
        }
        return new Shape.Edge({
          id: uid(),
          attrs: {
            line: {
              stroke: '#a0a0a0',
              strokeWidth: 1,
              targetMarker: {
                name: 'classic',
                size: 7
              }
            }
          }
        })
      },
      validateConnection ({ targetView, targetMagnet }) {
        if (!targetMagnet) {
          return false
        }

        if (targetView) {
          const node = targetView.cell
          // 结束节点可以随便连
          if (node instanceof EndEventShape) {
            return true
          }
          if (!node.canInEdge) {
            return false
          }
          const canInEdge = node.canInEdge()
          if (!canInEdge) {
            return false
          }

          const usedPortIds = [];
          [
            ...BaseShape.getUsedInPorts(node),
            ...BaseShape.getUsedOutPorts(node)
          ].forEach((item) => {
            if (item.id) {
              usedPortIds.push(item.id)
            }
          })
          const portId = targetMagnet.getAttribute('port')
          if (!portId) {
            return false
          }
          if (usedPortIds.includes(portId)) {
            return false
          }
        }

        return true
      }
    },
    scroller: {
      enabled: true,
      pannable: true,
      modifiers: ['alt']
    },
    mousewheel: {
      enabled: true,
      modifiers: ['alt'],
      minScale: 0.5,
      maxScale: 2
    },
    keyboard: true,
    clipboard: true,
    history: true
  })

  const showOrHidePorts = (ports, show) => {
    ports.forEach((el) => {
      el.style.visibility = show ? 'visible' : 'hidden'
    })
  }

  graph.on('node:added', ({ node, index, options }) => {
    console.log('node:added')
    if (node instanceof MessageEventGroupShape) {
      const { x, y } = node.position()
      const { width } = node.size()

      const messageEventChild = new MessageEventShape({
        x: x + (width / 2) - (80 / 2),
        y: y + 20
      })
      const conditionTaskChild = new ConditionTaskShape({
        x: x + (width / 2) - (100 / 2),
        y: y + 50 + 80 + 20
      })
      node.addChild(messageEventChild)
      node.addChild(conditionTaskChild)

      graph.addEdge(new Shape.Edge({
        id: uid(),
        attrs: {
          line: {
            stroke: '#a0a0a0',
            strokeWidth: 1,
            targetMarker: {
              name: 'classic',
              size: 7
            }
          }
        },
        source: { cell: messageEventChild, port: PortGroup.Bottom },
        target: { cell: conditionTaskChild, port: PortGroup.Top }
      }))
    }
  })

  // 控制连接桩显示/隐藏
  graph.on('node:mouseenter', ({ node, view }) => {
    const shape = node
    if (shape.canOutEdge) {
      const canOutEdge = shape.canOutEdge()
      if (canOutEdge) {
        const usedPortIds = [];
        [
          ...BaseShape.getUsedInPorts(shape),
          ...BaseShape.getUsedOutPorts(shape)
        ].forEach((item) => {
          if (item.id) {
            usedPortIds.push(item.id)
          }
        })

        const portEls = Array.from(
          view.container.querySelectorAll(
            '.x6-port-body'
          )
        ).filter((portEl) => {
          const id = portEl.getAttribute('port')
          if (!id) {
            return false
          }
          return !usedPortIds.includes(id)
        })
        showOrHidePorts(portEls, true)
      }
    } else {
      throw Error(`${node.shape} does not implements BaseShape`)
    }
  })

  graph.on('node:mouseleave', ({ view }) => {
    const portEls = Array.from(
      view.container.querySelectorAll(
        '.x6-port-body'
      )
    )

    showOrHidePorts(portEls, false)
  })

  graph.on('node:click', ({ view }) => {
    const portEls = Array.from(
      view.container.querySelectorAll(
        '.x6-port-body'
      )
    )
    showOrHidePorts(portEls, false)
  })

  // 快捷键与事件
  // copy cut paste
  graph.bindKey(['meta+c', 'ctrl+c'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.copy(cells)
    }
    return false
  })
  graph.bindKey(['meta+x', 'ctrl+x'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.cut(cells)
    }
    return false
  })
  graph.bindKey(['meta+v', 'ctrl+v'], () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 })
      graph.cleanSelection()
      graph.select(cells)
    }
    return false
  })

  // undo redo
  graph.bindKey(['meta+z', 'ctrl+z'], () => {
    if (graph.history.canUndo()) {
      graph.history.undo()
    }
    return false
  })
  graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
    if (graph.history.canRedo()) {
      graph.history.redo()
    }
    return false
  })

  // select all
  graph.bindKey(['meta+a', 'ctrl+a'], () => {
    const nodes = graph.getNodes()
    if (nodes) {
      graph.select(nodes)
    }
  })

  // delete
  graph.bindKey(['backspace', 'del'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.removeCells(cells)
    }
  })

  return graph
}

export const createDnd = (graph) => {
  return new Addon.Dnd({
    target: graph,
    animation: true
  })
}
