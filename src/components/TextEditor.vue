<template>
    <div>      
        <v-alert v-if="savesucess" dismissible type="success">
            Your document is now saved and can be found on "SE SAVED DOCS!"
        </v-alert>
        <v-alert v-if="infoalert" dismissible type="info">
            Sorry! The heading and content must be filled in to save a document!
        </v-alert>
        <div class="texteditor">
            <v-icon v-on:click="savedData()">mdi-content-save</v-icon>
            <p v-if="this.docid">Current editing document: {{this.docName}}</p>
            <p v-if="!this.docid">Create a new document below</p>
            <p> Name your document: <input class="docname" type="text" v-on:keyup="emitDocData()" v-model="docName"></p>
            <!-- <textarea id="textarea" v-on:keyup="emitDocData()" style="width:800px; height:200px; border:1px solid black;" v-model="content"></textarea> -->
            <div v-on:keyup="emitDocData()">
                <quill-editor
                        v-model="content"
                    />
            </div>
            <p v-if="owner === true">Share this document with: </p>
            <p v-if="owner === false">Only the owner [{{this.ownerName}}] can share this document</p>
            <div v-for="user in allusers" :key="user._id">
                <input type="checkbox" :id="user._id" :value="user._id" v-model="sharedWith">
                <label :for="user._id">{{user.name}}</label>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import axios from "axios";
import io from "socket.io-client";

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'



export default {
    components: { 
        quillEditor
    },
    data: function() {
        return {
            docid: this.$currentdoc._id,
            content: this.$currentdoc.documentText,
            docName: this.$currentdoc.documentHeading,
            ownerName: this.$currentdoc.ownerName,
            savesucess: false,
            infoalert: false,
            socket: io(),
            docData: {},
            userID: Vue.prototype.$currentuserID,
            userName: Vue.prototype.$currentuserName,
            sharedWith: this.$currentdoc.sharedWith,
            allusers: [],
            owner: false,
            editorOption: {
            // Some Quill options...
            }
        }
    },
    created () {
        // this.socket = io("http://localhost:1337");
        this.socket = io("https://jsramverk-editor-saji19.azurewebsites.net/");
    },
    async mounted () { 
        this.emitDocData(); 
        this.socket.on("text", (docData) => {
            this.docName = docData.docName
            this.content = docData.content;
        });
        if (Vue.prototype.$currentuserID === Vue.prototype.$currentdoc.userId || this.docid === "") {
            this.owner = true;
            try {
                var result = await axios({
                    method: "POST",
                    url: "http://localhost:1337/graphql",
                    data: {
                        query: `
                            {
                                allUsers {
                                    name,
                                    _id
                                }
                            }
                        `
                    }
                });
                console.log(result)
            } catch (error) {
                console.error(error);
            }
            var allusersdata = result.data.data.allUsers;
            for (let i = 0; i < allusersdata.length; i++) {
                if (allusersdata[i]._id !== Vue.prototype.$currentuserID) {
                    this.allusers.push(allusersdata[i])
                }
            }
        }
    },
    methods: {
        savedData: function() {
            if (this.$currentdoc._id === "") {
                if (this.docName === "" || this.content === "") {
                    this.infoalert = true;
                } else {
                    this.savesucess = true;
                    axios.post(`https://jsramverk-editor-saji19.azurewebsites.net/`, {
                        documentHeading: this.docName,
                        documentText: this.content,
                        userId: this.userID,
                        sharedWith: this.sharedWith,
                        ownerName: this.userName
                    });
                    this.docName = "";
                    this.content = "";
                    this.sharedWith = [];
                    this.owner = true;
                }
            } else {
                axios.put(`https://jsramverk-editor-saji19.azurewebsites.net/${this.$currentdoc._id}`, {
                    documentHeading: this.docName,
                    documentText: this.content,
                    sharedWith: this.sharedWith
                });
                Vue.prototype.$currentdoc._id = "";
                Vue.prototype.$currentdoc.documentHeading = "";
                Vue.prototype.$currentdoc.documentText = "";
                Vue.prototype.$currentdoc.sharedWith = "";
                this.docName = "";
                this.content = "";
                this.docid = "";
                this.sharedWith = [];
            }
        },
        emitDocData () {
            console.log(this.content)
            this.docData = {
                _id: this.docid,
                content: this.content,
                docName: this.docName
            }
            this.socket.emit("text", this.docData);
            this.socket.emit("create", this.docData._id);
        }
    }
}
</script>

<style scoped>
.texteditor {
  width: 60%;
  height: 300px;
  margin: 0 auto;
  padding-top: 80px;
}

#inspire {
    max-height: 700px;
}

.docname {
    border-bottom: 1px solid black;
    margin: 5px;
}

.save {
    background: green;
}

#textarea {
    background-color: white;
}
</style>