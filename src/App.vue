<template>
    <section id="mainBody">
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
import header from '@/components/index/header.vue';
import nav from '@/components/index/nav.vue';
import breadcrumb from '@/components/index/breadcrumb.vue';

export default {
    components: {
        vHeader: header,
        vNav: nav,
        vBreadcrumb: breadcrumb
    }
};
</script>

<style lang="less" rel="stylesheet/less">
@import './assets/less/styles.less';

@header_height: 60px;  // 头部高度
@nav_width: 200px;  // 左侧导航宽度
@breadcrumb: 30px; // 面包屑高度

html, body {
    height: 100%;
}

#mainHeader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
    .lh(@header_height);
}

#mainNav {
    position: absolute;
    top: @header_height;
    bottom: 0;
    left: 0;
    width: @nav_width;
    background-color: @green;
}

#breadcrumb {
    position: absolute;
    top: @header_height;
    left: @nav_width;
    right: 0;
    .lh(@breadcrumb);
    background-color: #eee;
}

#mainContent {
    margin-top: @header_height + @breadcrumb;
    margin-left: @nav_width;
    padding: 20px;
}
</style>
