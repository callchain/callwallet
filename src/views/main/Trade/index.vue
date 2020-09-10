<template>
    <div class="main pa-8" style="min-height: 550px;">
        <v-row>
            <v-col>
                <p class="text-subtitle-1 font-weight-bold">Orderbook</p>
                <v-select
                    style="width: 90%;"
                    class="ml-2"
                    v-model="select"
                    :items="pairs"
                    item-color="primary"
                    dense
                    outlined
                    auto-select-first
                    @change="handleBlur"
                ></v-select>

            </v-col>
            <v-col>
                <p class="text-subtitle-1 font-weight-bold">Trade</p>
                <v-tabs>
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab>BUY</v-tab>
                    <v-tab-item>
                        hello
                    </v-tab-item>

                    <v-tab>SELL</v-tab>
                    <v-tab-item>
                        hello1
                    </v-tab-item>
                </v-tabs>
            </v-col>
        </v-row>
        
        <v-row>
        </v-row>
    </div>
</template>
<script>
export default {
    name: 'trade',
    data: () => ({
        select: '',
        pairs: []
    }),
    mounted() {
    },
    computed: {
        
    },
    methods: {
        handleBlur() {

        }
    }
}
</script>