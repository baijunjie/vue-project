<template>
    <section class="home">
        <p v-text="$t('pages.home.name')"></p>
    </section>
</template>

<script>
export default {};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../assets/less/_config.less";

p {
    text-align: center;
    line-height: 100px;
    .ftsz(30px);

}
</style>