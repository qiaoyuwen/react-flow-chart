<template>
  <a-modal
    title="选择组件"
    :visible="visible"
    :closable="false"
    width="60%">
    <a-table
      ref="table"
      size="middle"
      bordered
      :columns="columns"
      :rowKey="(record) => record.id"
      :pagination="pagination"
      :scroll="{ x: tableWidth }"
      @change="paginationChange"
      :data-source="records"
    >
      <div slot="action" slot-scope="text, record">
        <a-button
          type="link"
          size="small"
          @click="onConfirm(record)"
        >
          选择
        </a-button>
      </div>
    </a-table>
    <template slot="footer">
      <a-button @click="onCancle">取 消</a-button>
    </template>
  </a-modal>
</template>

<script>
import WorkflowApi from '../../../../service'
import { pagination } from '@/mixins'

export default {
  name: 'ComponentSelectionModal',
  mixins: [pagination],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      columns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '模块',
          dataIndex: 'module'
        },
        {
          title: '类型',
          dataIndex: 'nodeType'
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '版本',
          dataIndex: 'version'
        },
        {
          title: '操作区',
          dataIndex: '',
          scopedSlots: { customRender: 'action' },
          width: 120
        }
      ],
      records: []
    }
  },
  watch: {
    visible () {
      if (this.visible) {
        this.init()
      }
    }
  },
  mounted () {
  },
  methods: {
    init () {
      this.loadRecords()
    },
    loadRecords () {
      this.loadRecordsPromise((resolve, reject) => {
        const data = {
          pageNum: this.current,
          pageSize: this.pageSize,
          nodeType: this.type
        }
        WorkflowApi.getComponentPage(data).then((resp) => {
          this.records = resp.records
          resolve({ total: resp.total, pageNum: resp.current, pageSize: resp.size })
        }, reject)
      })
    },
    onCancle () {
      this.$emit('cancel')
    },
    onConfirm (record) {
      this.$emit('confirm', record)
    }
  }
}
</script>

<style scoped lang="less">
</style>
