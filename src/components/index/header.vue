<template>
    <section class="header">
        <div class="title" v-text="$t('components.index.welcome')"></div>
        <div class="language">
            <a href="javascript:void(0);" @click="changeLang('zh-CN')">中文</a>
            <span> | </span>
            <a href="javascript:void(0);" @click="changeLang('en-US')">English</a>
        </div>
    </section>
</template>

<script>
export default {
    methods: {
        changeLang(langType) {
            this.$i18n.setLangType(langType);
        }
    }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';

.header {
    font-size: 24px;
    text-align: center;
    color: #fff;
    background-color: @blue;

    .title {
        .text-glow();
    }

    .language {
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 14px;
        color: #fff;

        a {
            color: #fff;
        }
    }
}
</style>