<template>
    <div class="section-header">
        <div>トークアーカイブ</div>
        <img class="rainbow_underline" src="/src/assets/tmp/icons/rainbow_underline.png" />
    </div>
    <div
        class="cue-item"
        v-for="(cue, index) in cues"
        v-bind:class="{ hiddenItems: index > 5, BlurItems: index === 5, caption: cue.text, item: !cue.text }"
        :key="'archive' + index">
        <!-- キャプション -->
        <div v-if="cue.text">
            <!-- FIXME: 仮font-awesome使用中 -->
            <div @click="openModal(cue.seconds)" class="cue-start">
                <CueStartIcon />
                <span>{{ cue.start }}</span>
            </div>
            <span class="cue-text">{{ cue.text }}</span>
        </div>
        <!-- アイテム紹介 -->
        <div v-else>
            <a :href="cue.url" target="_blank">
                <img class="item-img" :src="cue.thumbnail_url" />
            </a>
            <div class="item-info">
                <div @click="openModal(cue.seconds)" class="cue-start">
                    <CueStartIcon />
                    <span>{{ cue.start }}</span>
                </div>
                <a :href="cue.url" target="_blank">
                    <div class="title">
                        <span class="">{{ cue.itemTitle }}</span>
                    </div>
                    <span class="price">¥1,790~</span>
                </a>
            </div>
        </div>
    </div>
    <div v-if="cues.length > 5" class="more-show-wrapper talk-archive-more-show">
        <div @click="moreShow()" class="more-show">もっと見る<MoreShowArrowIcon /></div>
    </div>
</template>

<script setup lang="ts">
// import Vue from 'vue';
import { ref, type Ref, onMounted } from 'vue';
import { useTigDataStore } from '@/stores/tigData';
import CueStartIcon from '@/components/icon/CueStartIcon.vue';
import MoreShowArrowIcon from '@/components/icon/MoreShowArrowIcon.vue';

interface ICue {
    seconds: number;
    start: string;
    end: string | undefined;
    text: string | undefined;
    itemTitle: string | undefined;
    thumbnail_url: string | undefined;
    url: string | undefined;
}

const customData = useTigDataStore();

const cues: Ref<ICue[]> = ref<ICue[]>([]);
const emits = defineEmits(['emitsCues']);

