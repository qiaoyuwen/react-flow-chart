<template>
  <div>
    <a-form ref="form" :model="form" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="组件类型">
        <span v-if="form.component && form.component.name" style="margin-right: 12px;">{{ form.component.name }}</span>
        <a-button @click="showComponentsModal">选择</a-button>
      </a-form-item>
    </a-form>

    <a-form v-if="form.component && form.component.id && form.component.methodName === 'sendCoupon'" ref="couponForm" :model="couponForm" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="代金券">
        <span v-if="couponForm.coupon && couponForm.coupon.activityName" style="margin-right: 12px;">{{ couponForm.coupon.activityName }}</span>
        <a-button @click="showCouponsModal">选择</a-button>
      </a-form-item>

      <!-- <a-form-item label="用户限制">
        <a-radio-group :options="userLimitsOptions" v-model="couponForm.userLimits" />
      </a-form-item> -->

      <a-form-item v-if="false" label="选取模式">
        <a-radio-group :options="collectionModeOptions" v-model="couponForm.collectionMode" />
      </a-form-item>
    </a-form>

    <a-form v-if="form.component && form.component.id && form.component.methodName === 'sendAppMsg'" ref="appMsgForm" :model="appMsgForm" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="平台标识">
        <a-input
          :clearable="true"
          v-model="appMsgForm.platformId"
          placeholder="平台标识"
        ></a-input>
      </a-form-item>

      <a-form-item label="推送类型">
        <a-radio-group v-model="appMsgForm.pushType" :options="pushTypeOptions">
        </a-radio-group>
      </a-form-item>

      <a-form-item label="消息标题">
        <a-input
          :clearable="true"
          v-model="appMsgForm.messageTitle"
          placeholder="消息标题"
        ></a-input>
      </a-form-item>

      <a-form-item label="消息内容">
        <a-input
          v-model="appMsgForm.messageText"
          type="textarea"
          placeholder="消息内容"
          :max-length="2000"
          show-word-limit
          :auto-size="{ minRows: 4 }"
        ></a-input>
      </a-form-item>

      <template v-if="appMsgForm.pushType === '1'">
        <a-form-item label="转跳类型">
          <a-radio-group v-model="appMsgForm.jumpType" :options="jumpTypeOptions">
          </a-radio-group>
        </a-form-item>

        <a-form-item label="跳转地址">
          <a-input
            :clearable="true"
            v-model="appMsgForm.url"
            placeholder="跳转地址"
          ></a-input>
        </a-form-item>
      </template>

      <template v-if="appMsgForm.pushType === '2'">
        <a-form-item label="吉祥物配置">
        </a-form-item>
        <a-form-item label="收起状态图片">
          <file-uploader
            multi-media-groupid="0"
            v-model="appMsgForm.mascotImg"
            message="仅支持上传jepg、jpg、png格式的图片"
          />
        </a-form-item>

        <a-form-item label="展开状态图片">
          <file-uploader
            multi-media-groupid="0"
            v-model="appMsgForm.advImg"
            message="仅支持上传jepg、jpg、png格式的图片"
          />
        </a-form-item>

        <a-form-item label="背景广告图片">
          <file-uploader
            multi-media-groupid="0"
            v-model="appMsgForm.linkImg"
            message="仅支持上传jepg、jpg、png格式的图片"
          />
        </a-form-item>

        <a-form-item label="广告链接类型">
          <a-select v-model="appMsgForm.linkType" placeholder="广告链接类型">
            <a-select-option value="0">商城链接</a-select-option>
            <a-select-option value="-1">优惠券链接</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="appMsgForm.linkType === '0'" label="广告链接">
          <a-input
            :clearable="true"
            v-model="appMsgForm.link"
            placeholder="广告链接"
          ></a-input>
        </a-form-item>

        <a-form-item v-if="appMsgForm.linkType === '-1'" label="广告链接">
          <span v-if="appMsgForm.link" style="margin-right: 12px;">{{ appMsgForm.link }}</span>
          <a-button @click="showCouponsModal">选择</a-button>
        </a-form-item>
      </template>

      <a-form-item label="有效期至">
        <a-radio-group v-model="appMsgForm.validTimeType" :options="validTimeTypeOptions">
        </a-radio-group>
        <a-date-picker
          v-if="appMsgForm.validTimeType === '2'"
          clearable
          v-model="appMsgForm.validTime"
          format="YYYY-MM-DD HH:mm:ss"
          style="width: auto;"
          :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
        >
        </a-date-picker>
      </a-form-item>

      <a-form-item label="推送目标">
        <a-radio-group v-model="appMsgForm.targetType" :options="targetTypeOptions">
        </a-radio-group>
      </a-form-item>

      <a-form-item label="选择用户" v-if="appMsgForm.targetType === '2'">
        <span style="margin-right: 12px;">{{ appMsgForm.targetList.length === 0 ? '请选择' : `已选择${ appMsgForm.targetList.length }个用户` }}</span>
        <a-button @click="showUserModal">选择</a-button>
        <div>
          <a-icon style="margin-right: 5px;" type="info-circle" />
          <span>此处若选择用户，则将只会向选定用户发送信息。</span>
        </div>
      </a-form-item>

      <a-form-item label="自定义参数" v-if="false">
        <a-input
          v-model="appMsgForm.extra"
          type="textarea"
          placeholder="自定义参数"
          :max-length="2000"
          show-word-limit
          :auto-size="{ minRows: 4 }"
        ></a-input>
      </a-form-item>

      <a-form-item label="推送时间">
        <a-date-picker
          clearable
          v-model="appMsgForm.date"
          format="YYYY-MM-DD HH:mm:ss"
          style="width: auto;"
          :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
        >
        </a-date-picker>
      </a-form-item>
    </a-form>

    <component-selection-modal type="action" :visible="visible" @cancel="visible = false" @confirm="selectCondition"/>
    <coupon-selection-modal :visible="couponModalVisible" @cancel="couponModalVisible = false" @confirm="selectCoupon"/>
    <user-selection-modal :visible="userModalVisible" :init-selections="appMsgForm.targetList" @cancel="userModalVisible = false" @confirm="selectUser"/>
  </div>
