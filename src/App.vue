<template>
    <div v-if="customData.error">
        <ErrorComponent />
    </div>
    <div v-else>
        <header>
            <HeaderComponent />
        </header>

        <main>
            <section class="section content-first-view">
                <ContentSection />
            </section>
            <section v-if="showTalkArchiveSection" class="section">
                <TalkArchiveSection @emitsCues="checkExistCues" />
            </section>
            <section v-if="showIntroductionItemSection" class="section">
                <IntroductionItemSection @emitsItems="checkExistIntroductionItem" />
            </section>
            <section v-if="showPerformerSection" class="section">
                <PerformerSection @emitsPerformers="checkExistPerformer" />
            </section>
            <section v-if="showLiveArchiveSection" class="section">
                <LiveArchiveSection @emitsArchiveContents="checkExistLiveArchive" />
            </section>
        </main>

        <footer>
            <FooterComponent />
        </footer>

        <BackToPageTopButtonComponent />
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useTigDataStore } from '@/stores/tigData';
import HeaderComponent from '@/components/header/HeaderComponent.vue';
import ContentSection from '@/components/main/ContentSection.vue';
import IntroductionItemSection from '@/components/main/IntroductionItemSection.vue';
import TalkArchiveSection from '@/components/main/TalkArchiveSection.vue';
import PerformerSection from '@/components/main/PerformerSection.vue';
import LiveArchiveSection from '@/components/main/LiveArchiveSection.vue';
import FooterComponent from '@/components/footer/FooterComponent.vue';
import BackToPageTopButtonComponent from '@/components/helper/BackToPageTopButtonComponent.vue';
import ErrorComponent from '@/components/error/ErrorComponent.vue';

const customData = useTigDataStore();
const showTalkArchiveSection: Ref<boolean> = ref<boolean>(true);
const showIntroductionItemSection: Ref<boolean> = ref<boolean>(true);
const showPerformerSection: Ref<boolean> = ref<boolean>(true);
const showLiveArchiveSection: Ref<boolean> = ref<boolean>(true);

const checkExistCues = (cuesArray: []) => {
    console.log('showTalkArchiveSectionの状態。');
    console.log(showTalkArchiveSection.value);
    if (cuesArray.length === 0) {
        console.log('showTalkArchiveSectionをfalseにします');
        showTalkArchiveSection.value = false
        console.log(showTalkArchiveSection.value);
    }
};
const checkExistIntroductionItem = (itemsArray: []) => {
    if (itemsArray.length === 0) {
        showIntroductionItemSection.value = false
    }
};
const checkExistPerformer = (performersArray: []) => {
    if (performersArray.length === 0) {
        showPerformerSection.value = false
    }
};
const checkExistLiveArchive = (liveArchivesArray: []) => {
    if (liveArchivesArray.length === 0) {
        showLiveArchiveSection.value = false
    }
};
</script>

<style scoped lang="scss">
header {
    position: sticky;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.15);
    z-index: 1; /* pipのz-indexが5002なのでそれを超えないように設定 */
    background: #fff;
}

main {
    padding-bottom: 110px;
}

.section {
    width: 100%;
    padding: 0 16px;
    /* margin-bottom: 25px; */
    margin-bottom: 20px;
    background: #fff;
    box-shadow: 0px 15px 10px -10px #dddddd;
}

.content-first-view {
    /* padding: 15px 0; */
    /* background: #fafafa; */
}

footer {
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 110px;
    padding: 0 20px;
    /* z-index: 5000000; */
    background: #000;
}
</style>
