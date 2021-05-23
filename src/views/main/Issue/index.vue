<template>
    <div class="main ma-4" style="min-height: 550px;">
        <NoData v-if="nofund"></NoData>
        <router-view  v-if="!nofund" />
    </div>
</template>
<script>
import BN from 'bignumber.js';
const ZERO = new BN(0);
import NoData from '../../../components/NoData';

export default {
    name: 'issue',
    data: () => ({
        
    }),
    components: {
        NoData
    },
    computed: {
        nofund() {
            return this.$store.state.balance.isEqualTo(ZERO);
        }
    },
    methods: {
        
    }
}
</script>