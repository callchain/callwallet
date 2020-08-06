<template>
    <v-card flat class="ml-2 pb-10">
        <p class="text-subtitle-1 font-weight-bold mt-1">Options</p>
        <v-divider></v-divider>
        <p class="text-h6 font-weight-bold mt-5 mb-1">Callchain Service</p>
            <p class="text-subtitle-2 mb-1">WebSocket hostname, port, secure</p>
            <div class="d-flex" style="width: 400px; height: 44px">
                <v-text-field
                    style="width: 250px;"
                    outlined
                    v-model="sendData.host"
                    solo
                    flat
                    dense
                ></v-text-field>
                <v-text-field
                    style="width: 130px;"
                    class="ml-5"
                    outlined
                    v-model="sendData.port"
                    solo
                    flat
                    dense
                ></v-text-field>
            </div>
            <v-checkbox
                class="mt-0"
                v-model="sendData.ssl"
                label="Use secure WebSocket"
            ></v-checkbox>
        <v-btn class="ml-5 pl-10 pr-10" color="primary" @click="handleSave">Save</v-btn>
    </v-card>
</template>

<script>
export default {
    name: 'options',
    data: () => ({
        sendData: { 
            host: '', 
            port: '', 
            ssl: false 
        }
    }),
    created() {
        var server = this.$store.state.server;
        this.sendData = server;
    },
    methods: {
        // 保存
        handleSave() {

        }
    }
}
</script>