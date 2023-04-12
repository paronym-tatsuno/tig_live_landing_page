<template>
    <div class="scroll-top" :class="{ visible: scrollTopVisible }" @click="scrollToTop">
        <BackToPageTopButtonIcon />
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import BackToPageTopButtonIcon from '@/components/icon/BackToPageTopButtonIcon.vue';

const scrollTop = ref(0);
const scrollTopVisible = computed(() => scrollTop.value > 0);

const handleScroll = () => {
    scrollTop.value = window.scrollY;
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

// スクロール時にボタンを表示・非表示を切り替える
window.addEventListener('scroll', handleScroll);

// コンポーネントがアンマウントされるときにイベントリスナーを削除する
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.scroll-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 5000000;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

/* スクロール位置が一定以上になったらボタンを表示する */
.scroll-top.visible {
    opacity: 1;
}
</style>
