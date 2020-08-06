<template>
    <div class="main" style="min-height: 550px;">
        <p class="text-h4">Your transaction has been submitted.</p>
        <p>Transaction Hash: {{hash}}</p>
        <p>Your issue information wil update once the payment has cleared.</p>
        <v-divider></v-divider>
        <div></div>
        <v-hover v-slot:default="{ hover }">
            <div @click="backIssue" :class="hover? 'primary--text':'primary--text text-decoration-underline'" style="display: inline-block; cursor: pointer; line-height: 40px;">Back to Issue List</div>
        </v-hover>
    </div>
</template>
<script>
export default {
    name: 'issue-to-user-submitted',
    data: () => ({
        hash: ''
    }),
    created() {
        var params = this.$route.params;
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