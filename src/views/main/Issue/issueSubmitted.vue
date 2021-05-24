<template>
    <div class="main mt-4" style="min-height: 550px;">
        <p class="text-h4">{{$t('issue.submitted.submitted')}}</p>
        <p>{{$t('issue.submitted.hash')}} {{hash}}</p>
        <p>{{$t('issue.submitted.update')}}</p>
        <v-divider></v-divider>
        <div></div>
        <v-hover v-slot:default="{ hover }">
            <div @click="handleBackBlance" :class="hover? 'primary--text':'primary--text text-decoration-underline'" style="display: inline-block; cursor: pointer; line-height: 40px;">{{$t('issue.submitted.back')}}</div>
        </v-hover>
    </div>
</template>
<script>
export default {
    name: 'IssueSubmitted',
    data: () => ({
        hash: ''
    }),
    created() {
        let params = this.$route.params;
        if (_.isEmpty(params.id)) {
            this.$router.push('newIssue')
        } else {
            this.hash = params.id
        }
    },
    methods: {
        // back to issue list
        handleBackBlance() {
            this.$router.push('./issue')
        }
    }
}
</script>