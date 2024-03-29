<template>
    <div class="main ma-4" style="min-height: 550px;">
        <div>
            <div class="d-flex align-center justify-space-between mb-5">
                <span class="text-subtitle-1 font-weight-bold">{{$t('issue.new.issue')}}</span>
            </div>
            <v-divider></v-divider>

            <div class="mt-3">
                <div style="width: 30%;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">{{$t('issue.new.symbol')}}</p>
                    <v-text-field
                        outlined
                        v-model="symbol"
                        label="Symbol"
                        solo
                        flat
                        dense
                        @blur="checkSymbol()"
                    ></v-text-field>
                </div>
                <div style="width: 30%;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">{{$t('issue.new.supply')}}</p>
                    <v-text-field
                        outlined
                        v-model="supply"
                        label="Total Supply"
                        type="number"
                        solo
                        flat
                        dense
                        @keydown="inputSupply"
                    ></v-text-field>
                </div>
                <div style="width: 30%;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">{{$t('issue.new.desc')}}</p>
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
                    <v-btn outlined color="primary" @click="goBack()" width="10%">&lt;&lt; {{$t('issue.new.back')}}</v-btn>
                    <v-btn class="ml-5" color="primary" @click="confirmIssue()" width="15%" :disabled="canIssue ? false : true">{{$t('issue.new.ok')}}</v-btn>
                </div>
            </div>

        </div>
    </div>
</template>
<script>

export default {
    name: 'NewIssue',
    data: () => ({
        symbol: '',
        supply: '',
        description: '',
        checkbox: false, // checkbox for invoice token
    }),
    computed: {
        canIssue() {
            return this.isValidSymbol(this.symbol) && this.symbol.length === 3 
                && this.isValidSupply(this.supply)
                && this.description && this.description.length > 0;
        }
    },
    methods: {
        confirmIssue() {
            this.$router.push({name: 'issueConfirm', 
                params: {symbol: this.symbol, supply: this.supply, desc: this.description}}
            );
        },
        goBack() {
            this.$router.go(-1);
        },
        isValidSymbol(s) {
            return /^[1-9A-Za-z]{1,3}$/.test(s);
        },
        isValidSupply(s) {
            return /^[1-9][0-9]{0,12}$/.test(s);
        },
        checkSymbol() {
            if (!this.symbol || this.symbol === '') return;
            
            if (!this.symbol || this.symbol.length !== 3) {
                this.$toast.error('Symbol should have three characters');
                return;
            }
            let list = this.$store.state.issue_list;
            if (list[this.symbol]) {
                this.$toast.error('This symbol token has already issued');
                    this.$nextTick(() => {
                        this.symbol = '';
                    });
                return;
            }
        },
        inputSupply(e) {
            if (e.key === '.') {
                this.$nextTick(() => {
                    this.supply = this.supply.replace(/\./g,'');
                })
            }
            if (e.key === '-') {
                this.$nextTick(() => {
                    this.supply = this.supply.replace(/-/g,'');
                })
            }
        }
    },
    watch: {
        symbol(newv, oldv) {
            if (!this.symbol || this.symbol === '') return;
            if (!this.isValidSymbol(this.symbol)) {
                this.$nextTick(() => {
                    this.symbol = oldv;
                });
                return;
            }
            this.symbol = this.symbol.toUpperCase();
        },
        supply(newv, oldv) {
            if (!this.supply || this.supply === '') return;
            if (!this.isValidSupply(this.supply)) {
                this.$nextTick(() => {
                    this.supply = oldv;
                });
                return;
            }
            this.$nextTick(() => {
                this.supply = parseInt(this.supply) + '';
            });
        },
        description(newv, oldv) {
            if (!this.description || this.description === '') return;
            if (this.description.length > 256) {
                this.$nextTick(() => {
                    this.description = oldv;
                });
            }
        }
    }
}
</script>