<template>
    <div class="main pa-8" style="min-height: 550px;">
        <NoData v-if="nofund"></NoData>
        <router-view  v-if="!nofund" />
    </div>
</template>
<script>
import NoData from '../../../components/NoData';

export default {
    name: 'send',
    data: () => ({
        
    }),
    components: {
        NoData
    },
    computed: {
        nofund() {
            return this.$store.state.balance === 0
        }
    },
    methods: {
        
    }
}
</script>