onMounted(() => {
    const xhr = new XMLHttpRequest();
    /*
    【TODO】
    ・IF定義
    ・subtitles配列には多言語含まれる想定だが、lang=jaのものだけを採用する(langをパラメータとかで選べれば良さげだがとりあえずいいか)
    ・videos配列も先頭使用でいい？
    */
    const captionURL = customData.cd.videos[0].subtitles[0]?.url;
    console.log('captionURL');
    console.log(captionURL);

    if (!captionURL) {
        emits('emitsCues', cues.value);
        return;
    }

    xhr.open('GET', captionURL);
    xhr.onload = function () {
        if (xhr.status === 200) {
            // 正規表現で時間とテキストを抽出しながらキュー毎に配列へ格納
            //const regExp = /(\d{2}:\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}:\d{2}.\d{3})\n(.+?(?=\n\n|$))/g;
            const regExp = /(\d{1,2}(:\d{2}){1,2}.\d{3}) --> (\d{1,2}(:\d{2}){1,2}.\d{3})\n(.+?(?=\n\n|$))/g;

            let match;
            while ((match = regExp.exec(xhr.responseText)) !== null) {
                const start = match[1];
                const end = match[3];
                const text = match[5];
                // 時間のフォーマット変換処理
                // hh:mm:ss形式の時間文字列
                const timeString = match[1];

                const timeParts = timeString.split(':').reverse(); // 時間文字列を分解し、配列を逆にする
                let totalMilliseconds = 0;
                for (let i = 0; i < timeParts.length; i++) {
                    const timePartInMilliseconds = parseFloat(timeParts[i]) * Math.pow(60, i) * 1000;
                    totalMilliseconds += timePartInMilliseconds;
                }

                // ミリ秒を秒に変換
                let seconds = Math.floor(totalMilliseconds / 1000);

                // 分を計算
                let minutes = Math.floor(seconds / 60);
                seconds = seconds % 60;

                // 時を計算
                let hours = Math.floor(minutes / 60);
                minutes = minutes % 60;

                // mm:ss形式またはh:mm:ss形式に変換
                let formattedTime =
                    (hours > 0 ? hours + ':' : '') +
                    (minutes < 10 ? '0' : '') +
                    minutes +
                    ':' +
                    (seconds < 10 ? '0' : '') +
                    seconds;

                cues.value.push({
                    seconds: totalMilliseconds / 1000,
                    start: formattedTime,
                    end: match[2],
                    text: match[5],
                    itemTitle: undefined,
                    thumbnail_url: undefined,
                    url: undefined,
                });
            }

            // ここから紹介アイテムを配列に突っ込んでいく
            for (let i = 0; i < customData.cd.displayed_items.length; i++) {
                const displayed_item = customData.cd.displayed_items[i];

                // 秒数の小数点を削る
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

                cues.value.push({
                    seconds: timeInSeconds,
                    start: formattedTime,
                    end: undefined,
                    text: undefined,
                    itemTitle: matched_item?.title,
                    thumbnail_url: matched_item?.thumbnail_url,
                    url: url,
                });
            }

            // 時間で昇順
            cues.value.sort((a, b) => {
                const timeA = a.start.split(':').map(Number);
                const timeB = b.start.split(':').map(Number);
                if (timeA.length === 2) timeA.unshift(0);
                if (timeB.length === 2) timeB.unshift(0);
                if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
                if (timeA[1] !== timeB[1]) return timeA[1] - timeB[1];
                return timeA[2] - timeB[2];
            });

            // トークアーカイブデータを親へ伝播
            emits('emitsCues', cues.value);
        } else {
            console.error(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };
    xhr.send();
});

const moreShow = () => {
    // 表示するリストの数: ちゃんと表示5件 + ぼかし1件
    const moreShowNum = 6;

    // もっと見るボタン
    const moreShow = document.querySelector('.talk-archive-more-show.more-show-wrapper') as HTMLElement;

    // ボケていた要素のぼかしを外す
    const beforeBlurItems = document.querySelector('.BlurItems') as HTMLElement;
    if (beforeBlurItems) {
        beforeBlurItems.classList.remove('BlurItems');
    }

    // もっと見るで表示させる対象の要素
    const targetElements = [];

    // class="item"が現れるまでの全ての隠れているキャプション要素を取得
    // itemが現れたらそれも表示対象
    const allHiddenElements = document.querySelectorAll('.hiddenItems');
    for (let i = 0; i < allHiddenElements.length; i++) {
        const element = allHiddenElements[i];
        targetElements.push(element);
        // アイテムだったらストップ
        if (element.classList.contains('item')) {
            break;
        }
    }

    // 前段でとった配列の最後にアイテムがいる。そのからキャプションが5つ続いたところで再度ストップ
    // キャプションが5つになる前にアイテムが来たらそれは表示させ再度そこから5件カウント
    const lastItem = targetElements[targetElements.length - 1];
    let nextElementOfItem = lastItem?.nextElementSibling;
    let count = 0;
    while (count < moreShowNum && nextElementOfItem) {
        // アイテムだったらそこから5件キャプションのカウントに戻さないといけないのでリセット
        if (nextElementOfItem.classList.contains('hiddenItems') && nextElementOfItem.classList.contains('item')) {
            targetElements.push(nextElementOfItem);
            count = 0;
        }
        // 非表示中のキャプションであればカウント
        if (nextElementOfItem.classList.contains('hiddenItems') && nextElementOfItem.classList.contains('caption')) {
            targetElements.push(nextElementOfItem);
            count++;
        }
        nextElementOfItem = nextElementOfItem.nextElementSibling;
    }

    for (let i = 0; i < targetElements.length; i++) {
        targetElements[i].classList.remove('hiddenItems'); // 要素に対してremoveClassを実行しdisplay: none;を取っ払う
    }

    //  表示した最後のぼかす要素
    const AfterBlurItems = targetElements[targetElements.length - 1] as HTMLElement;
    if (AfterBlurItems) {
        AfterBlurItems.classList.add('BlurItems');
    }

    // 非表示されているものが全てなくなったらボタンを消す
    const hiddenItems = document.querySelectorAll('.cue-item.hiddenItems');
    if (hiddenItems.length === 0) {
        moreShow.style.display = 'none';
    }
};

declare global {
    interface Window {
        tigPlayer: any;
        tigEmbedModalLeavePip: () => void;
    }
}

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
    width: 100%;
    margin: 0 auto;
    border-bottom: 1px #ececec solid;
    // padding: 5px 0;
}

.caption {
    padding: 10px 0;
}

.item {
    padding: 10px 0;
}

.cue-start {
    display: flex;
    align-items: center;
    span {
        margin-left: 3px;
        color: #0280e8;
        font-weight: 500;
    }
}

.cue-text {
    margin-bottom: 3px;
}

.item-img {
    width: 120px;
    height: 120px;
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
    // padding: 10px;
    // img {
    //     width: 100%;
    //     height: 100%;
    //     object-fit: cover;
    // }
}

.item-info {
    width: 60%;
    display: inline-block;
    vertical-align: top;
    .title {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 16px;
    }
    .price {
        font-weight: 700;
        font-size: 16px;
    }
}

.more-show-wrapper {
    top: -50px;
    padding-top: 70px;
}

.hiddenItems {
    display: none;
}

.BlurItems {
    // 	opacity: 0.3;
    // background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
}
</style>
