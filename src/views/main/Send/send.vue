<template>
    <div class="main" style="min-height: 550px;">
       <p class="text-subtitle-1 font-weight-bold">Send Money</p>
        <v-divider></v-divider>
        <div style="width: 400px;" class="mt-5">
            <p class="text-subtitle-1 font-weight-bold mb-2">Recipient</p>
            <v-text-field
                outlined
                v-model="recipient"
                label="Contact name or Callchain address"
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
                <v-combobox
                    style="width: 150px;"
                    class="ml-2"
                    v-model="select"
                    :items="items"
                    item-color="primary"
                    dense
                    outlined
                    @change="handleBlur"
                ></v-combobox>
            </div>
        </div>
        <v-btn width="300" @click="handleConfrim" color="primary">Send CALL</v-btn>
    </div>
</template>
<script>
export default {
    name: 'receive',
    data: () => ({
        recipient: '',
        recipientReceive: '',
        items: [{ text: 'asd', value: '1'}, { text: 'as12d', value: '2'}, { text: 'as123d', value: '3'}],
        select: ''
    }),
    methods: {
        handleConfrim(){
            this.$router.push('./sendConfirm')
        },
        /// 下拉框输入
        handleBlur() {
            console.log(this.select)
        }
    }
}
</script>