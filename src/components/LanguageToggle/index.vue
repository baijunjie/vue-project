<template>
    <section class="language-toggle">
        <a href="javascript:void(0);" @click="changeLang('zh-CN')">简体中文</a>
        <span> | </span>
        <a href="javascript:void(0);" @click="changeLang('en-US')">English</a>
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

.language-toggle {
    font-size: 14px;
    color: #fff;

    a {
        color: #fff;
    }
}
</style>
