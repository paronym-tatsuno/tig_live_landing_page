<template>
    <div class="section-header">
        <div>出演者情報</div>
        <img class="rainbow_underline" src="/src/assets/tmp/icons/rainbow_underline.png" />
    </div>
    <div
        class="performer"
        v-bind:class="{ hiddenItems: index > 1, BlurItems: index === 1 }"
        v-for="(performer, index) in performers"
        :key="'performer' + index">
        <div class="performer-profile">
            <div class="performer-img">
                <img :src="performer.thumbnail_url" />
            </div>
            <div class="performer-name">
                <span>{{ performer?.name }}</span>
            </div>
            <div class="performer-description">
                <span>{{ performer.description }}</span>
            </div>
        </div>
        <div class="performer-links">
            <div v-for="(link, index) in performer.links" :key="'performer' + index" class="link-block">
                <div class="link">
                    <a :href="link.url" target="_blank">
                        <img :src="getLinkThumbnailUrl(link.type)" />
                        <div class="link-title">
                            {{ getLinkTitle(link.type, link.name) }}
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div v-if="performers.length > 2" class="more-show-wrapper performer-more-show">
        <div @click="moreShow()" class="more-show">もっと見る<MoreShowArrowIcon /></div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import { useTigDataStore } from '@/stores/tigData';
import MoreShowArrowIcon from '@/components/icon/MoreShowArrowIcon.vue';

interface IPerformer {
    id: number;
    name: string | undefined;
    description: string | undefined;
    thumbnail_url: string | undefined;
    links: IPerformerLink[];
}

interface IPerformerLink {
    type: string;
    url: string;
    name: string;
}

const customData = useTigDataStore();

const performers: Ref<IPerformer[]> = ref<IPerformer[]>([]);

const emits = defineEmits(['emitsPerformers']);

onMounted(() => {
    for (let i = 0; i < customData.cd.live.performers.length; i++) {
        const performer = customData.cd.live.performers[i];
        performers.value.push({
            id: performer.id,
            name: performer.name,
            description: performer.description,
            thumbnail_url: performer.thumbnail_url,
            links: performer.links,
        });
    }
    // トークアーカイブデータを親へ伝播
    emits('emitsPerformers', performers.value);
});

const moreShow = () => {
    const moreShow = document.querySelector('.performer-more-show.more-show-wrapper') as HTMLElement;
    const hiddenItems = document.querySelectorAll('.performer.hiddenItems');
    if (moreShow) {
        moreShow.style.display = 'none';
    }
    for (const el of hiddenItems) {
        (el as HTMLElement).style.display = 'block';
    }
};

const getLinkThumbnailUrl = (type: string | null) => {
    if (type === 'instagram') {
        return '/src/assets/tmp/icons/performer_link_instagram_icon.png';
    } else if (type === 'twitter') {
        return '/src/assets/tmp/icons/performer_link_twitter_icon.png';
    } else if (type === 'tiktok') {
        return '/src/assets/tmp/icons/performer_link_tiktok_icon.png';
    } else if (type === 'ec') {
        return '/src/assets/tmp/icons/performer_link_ec_icon.png';
    } else if (type === 'mail_magazine') {
        return '/src/assets/tmp/icons/performer_link_mail_icon.png';
    } else if (type === 'other') {
        return '/src/assets/tmp/icons/performer_link_other_link_icon.png';
    }
};

const getLinkTitle = (type: string | null, name: any) => {
    if (type === 'instagram') {
        return 'Instagram';
    } else if (type === 'twitter') {
        return 'Twitter';
    } else if (type === 'tiktok') {
        return 'TikTok';
    } else if (type === 'ec') {
        return 'ECサイト';
    } else if (type === 'mail_magazine') {
        return 'メルマガ';
    } else if (type === 'other') {
        return name;
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

.performer {
    // width: 100%;
    // padding: 10px;
    border-bottom: 1px #ececec solid;
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

.performer-img {
    display: inline-block;
    width: 20%;
    vertical-align: middle;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }
}

.performer-name {
    // width: 75%;
    display: inline-block;
    vertical-align: middle;
    padding-left: 15px;
    font-weight: 500;
    font-weight: bold;
}

.performer-description {
    width: 100%;
    margin-bottom: 10px;
}

.performer-links {
    display: flex;
    font-size: 12px;
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.link-block {
    width: 64px;
    display: flex;
    justify-content: flex-start;
    margin-right: 32px;
    .link {
        display: flex;
        flex-direction: column;
        width: 56px;
        padding-bottom: 16px;
        cursor: pointer;
        align-items: center;
        img {
            width: 64px;
            height: 64px;
            border-radius: 50%;
        }
    }
}

.performer-link {
    display: flex;
    justify-content: flex-start;
    width: 68px;
    // display: inline-block;
    // width: 15%;
    // margin-right: 20px;
    // text-align: center;
    // font-size: 12px;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.link-title {
    text-align: center;
    word-wrap: break-word;
    margin-top: 8px;
    font-size: 9px;
    line-height: 11px;
    // color: rgba(18, 18, 18, 0.4);
    font-weight: bold;
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
    }
    .price {
        float: right;
        font-weight: 700;
    }
}

.more-show-wrapper {
    top: -38px;
    padding-top: 35px;
}

.introduction-time {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;
    height: 45px;
    border: 1px #b0b0b0 solid;
    border-radius: 30px;
    font-size: 14px;
    margin: 0 auto;
    color: #fff;
    background: #1282f4;
    // margin-bottom: 30px;
    // backdrop-filter: blur(5px);
    .fas {
        position: relative;
        left: 45px;
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
