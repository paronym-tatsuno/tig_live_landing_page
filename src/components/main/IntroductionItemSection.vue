<template>
    <div class="section-header">
        <div>紹介アイテム</div>
        <img class="rainbow_underline" src="/src/assets/tmp/icons/rainbow_underline.png" />
    </div>
    <div
        class="introduceItem"
        v-bind:class="{ hiddenItems: index > 1, BlurItems: index === 1 }"
        v-for="(item, index) in items"
        :key="'item' + index">
        <div>
            <div>
                <a class="link" :href="item.url" target="_blank">
                    <div class="item-img">
                        <img :src="item.thumbnail_url" />
                    </div>
                    <div class="item-info">
                        <div class="title">
                            <span class="">{{ item.itemTitle }}</span>
                        </div>
                        <span class="price">¥1,790~</span>
                    </div>
                </a>
            </div>
            <div @click="openModal(item.seconds)" class="introduction-time">
                <div class="left"><CueStartIcon2 />紹介時間</div>
                <div class="right">{{ item.start }}</div>
            </div>
        </div>
    </div>
    <div v-if="items.length > 2" class="more-show-wrapper introduceItem-more-show">
        <div @click="moreShow()" class="more-show">
        もっと見る<MoreShowArrowIcon />
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import { useTigDataStore } from '@/stores/tigData';
import CueStartIcon2 from '@/components/icon/CueStartIcon2.vue';
import MoreShowArrowIcon from '@/components/icon/MoreShowArrowIcon.vue';

interface IItem {
    seconds: number;
    start: string;
    end: string | undefined;
    itemTitle: string | undefined;
    thumbnail_url: string | undefined;
    url: string | undefined;
}

const customData = useTigDataStore();

const items: Ref<IItem[]> = ref<IItem[]>([]);

const emits = defineEmits(['emitsItems']);

onMounted(() => {
    for (let i = 0; i < customData.cd.displayed_items.length; i++) {
        const displayed_item = customData.cd.displayed_items[i];

        // 秒数の小数点を削る
        console.log(displayed_item)
        console.log(displayed_item.time)
        let timeInSeconds = displayed_item.time;

        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        if (timeInSeconds >= 3600) {
            hours = Math.floor(timeInSeconds / 3600);
            timeInSeconds = timeInSeconds % 3600;
        }

        if (timeInSeconds >= 60) {
            minutes = Math.floor(timeInSeconds / 60);
            seconds = Math.floor(timeInSeconds % 60);
        } else {
            seconds = Math.floor(timeInSeconds);
        }

        // (h:)mm:ssフォーマットへ変換
        let formattedTime = '';
        if (hours > 0) {
            formattedTime += hours.toString() + ':';
        }

        if (minutes < 10) {
            formattedTime += '0';
        }
        formattedTime += minutes.toString() + ':';

        if (seconds < 10) {
            formattedTime += '0';
        }
        formattedTime += seconds.toString();

        // displayed_itemsのidをキーにitemsから該当itemを拾う
        const matched_item = customData.cd.items.find((item) => item.id === displayed_item.id);

        let url = undefined;
        if (matched_item?.url) {
            url = matched_item.url;
        }

        items.value.push({
            seconds: timeInSeconds,
            start: formattedTime,
            end: undefined,
            itemTitle: matched_item?.title,
            thumbnail_url: matched_item?.thumbnail_url,
            url: url,
        });
    }

    // 時間で昇順
    items.value.sort((a, b) => {
        const timeA = a.start.split(':').map(Number);
        const timeB = b.start.split(':').map(Number);
        if (timeA.length === 2) timeA.unshift(0);
        if (timeB.length === 2) timeB.unshift(0);
        if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
        if (timeA[1] !== timeB[1]) return timeA[1] - timeB[1];
        return timeA[2] - timeB[2];
    });

    // トークアーカイブデータを親へ伝播
    emits('emitsItems', items.value);
});

const moreShow = () => {
    const moreShow = document.querySelector('.introduceItem-more-show.more-show-wrapper') as HTMLElement;
    const hiddenItems = document.querySelectorAll('.introduceItem.hiddenItems');
    if (moreShow) {
        moreShow.style.display = 'none';
    }
    for (const el of hiddenItems) {
        (el as HTMLElement).style.display = 'inline-block';
    }
};

declare const tigPlayer: any;
const openModal = (t: number) => {
    if (tigPlayer) {
        // シーク操作
        tigPlayer.postMessage(
            {
                type: 'TigIframe#req#currentTime',
                time: t,
            },
            '*'
        );
        if (typeof window.tigEmbedModalLeavePip === 'function') {
            window.tigEmbedModalLeavePip();
        }
    } else {
        if (typeof window.tigEmbedFloatOpenModal === 'function') {
            // フローティングをクリックせずにjavascriptから開く (開く箇所の秒数指定可)
            window.tigEmbedFloatOpenModal(t);
        }
    }
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

.cue-item {
    width: 90%;
    margin: 0 auto;
    border-bottom: 1px #ececec solid;
    padding: 5px 0;
}

.introduceItem {
    width: 50%;
    display: inline-block;
    padding: 10px;
}

.cue-start {
    margin-left: 3px;
    color: #1282f4;
    font-weight: 500;
}

.cue-text {
    margin-bottom: 3px;
}

.item-img {
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.item-info {
    display: inline-block;
    width: 100%;
    margin-bottom: 10px;
    .title {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 3em;
    }
    .price {
        float: right;
        font-weight: 700;
    }
}

.more-show-wrapper {
    top: -55px;
    padding-top: 50px;
}

.introduction-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    height: 44px;
    // border: 1px #b0b0b0 solid;
    border-radius: 30px;
    font-size: 13px;
    margin: 0 auto;
    padding: 0 10px;
    color: #fff;
    background: #1282f4;
    // margin-bottom: 30px;
    // backdrop-filter: blur(5px);
    .fas {
        position: relative;
        left: 45px;
    }
    .left {
        display: flex;
        align-items: center;
        svg {
            margin-right: 5px;
        }
    }
}

.hiddenItems {
    display: none;
}

.BlurItems {
    .cue-text {
        opacity: 0.5;
    }
}
</style>
