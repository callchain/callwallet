<template>
    <div>
        <NoData v-if="nofund"></NoData>
        <v-card flat style="position: relative;" v-if="!nofund">
            <v-btn style="position: absolute; right: 15px; top: 0;" @click="isShowAdd = true" color="primary" :disabled="isShowAdd? true: false">Add Trust</v-btn>
            <div v-if="!isShowAdd">
                <v-data-table 
                    calculate-widths
                    :headers="headers"
                    :items="data"
                    sort-by="calories"
                    :items-per-page="10"
                    hide-default-footer>   
                    <template v-slot:item.actions="{ item }">
                        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
                    </template>
                    </v-data-table>
                    <v-divider></v-divider>
                    <v-btn text style="cursor: pointer;" class="mb-5 mt-5 primary--text text-center">Load More</v-btn>
                </div>
            <div v-else class="add-edit ml-3 mt-1">
                <div style="width: 300px;">
                    <div class="text-subtitle-1 font-weight-bold">Contact name or Callchain address</div>
                    <v-text-field
                    outlined
                    v-model="name"
                    label="Contact name or Callchain address"
                    solo
                    flat
                    dense
                    ></v-text-field>
                </div>
                <div style="width: 300px;">
                    <div class="text-subtitle-1 font-weight-bold">Token</div>
                    <v-combobox
                        v-model="select"
                        :items="items"
                        item-color="primary"
                        dense
                        outlined
                        @change="handleBlur"
                    ></v-combobox>
                </div>
                
                <div class="d-inline-flex align-center">
                    <v-btn width="100px" @click="isShowAdd = false" outlined color="primary">Cancel</v-btn>
                    <v-btn width="180px" @click="handleAddConfirm" color="primary" class="ml-5">Add Contact</v-btn>
                </div>
            </div>


            <v-dialog
                v-model="dialog"
                max-width="600"
                >
                <v-card>
                    <v-card-title></v-card-title>
                    <v-card-text class="text-center">Are you want to delete this item?</v-card-text>
                    <v-card-actions class="d-flex align-center justify-center pb-5">
                        <v-btn
                            color="primary"
                            outlined
                            text
                            @click="dialog = false"
                        >
                            No
                        </v-btn>
                        <v-btn
                            color="primary"
                            @click="handleDialogConfirm"
                        >
                            Yes, delete
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>
<script>

import NoData from '../../../components/NoData';


export default {
    name: 'contacts',
    data: () => ({
        isShowAdd: false, /// 是否能点击添加按钮
        dialog: false, /// 是否显示弹窗
        headers: [{ text: 'Name/Address', value: 'title', width: 200, sortable: false }, { text: 'Token', value: 'token' }, { text: 'Balance', value: 'balance' }, { text: 'Actions', value: 'actions', width: 150, align: 'center', sortable: false },],
        data: [
            { title: 'gateway1', token: 'qtBcUoHe2zqhVFED6o9or', balance: '100,000' },
            { title: 'gateway32', token: 'cBcUoHe2zqhVFFbgUVED6o9or', balance: '100,000' },
            { title: 'gateway3', token: 'cGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or', balance: '100,000' },
            { title: 'gateway4', token: 'cGa9JzqhVFFbgUVED6o9or', balance: '100,000' },
            { title: 'gateway5', token: 'cGa9Jsd9TkqasdxcfvdfgtBo9asdor', balance: '100,000' },
        ],
        items: [{ text: 'asd', value: '1'}, { text: 'as12d', value: '2'}, { text: 'as123d', value: '3'}],
        name: '',
        select: '', /// token
        deleteIndex: null, /// 记录删除下标
    }),
    created() {
        this.isShowAdd = false;
    },
    methods: {
        /// 确认新增
        handleAddConfirm() {

        },
        /// 显示弹窗删除
        deleteItem (item) {
            this.deleteIndex = this.data.indexOf(item);
            this.dialog = true;
        },
        /// 确认删除
        handleDialogConfirm() {
            this.data.splice(this.deleteIndex, 1);
            this.dialog = false;
        },
         /// 下拉框输入
        handleBlur() {
            console.log(this.select)
        }

    },
    components: {
        NoData
    },
    computed: {
        nofund() {
            return this.$store.state.balance === 0
        }
    },
    // watch: {
    //     name(a, b) {
    //         if(this.name != '' && this.address != ''){
    //             this.canIAdd = true
    //         } else {
    //             this.canIAdd = false
    //         }
    //     },
    //     address(a, b) {
    //         if(this.name != '' && this.address != ''){
    //             this.canIAdd = true
    //         } else {
    //             this.canIAdd = false
    //         }
    //     }
    // }
}
</script>