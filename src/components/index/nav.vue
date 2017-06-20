<template>
    <section class="nav">
        <ul>
            <li v-for="link in links" v-if="!link.hide && link.path">
                <a v-if="link.empty" href="javascript:;" v-text="$t(link.i18n)"></a>
                <router-link v-else :to="link.path" v-text="$t(link.i18n)"></router-link>
                <ul v-if="link.children && link.children.length">
                    <li v-for="childLink in link.children" v-if="!childLink.hide && childLink.path">
                        <router-link :to="childLink.path" v-text="$t(childLink.i18n)"></router-link>
                    </li>
                </ul>
            </li>
        </ul>
    </section>
</template>

<script>

export default {
    data() {
        return {
            links: this.$router.routes[0].children
        };
    },
    methods: {
        // 判断当前页面路径是否在指定路径下
        containPath(path) {
            return !this.$route.fullPath.indexOf(path);
        }
    }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';

.nav {
    line-height: 30px;

    ul {
        padding: 0 20px;
    }

    li {
        .ftsz(16px);

        a {
            .acl(#fff @red, @active_class: router-link-active);
        }
    }
}
</style>