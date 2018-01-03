<template>
    <section id="login">
        <v-language-toggle class="language-toggle"></v-language-toggle>
        <div class="title" v-text="T('title')"></div>
        <div class="box">
            <el-form ref="form"
                     :model="form"
                     :rules="rules"
                     label-width="100px">

                <el-form-item :label="T('userName')"
                              prop="userName">
                    <el-input v-model="form.userName" />
                </el-form-item>

                <el-form-item :label="T('password')"
                              prop="password">
                    <el-input v-model="form.password"
                              type="password" />
                </el-form-item>

                <el-button type="primary"
                           class="submit full"
                           @click="submit"
                           v-text="T('login')"></el-button>

            </el-form>
        </div>
    </section>
</template>

<script>
import { utils } from 'G';
import LanguageToggle from '../../components/LanguageToggle';

export default {
    data() {
        const T = this.$i18n.getT('views.Login');
        return {
            T,

            form: {
                userName: '',
                password: ''
            },

            rules: {
                userName: { required: true, message: T('userNameNotEmpty'), trigger: 'change' },
                password: { required: true, message: T('passwordNotEmpty'), trigger: 'change' }
            }
        };
    },

    components: {
        vLanguageToggle: LanguageToggle
    },

    methods: {
        submit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.login();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        login() {
            const loading = this.$loading({
                target: this.$refs['form'].$el
            });

            // 模拟登录
            setTimeout(() => {
                loading.close();

                let userData = {
                    createDate: Date.now()
                }; // 模拟用户数据

                utils.setStorage('userData', userData);

                console.log('login success!');

                this.$router.push({
                    name: 'home'
                });
            }, 1000);
        }
    }
};
</script>

<style lang="less" rel="stylesheet/less">
@import '~less-lib';

#login {
    height: 100%;
    .lgy3(@blue, @sky, 50%, @green);
    .flex();
    .flex-y();
    .flex-center();

    .title {
        margin-top: -80px;
        .ftsz(50px);
        letter-spacing: 10px;
        color: #fff;
        .text-glow();
    }

    .box {
        margin-top: 40px;
        padding: 20px;
        .bgcl(#fff);
        .bxsd(thin);
    }

    .submit {
        margin-top: 20px;
    }

    .language-toggle {
        position: absolute;
        top: 20px;
        right: 40px;
    }
}
</style>
