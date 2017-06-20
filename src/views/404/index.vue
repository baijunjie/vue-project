<template>
    <section class="foo">
        <p class="title" v-text="i18n['name']"></p>
        <p class="message" v-text="i18n['message']"></p>
    </section>
</template>
<script>

const i18n = function() {
    return this.$i18n.getLang('views.404');
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