</template>

<script>
import { CouponTaskShape } from '../../shapes/coupon-task'
import ComponentSelectionModal from '../component-seletion-modal'
import CouponSelectionModal from '../coupon-seletion-modal'
import UserSelectionModal from '../user-seletion-modal'
import WorkflowApi from '../../../../service'
import moment from 'moment'
import FileUploader from '@/components/FileUploader'

export default {
  name: 'CouponTaskForm',
  components: { ComponentSelectionModal, CouponSelectionModal, UserSelectionModal, FileUploader },
  props: {
    node: {
      type: CouponTaskShape,
      default: null
    }
  },
  data () {
    return {
      moment,
      form: {
        component: {}
      },
      couponForm: {
        coupon: {},
        userLimits: '0',
        collectionMode: 'all'
      },
      appMsgForm: {
        platformId: '',
        pushType: '1',
        messageTitle: '',
        messageText: '',
        mascotImg: [],
        advImg: [],
        linkImg: [],
        linkType: '0',
        link: '',
        jumpType: '1',
        url: '',
        validTimeType: '1',
        validTime: '',
        targetType: '1',
        targetList: [],
        extra: '',
        date: ''
      },
      visible: false,
      couponModalVisible: false,
      userModalVisible: false,
      userLimitsOptions: [
        { label: '普通用户', value: '0' },
        { label: '新用户', value: '1' }
      ],
      collectionModeOptions: [
        { label: '全部', value: 'all' },
        { label: '单例', value: 'singleton' },
        { label: '随机', value: 'random' }
      ],
      pushTypeOptions: [
        { label: '通知', value: '1' },
        { label: '透传', value: '2' }
      ],
      jumpTypeOptions: [
        { label: '打开应用', value: '1' },
        { label: '打开原生页面', value: '2' },
        { label: '打开web页面', value: '3' }
      ],
      targetTypeOptions: [
        { label: '当前用户', value: '1' },
        { label: '指定用户', value: '2' }
      ],
      validTimeTypeOptions: [
        { label: '永久', value: '1' },
        { label: '指定日期', value: '2' }
      ]
    }
  },
  watch: {
     node () {
      this.init()
    },
    form: {
      handler () {
        this.node.changeValues({
          ...this.node.values,
          ...this.form
        })
      },
      deep: true
    },
    couponForm: {
      handler () {
        this.node.changeValues({
          ...this.node.values,
          ...this.couponForm
        })
      },
      deep: true
    },
    appMsgForm: {
      handler () {
        this.node.changeValues({
          ...this.node.values,
          ...this.appMsgForm
        })
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (!this.node.values || !this.node.values.component) {
        this.initForm()
        return
      }
      this.form = {
        component: this.node.values.component
      }
      if (this.node.values.component.methodName === 'sendCoupon') {
        this.couponForm = { ...this.node.values }
      }
      if (this.node.values.component.methodName === 'sendAppMsg') {
        this.appMsgForm = { ...this.node.values }
      }
    },
    initForm () {
      this.form = {
        component: {}
      }
      this.couponForm = {
        coupon: {},
        userLimits: '0',
        collectionMode: 'all'
      }
      this.appMsgForm = {
        platformId: '',
        pushType: '1',
        messageTitle: '',
        messageText: '',
        mascotImg: [],
        advImg: [],
        linkImg: [],
        linkType: '0',
        link: '',
        jumpType: '1',
        url: '',
        validTimeType: '1',
        validTime: '',
        targetType: '1',
        targetList: [],
        extra: '',
        date: ''
      }
    },
    showComponentsModal () {
      this.visible = true
    },
    async selectCondition (record) {
      await this.getComponentDetail(record.id)
      this.visible = false
    },
    async getComponentDetail (id) {
      WorkflowApi.getComponentDetail({
        id
      }).then((data) => {
        this.form.component = {
          id,
          ...data
        }
      })
    },
    showCouponsModal () {
      this.couponModalVisible = true
    },
    selectCoupon (coupon) {
      if (this.form.component && this.form.component.id && this.form.component.methodName === 'sendAppMsg') {
        this.appMsgForm = {
          ...this.appMsgForm,
          link: `/storeCoupon?id=${coupon.id}`
        }
      } else {
        this.couponForm.coupon = coupon
      }
      this.couponModalVisible = false
    },
    showUserModal () {
      this.userModalVisible = true
    },
    selectUser (userIds) {
      this.appMsgForm.targetList = userIds
      this.userModalVisible = false
    }
  }
}
</script>

<style scoped lang="less">
</style>
