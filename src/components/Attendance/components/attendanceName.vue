<template>
  <el-select
    filterable
    clearable
    v-model="currentValue"
    placeholder="请选择考勤名称"
    :style="{width:width+'px'}">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<style scoped></style>
<script>
import { getAttendanceNameList } from '@/axios/api.js'

export default {
  data () {
    return {
      options: []
    }
  },
  model: {
    prop: 'attendanceId',
    event: 'cc'
  },
  props: {
    attendanceId: {},
    width: {
      default: 197
    }
  },
  computed: {
    currentValue: {
      get () {
        return this.attendanceId
      },
      set (val) {
        this.$emit('cc', val)
        return val
      }
    }
  },
  created () {
    getAttendanceNameList().then((res) => {
      for (const i of res.data.value) {
        this.options.push({
          value: i.id,
          label: i.atName
        })
      }
      if (this.currentValue === 0) { this.currentValue = res.data[0].id }
    })
  }
}
</script>
