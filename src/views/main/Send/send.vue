<template>
    <div class="main" style="min-height: 550px;">
       <p class="text-subtitle-1 font-weight-bold">{{$t('send.send.sendmoney')}}</p>
        <v-divider></v-divider>
        <div style="width: 400px;" class="mt-5">
            <p class="text-subtitle-1 font-weight-bold mb-2">{{$t('send.send.recipient')}}</p>
            <v-text-field
                outlined
                v-model="recipient"
                label="Callchain address"
                solo
                flat
                dense
                @blur="checkReceipt"
            ></v-text-field>
        </div>
        <div style="width: 400px;">
            <p class="text-subtitle-1 font-weight-bold mb-2">{{$t('send.send.willreceive')}} {{issuer}}</p>
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
                    v-model="select"
                    :items="currencies"
                    item-color="primary"
                    dense
                    outlined
                    auto-select-first
                    @change="handleBlur"
                ></v-select>
            </div>
        </div>
        <!-- memo -->
        <div style="width: 400px;" class="mb-2">
            <p class="text-subtitle-1 font-weight-bold mb-2">{{$t('send.send.memo')}}</p>
            <v-text-field
                outlined
                v-model="memo"
                label="Optional"
                counter=256
                solo
                flat
                dense
                @blur="checkMemo"
            ></v-text-field>
        </div>

        <v-btn width="300" @click="handleConfrim" color="primary" :disabled="canSend ? true : false">{{$t('send.send.send')}} {{select && select.text ? select.text : ''}}</v-btn>
    </div>
</template>
<script>

import utils from '../../../api/utils';

export default {
    name: 'send',
    data: () => ({
        recipient: '',
        recipientReceive: '',
        select: '',
        issuer: '',
        canSend: false,
        balance_map: {},
        memo: ''
    }),
    computed: {
        currencies() {
            var ret = [];
            var list = this.$store.state.balance_list;
            for (var key in list)
            {
                var item = list[key];
                if (Number(item.value) < 0) continue;
                ret.push(item.currency);
                this.balance_map[item.currency] = item;
            }
            return ret;
        }
    },
    methods: {
        handleConfrim(){
            if (!this.recipient || this.recipient.length === 0) {
                this.$toast.error("Invalid Recipient");
                return;
            }

            if (!this.recipientReceive || this.recipientReceive.length === 0) {
                this.$toast.error("Invalid Amount");
                return;
            }

            var currency = this.select;
            if (!currency || currency.length === 0) {
                this.$toast.error("Invalid Currency");
                return;
            }

            var issuer = this.balance_map[currency];
            this.$router.push({name: 'sendConfirm', params: {recipient: this.recipient, amount: this.recipientReceive,
                currency: issuer, memo: this.memo}});
        },
        /// 下拉框输入
        handleBlur() {
        },
        checkReceipt() {
            this.recipient = this.recipient.trim();
            if (this.recipient === '') return false;
            if (!utils.isValidAddr(this.recipient))
            {
                this.$toast.error("Invalid recipient address");
                this.recipient = '';
                return false;
            }
            var address = this.$store.state.address;
            if (this.recipient === address) {
                this.$toast.error("Send to yourself is not unnecessary");
                this.recipient = '';
                return false;
            }
            return true;
        },
        checkMemo() {
            this.memo = this.memo.trim();
            if (this.memo === '') return;
            if (this.memo.length > 256) {
                this.$toast.error("Memo exceed limit length");
                this.memo = this.memo.substring(0, 256);
                return;
            }
        }
    },
    watch: {
        recipientReceive(newv, oldv) {
            if (Number(newv) === NaN) {
                this.$nextTick(() => {
                    this.recipientReceive = '';
                });
                return;
            }
            if (!this.select || _.isEmpty(this.select)) return; // not select currency

            var amount = newv;
            var currency = this.select;
            var issuer = this.balance_map[currency];
            var balances = this.$store.state.balance_list;
            var key = issuer.counterparty ? issuer.currency + '@' + issuer.counterparty : issuer.currency;
            var bal = balances[key];

            if (!bal) {
                this.$nextTick(() => {
                    this.recipientReceive = oldv;
                });
                this.$toast.error("You have no funds for " + currency);
                return;
            }

            if (issuer.currency === 'CALL') amount = Number(amount) + 0.0001;
            if (amount > Number(bal.value)) {
                this.$nextTick(() => {
                    this.recipientReceive = oldv;
                });
                this.$toast.error("Insufficient balance for " + currency);
                return;
            }
        }
    }
}
</script>