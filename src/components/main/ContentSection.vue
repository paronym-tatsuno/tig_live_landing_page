<template>
    <div @click="openModal" class="archive-player-modal">
        <!-- TODO: サムネなかったら -->
        <img :src="getThumbnailUrl()" />
        <PlayIcon v-if="customData.cd.displayed_items.length > 0" class="play-icon" />
    </div>
    <div class="archive-detail">
        <!-- TODO: 動的表示 cd.live.start_dateを使う -->
        <div class="live-start">{{ getLiveStartTime(customData.cd.live.start_date) }}配信分</div>
        <div class="live-title">{{ customData.cd.title }}</div>
        <!-- TODO: 動的表示 -->
        <div v-if="customData.cd.description" class="live-description">{{ customData.cd.description }}</div>
    </div>
    <div class="broadcast">
        <!-- 配信ブランドは現在保持しているデータなしのため非表示 -->
        <!-- <div class="brand">配信ブランド</div>
        <div class="logo"><img src="/src/assets/tmp/icons/logo_nitori.png" />ニトリ</div> -->
        <div class="brand">配信企業</div>
        <!-- グループアイコンもデータとしてないので非表示 -->
        <!-- <div class="logo"><img src="/src/assets/tmp/icons/logo_nitori.png" />株式会社ニトリ</div> -->
        <div class="logo">{{ customData.cd.owner_group_name }}</div>
    </div>
</template>

<script setup lang="ts">
import { useTigDataStore } from '@/stores/tigData';
import PlayIcon from '@/components/icon/PlayIcon.vue';

declare global {
    interface Window {
        tigEmbedFloatOpenModal: (overrideStart: number) => void;
    }
}

const customData = useTigDataStore();

const getThumbnailUrl = () => {
    return customData.cd.thumbnail_url;
};

declare const tigPlayer: any;
const openModal = () => {
    if (tigPlayer) {
        // シーク操作
        tigPlayer.postMessage(
            {
                type: 'TigIframe#req#currentTime',
                // time: 0,
            },
            '*'
        );
        if (typeof window.tigEmbedModalLeavePip === 'function') {
            window.tigEmbedModalLeavePip();
        }
    } else {
        // イベントハンドラの処理を記述する
        if (typeof window.tigEmbedFloatOpenModal === 'function') {
            // フローティングをクリックせずにjavascriptから開く (開く箇所の秒数指定可)
            window.tigEmbedFloatOpenModal(0);
        }
    }
};

const getLiveStartTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];

    const formattedDate = `${year}年${month}月${day}日（${weekday}）`;
    return formattedDate;
};
</script>

<style scoped lang="scss">
.archive-player-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0;
    padding-bottom: 10px;
    width: 100%;
    height: 400px;
    position: relative;
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.play-icon {
    height: 50px;
    // height: 50px;
    position: absolute;
    pointer-events: none;
}

.archive-detail {
    background: #fff;
    border-bottom: 1px #ececec solid;
}

.live-start {
    background: #000;
    /* width: auto; */
    display: inline-block;
    color: #fff;
    padding: 3px 10px;
    margin: 16px 0;
    border-radius: 15px;
}

.live-title {
    font-size: 22px;
    font-weight: bold;
    // padding: 5px;
}

.live-description {
    padding: 16px 0;
}

.broadcast {
    background: #fff;
    padding: 10px;
}

.logo {
    padding: 10px;
    display: flex;
    align-items: center;
    img {
        margin-right: 12px;
        width: 64px;
        height: 64px;
    }
}

.brand {
    display: inline-block;
    text-align: center;
    width: 130px;
    padding: 0px 10px;
    margin-top: 10px;
    border: 2px solid transparent;
    border-radius: 20px;
    background: padding-box linear-gradient(white, white),
        border-box
            repeating-linear-gradient(
                90deg,
                rgba(192, 158, 44, 1) 0%,
                rgba(9, 132, 223, 1) 50%,
                rgba(186, 58, 150, 1) 100%
            );
}
</style>
