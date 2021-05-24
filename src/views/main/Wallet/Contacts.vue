<template>
    <v-card flat style="position: relative;">
        <v-btn style="position: absolute; right: 0; top: 0;" @click="handleShowAdd" color="primary" :disabled="isShowAdd? true: false">Add Contact</v-btn>
        <div v-if="!isShowAdd">
            <v-data-table 
            calculate-widths
            :headers="headers"
            :items="contract_list"
            sort-by="calories"
            :items-per-page="-1"
            hide-default-footer
            >   
                <template v-slot:[`item.actions`]="{ item }">
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
                label=""
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
                label=""
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
                <v-btn width="180px" @click="handleConfirm" color="primary" class="ml-5" :disabled="canIAdd? false: true">{{mode === 'add' ? 'Add Contact' : 'Edit Contact'}}</v-btn>
            </div>
            <p class="text-body-2 mt-2">You don't have any contacts yet. Click on "Add contact" button in the top right corner to add a new contact.</p>
        </div>

        <v-dialog
            v-model="dialog"
            max-width="600"
            >
            <v-card>
                <v-card-title></v-card-title>
                <v-card-text class="text-center">{{warn_text}}</v-card-text>
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
    name: 'Contacts',
    data: () => ({
        isShowAdd: false, /// 是否能点击添加按钮
        canIAdd: false, /// 填完 name address 才能添加
        dialog: false, /// 是否显示弹窗
        headers: [{ text: 'Name', value: 'title', width: 200, sortable: false }, { text: 'Address', value: 'content' }, { text: 'Actions', value: 'actions', width: 150, align: 'center', sortable: false },],
        name: '',
        address: '',
        mode: '', // add or edit
        warn_text: '',
        currentItem: {}
    }),
    created() {
        this.isShowAdd = false;
        this.canIAdd = false;

    },
    computed: {
        contract_list() {
            let contacts = this.$store.state.blob.data.contacts;
            let result = [];
            Object.keys(contacts).forEach(function(key) {
                result.push({title: key, content: contacts[key]});
            });
            return result;
        }
    },
    methods: {
        /// 新增
        handleShowAdd() {
            this.isShowAdd = true;
            this.mode = 'add';
        },
        resetAddFace() {
            this.isShowAdd = false;
            this.name = '';
            this.address = '';
            this.mode = '';
            this.currentItem = {};
        },
        /// 新增
        handleConfirm() {
            let contacts = this.$store.state.blob.data.contacts;
            if (this.mode === 'add')
            {
                if (contacts[this.name]) {
                    this.dialog = true;
                    this.warn_text = 'Same name exists';
                    return;
                }
                for (let key in contacts) {
                    let value = contacts[key];
                    if (value === this.address) {
                        this.dialog = true;
                        this.warn_text = 'Same address exists';
                        return;
                    }
                }
                this.$store.commit('newContact', {title: this.name, content: this.address});
                this.resetAddFace();
            }
            else if (this.mode === 'edit')
            {
                if (this.currentItem.title === this.name && this.currentItem.content === this.address) {
                    this.resetAddFace();
                    return;
                }
                if (this.currentItem.title !== this.name && contacts[this.name]) {
                    this.dialog = true;
                    this.warn_text = 'Same name exists';
                    return;
                }
                if (this.currentItem.content !== this.address) {
                    for (let key in contacts) {
                        let value = contacts[key];
                        if (value === this.address) {
                            this.dialog = true;
                            this.warn_text = 'Same address exists';
                            return;
                        }
                    }
                }
                this.$store.commit('updateContact', {title: this.name, content: this.address, 
                    delBefIns: this.currentItem.title !== this.name, oldtitle: this.currentItem.title});
                this.resetAddFace();
            }
            
        },
        /// 编辑
        editItem (item) {
            this.isShowAdd = true;
            this.mode = 'edit';
            this.name = item.title;
            this.address = item.content;
            this.currentItem = item;
        },
        /// 点击显示弹窗删除
        deleteItem (item) {
            this.currentItem = this.item;
            this.mode = 'del';
            this.warn_text = 'Are you want to delete this item?';
            this.dialog = true;
        },
        /// 确认删除
        handleDialogConfirm() {
            this.dialog = false;
            if (this.mode !== 'del') return;

            // for delete
            this.$store.commit('delContact', this.currentItem.title);
            this.resetAddFace();
        },
        checkAdd() {
            if(this.name != '' && this.address != ''){
                this.canIAdd = true
            } else {
                this.canIAdd = false
            }
        }
    },
    watch: {
        name(a, b) {
            this.checkAdd();
        },
        address(a, b) {
            this.checkAdd();
        }
    }
}
</script>