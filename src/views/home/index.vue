<template>
    <section class="home">
        <p v-text="T('name')"></p>
    </section>
</template>

<script>
export default {
    data() {
        return {
            T: this.$i18n.getT('views.Home')
        };
    }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';

p {
    text-align: center;
    line-height: 100px;
    .ftsz(30px);

}
</style>
