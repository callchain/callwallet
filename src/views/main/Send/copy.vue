<template>
    <div class="main pa-8" style="min-height: 550px;">
        <div v-if="showStatus == 0">
            <p class="text-subtitle-1 font-weight-bold">Send Money</p>
            <v-divider></v-divider>
            <div style="width: 400px;" class="mt-5">
                <p class="text-subtitle-1 font-weight-bold mb-2">Recipient</p>
                <v-text-field
                    outlined
                    v-model="recipient"
                    label="Recipient"
                    solo
                    flat
                    dense
                ></v-text-field>
            </div>
            <div style="width: 400px;">
                <p class="text-subtitle-1 font-weight-bold mb-2">Recipient will receive</p>
                <div class="d-inline-flex justify-space-between">
                    <v-text-field
                        style="width: 242px;"
                        outlined
                        v-model="recipientReceive"
                        label="Recipient will receive"
                        solo
                        flat
                        dense
                    ></v-text-field>
                    <v-select
                        style="width: 150px;"
                        class="ml-2"
                        :items="items"
                        dense
                        outlined
                    ></v-select>
                </div>
            </div>
            <v-btn width="300" @click="showStatus = 1" color="primary">Send CALL</v-btn>
        </div>
        <div v-else-if="showStatus == 1">
            <p class="text-subtitle-1 font-weight-bold">You are sending CALL to</p>
            <v-divider></v-divider>
            <p class="text-subtitle-1 font-weight-bold mt-2">Recipient</p>
            <p><span class="font-weight-bold">agent</span>  <span>cGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or</span></p>
            <p>They will receive</p>
            <p>1 CALL</p>
            <p>Are you sure?</p>
            <div class="d-flex">
                <v-btn width="100" @click="showStatus = 0" outlined color="primary">Back</v-btn>
                <v-btn width="150" @click="showStatus = 2" class="ml-5" color="primary">Confirm</v-btn>
            </div>
        </div>

        <div v-else>
            <p>Your transaction has been submitted.</p>
            <p>Your account balance wil update once the payment has cleared.</p>
            <v-divider></v-divider>
            <v-hover v-slot:default="{ hover }">
                <div :class="hover? 'primary--text mt-2':'mt-2'" style="display: inline-block; cursor: pointer; line-height: 40px;">Send another payment</div>
            </v-hover>
            <div></div>
            <v-hover v-slot:default="{ hover }">
                <div @click="handleBackBlance" :class="hover? 'primary--text':''" style="display: inline-block; cursor: pointer; line-height: 40px;">Back to balance</div>
            </v-hover>
        </div>
    </div>
</template>
<script>
export default {
    name: 'receive',
    data: () => ({
        recipient: 'Contact name or Callchain address',
        recipientReceive: '',
        items: ['asd', '128', '215'],
        showStatus: 0,  /// 0=>send  1=>confirm  2=>submitted  3=>cleared
    }),
    methods: {
        handleBackBlance() {
            this.$router.push('./Balance')
        }
    }
}
</script>