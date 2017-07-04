<template>
    <section class="foo">
        <p class="title" v-text="T('name')"></p>
        <p class="message" v-text="T('message')"></p>
    </section>
</template>
<script>
export default {
    data() {
        return {
            T: this.$i18n.getT('views.404')
        };
    }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';
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
