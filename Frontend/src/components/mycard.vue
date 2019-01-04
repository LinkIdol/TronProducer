<template>
  <div class="card">
    <div class="card-outer">
      <div class="card-inner">
        <div class="card-top">
          <span>第14世代</span>
          <div class="favorite-outer">
            <font-awesome-icon icon="heart" style="color: #BD5657;"/>
          </div>
        </div>
        <div class="card-middle">
          <div class="star-outer">
            <el-rate v-model="stars" style="display: flex;flex-direction: row-reverse;"></el-rate>
            <!--<i class="el-icon-star-off"></i>
            <i class="el-icon-star-off"></i>-->
          </div>
          <div class="image-outer">
            <div class="image-inner">
              <img src="https://img.crypko.ai/daisy/03b2239f442b83f6516ead0461328346e1bf3422_sm.jpg" class="avatar-img">
            </div>
          </div>
        </div>
        <div class="card-below">
          <div>
            <span>银发 黑色眼瞳 短发 微笑</span>
          </div>
          <div>
            <span>灰发 紫色眼瞳 长发 帽子</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',
  props: {
    msg: String
  },
  data() {
    return {
        stars: 2
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
  .favorite-outer {
    float: right;
  }
  .card-top {
    padding: 2px 4px;
    box-shadow:0 0 8px #9328d4;
    color: #fff;
  }
  .card-middle {
    padding: 0 10px;
    margin-bottom: 10px;
  }
  .star-outer {
    text-align: right;
    margin: 4px 0;
    /*color: #FFB884;*/
  }
  .image-inner {
    height: 140px;
    width: 140px;
    position: relative;
  }
  .image-outer {
    /*padding: 4px;*/
    background-color: #777285;
    box-shadow:0 0 8px #9328d4;
  }
  .avatar-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    z-index: 1;
    transition-duration: .3s;
    transition-property: all;
    transition-timing-function: ease-out;
    transform: translateZ(0);
  }
  .card-below {
    padding: 6px 10px;
    background: linear-gradient(20deg, #C06EF2, #f79f5f);
    font-size: 10px;
    color: #fff;
  }
  .card-outer {
    width: auto;
    padding: 6px;
    background: linear-gradient(135deg, #f79f5f, #9328d4);
    border-radius: 4px;
  }
  .card-inner {
    padding: 12px;
    width: 160px;
    background: linear-gradient(135deg, #C06EF2, #FFB884);
  }
</style>
<style>
  .el-rate__icon {
    margin-right: 0;
  }
</style>
