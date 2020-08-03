<template>
<v-card
    class="mx-auto"
    max-width="1200"
    outlined
    light
  >
  <div class="login">
    <div class="text-center text-h4 pt-6 pb-6">Create a Callchain Wallet</div>
    <v-divider></v-divider>
    <div style="width: 90%; margin-left: 5%; padding: 20px 0;">
      <p class="text-subtitle-1">Callchain is global open blockchain system for everyone's token issue. One click, easy and fast asset blockchain system.</p>
      <p class="text-subtitle-1">Your Wallet is only as safe as your Wallet username and passphrase, used to encrypt your Wallet data. Choose a passphrase you can easily remember but others cannot guess. Hint: Mix letters, numbers, and symbols.
      </p>
      <p class="text-subtitle-1" style="color: red;">Only you have this Wallet username and passphrase and are responsible for their safekeeping. <br/> Callchain cannot recover them if you forget them!</p>
      <div class="form-item" style="width: 400px;">
          <p class="font-weight-bold mb-1">Create Wallet username</p>
          <v-text-field
            outlined
            v-model="walletName"
            label=""
            solo
            flat
            dense
          ></v-text-field>
      </div>
      <div class="d-flex">
          <div class="form-item" style="width: 400px;">
            <p class="font-weight-bold mb-1">Create Wallet passphrase</p>
            <v-text-field
                outlined
                v-model="passphrase"
                type="password"
                label=""
                solo
                flat
                dense
            ></v-text-field>
            </div>
            <div class="form-item ml-5" style="width: 400px;">
            <p class="font-weight-bold mb-1">Re-enter passphrase</p>
            <v-text-field
                outlined
                v-model="repassphrase"
                type="password"
                label=""
                solo
                flat
                dense
            ></v-text-field>
        </div>
      </div>
      <div class="form-item" style="width: 400px;" v-if="isShowKey">
          <p class="font-weight-bold mb-1">Secret Account Key <v-hover v-slot:default="{ hover }"><span :class="hover ? 'primary--text text-decoration-underline': 'primary--text'" style="cursor: pointer;" @click="isShowKey = false; key='';">Hide</span></v-hover></p>
          <v-text-field
            outlined
            v-model="key"
            label=""
            solo
            flat
            dense
          ></v-text-field>
      </div>
      <v-btn width="400" large color="primary" depressed @click="handleRegister" :disabled="canILogin? false:true">Create Wallet</v-btn>
      <v-card-text style="padding-left: 0;">
        <span>Already have a Wallet? </span>
        <v-hover v-slot:default="{ hover }">
          <span @click="handleBackLogin" :class="hover ? 'primary--text text-decoration-underline': 'primary--text'" style="cursor: pointer">Open Wallet</span>
        </v-hover>
      </v-card-text>
      <v-card-text style="padding-left: 0; padding-top: 0;" v-if="!isShowKey">
        <span>Need to use your Secret Key? </span>
        <v-hover v-slot:default="{ hover }">
          <span @click="isShowKey = true" :class="hover ? 'primary--text text-decoration-underline': 'primary--text'" style="cursor: pointer">Use Key</span>
        </v-hover>
      </v-card-text>
    </div>
  </div>

    <v-dialog
      v-model="dialog"
      max-width="300"
    >
      <v-card>
        <v-card-title></v-card-title>
          <v-card-text class="text-center">{{warn_text}}</v-card-text>
            <v-card-actions class="d-flex align-center justify-center pb-5">
                <v-btn
                  color="primary"
                  @click="dialog=false"
                >
                  OK
                </v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
</v-card>
</template>

<script>
// @ is an alias to /src
import api from '../api/index';
import Blob from '../api/Blob';

export default {
  name: 'Register',
  data: () => ({
    walletName: '',
    passphrase: '',
    repassphrase: '',
    key: '',
    isShowKey: false,
    canILogin: false,
    dialog: false,
    warn_text: ''
  }),
  methods: {
    // 点击回上一页
    handleBackLogin() {
        this.$router.go(-1)
    },
    // 注册
    handleRegister() {
        // do something
        var wallet;
        if (this.key !== '') {
          if (!call.CallAPI._PRIVATE.schemaValidator.isValidSecret(this.key)) {
            this.warn_text = 'Invalid secret key';
            this.dialog = true;
            return;
          }
          wallet = api.fromSecret(this.key);
        }
        else
        {
           wallet = api.generateAddress();
        }
        
        var blob = {
          data: {
            master_seed: wallet.secret,
            account_id: wallet.address,
            contacts: []
          },
          meta: {
            created: (new Date()).toJSON(),
            modified: (new Date()).toJSON()
          }
        };
        var ret = Blob.encrypt(this.walletName, this.passphrase, blob);
        if (ret !== 'OK') {
          this.warn_text = ret;
          this.dialog = true;
          return;
        }
        this.$router.push({name: 'welcome', params: wallet});
    }
  },
  watch: {
    passphrase(a, b) {
        if(this.walletName != '' && this.passphrase != '' && this.passphrase === this.repassphrase){
            this.canILogin = true
        } else {
            this.canILogin = false
        }
    },
    repassphrase(a, b) {
        if(this.walletName != '' && this.passphrase != '' && this.passphrase === this.repassphrase){
            this.canILogin = true
        } else {
            this.canILogin = false
        }
    },
    walletName(a, b) {
        if(this.walletName != '' && this.passphrase != '' && this.passphrase === this.repassphrase){
            this.canILogin = true
        } else {
            this.canILogin = false
        }
    },
  }
}
</script>
