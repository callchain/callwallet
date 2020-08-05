<template>
    <div class="main pa-8" style="min-height: 550px;">
        <div>
            <div class="d-flex align-center justify-space-between mb-5">
                <span class="text-subtitle-1 font-weight-bold">Issue Token to User</span>
            </div>
            <v-divider></v-divider>

            <div>
                <div style="width: 300px;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Recipient</p>
                    <v-text-field
                        outlined
                        v-model="recipient"
                        label="Contract name or Callchain address"
                        solo
                        flat
                        dense
                    ></v-text-field>
                </div>
                <div style="width: 300px;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Recipient will receive</p>
                    <div class="d-inline-flex">
                        <v-text-field
                            outlined
                            v-model="recipientReceive"
                            label="Amount"
                            solo
                            flat
                            dense
                        ></v-text-field>
                        <span class="mt-2 ml-5">USDT</span>
                    </div>
                </div>
                <!-- <div style="width: 300px;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Invoice ID</p>
                    <v-text-field
                        outlined
                        v-model="invoiceID"
                        label="Invoice ID"
                        solo
                        flat
                        dense
                    ></v-text-field>
                </div> -->
                <div class="">
                    <v-btn outlined color="primary" @click="showStatus = 0" width="100">back</v-btn>
                    <v-btn class="ml-5" color="primary" @click="showStatus = 0" width="180">comfirm</v-btn>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../../../api/index';

export default {
    name: 'issue to user',
    data: () => ({

        recipient: '',
        recipientReceive: '',
        invoiceID: '',

        currentIssue: {}

    }),
    methods: {
        async confirmIssue() {
        }
    },
    components: {
    },
    computed: {
    },
    async created() {
        
    }
}
</script>