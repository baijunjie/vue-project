<template>
    <section class="home">
        <p v-text="i18n['name']"></p>
    </section>
</template>

<script>

const i18n = function() {
    return this.$i18n.getLang('views.home');
};

export default {
    data() {
        return {

        };
    },
    computed: {
        i18n
    }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../assets/less/_config.less";

p {
    text-align: center;
    line-height: 100px;
    .ftsz(30px);

}
</style>
