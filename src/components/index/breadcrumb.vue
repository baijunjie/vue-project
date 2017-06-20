<template>
    <section class="breadcrumb">
        <ul>
            <li v-for="route in routeList">
                <router-link v-if="route.path" :to="route.path" v-text="$t(route.i18n)"></router-link>
                <span v-else v-text="$t(route.i18n)"></span>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
    data: () => ({
        routeList: []
    }),

    watch: {
        $route(to, from) {
            document.title = this.$t(to.meta.i18n);
            this.routeList = this.$router.matchRoutes(to);
        }
    }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';

.breadcrumb {
    ul {
        display: inline-block;
        padding: 0 20px;
    }

    li {
        display: inline-block;

        &:not(:last-child):after {
            content: '>';
            color: #999;
            margin: 0 10px;
        }
    }
}
</style>
