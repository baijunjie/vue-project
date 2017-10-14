<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="route in routeList"
                            :key="route.path"
                            :to="route.empty ? null : route.path">
            <span v-text="$t(route.i18n)"></span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    data() {
        return {
            routeList: this.$router.matchRoutes(this.$route)
        };
    },

    watch: {
        $route(to, from) {
            this.routeList = this.$router.matchRoutes(to);
        }
    }
};
</script>
