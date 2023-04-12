import { defineStore } from 'pinia';

export interface ICD {
    displayed_items: IDisplayedItem[];
    items: IItem[];
    live: ILive;
    videos: IVideo[];
    custom: string;
    identifier: string;
    owner_group_identifier: number;
    owner_group_name: string;
    thumbnail_url: string;
    title: string;
    description: string;
}

export interface IVideo {
    subtitles: ISubtitles[];
}

export interface ISubtitles {
    lang: string;
    url: string;
}

export interface IItem {
    id: number;
    custom: string;
    title: string;
    url: string;
    thumbnail_url: string;
}
export interface ILive {
    performers: IPerformers[];
    archive_status: number;
    landing_page: number;
    start_date: string;
}
export interface IPerformers {
    id: number;
    description: string;
    name: string;
    thumbnail_url: string;
    links: IPerformersLink[];
}
export interface IPerformersLink {
    name: string;
    type: string;
    url: string;
}

export interface IDisplayedItem {
    id: number;
    time: number;
}

export interface ILiveArchive {
    archive_contents: IArchiveContents[];
}
export interface IArchiveContents {
    identifier: string | undefined;
    title: string | undefined;
    title_image_url: string | undefined;
    live_start_date: string | undefined;
    live_end_date: string | undefined;
}

export const useTigDataStore = defineStore({
    id: 'tig-content-data',

    state: () => ({
        cd: {} as ICD,
        liveArchive: {} as ILiveArchive,
        error: false
    }),

    actions: {
        async fetchDataFromAPI() {
            // cd取得
            const urlParam = new URLSearchParams(window.location.search);
            const contentID = urlParam.get('id');
            const getCDUrl = `${import.meta.env.VITE_API_BASE_URL}/v2/cd?id=${contentID}`;
            const contentResponse = await fetch(getCDUrl);
            const contentData = await contentResponse.json();
            const customData = JSON.parse(contentData.custom);
            if (contentData.error) {
                throw new Error();
            }

            // ライブアーカイブ取得
            const gid = contentData.owner_group_identifier;
            const getLiveArchiveUrl = `${import.meta.env.VITE_API_BASE_URL}/v2/live-archives?gid=${gid}`;
            const liveArchiveResponse = await fetch(getLiveArchiveUrl);
            const liveArchiveData = await liveArchiveResponse.json();
            if (liveArchiveData.error) {
                throw new Error();
            }

            // stateに格納
            this.cd = contentData;
            this.liveArchive = liveArchiveData;

            // ・アーカイブ済みLIVEコンテンツではない ・LP表示が許可されていない ・customデータで表示を禁止されている
            // いずれかの条件に該当する場合、コンテンツが存在してもLPを表示しない(404表示)
            if (this.cd.live.archive_status !== 2 || customData.live_landing_page === false) {
                // this.cd.live.landing_page !== 1
                throw new Error();
            }

            // log
            console.log('===== cd =====', this.cd);
            console.log('===== live_archive =====', this.liveArchive);
            console.log('===== API_BASE_URL =====', import.meta.env.VITE_API_BASE_URL);
        },
    },
});
