<template>
    <section @click="clickOut">
        <!--视频-->
        <div class="video">
            <video id="player"
            preload="auto"
            :poster="avatar">
                <source :src="url" type="rtmp/flv" />
            </video>
        </div>

        <!--关注-->
        <div class="attention">
            <div class="attention-bar black-bg" @click="follow">
                <div class="img"
                     :style="{backgroundImage: 'url(' + avatar + ')'}"></div>
                <div :class="['attention-btn', followed ? 'followed' : null]"></div>
                <div class="text-area">
                    <p class="nickname" v-text="nickname"></p>
                    <p class="audience"><em v-text="people"></em><span v-text="T('watch')"></span></p>
                </div>
            </div>
        </div>

        <!--贡献-->
        <div class="contribution">
            <div class="contribution-top3">
                <div class="contribution-top3-item">
                    <div class="crown crown1" :style="{backgroundImage: 'url(' + contributionTop3[0] + ')'}"></div>
                </div>
                <div class="contribution-top3-item">
                    <div class="crown crown2" :style="{backgroundImage: 'url(' + contributionTop3[1] + ')'}"></div>
                </div>
                <div class="contribution-top3-item">
                    <div class="crown crown3" :style="{backgroundImage: 'url(' + contributionTop3[2] + ')'}"></div>
                </div>
            </div>
            <div class="contribution-all black-bg">
                <i></i>
                <span v-text="T('contributionList')"></span>
            </div>
        </div>

        <!--评论区-->
        <div :class="{ comments: true, 'top-offset': inputLayerShow }" ref="comments">
            <div class="comment" v-for="item in comments" v-text="item"></div>
        </div>

        <!--底部功能区-->
        <div v-show="!inputLayerShow" class="bottom-area">
            <div class="open-input black-bg" @click="openInput">
                <span v-text="T('messageTips')"></span>
            </div>
            <div class="gift black-bg" @click="gift">
                <i class="fa fa-gift"></i>
            </div>
            <div class="exit black-bg" @click="exit">
                <i class="fork"></i>
            </div>
        </div>

        <!--发送消息-->
        <div :class="['input-layer', inputLayerShow ? 'show' : null]">
            <div class="btn-area">
                <div class="submit button small" @click="submit">
                    <i class="fa fa-send"></i>
                </div>
            </div>
            <div class="input-area">
                <input type="text" ref="input">
            </div>
        </div>
    </section>
</template>

<script>
import { utils, api } from 'G';
import $ from 'jquery';
import OverScroll from '@/assets/plugins/OverScroll/OverScroll';
import ChartRoom from '@/assets/js/ChartRoom';
import videojs from 'video.js';

const MAX_COMMENT_NUM = 100;

