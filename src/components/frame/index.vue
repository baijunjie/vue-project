<template>
    <section>
        <div id="mainHeader">
            <v-header></v-header>
        </div>
        <div id="mainNav">
            <v-nav></v-nav>
        </div>
        <div id="breadcrumb">
            <v-breadcrumb></v-breadcrumb>
        </div>
        <section id="mainContent">
            <router-view :key="$route.fullPath"></router-view>
        </section>
    </section>
</template>

<script>
import header from './header.vue';
import nav from './nav.vue';
import breadcrumb from './breadcrumb.vue';

export default {
    components: {
        vHeader: header,
        vNav: nav,
        vBreadcrumb: breadcrumb
    }
};
</script>

<style lang="less" rel="stylesheet/less">
@import '~less-lib';

@header_height: 60px;  // 头部高度
@nav_width: 200px;  // 左侧导航宽度
@breadcrumb: 30px; // 面包屑高度

#mainHeader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
    .lh(@header_height);
}

#mainNav {
    position: fixed;
    top: @header_height;
    bottom: 0;
    left: 0;
    width: @nav_width;
    background-color: #eef1f6;
}

#breadcrumb {
    position: fixed;
    top: @header_height;
    left: @nav_width;
    right: 0;
    padding: 8px 10px;
    height: @breadcrumb - 16px;
    background-color: #f5f5f5;
}

#mainContent {
    margin-top: @header_height + @breadcrumb;
    margin-left: @nav_width;
    padding: 20px;
}
</style>
