<template>
    <v-card flat>
        <v-card-text>
        <div class="text-h5 text-center mt-5 mb-5">
           {{$t('nodata.welcome')}}
        </div>
        <p class="text-subtitle-2 text-center pt-5 pb-5">{{$t('nodata.nofund')}}</p>
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    name: 'noData',
}
</script>