<template>
    <section class="bar">
        <p v-text="$t('common.iam') + ' ' + i18n['name']"></p>
        <div id="clipArea"></div>
        <input type="file" id="file">
        <button id="clipBtn">截取</button>
        <div id="view"></div>
    </section>
</template>

<script>
import PhotoClip from 'photoclip';

export default {
    data() {
        return {
            i18n: this.$i18n.getLang('pages.demo.bar')
        };
    },
    mounted () {
        new PhotoClip('#clipArea', {
            size: 260,
            outputSize: 640,
            // adaptive: ['60%', '80%'],
            file: '#file',
            view: '#view',
            ok: '#clipBtn',
            loadStart: function() {
                console.log('开始读取照片');
            },
            loadComplete: function() {
                console.log('照片读取完成');
            },
            done: function(dataURL) {
                console.log(dataURL);
            },
            fail: function(msg) {
                alert(msg);
            }
        });
    }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../../assets/less/_config.less";
.bar {
    margin: 0;
    text-align: center;
}
p {
    text-align: center;
    line-height: 100px;
    .ftsz(30px);
}
#clipArea {
    height: 300px;
}
#file,
#clipBtn {
    margin: 20px;
}
#view {
    margin: 0 auto;
    width: 200px;
    height: 200px;
    background-color: #666;
}
</style>
