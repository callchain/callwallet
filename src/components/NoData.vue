<template>
    <v-card flat>
        <v-card-text>
        <div class="text-h5 text-center mt-5 mb-5">
           Welcome to Callchain
        </div>
        <p class="text-subtitle-2 text-center pt-5 pb-5">You currently don't have any Call Token (CALL). To get started you can:</p>
        <div class="d-flex align-center justify-center mt-5 mb-5">
            <v-card outlined flat style="border: none; border-radius: 0;" class="mr-5" width="187">
                <v-img height="270" width="187" src="../assets/from-user.jpg" aspect-ratio="1.7"></v-img>
                <v-card-text class="text-subtitle-2">Have another user send you 1 or more CALL</v-card-text>
            </v-card>
            <v-card outlined flat style="border: none; border-radius: 0;" class="ml-5" width="187">
                <v-img height="270" width="187" src="../assets/from-exchange.jpg" aspect-ratio="1.7"></v-img>
                <v-card-text class="text-subtitle-2">Buy CALL at exchange or from gateway</v-card-text>
            </v-card>
        </div>
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    name: 'noData',
}
</script>