import Vue from 'vue';
import i18n from '@/assets/js/i18n';

import popup from '../plugins/popup/js/popup.js';

let factory = function(template) {
    let VueComponent = Vue.extend({
        template,
        i18n,
        data: () => ({
            loading: false,
            disabled: false,
            title: '',
            ok: '',
            cancel: '',
            sending: ''
        })
    });

    let vm = new VueComponent();
    vm.$mount();

    return {
        dom: vm.$el,
        vm: vm
    };
};

let inAnimate = {
    start: {
        x: '-50%',
        y: -50,
        opacity: 0
    },
    end: {
        x: '-50%',
        y: 0,
        opacity: 1
    }
};

let outAnimate = {
    start: {
        x: '-50%',
        y: 0,
        opacity: 1
    },
    end: {
        x: '-50%',
        y: -50,
        opacity: 0
    }
};

let closeCallback = function() {
    Object.assign(this.vm.$data, {
        loading: false,
        title: '',
        ok: '',
        cancel: '',
        sending: ''
    });
};

popup.setGlobalOptions({
    alert: {
        in: inAnimate,
        out: outAnimate,
        close: closeCallback,
        factory: factory,
        template: `
            <div class="popup-box popup-confirm el-dialog">
                <div class="popup-header el-dialog__header">
                    <span class="el-dialog__title" v-text="title || $t('common.hint')"></span>
                    <div class="popup-close el-dialog__headerbtn">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                    </div>
                </div>
                <div class="el-dialog__body">
                    <div class="popup-text"></div>
                    <div class="popup-html"></div>
                </div>
                <div class="popup-footer el-dialog__footer">
                    <div class="dialog-footer">
                        <el-button type="primary" :loading="loading" :disabled="disabled" class="popup-button">
                            <span v-text="loading ? sending || $t('common.sending') : ok || $t('common.ok')"></span>
                        </el-button>
                    </div>
                </div>
            </div>`
    },
    confirm: {
        in: inAnimate,
        out: outAnimate,
        close: closeCallback,
        factory: factory,
        template: `
            <div class="popup-box popup-confirm el-dialog">
                <div class="popup-header el-dialog__header">
                    <span class="el-dialog__title" v-text="title || $t('common.hint')"></span>
                    <div class="popup-close el-dialog__headerbtn">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                    </div>
                </div>
                <div class="el-dialog__body">
                    <div class="popup-text"></div>
                    <div class="popup-html"></div>
                </div>
                <div class="popup-footer el-dialog__footer">
                    <div class="dialog-footer">
                        <el-button type="primary" :loading="loading" :disabled="disabled" class="popup-button">
                            <span v-text="loading ? sending || $t('common.sending') : ok || $t('common.ok')"></span>
                        </el-button>
                        <el-button class="popup-button" :disabled="loading || disabled">
                            <span v-text="cancel || $t('common.cancel')"></span>
                        </el-button>
                    </div>
                </div>
            </div>`
    }
});

// i18n.on('change', function() {
//     popup.setGlobalOptions({
//         alert: {
//             button: [i18n.getLang('common.ok')]
//         },
//         confirm: {
//             button: [i18n.getLang('common.ok'), i18n.getLang('common.cancel')]
//         }
//     });
// });