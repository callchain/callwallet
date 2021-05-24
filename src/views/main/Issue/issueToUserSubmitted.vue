<template>
    <div class="main mt-4" style="min-height: 550px;">
        <p class="text-h4">{{$t('issue.touserok.submitted')}}</p>
        <p>{{$t('issue.touserok.hash')}} {{hash}}</p>
        <p>{{$t('issue.touserok.update')}}</p>
        <v-divider></v-divider>
        <div></div>
        <v-hover v-slot:default="{ hover }">
            <div @click="backIssue" :class="hover? 'primary--text':'primary--text text-decoration-underline'" style="display: inline-block; cursor: pointer; line-height: 40px;">{{$t('issue.touserok.back')}}</div>
        </v-hover>
    </div>
</template>
<script>
export default {
    name: 'IssueToUserSubmitted',
    data: () => ({
        hash: ''
    }),
    created() {
        let params = this.$route.params;
        if (_.isEmpty(params.id)) {
            this.$router.push('issueToUser')
        } else {
            this.hash = params.id
        }
    },
    methods: {
        // back to issue list
        backIssue() {
            this.$router.push('./issue')
        }
    }
}
</script>