<template>
    <div class="imgWrap">
      <el-dialog :visible.sync="visible" class="imgPopCls" width="440px" @close="closeDialog">
          <el-carousel ref="carousel"
            v-if="visible"
            indicator-position="none"
            :autoplay="false"
            :initial-index="imgInit" height="440px"
            :loop="false"
            @change="imgChange">
            <el-carousel-item v-for="(item,index) in imgList" :key="item+index" name="index">
              <div class="imgBox">
                <img v-if="item.imgUrl" :src="baseUrl + item.imgUrl" @load="imgLoad" />
                <img v-else :src="defaultImg" @load="imgLoad" />
                <span class="prev" @click="prevImg"></span>
                <span class="next" @click="nextImg"></span>
              </div>
              <div class="userInfo">
                <span class="label">{{item.userName}}</span>
                <el-button v-if="item.bigImgUrl" size="small" @click="viewPicture(item.bigImgUrl)">查看全景图</el-button>
              </div>
            </el-carousel-item>
          </el-carousel>
      </el-dialog>
    </div>
</template>
<script>
import defaultImg from '@/assets/images/no-data.png'
export default {
  data () {
    return {
      visible: false,
      baseUrl: this.$globalConst.apiPrefix,
      imgStart: 0,
      imgEnd: 0,
      imgCur: 0,
      imgInit: 0,
      imgList: {},
      viewPic: false,
      defaultImg: defaultImg
    }
  },
  methods: {
    showData (data) {
      this.visible = true
      this.imgInit = data.imgInit
      this.imgEnd = data.imgEnd
      this.imgList = data.dataList
      this.$nextTick(() => {
        this.$refs.carousel.setActiveItem(this.imgInit)
      })
    },
    viewPicture (bigImg) {
      window.open(this.baseUrl + bigImg)
    },
    imgLoad (event) {
      let _img = event.target
      let imgR = _img.clientWidth / _img.clientHeight
      if (imgR > 1) {
        _img.style.width = '100%'
      } else {
        _img.style.height = '100%'
      }
    },
    imgChange (index, prevIndex) {
      this.imgCur = index
    },
    prevImg () {
      this.$refs.carousel.prev()
      if (this.imgCur === this.imgStart) {
        this.$message({
          type: 'info',
          message: '已是本页第一张！'
        })
      }
    },
    nextImg () {
      this.$refs.carousel.next()
      if (this.imgCur === this.imgEnd || this.imgCur === this.imgList.length - 1) {
        this.$message({
          type: 'info',
          message: '已是本页最后一张！'
        })
      }
    },
    closeDialog () {
      this.viewPic = false
    }
  }
}
</script>

<style scoped>
</style>
