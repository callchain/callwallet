<template>
    <div class="main ma-4" style="min-height: 550px;">
        <div>
            <div class="d-flex align-center justify-space-between mb-5">
                <span class="text-subtitle-1 font-weight-bold">{{$t('issue.list.issued')}}</span>
                <v-btn color="primary" @click="goNew()">{{$t('issue.list.new')}}</v-btn>
            </div>
            <v-divider></v-divider>
            <div class="mt-3 d-flex align-center flex-wrap">
                <span v-if="issues.length === 0">{{$t('issue.list.noissue')}}</span>
                <v-hover v-for="item in issues" :key="item.currency" v-slot:default="{ hover }">
                    <v-card @click="goIssueToUser(item)" width="31%" :elevation="hover ? 6 : 2" style="margin: 8px .5%">
                        <div :class="hover?'d-inline-flex justify-space-between pa-2 text-body-1 cardHover white--text':'d-inline-flex justify-space-between pa-2 text-body-1 primary white--text'" style="width: 100%;">
                            <span class="text-subtitle-1">{{item.currency}}</span>
                            <span class="text-subtitle-1">{{item.fans | numberFormat}} {{$t('issue.list.users')}}</span>
                        </div>
                        <v-divider></v-divider>
                        <v-card-text class="text-center text-h6 pt-6 pb-6"><span class="primary--text">{{item.issued | numberFormat}}</span>/<span>{{item.total | numberFormat}}</span></v-card-text>
                    </v-card>
                </v-hover>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'IssueList',
    data: () => ({
    }),
    methods: {
        // 新增
        goNew() {
            this.$router.push({name: 'newIssue'});
        },
        // 点击进入详情
        goIssueToUser(item) {
            this.$router.push({name: 'issueToUser', params: item});
        }
    },
    computed: {
        issues() {
            let list = [];
            for (let key in this.$store.state.issue_list) {
                let item = this.$store.state.issue_list[key];
                list.push(item);
            }
            return list;
        }
    },
    async created() {
        // check network status
        let status = this.$store.getters.networkStatus;
        if (!status) {
            this.$store.commit('logout');
            return;
        }

        let address = this.$store.state.address;
        let api = this.$store.state.api;
        try {
            let issues = await api.getAccountIssues(address);
            this.$store.commit('initIssues', issues);
        } catch (e) {
            this.$toast.error(e.message);
            console.dir(e);
            if (e.message !== 'actNotFound') {
                this.$store.commit('logout');
            }
        }
    }
}
</script>