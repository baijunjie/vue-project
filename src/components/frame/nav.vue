<template>
    <el-menu :default-active="$route.fullPath"
             :default-openeds="links.map(item => item.path)"
             router>
        <template v-for="link in links"
                  v-if="!link.hide && link.path">
            <el-submenu v-if="link.children && link.children.length"
                        :key="link.path"
                        :index="link.path">

                <template v-if="link.empty"
                          slot="title"
                          class="submenu-title">
                    <i :class="link.icon"></i>
                    <span v-text="$t(link.i18n)"></span>
                </template>
                <el-menu-item v-else
                              slot="title"
                              class="submenu-title"
                              :index="link.path">
                    <i :class="link.icon"></i>
                    <span v-text="$t(link.i18n)"></span>
                </el-menu-item>

                <el-menu-item v-for="childLink in link.children"
                              v-if="!childLink.hide && childLink.path"
                              :key="childLink.path"
                              :index="childLink.path">
                    <i :class="childLink.icon"></i>
                    <span v-text="$t(childLink.i18n)"></span>
                </el-menu-item>
            </el-submenu>

            <el-menu-item v-else
                          :key="link.path"
                          :index="link.path">
                <i :class="link.icon"></i>
                <span v-text="$t(link.i18n)"></span>
            </el-menu-item>

        </template>
    </el-menu>
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

<style lang="less" rel="stylesheet/less">
@import '~less-lib';

.el-submenu__title {
    .lh(50px);
}
</style>

<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';

a {
    .acl(none);
}

.fa {
    margin-right: 10px;
}

.submenu-title {
    height: auto;
    padding: 0 !important;
}
</style>
