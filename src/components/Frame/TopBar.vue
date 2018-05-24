<template>
    <section class="top-bar">
        <div class="logo">
            <img src="../../assets/img/logo.png">
        </div>
        <div class="download-app">
            <div class="button small" v-text="T('downloadApp')"></div>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                T: this.$i18n.getT('components.Frame')
            };
        },
        methods: {

        }
    };
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';

.logo {
    position: absolute;
    left: 10px;
    top: 0;
    height: 100%;
    .ftsz(0);
    .va;

    img {
        max-height: 80%;
    }
}

.download-app {
    position: absolute;
    right: 10px;
    top: 0;
    height: 100%;
    .ftsz(0);
    .va;

    .button {
        .bdrd(15px);
    }
}

</style>
