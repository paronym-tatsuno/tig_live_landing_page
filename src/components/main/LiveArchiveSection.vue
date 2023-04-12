<template>
    <div class="section-header">
        <div>過去のライブ</div>
        <img class="rainbow_underline" src="/src/assets/tmp/icons/rainbow_underline.png" />
    </div>
    <div
        class="live-archive"
        v-bind:class="{ hiddenItems: index > 9, BlurItems: index === 8 }"
        v-for="(archiveContent, index) in archiveContents"
        :key="'archiveContent' + index">
        <a :href="getArchiveContentUrl(archiveContent.identifier)" target="_blank">
            <img :src="archiveContent.title_image_url" />
        </a>
    </div>
    <div v-if="archiveContents.length > 10" class="more-show-wrapper archive-content-more-show">
        <div @click="moreShow()" class="more-show">
            もっと見る<MoreShowArrowIcon />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import { useTigDataStore } from '@/stores/tigData';
import MoreShowArrowIcon from '@/components/icon/MoreShowArrowIcon.vue';

interface IArchiveContents {
    identifier: string | undefined;
    title: string | undefined;
    title_image_url: string | undefined;
    live_start_date: string | undefined;
    live_end_date: string | undefined;
}

const customData = useTigDataStore();

const archiveContents: Ref<IArchiveContents[]> = ref<IArchiveContents[]>([]);

const emits = defineEmits(['emitsArchiveContents']);

onMounted(() => {
    for (let i = 0; i < customData.liveArchive.archive_contents.length; i++) {
        const archiveContent = customData.liveArchive.archive_contents[i];
        archiveContents.value.push(archiveContent);
    }
    // ライブアーカイブデータを親へ伝播
    emits('emitsArchiveContents', archiveContents.value);
});

const moreShow = () => {
    const moreShow = document.querySelector('.archive-content-more-show.more-show-wrapper') as HTMLElement;
    const hiddenItems = document.querySelectorAll('.live-archive.hiddenItems');
    if (moreShow) {
        moreShow.style.display = 'none';
    }
    for (const el of hiddenItems) {
        (el as HTMLElement).style.display = 'inline-block';
    }
};

const getArchiveContentUrl = (identifier?: string) => {
    return 'https://dev.tigmedia.jp/live/watch?id=' + identifier;
};
</script>

<style scoped lang="scss">
@import '@/assets/more-show-button.scss';
.section-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 24px;
    font-weight: 900;
    .rainbow_underline {
        width: 74px;
        height: 8px;
    }
}

.live-archive {
    width: 50%;
    display: inline-block;
    padding: 10px;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.more-show-wrapper {
    top: -44px;
    padding-top: 50px;
}

.hiddenItems {
    display: none;
}

.BlurItems {
    // .cue-text {
    //     opacity: 0.5;
    // }
}
</style>
