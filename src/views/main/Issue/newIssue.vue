<template>
    <div class="main pa-8" style="min-height: 550px;">
        <div>
            <div class="d-flex align-center justify-space-between mb-5">
                <span class="text-subtitle-1 font-weight-bold">Issue New Token</span>
            </div>
            <v-divider></v-divider>

            <div class="mt-3">
                <div style="width: 30%;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Symbol</p>
                    <v-text-field
                        outlined
                        v-model="symbol"
                        label="Symbol"
                        solo
                        flat
                        dense
                    ></v-text-field>
                </div>
                <div style="width: 30%;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Total Supply</p>
                    <v-text-field
                        outlined
                        v-model="supply"
                        label="Total Supply"
                        solo
                        flat
                        dense
                    ></v-text-field>
                </div>
                <div style="width: 30%;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Description</p>
                    <v-textarea
                        outlined
                        no-resize
                        rows="5"
                        name="description"
                        v-model="description"
                    ></v-textarea>
                </div>
                <!-- <v-checkbox
                    class="mt-0"
                    v-model="checkbox"
                    label="Non-Fungible Token"
                ></v-checkbox> -->
                <div class="">
                    <v-btn outlined color="primary" @click="goBack()" width="10%">back</v-btn>
                    <v-btn class="ml-5" color="primary" @click="confirmIssue()" width="15%">issue</v-btn>
                </div>
            </div>

        </div>
    </div>
</template>
<script>

export default {
    name: 'new-issue',
    data: () => ({
        symbol: '',
        supply: '',
        description: '',
        checkbox: false, // 是否默认选中checkbox
    }),
    methods: {
        confirmIssue() {
            this.$router.push({name: 'issueConfirm', 
                params: {symbol: this.symbol, supply: this.supply, desc: this.description}}
            );
        },
        goBack() {
            this.$router.go(-1);
        }
    },
    components: {

    },
}
</script>