<template>
    <div class="error-message">
        <p>お探しのページは削除されたか、存在しないため見つかりませんでした。</p>
    </div>
</template>

<style scoped lang="scss">
.error-message {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    background: #000;
    color: #fff;
    font-size: 24px;
}
</style>
