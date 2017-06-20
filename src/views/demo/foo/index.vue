<template>
    <section class="foo">
        <p class="title" v-text="$t('common.iam') + ' ' + i18n['name']"></p>
        <div class="demo">
            <h1>Element UI</h1>
            <br/>
            <el-button>{{i18n['defaultBtn']}}</el-button>
            <el-button type="primary">{{i18n['primaryBtn']}}</el-button>
            <el-button type="primary" :loading="true">{{$t('common.loading')}}</el-button>
            <el-button type="text">{{i18n['textBtn']}}</el-button>
            <br/>
            <br/>
            <el-button @click="submit">{{i18n['touchMe']}}</el-button>
        </div>
    </section>
</template>
<script>
import { popup } from 'G';

const i18n = function() {
    return this.$i18n.getLang('views.demo.foo');
};

export default {
    data() {
        return {

        };
    },
    computed: {
        i18n
    },

    methods: {
        submit() {
            var box = popup({
                type: 'confirm',
                text: this.i18n['submitForm'],
                beforeClose: (num, elem, done) => {
                    if (num == 1) {
                        box.vm.loading = true;
                        setTimeout(() => {
                            box.vm.loading = false;
                            done();
                        }, 2000);
                    } else {
                        done();
                        box.vm.loading = false;
                    }
                }
            });
        }
    }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';
.title {
    text-align: center;
    line-height: 100px;
    .ftsz(30px);
}

.demo {
    text-align: center;
}
</style>
