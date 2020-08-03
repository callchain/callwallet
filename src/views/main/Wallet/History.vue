<template>
    <v-card flat>
        <NoData v-if="nofund"></NoData>
        <div v-if="!nofund">
        <v-data-table
            calculate-widths
            :headers="headers"
            :items="data"
            :items-per-page="10"
            hide-default-footer
        ></v-data-table>
        <v-divider></v-divider>
        <v-btn text style="cursor: pointer;" class="mb-5 mt-5 primary--text text-center">Load More</v-btn>
        </div>
    </v-card>
</template>
<script>
import NoData from '../../../components/NoData';

export default {
    name: 'history',
    data: () => ({
        headers: [{ text: 'Date', value: 'date', width: 200 }, { text: 'Description', value: 'content' }],
        data: [
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
        ]
    }),
    components: {
        NoData
    },
    computed: {
        nofund() {
            return this.$store.state.balance === 0
        }
    }
}
</script>