import { StartEventShape } from '../graph/shapes/start-event'
import BpmnModdle from 'bpmn-moddle'
import { BooleanEdge } from '../graph/edges/boolean-edge'
import { EndEventShape } from '../graph/shapes/end-event'
import { ConditionTaskShape } from '../graph/shapes/condition-task'
import { CouponTaskShape } from '../graph/shapes/coupon-task'
import { MessageEventShape } from '../graph/shapes/message-event'
import ZeebePackage from './zeebe.json'
import WorkflowApi from '../../service'
import appConfig from '@/config/app.config'
import { MessageEventGroupShape } from '../graph/shapes/message-event-group'

const moddle = new BpmnModdle({
  zeebe: ZeebePackage
})

// shape
const BpmnStartEvent = moddle.getType('bpmn:StartEvent')
const BpmnEndEvent = moddle.getType('bpmn:EndEvent')
/* const BpmnIntermediateCatchEvent = moddle.getType('bpmn:IntermediateCatchEvent')
const BpmnMessageEventDefinition = moddle.getType('bpmn:MessageEventDefinition')
const BpmnMessage = moddle.getType('bpmn:Message') */
const BpmnExclusiveGateway = moddle.getType('bpmn:ExclusiveGateway')
const BpmnServiceTask = moddle.getType('bpmn:ServiceTask')
const BpmnExtensionElements = moddle.getType('bpmn:ExtensionElements')
// const BpmnExpression = moddle.getType('bpmn:Expression')
const BpmnFormalExpression = moddle.getType('bpmn:FormalExpression')
const ZeebeTaskDefinition = moddle.getType('zeebe:TaskDefinition')
// const ZeebeSubscription = moddle.getType('zeebe:Subscription')

// bpmndi
// const BpmndiBPMNDiagram = moddle.getType('bpmndi:BPMNDiagram')
const BpmndiBPMNPlane = moddle.getType('bpmndi:BPMNPlane')
const BpmndiBPMNEdge = moddle.getType('bpmndi:BPMNEdge')
// const BpmndiBPMNLabel = moddle.getType('bpmndi:BPMNLabel')
const BpmndiBPMNShape = moddle.getType('bpmndi:BPMNShape')
const DcPoint = moddle.getType('dc:Point')
const DcBounds = moddle.getType('dc:Bounds')

// edge
const BpmnSequenceFlow = moddle.getType('bpmn:SequenceFlow')

const DefaultXml = `
<bpmn:definitions
    xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:zeebe="http://camunda.org/schema/zeebe/1.0" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
</bpmn:definitions>
`

const createCells = ({
  cells,
  bpmnProcess,
  definitions
}) => {
  const bmpnNodes = []
  const bmpnEdges = []

  const findSourceBmpnNodeByEdge = (edge) => {
    return bmpnNodes.find((bn) => bn.id.includes(edge.source.cell))
  }

  const findTargetBmpnNodeByEdge = (edge) => {
    return bmpnNodes.find((bn) => bn.id.includes(edge.target.cell))
  }

  // shape
  for (const cell of cells) {
    if (cell.shape === StartEventShape.ShapeKey) {
      bmpnNodes.push(new BpmnStartEvent({ id: `StartEvent_${cell.id}`, name: cell.attrs.text.text }))
    }
    if (cell.shape === EndEventShape.ShapeKey) {
      bmpnNodes.push(new BpmnEndEvent({ id: `EndEvent_${cell.id}`, name: cell.attrs.text.text }))
    }
    if (cell.shape === ConditionTaskShape.ShapeKey) {
      bmpnNodes.push(new BpmnExclusiveGateway({ id: `ExclusiveGateway_${cell.id}`, name: cell.attrs.text.text }))
    }
    if (cell.shape === CouponTaskShape.ShapeKey || cell.shape === MessageEventShape.ShapeKey) {
      const bpmnServiceTask = new BpmnServiceTask({ id: `ServiceTask_${cell.id}`, name: cell.attrs.text.text })
      const bpmnExtensionElements = new BpmnExtensionElements()
      bpmnServiceTask.get('documentation').push(bpmnExtensionElements)
      const zeebeTaskDefinition = new ZeebeTaskDefinition({ type: 'api' })
      bpmnExtensionElements.get('values').push(zeebeTaskDefinition)
      bmpnNodes.push(bpmnServiceTask)
    }
  }

  // edge
  for (const cell of cells) {
    if (cell.shape === 'edge') {
      const bmpnEdge = new BpmnSequenceFlow({ id: `SequenceFlow_${cell.id}`, sourceRef: findSourceBmpnNodeByEdge(cell), targetRef: findTargetBmpnNodeByEdge(cell) })
      bmpnEdges.push(bmpnEdge)
    }
    if (cell.shape === BooleanEdge.ShapeKey) {
      const bmpnEdge = new BpmnSequenceFlow({ id: `SequenceFlow_${cell.id}`, sourceRef: findSourceBmpnNodeByEdge(cell), targetRef: findTargetBmpnNodeByEdge(cell) })
      if (cell.value) {
        const conditionCell = cells.find((item) => cell.source.cell === item.id)
        bmpnEdge.conditionExpression = new BpmnFormalExpression()
        bmpnEdge.conditionExpression.body = `= count${conditionCell.values.compareType}${conditionCell.values.value}`
      }

      bmpnEdges.push(bmpnEdge)
    }
  }

  // 处理依赖
  for (const bmpnNode of bmpnNodes) {
    const incoming = []
    const outgoing = []

    for (const bmpnEdge of bmpnEdges) {
      if (bmpnEdge.targetRef.id === bmpnNode.id) {
        incoming.push(bmpnEdge)
      }
      if (bmpnEdge.sourceRef.id === bmpnNode.id) {
        outgoing.push(bmpnEdge)

        // default分支
        if (bmpnNode.id.includes('ExclusiveGateway_')) {
          let findCell = null
          for (const cell of cells) {
            if (cell.shape === BooleanEdge.ShapeKey && bmpnEdge.id === `SequenceFlow_${cell.id}`) {
              findCell = cell
            }
          }
          if (findCell && !findCell.value) {
            bmpnNode.default = bmpnEdge
          }
        }
      }
    }
    bmpnNode.incoming = incoming
    bmpnNode.outgoing = outgoing
  }

  for (const bmpnNode of bmpnNodes) {
    bpmnProcess.get('documentation').push(bmpnNode)
  }

  for (const bmpnEdge of bmpnEdges) {
    bpmnProcess.get('documentation').push(bmpnEdge)
  }

  return {
    bmpnNodes,
    bmpnEdges
  }
}

