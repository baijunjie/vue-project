<template>
    <section class="foo">
        <p class="title" v-text="i18n['name']"></p>
        <p class="message" v-text="i18n['message']"></p>
    </section>
</template>
<script>
export default {
    data() {
        return {

        };
    },

    computed: {
        i18n() {
            return this.$i18n.getLang('pages.demo[404]');
        }
    }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "../../../assets/less/_config.less";
.title {
    text-align: center;
    line-height: 100px;
    .ftsz(30px);
}

.message {
    text-align: center;
    .ftsz(20px);
}
</style>
