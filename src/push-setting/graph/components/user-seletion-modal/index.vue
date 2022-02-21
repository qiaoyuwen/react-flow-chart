<template>
  <a-modal
    title="选择用户"
    :visible="visible"
    :closable="false"
    width="60%">
    <a-table
      ref="table"
      bordered
      :loading="loading"
      :rowKey="(record) => record.userId"
      :columns="columns"
      :pagination="pagination"
      :scroll="{x:tableWidth}"
      @change="paginationChange"
      :data-source="records"
      :row-selection="rowSelection"
    >
      <div slot="index" slot-scope="text, record, index">
        <span>{{ rowIndex(index) }}</span>
      </div>
      <div slot="isVip" slot-scope="text,record">
        <span>{{ record.isVip|isVip }}</span>
      </div>
      <div slot="status" slot-scope="text,record">
        <span v-show="record.status===0" style="color: red">{{ record.status|customerStatus }}</span>
        <span v-show="record.status===1">{{ record.status|customerStatus }}</span>
      </div>
    </a-table>

    <template slot="footer">
      <a-button @click="onCancle">取 消</a-button>
      <a-button type="primary" @click="onConfirm" style="margin-top: 24px;">确 定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { pagination } from '@/mixins'
import { customerStatus, isVip } from '@/filters'
import GuKeApi from '@/modules/gukezhongxin/service'

export default {
  name: 'UserSelectionModal',
  mixins: [pagination],
  filters: { customerStatus, isVip },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    initSelections: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tableRowKey: 'userId',
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: 70,
          fixed: 'left',
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '昵称',
          dataIndex: 'nickName'
        },
        {
          title: '手机号',
          dataIndex: 'tele'
        },
        {
          title: '下单数量',
          dataIndex: 'orderNum',
          sortDirections: ['descend', 'ascend'],
          sorter: (a, b) => a.orderNum - b.orderNum
        },
        {
          title: '消费总金额(元)',
          dataIndex: 'total',
          sortDirections: ['descend', 'ascend'],
          sorter: (a, b) => a.total - b.total
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
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
    },
    initSelections () {
      this.selectedRecords = this.initSelections.map((userId) => {
        return {
          userId
        }
      })
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
          page: this.current,
          limit: this.pageSize,
          ...this.searchConditions
        }
        GuKeApi.qryStoreCustomePage(data).then(resp => {
          this.records = resp.records
          resolve({ total: resp.total, pageNum: resp.current, pageSize: resp.size })
        }, reject)
      })
    },
    onCancle () {
      this.$emit('cancel')
    },
    onConfirm () {
      this.$emit('confirm', this.selectedRecords.map((item) => item.userId))
    }
  }
}
</script>

<style scoped lang="less">
</style>
