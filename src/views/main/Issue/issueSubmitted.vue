<template>
    <div class="main ml-2 mt-4" style="min-height: 550px;">
        <p class="text-h4">Your transaction has been submitted.</p>
        <p>Transaction Hash: {{hash}}</p>
        <p>Your issue list wil update once the issueset has cleared.</p>
        <v-divider></v-divider>
        <div></div>
        <v-hover v-slot:default="{ hover }">
            <div @click="handleBackBlance" :class="hover? 'primary--text':'primary--text text-decoration-underline'" style="display: inline-block; cursor: pointer; line-height: 40px;">Back to Issue List</div>
        </v-hover>
    </div>
</template>
<script>
export default {
    name: 'issue-submitted',
    data: () => ({
        hash: ''
    }),
    created() {
        var params = this.$route.params;
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