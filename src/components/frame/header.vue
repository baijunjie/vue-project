<template>
    <section class="header">
        <div class="title" v-text="$t('components.frame.title')"></div>
        <a href="javascript:void(0);" class="close" @click="logout"><i class="fa fa-power-off"></i></a>
        <div class="language">
            <a href="javascript:void(0);" @click="changeLang('zh-CN')">简体中文</a>
            <span> | </span>
            <a href="javascript:void(0);" @click="changeLang('en-US')">English</a>
        </div>
    </section>
</template>

<script>
import { utils } from 'G';

export default {
    methods: {
        changeLang(langType) {
            this.$i18n.setLangType(langType);
        },
        logout() {
            utils.logout();
        }
    }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';

.header {
    position: relative;
    font-size: 24px;
    color: #fff;
    background-color: @blue;
    .bdb(#fff);
    .clear();

    &:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        .bdb(darken(@blue, 10%));
    }

    .title {
        margin-left: 20px;
        float: left;
        .text-glow();
    }

    .close {
        margin-left: 20px;
        float: right;
        width: 60px;
        height: 100%;
        text-align: center;
        .acl(none);
        .bgcl(transparent rgba(0,0,0,.1));
    }

    .language {
        float: right;
        height: 100%;
        font-size: 14px;
        color: #fff;

        a {
            color: #fff;
        }
    }
}
</style>
