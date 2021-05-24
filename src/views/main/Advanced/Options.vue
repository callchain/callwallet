<template>
    <v-card flat class="ml-2 pb-10">
        <p class="text-subtitle-1 font-weight-bold mt-1">{{$t('advanced.options.options')}}</p>
        <v-divider></v-divider>
        <p class="text-h6 font-weight-bold mt-5 mb-1">{{$t('advanced.options.node')}}</p>
            <p class="text-subtitle-2 mb-1 pt-2 pb-4">{{$t('advanced.options.server')}}</p>
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
                :label="$t('advanced.options.ssl')"
            ></v-checkbox>
        <v-btn class="ml-5 pl-10 pr-10" color="primary" @click="handleSave">{{$t('advanced.options.save')}}</v-btn>
    </v-card>
</template>

<script>
import utils from '../../../api/utils';

export default {
    name: 'Options',
    data: () => ({
        sendData: { 
            host: '', 
            port: '', 
            ssl: false 
        },
    }),
    created() {
        let server = this.$store.state.server;
        this.sendData = JSON.parse(JSON.stringify(server));
    },
    methods: {
        // 保存
        async handleSave() {
            if (!utils.isValidDomain(this.sendData.host)) {
                this.$toast.error("Invalid host name");
                return;
            }
            if (!utils.isValidPort(this.sendData.port)) {
                this.$toast.error("Invalid port");
                return;
            }
            let server = this.$store.state.server;
            if (server.host !== this.sendData.host || server.port !== this.sendData.port
                    || server.ssl !== this.sendData.ssl)
            {
                this.$store.commit('updateServer', this.sendData);
                let api = this.$store.state.api;
                try {
                    if (api.isConnected && api.isConnected()) {
                        await api.disconnect();
                    }
                } catch (e) {
                    this.$toast.error(e.message);
                    console.dir(e);
                }
                this.$store.commit('logout');
            }
        }
    }
}
</script>