const createMessageEventMap = async (cells, messageEventCell) => {
  // 找到所连接的ConditionTask
  let edge
  for (const cell of cells) {
    if (cell.shape === 'edge' && cell.source.cell === messageEventCell.id) {
      edge = cell
    }
  }
  if (!edge) {
    throw (Error('Invalid MessageEventShape'))
  }
  const conditionTaskCell = cells.find((item) => item.id === edge.target.cell)
  if (!conditionTaskCell) {
    throw (Error('Invalid MessageEventShape'))
  }

  const componentDetail = await WorkflowApi.getComponentDetail({
    id: messageEventCell.values.component.id
  })
  const mappingMap = {
    amount: 'amount',
    amountComparator: 'amountComparator'
  }
  const attributeMap = {
    amount: `${conditionTaskCell.values.value}`,
    amountComparator: conditionTaskCell.values.compareType
  }

  const taskMapItem = {
    id: `ServiceTask_${messageEventCell.id}`,
    compentId: messageEventCell.values.component.id,
    className: componentDetail.className,
    mappingMap,
    attributeMap,
    methodName: componentDetail.methodName,
    name: messageEventCell.attrs.text.text,
    parameters: componentDetail.parameters,
    retries: 0,
    transactionType: '0',
    type: 'api'
  }
  return taskMapItem
}

const createTaskCellMap = async (couponTaskCell) => {
  if (!couponTaskCell.values || !couponTaskCell.values.component) {
    return
  }

  if (couponTaskCell.values.component.methodName === 'sendCoupon') {
    return createCouponTaskMap(couponTaskCell)
  }

  if (couponTaskCell.values.component.methodName === 'sendAppMsg') {
    return createAppMsgTaskMap(couponTaskCell)
  }
}

const createCouponTaskMap = async (couponTaskCell) => {
  const componentDetail = await WorkflowApi.getComponentDetail({
    id: couponTaskCell.values.component.id
  })
  const mappingMap = {
    couponId: 'couponId',
    userLimits: 'userLimits',
    collectionMode: 'collectionMode'
  }
  const attributeMap = {
    couponId: `${couponTaskCell.values.coupon.id}`,
    userLimits: couponTaskCell.values.userLimits,
    collectionMode: couponTaskCell.values.collectionMode
  }

  const taskMapItem = {
    id: `ServiceTask_${couponTaskCell.id}`,
    compentId: couponTaskCell.values.component.id,
    className: componentDetail.className,
    mappingMap,
    attributeMap,
    methodName: componentDetail.methodName,
    name: couponTaskCell.attrs.text.text,
    parameters: componentDetail.parameters,
    retries: 0,
    transactionType: '0',
    type: 'api'
  }
  return taskMapItem
}

