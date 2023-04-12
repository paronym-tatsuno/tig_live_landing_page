<template>
    <!-- FIXME: 仮img使用中 -->
    <img src="/src/assets/tmp/icons/header_logo.png" />
    <HamburgerMenuComponent />
</template>

<script setup lang="ts">
import HamburgerMenuComponent from '@/components/header/HamburgerMenuComponent.vue';
</script>

<style scoped lang="scss">
img {
    width: 85px;
    height: 64px;
}
.header-menu {
    position: absolute;
    right: 10px;
    top: 15px;
}
</style>
