<template>
  <a-modal
    title="选择组件"
    :visible="visible"
    :closable="false"
    width="60%">
    <a-menu
      class="tabs e-margin-bottom"
      mode="horizontal"
      type="inner"
      :selectedKeys="selectedKeys"
      @click="onOpenChange"
    >
      <a-menu-item class="tab" key="1">
        <span>进行中</span>
      </a-menu-item>
    </a-menu>
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
      <div slot="couponType" slot-scope="text, record" label="代金券类型">
        <span>
          {{ record.couponType | couponTypeLabel }}
        </span>
      </div>

      <div slot="collectionTime" slot-scope="text, record" label="可领时间">
        <span>
          {{ `${record.startDate} ~ ${record.endDate}` }}
        </span>
      </div>

      <div slot="state" slot-scope="text, record" label="活动状态">
        <span>
          {{ statusEnum[record.state] || "/" }}
        </span>
      </div>

      <div slot="applicableRange" slot-scope="text, record" label="适用场景">
        <span>
          {{ record.applicableRange | applicableRangeLabel }}
        </span>
      </div>

      <div slot="rating" slot-scope="text, record" label="使用率">
        <span>
          {{ `${Number(record.rating * 100).toFixed(2)}%` }}
        </span>
      </div>

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
import DaiJinQuanApi from '../../../../../daijinquan/service'
import { pagination } from '@/mixins'

export default {
  name: 'CouponSelectionModal',
  mixins: [pagination],
  filters: {
    couponTypeLabel (type) {
      if (type === 1) {
        return '无门槛券'
      }
      if (type === 3) {
        return '满减券'
      }
      return '/'
    },
    applicableRangeLabel (type) {
      if (type === 1) {
        return '线上订单'
      }
      if (type === 0) {
        return '线下扫码支付'
      }
      return '/'
    }
  },
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
      state: 1,
      selectedKeys: ['1'],
      columns: [
        {
          title: '代金券ID',
          dataIndex: 'id'
        },
        {
          title: '代金券名称',
          dataIndex: 'activityName'
        },
        {
          title: '代金券类型',
          dataIndex: 'couponType',
          scopedSlots: { customRender: 'couponType' }
        },
        {
          title: '面额',
          dataIndex: 'faceAmountText'
        },
        {
          title: '可领时间',
          dataIndex: 'collectionTime',
          scopedSlots: { customRender: 'collectionTime' }
        },
        {
          title: '活动状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '适用场景',
          dataIndex: 'applicableRange',
          scopedSlots: { customRender: 'applicableRange' }
        },
        {
          title: '使用率',
          dataIndex: 'rating',
          scopedSlots: { customRender: 'rating' }
        },
        {
          title: '操作区',
          dataIndex: '',
          scopedSlots: { customRender: 'action' },
          width: 120
        }
      ],
      records: [],
      statusEnum: [
        '未开始',
        '进行中',
        '已结束',
        '已中止'
      ]
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
          page: this.current,
          limit: this.pageSize,
          state: this.state
        }
        DaiJinQuanApi.getDaiJinQuanListNew(data).then((resp) => {
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
    },
    onOpenChange (openKeys) {
      this.records = []
      this.selectedKeys = [openKeys.key]
      this.state = +openKeys.key
      this.loadRecords()
    }
  }
}
</script>

<style scoped lang="less">
.tabs {
  display: flex;
  padding: 0 30px 2px 5px;
}

.tabs .tab {
  padding: 0 30px 0 30px;
  display: flex;
  cursor: pointer;
}

.tabs .tab.active {
  border-bottom: 1px solid #e2e2e2;
}
</style>
