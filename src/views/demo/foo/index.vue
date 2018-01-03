<template>
    <section class="foo">
        <p class="title" v-text="$t('common.iam') + ' ' + T('name')"></p>
        <div class="demo">
            <h1>Element UI</h1>
            <br/>
            <el-button>{{T('defaultBtn')}}</el-button>
            <el-button type="primary">{{T('primaryBtn')}}</el-button>
            <el-button type="primary" :loading="true">{{$t('common.loading')}}</el-button>
            <el-button type="text">{{T('textBtn')}}</el-button>
            <br/>
            <br/>
            <el-button @click="submit">{{T('touchMe')}}</el-button>
        </div>
    </section>
</template>
<script>
import { popup } from 'G';

export default {
    data() {
        return {
            T: this.$i18n.getT('views.demo.Foo')
        };
    },

    methods: {
        submit() {
            var box = popup({
                type: 'confirm',
                text: this.T('submitForm', { msg: 'Test' }),
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
