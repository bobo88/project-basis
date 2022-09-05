<template>
  <div class="v-application-wrap" :class="'size-' + windowSize">
    <!-- 顶部组件 -->
    <top-com :data-idx="idx" :top-values="topValues" />
    <!-- 右侧导航按钮 -->
    <right-com />
    <!-- <h1 style="position:fixed;top:0;left:50px;z-index:9999;color:#f00;">{{idx}}</h1> -->

    <div class="v-main-wrap">
      <section-frontpage class="container wrapper" id="frontpage" />
      <section-solution class="container wrapper" id="solution" />
      <section-advantage class="container wrapper" id="advantage" />
      <section-scenes class="container wrapper" id="scenes" />
      <section-cloud-guide class="container wrapper" id="cloud-guide" />
      <section-partner class="container wrapper" id="partner" />
    </div>

    <div style="width: 100%;height: 1000px; background:rgba(147, 213, 220, 1);">

    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import TopCom from '@/components/TopCom'
import RightCom from '@/components/RightCom'
import SectionFrontpage from '@/components/SectionFrontpage'
import SectionSolution from '@/components/SectionSolution'
import SectionAdvantage from '@/components/SectionAdvantage'
import SectionScenes from '@/components/SectionScenes'
import SectionCloudGuide from '@/components/SectionCloudGuide'
import SectionPartner from '@/components/SectionPartner'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    TopCom,
    RightCom,
    SectionFrontpage,
    SectionSolution,
    SectionAdvantage,
    SectionScenes,
    SectionCloudGuide,
    SectionPartner,
  },
  data () {
    return {
      idx: 0,
      topValues: {
        data: []
      },
      windowSize: 'small'
    }
  },
  mounted () {
    // 页面特定版块：距离页面顶部的距离
    const frontpage = document.getElementById('frontpage');
    const solution = document.getElementById('solution');
    const advantage = document.getElementById('advantage');
    const scenes = document.getElementById('scenes');
    const cloudGuide = document.getElementById('cloud-guide');
    const partner = document.getElementById('partner');
    this.topValues.data.push(frontpage.offsetTop, solution.offsetTop, advantage.offsetTop, scenes.offsetTop, cloudGuide.offsetTop, partner.offsetTop);
    console.log(588, this.topValues);

    // 页面滚动事件
    const onScroll = () => {
      let top = document.body.scrollTop || document.documentElement.scrollTop;
      // console.log(top);
      let topValuesData = this.topValues.data;
      const topValuesLen = topValuesData.length;
      for(let k = 0; k < topValuesLen; k++) {
        if (k < topValuesLen - 1) {
          (top > topValuesData[k] && top < topValuesData[k+1]) && (this.idx = k);
        } else {
          top > topValuesData[k] && (this.idx = k);
        }
      }
    };
    window.addEventListener("scroll", onScroll);
  },
  methods: {
    // xxx
  }
})
</script>

<style scoped lang='scss'>
  .v-application-wrap {
    padding-top: 110px;
  }
  .v-main-wrap {
    flex: 1 1 auto;
    max-width: 100%;
    position: relative;
  }
</style>
