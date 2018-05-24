<template>
    <section class="tab-bar">
        <ul>
            <li :class="{'tab-item': true, active: index === curTabIndex}"
                v-for="(item, index) in tabs"
                @click="tab(index)">
                <i :class="['fa', index === curTabIndex ? item.active : item.inactive]"></i>
                <p class="label" v-text="item.label"></p>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
    data() {
        const T = this.$i18n.getT('components.Frame');
        return {
            T,
            tabs: [
                {
                    active: 'fa-heart',
                    inactive: 'fa-heart-o',
                    label: T('favorite')
                },
                {
                    active: 'fa-hand-spock-o',
                    inactive: 'fa-hand-stop-o',
                    label: T('discover')
                },
                {
                    active: 'fa-user-circle',
                    inactive: 'fa-user-circle-o',
                    label: T('myCenter')
                }
            ],
            curTabIndex: 1
        };
    },
    methods: {
        tab(index) {
            console.log(index);
            this.curTabIndex = index;
        }
    }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import '~less-lib';

.tab-bar {
    .nosel;
    ul {
        .mean(3);
        text-align: center;
    }

    li {
        height: 0.9rem;
        line-height: 0.9rem;
    }

    i {
        margin-bottom: .1rem;
        .ftsz(.4rem);
        vertical-align: middle;
        color: #999;
    }

    .label {
        .ftsz(.24rem);
        color: #999;
    }

    .tab-item.active {
        .label,
        i {
            color: @blue;
        }
    }
}
</style>
