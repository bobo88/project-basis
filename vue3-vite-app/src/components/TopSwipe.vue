<template>
  <div class="top-swiper">
    <swiper
      :modules="modules"
      :freeMode="true"
      slides-per-view="auto"
      :space-between="15"
    >
      <swiper-slide
        v-for="item in props.list"
        :key="item.id"
        class="slide-item"
      >
        <van-image class="icon" :src="item.icon" :alt="item.name"></van-image>
        <span class="name">{{ item.name }}</span>
        <span class="category">{{ item.category }}</span>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/free-mode'
import { FreeMode } from 'swiper'
import { ref } from 'vue'
const modules = [FreeMode]
const props = defineProps({
  list: Object
})
const testData = ref(123)
console.log(testData)
</script>

<style lang="scss">
.top-swiper {
  padding: 0 15px;
  border-bottom: 1px solid var(--color-border);
}
.slide-item {
  padding: 0 0 5px;
  width: 90px;
  text-align: center;
  .icon {
    display: block;
    width: 90px;
    height: 90px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
  }
  .name {
    display: block;
    line-height: 20px;
    color: var(--color-text);
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .category {
    line-height: 20px;
    color: var(--color-text-light);
    font-size: 14px;
  }
}
</style>
