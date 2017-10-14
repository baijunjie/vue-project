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
import Header from './Header';
import Nav from './Nav';
import Breadcrumb from './Breadcrumb';

export default {
    components: {
        vHeader: Header,
        vNav: Nav,
        vBreadcrumb: Breadcrumb
    }
};
</script>

<style lang="less" rel="stylesheet/less">
@import '~less-lib';

@header_height: 60px;  // 头部高度
@nav_width: 250px;  // 左侧导航宽度
@breadcrumb: 30px; // 面包屑高度

#mainHeader {
    position: absolute;
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
    background-color: #eef1f6;
}

#breadcrumb {
    position: absolute;
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
