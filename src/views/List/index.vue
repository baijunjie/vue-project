<template>
    <section>
        <div class="list">
            <h1 v-text="T('live')"></h1>
            <ul>
                <li v-for="item in items">
                    <router-link :to="'video/live/' + item.id">
                        <div class="img"
                             :style="{backgroundImage: 'url(' + item.avatar + ')'}">
                            <p v-if="item.time_str" class="label" v-text="T('live')"></p>
                            <p class="title" v-text="item.title"></p>
                        </div>
                        <div class="footer">
                            <p class="nickname" v-text="item.nickname"></p>
                            <p class="audience">
                                <i class="fa fa-user"></i>
                                <span v-text="item.people"></span>
                            </p>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>

        <div class="list">
            <h1 v-text="T('scene')"></h1>
            <ul>
                <li v-for="item in items2">
                    <router-link :to="'video/scene/' + item.id">
                        <div class="img"
                             :style="{backgroundImage: 'url(' + item.avatar + ')'}">
                            <p v-if="item.time_str" class="label" v-text="T('scene')"></p>
                            <p class="title" v-text="item.title"></p>
                        </div>
                        <div class="footer">
                            <p class="nickname" v-text="item.nickname"></p>
                            <p class="audience">
                                <i class="fa fa-user"></i>
                                <span v-text="item.people"></span>
                            </p>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import { utils, api } from 'G';

export default {
    data() {
        const T = this.$i18n.getT('views.List');
        return {
            T,
            items: [],
            items2: []
        };
    },

    created() {
        this.getLiveList();
        this.getSceneList();
    },

    methods: {
        getLiveList(token) {
            return utils.ajax({
                method: 'get',
                url: api.getLiveList,
                data: {
                    cannel: 1,
                    page: 1,
                    token: token
                }
            }).then(res => {
                console.log('获取直播列表', res);
                if (res.code == 200) {
                    this.items = res.data;
                } else if (res.code == 40006) {
                    let result = res.msg.match(/servertoken is (.+)/);
                    if (result && result[1]) {
                        this.getLiveList(result[1]);
                    }
                }
            });
        },

        getSceneList(token) {
            return utils.ajax({
                method: 'get',
                url: api.getSceneList,
                data: {
                    type: 0,
                    page: 1,
                    utoken: 0,
                    token: token
                }
            }).then(res => {
                console.log('获取现场列表', res);
                if (res.code == 200) {
                    this.items2 = res.data;
                } else if (res.code == 40006) {
                    let result = res.msg.match(/servertoken is (.+)/);
                    if (result && result[1]) {
                        this.getSceneList(result[1]);
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';

.list {
    h1 {
        margin: .2rem .2rem 0;
        padding: 0 .2rem;
        .bdl(red, .08rem);
        .ftsz(.32rem);
    }

    ul {
        .mean(3);
        padding: .1rem;
    }

    a {
        display: block;
        margin: .1rem;
        .acl(none);
        .bxsd(thin);
        .bdrd(.04rem);
    }

    .img {
        position: relative;
        .sz(1,1,100%);
        .bgimg('/static/img/default_head.jpg');
        .bgsz(cover);
    }

    .label {
        position: absolute;
        top: .08rem;
        right: .08rem;
        padding: 0 .08rem;
        height: .4rem;
        line-height: .4rem;
        .ftsz(.24rem);
        .bdrd(.04rem);
        color: #fff;
        .bgcl(fade(#000, 30%));
    }

    .title {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: .08rem;
        .ftsz(.24rem);
        .of3p;
        color: #fff;
        .ttsd(fade(#000, 20%));
        .lgy(fade(#000, 0), fade(#000, 50%));
    }

    .footer {
        position: relative;
        .col2-r(.8rem, @left: '.nickname', @right: '.audience');
        .ftsz(.24rem);
        height: .4rem;
        line-height: .4rem;
    }

    .nickname {
        padding: 0 .08rem;
        .of3p;
    }

    .audience {
        padding: 0 .08rem;
        text-align: right;
        color: #999;
    }
}
</style>
