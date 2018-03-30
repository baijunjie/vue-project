<template>
    <section id="mainBody">
        <div id="topBar">
            <TopBar></TopBar>
        </div>
        <div id="tabBar">
            <TabBar></TabBar>
        </div>
        <section id="mainContent">
            <router-view :key="$route.fullPath"></router-view>
        </section>
    </section>
</template>

<script>
import TopBar from './TopBar';
import TabBar from './TabBar';

export default {
    components: {
        TopBar,
        TabBar
    }
};
</script>

<style lang="less" rel="stylesheet/less">
@import '~less-lib';
@import '../../assets/less/_variables.less';

#mainBody {
    position: relative;
    max-width: @screen_lg;
    .cxbl;
}

#topBar {
    .center-x(top 0, fixed);
    z-index: 9;
    width: 100%;
    max-width: @screen_lg;
    height: @topBar_height;
    line-height: @topBar_height;
    background-color: #eef1f6;
}

#tabBar {
    .center-x(bottom 0, fixed);
    z-index: 9;
    width: 100%;
    max-width: @screen_lg;
    height: @tabBar_height;
    background-color: #eef1f6;
}

#mainContent {
    padding-top: @topBar_height;
    padding-bottom: @tabBar_height;
}
</style>