const createAppMsgTaskMap = async (couponTaskCell) => {
  const componentDetail = await WorkflowApi.getComponentDetail({
    id: couponTaskCell.values.component.id
  })
  const mappingMap = {
    platformId: 'platformId',
    pushType: 'pushType',
    messageTitle: 'messageTitle',
    messageText: 'messageText',
    jumpType: 'jumpType',
    url: 'url',
    targetType: 'targetType',
    targetList: 'targetList',
    extra: 'extra',
    date: 'date'
  }
  let extraObj = {}

  if (componentDetail.methodName === 'sendAppMsg' && couponTaskCell.values.pushType === '2') {
    extraObj = {
      type: 'mascot',
      data: {
        mascotImg: couponTaskCell.values.mascotImg[0] ? appConfig.imgDomain + couponTaskCell.values.mascotImg[0] : '',
        advImg: couponTaskCell.values.advImg[0] ? appConfig.imgDomain + couponTaskCell.values.advImg[0] : '',
        linkImg: couponTaskCell.values.linkImg[0] ? appConfig.imgDomain + couponTaskCell.values.linkImg[0] : '',
        linkData: {
          linkType: '0',
          link: couponTaskCell.values.link
        },
        validTime: couponTaskCell.values.validTimeType === '2' ? couponTaskCell.values.validTime : ''
      }
    }
  }

  const attributeMap = {
    platformId: couponTaskCell.values.platformId,
    pushType: couponTaskCell.values.pushType,
    messageTitle: couponTaskCell.values.messageTitle,
    messageText: couponTaskCell.values.messageText,
    jumpType: couponTaskCell.values.jumpType,
    url: couponTaskCell.values.url,
    targetType: couponTaskCell.values.targetType,
    targetList: couponTaskCell.values.targetList,
    extra: extraObj,
    date: couponTaskCell.values.date
  }

  const taskMapItem = {
    id: `ServiceTask_${couponTaskCell.id}`,
    compentId: couponTaskCell.values.component.id,
    className: componentDetail.className,
    mappingMap,
    attributeMap,
    methodName: componentDetail.methodName,
    name: couponTaskCell.attrs.text.text,
    parameters: componentDetail.parameters,
    retries: 0,
    transactionType: '0',
    type: 'api'
  }
  return taskMapItem
}

const createTaskMap = async (cells) => {
  const taskMap = {}

  for (const cell of cells) {
    if (cell.shape === MessageEventShape.ShapeKey) {
      const item = await createMessageEventMap(cells, cell)
      taskMap[item.id] = item
      continue
    }
    if (cell.shape === CouponTaskShape.ShapeKey) {
      const item = await createTaskCellMap(cell)
      if (item) {
        taskMap[item.id] = item
      }
      continue
    }
  }

  return taskMap
}

const createBpmndiDiagram = (graph, bpmndiDiagram, bmpnNodes, bmpnEdges) => {
  const edges = graph.getEdges()

  for (const edge of edges) {
    const bmpnEdge = bmpnEdges.find((item) => item.id.includes(edge.id))
    const bpmndiBPMNEdge = new BpmndiBPMNEdge({
      id: `${bmpnEdge.id}_di`,
      bpmnElement: bmpnEdge
    })
    bpmndiDiagram.plane.get('planeElement').push(bpmndiBPMNEdge)

    const startPoint = new DcPoint({ ...edge.getSourcePoint() })
    const endPoint = new DcPoint({ ...edge.getTargetPoint() })
    bpmndiBPMNEdge.get('waypoint').push(startPoint)
    bpmndiBPMNEdge.get('waypoint').push(endPoint)
  }

  const nodes = graph.getNodes()

  for (const node of nodes) {
    if (node instanceof MessageEventGroupShape) {
      // 跳过分组节点
      continue
    }
    const bmpnNode = bmpnNodes.find((item) => item.id.includes(node.id))

    const bpmndiBPMNShape = new BpmndiBPMNShape({
      id: `${bmpnNode.id}_di`,
      bpmnElement: bmpnNode
    })
    bpmndiDiagram.plane.get('planeElement').push(bpmndiBPMNShape)

    bpmndiBPMNShape.bounds = new DcBounds({
      ...node.position(),
      ...node.size()
    })
  }
}

export const exportX6GraphToBpmnXml = async (graph) => {
  const graphJson = graph.toJSON()
  const cells = graphJson.cells

  const {
    rootElement: definitions
  } = await moddle.fromXML(DefaultXml)

  const bpmnProcess = moddle.create('bpmn:Process', { id: 'Process' })
  const bpmndiDiagram = moddle.create('bpmndi:BPMNDiagram', { id: 'BPMNDiagram' })
  bpmndiDiagram.plane = new BpmndiBPMNPlane({
    id: 'BpmnPlane',
    bpmnElement: bpmnProcess
  })
  definitions.get('rootElements').push(bpmnProcess)
  definitions.get('rootElements').push(bpmndiDiagram)

  const {
    bmpnNodes,
    bmpnEdges
  } = createCells({
    cells,
    bpmnProcess,
    definitions
  })

  createBpmndiDiagram(graph, bpmndiDiagram, bmpnNodes, bmpnEdges)

  const {
    xml: xmlStrUpdated
  } = await moddle.toXML(definitions)
  const xml = (xmlStrUpdated || '').replace('bpmn:', 'bpmn2:')

  // defSettingInfo
  const taskMap = await createTaskMap(cells)

  return {
    defBpmn: xml,
    defBpmndi: JSON.stringify(graphJson),
    defSettingInfo: {
      taskMap
    }
  }
}
