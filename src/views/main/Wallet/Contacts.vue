<template>
    <v-card flat style="position: relative;">
        <v-btn style="position: absolute; right: 0; top: 0;" @click="handleShowAdd" color="primary" :disabled="isShowAdd? true: false">Add Contact</v-btn>
        <div v-if="!isShowAdd">
            <v-data-table 
            calculate-widths
            :headers="headers"
            :items="contract_list"
            sort-by="calories"
            :items-per-page="10"
            hide-default-footer
            >   
                <template v-slot:item.actions="{ item }">
                    <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                        small
                        @click="deleteItem(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>
            <!-- <v-divider></v-divider> -->
        </div>

        <div v-else class="add-edit">
            <div style="width: 300px;">
                <div class="text-subtitle-1 font-weight-bold">Name</div>
                <v-text-field
                outlined
                v-model="name"
                label="name"
                solo
                flat
                dense
                ></v-text-field>
            </div>
            <div style="width: 300px;">
                <div class="text-subtitle-1 font-weight-bold">Address</div>
                <v-text-field
                outlined
                v-model="address"
                label="address"
                solo
                flat
                dense
                ></v-text-field>
            </div>
            <!-- <div style="width: 300px;">
                <div class="text-subtitle-1 font-weight-bold">Destination tag</div>
                <v-text-field
                outlined
                v-model="tag"
                label="Destination tag"
                solo
                flat
                dense
                ></v-text-field>
            </div> -->
            <div class="d-inline-flex align-center">
                <v-btn width="100px" @click="isShowAdd = false" outlined color="primary">Cancel</v-btn>
                <v-btn width="180px" @click="handleAddConfirm" color="primary" class="ml-5" :disabled="canIAdd? false: true">Add Contact</v-btn>
            </div>
            <p class="text-body-2 mt-2">You don't have any contacts yet. Click on "Add contact" button in the top right corner to add a new contact.</p>
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
</template>
<script>
export default {
    name: 'contacts',
    data: () => ({
        isShowAdd: false, /// 是否能点击添加按钮
        canIAdd: false, /// 填完 name address 才能添加
        dialog: false, /// 是否显示弹窗
        headers: [{ text: 'Name', value: 'title', width: 200, sortable: false }, { text: 'Address', value: 'content' }, { text: 'Actions', value: 'actions', width: 150, align: 'center', sortable: false },],
        data: [
            { title: 'gateway', content: 'cGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' },
            { title: 'gateway', content: 'cGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' },
            { title: 'gateway', content: 'cGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' },
            { title: 'gateway', content: 'cGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' },
            { title: 'gateway', content: 'cGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' },
        ],
        name: '',
        address: '',
        tag: '',
        deleteIndex: null, /// 记录删除下标
    }),
    created() {
        this.isShowAdd = false;
        this.canIAdd = false;
    },
    computed: {
        contract_list() {
            return this.$store.state.blob.data.contacts
        }
    },
    methods: {
        /// 新增
        handleShowAdd() {
            this.isShowAdd = true;
        },
        /// 新增
        handleAddConfirm() {

        },
        /// 编辑
        editItem (item) {
            
        },
        /// 点击显示弹窗删除
        deleteItem (item) {
            this.deleteIndex = this.data.indexOf(this.item);
            this.dialog = true;
        },
        /// 确认删除
        handleDialogConfirm() {
            this.dialog = false;
            this.data.splice(this.deleteIndex, 1);
        }

    },
    watch: {
        name(a, b) {
            if(this.name != '' && this.address != ''){
                this.canIAdd = true
            } else {
                this.canIAdd = false
            }
        },
        address(a, b) {
            if(this.name != '' && this.address != ''){
                this.canIAdd = true
            } else {
                this.canIAdd = false
            }
        }
    }
}
</script>