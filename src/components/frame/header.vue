<template>
    <section class="header">
        <div class="title" v-text="$t('components.Frame.title')"></div>
        <a href="javascript:void(0);" class="close" @click="logout"><i class="fa fa-power-off"></i></a>
        <v-language-toggle class="language-toggle"></v-language-toggle>
    </section>
</template>

<script>
import { utils } from 'G';
import LanguageToggle from '../LanguageToggle';

export default {
    components: {
        vLanguageToggle: LanguageToggle
    },

    methods: {
        logout() {
            utils.logout();
        }
    }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';

.header {
    position: relative;
    font-size: 24px;
    color: #fff;
    background-color: @blue;
    .bdb(#fff);
    .clear();

    &:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        .bdb(darken(@blue, 10%));
    }

    .title {
        margin-left: 20px;
        float: left;
        .text-glow();
    }

    .close {
        margin-left: 20px;
        float: right;
        width: 60px;
        height: 100%;
        text-align: center;
        .acl(none);
        .bgcl(transparent rgba(0,0,0,.1));
    }

    .language-toggle {
        float: right;
        height: 100%;
    }
}
</style>