export default {
    data() {
        const T = this.$i18n.getT('views.Video');
        return {
            T,
            url: '',
            payload: '',
            nickname: '',
            avatar: '',
            people: 0,
            contributionTop3: [
                './static/img/zhubo_head.jpg',
                './static/img/zhubo_head.jpg',
                './static/img/zhubo_head.jpg'
            ],
            comments: [],
            followed: false,
            inputLayerShow: false // 是否为输入状态
        };
    },

    created() {
        this.id = this.$route.params.room;
        if (!this.id) {
            // 没有得到房间id
            return this.exit();
        }
        if (this.$route.params.type === 'live') {
            this.getLiveDetail();
        } else if (this.$route.params.type === 'scene') {
            this.getSceneDetail();
        }

        // 初始化融云聊天室
        this.chartRoom = new ChartRoom(this.id);

        this.chartRoom.ready(() => { // 初始化连接完成
            this.chartRoom.enter(); // 进入聊天室
        });

        this.chartRoom.receive((e, data) => { // 接收到消息
            this.addComment(data.user + ': ' + data.message);
        });
    },

    mounted() {
        this.overScroll = new OverScroll(this.$refs['comments']);
    },

    beforeDestroy() {
        this.chartRoom.destroy();
        this.overScroll.destroy();
    },

    methods: {
        getLiveDetail(token) {
            return utils.ajax({
                method: 'get',
                url: api.getLiveDetail,
                data: {
                    lid: this.id,
                    utoken: 0,
                    token: token
                }
            }).then(res => {
                console.log('获取直播详情', res);
                if (res.code == 200) {
                    let data = res.data;
                    // this.url = data.payload;
                    this.nickname = data.nickname;
                    this.avatar = data.avatar;
                    this.followed = data.followed;
                    this.people = data.people;
                    this.$nextTick(() => {
                        this.videoInit();
                    });
                } else if (res.code == 40006) {
                    let result = res.msg.match(/servertoken is (.+)/);
                    if (result && result[1]) {
                        this.getLiveDetail(result[1]);
                    }
                }
            });
        },

        getSceneDetail(token) {
            return utils.ajax({
                method: 'get',
                url: api.getSceneDetail,
                data: {
                    sid: this.id,
                    utoken: 0,
                    token: token
                },
                headers: {
                    'Accept': 'application/x.apitype.v2+json'
                }
            }).then(res => {
                console.log('获取现场详情', res);
                if (res.code == 200) {
                    let data = res.data;
                    // this.url = data.payload;
                    this.nickname = data.nickname;
                    this.avatar = data.avatar;
                    this.followed = data.followed;
                    this.people = data.people;
                } else if (res.code == 40006) {
                    let result = res.msg.match(/servertoken is (.+)/);
                    if (result && result[1]) {
                        this.getSceneDetail(result[1]);
                    }
                }
            });
        },

        videoInit() {
            let options = {};
            this.player = videojs('player', options, function onPlayerReady() {
                videojs.log('开始播放!');

                // In this context, `this` is the player that was created by Video.js.
                this.play();

                // How about an event listener?
                this.on('ended', function() {
                    videojs.log('播放结束!');
                });
            });
        },

        follow() {
            this.followed = !this.followed;
        },

        exit() {
            this.$router.push({
                name: 'list'
            });
        },

        gift() {

        },

        openInput() {
            this.inputLayerShow = true;
            this.$refs['input'].focus();
        },

        submit() {
            let input = this.$refs['input'];
            let msg = input.value;
            if (!msg) return;
            input.value = '';

            this.chartRoom.send(msg).then(data => {
                this.addComment(data.user + ': ' + data.message);
            });
        },

        addComment(msg) {
            this.comments.push(msg);
            while (this.comments.length > MAX_COMMENT_NUM) {
                this.comments.unshift();
            }
            let dom = this.$refs['comments'];
            this.$nextTick(() => {
                dom.scrollTop = dom.scrollHeight - dom.clientHeight;
            });
        },

        clickOut(e) {
            let $parents = $(e.target).parents().addBack();
            if ($parents.is('.input-layer') || $parents.is('.open-input')) return;
            this.$refs['input'].blur();
            this.inputLayerShow = false;
        }
    }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';

.default-head {
    background-image: url('../../assets/img/default_head.jpg');
    background-position: center;
    background-repeat: no-repeat;
    .bgsz(cover);
}

.black-bg {
    .bgcl(fade(#000, 30%));
    .active({
        .bgcl(fade(#000, 50%));
    });
}

.video {
    .fit(0);
    .ftsz(0);
    .bgcl(fade(@green, 10%));
    &:extend(.default-head);
    overflow: hidden;

    iframe,
    video {
        position: absolute;
        left: 0;
        right: 0;
        .sz(100%);
        object-fit: cover;
    }
}

.attention {
    position: absolute;
    left: .2rem;
    top: .2rem;
    width: 3rem;

    .attention-bar {
        padding: .1rem;
        .col3(float, auto, .6rem, .6rem, .1rem, .1rem, @left: '.img', @right: '.attention-btn');
        .ftsz(.24rem);
        line-height: .3rem;
        .bdrd(.08rem);
        color: #fff;

        .img {
            .sz(.6rem);
            .bdrd(100%);
            &:extend(.default-head);
        }

        .attention-btn {
            margin: .05rem;
            .icon-add(@yellow #fff, .5rem .06rem);

            &.followed {
                &:after {
                    content: none;
                }
            }
        }

        .nickname,
        .audience {
            .of3p;

            em {
                color: #ffea00;
                font-size: .26rem;
                font-weight: 400;
                margin-right: .06rem;
            }
        }
    }
}

.contribution {
    position: absolute;
    right: .2rem;
    top: .2rem;
    width: 2.5rem;

    .contribution-top3 {
        .mean(3);
    }

    .contribution-top3-item {
        .crown {
            position: relative;
            margin: .2rem auto;
            .sz(.5rem);
            .bdrd(100%);
            &:extend(.default-head);

            &:before {
                content: '';
                position: absolute;
                left: -.15rem;
                top: -.2rem;
                .sz(.4rem);
                background-position: center;
                .bgsz(.4rem);
            }

            &.crown1 {
                .bd(#fed530, .04rem);
                &:before { background-image: url('../../assets/img/crown-1.png'); }
            }
            &.crown2 {
                .bd(#e8e8e8, .04rem);
                &:before { background-image: url('../../assets/img/crown-2.png'); }
            }
            &.crown3 {
                .bd(#ca9561, .04rem);
                &:before { background-image: url('../../assets/img/crown-3.png'); }
            }
        }
    }

    .contribution-all {
        margin: 0 .1rem;
        text-align: center;
        color: #fff;
        .ftsz(.24rem);
        height: .4rem;
        line-height: .4rem;
        .bdrd(.4rem);

        i {
            display: inline-block;
            vertical-align: -.04rem;
            .sz(.32rem, .24rem);
            .bgsz(.32rem .24rem);
            background-image: url('../../assets/img/crown.png');
            background-position: center;
            background-repeat: no-repeat;
        }
    }
}

.comments {
    position: absolute;
    left: .2rem;
    right: .2rem;
    bottom: 1.2rem;
    z-index: 1;
    padding-top: .2rem;
    height: 4rem;
    .ftsz(.28rem);
    line-height: .4rem;
    .scroll(y);
    -webkit-mask-image: -webkit-linear-gradient(top, transparent 0, rgba(0,0,0,.1) 1%, rgba(0,0,0,.8) 5%, #fff 100%);

    &.top-offset {
        bottom: 2.2rem;
    }

    .comment {
        color: #fff;
        font-weight: bold;
        .text-stroke(fade(#000, 30%));
    }
}

.bottom-area {
    position: absolute;
    left: .2rem;
    right: .2rem;
    bottom: .2rem;
    z-index: 1;
}

.open-input {
    display: inline-block;
    padding: 0 .2rem 0 .7rem;;
    height: .8rem;
    line-height: .8rem;
    .ftsz(.28rem);
    .bdrd(.8rem);
    background-image: url('../../assets/img/keyboard.png');
    background-position: .2rem center;
    background-repeat: no-repeat;
    .bgsz(.4rem);
    color: #fff;
}

.gift {
    position: absolute;
    bottom: 0;
    right: 1.2rem;
    .sz(.8rem);
    line-height: .8rem;
    text-align: center;
    .bdrd(100%);

    i {
        .ftsz(.4rem);
        color: #fff;
        vertical-align: -.04rem;
    }
}

.exit {
    position: absolute;
    bottom: 0;
    right: 0;
    .sz(.8rem);
    .bdrd(100%);

    i {
        .icon-fork(#fff, .4rem .04rem);
        .cxy(.4rem, .4rem);
    }
}

.input-layer {
    position: fixed;
    left: 0;
    right: 0;
    top: 100%;
    bottom: auto;
    z-index: 2;
    padding: .1rem .2rem 50px;
    height: .8rem;
    background-color: fade(#000, 30%);

    .col2-r(float, 100%, .8rem, .2rem, @left: '.input-area', @right: '.btn-area');

    &.show {
        top: auto;
        bottom: 0;
    }

    .input-area {
        .va;

        input {
            .noapp;
            .bxbd;
            padding: 0 .6em;
            width: 100%;
            .ftsz(.28rem);
            .lh(.6rem);
            .bdrd(.08rem);
            background-color: fade(#fff, 90%);
        }
    }

    .btn-area {
        text-align: right;
        .va;
    }
}

@supports (-webkit-backdrop-filter: none) {
    .black-bg {
        background-color: rgba(0,0,0,.2);
        -webkit-backdrop-filter: saturate(180%) blur(20px);
        .active({
            background-color: rgba(0,0,0,.5);
        });
    }

    .input-layer {
        background-color: rgba(0,0,0,.2);
        -webkit-backdrop-filter: saturate(180%) blur(20px);

        .input-area {
            input {
                background-color: rgba(255,255,255,.5);
                -webkit-backdrop-filter: saturate(180%) blur(20px);
            }
        }
    }
}
</style>
