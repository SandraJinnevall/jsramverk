<template>
    <div>
        <v-app id="inspire">
            <v-card
            color="white"
            flat
            height="200px"
            tile
            >
            <v-toolbar>
                <v-spacer></v-spacer>
                <v-btn class="save" v-on:click="savedData()" icon>
                     SAVE
                </v-btn>
                <v-spacer></v-spacer>
            </v-toolbar>
                <v-alert v-if="savesucess" dismissible type="success">
                    Your document is now saved and can be found on "SE SAVED DOCS!"
                </v-alert>
                <v-alert v-if="infoalert" dismissible type="info">
                    Sorry! The heading and content must be filled in to save a document!
                </v-alert>
                <div class="texteditor">
                    <p v-if="this.docid">Current editing document: {{this.docName}}</p>
                    <p v-if="!this.docid">Create a new document below</p>
                    <p style="font-style:oblique;">Don't forget to press "SAVE"</p>
                    <p> Name your document: <input class="docname" type="text" v-model="docName"></p>
                    <input type="text" style="width:800px; height:200px; border:1px solid black;" name="name" value="" v-model="content"/>
                </div>
            </v-card>
        </v-app>
    </div>
</template>

<script>
import Vue from 'vue';
import axios from "axios";
import io from "socket.io-client";


export default {
    components: { 
        
    },
    data: function() {
        return {
            docid: this.$currentdoc._id,
            content: this.$currentdoc.documentText,
            docName: this.$currentdoc.documentHeading,
            savesucess: false,
            infoalert: false,
            text: "",
            socket: io(),
            docData: {}
        }
    },
    created () {
        this.socket = io("http://localhost:1337");
        // this.socket = io("https://jsramverk-editor-saji19.azurewebsites.net/");
    },
    mounted () { 
        this.emitDocData(); 
        this.socket.on("text", (docData) => {
            console.log(docData);
            console.log("1", docData);
            this.docName = docData.docName
            this.content = docData.content;
            console.log("2", docData);
        });
    },
    watch: {
        content: function () {
            this.emitDocData();
        },
        docName: function () {
            this.emitDocData();
        }
    },
    methods: {
        savedData: function() {
            if (this.$currentdoc._id === "") {
                if (this.docName === "" || this.content === "") {
                    this.infoalert = true;
                } else {
                    this.savesucess = true;
                    //add new doc to database
                    axios.post(`https://jsramverk-editor-saji19.azurewebsites.net/`, {
                        documentHeading: this.docName,
                        documentText: this.content
                    });
                    this.docName = "";
                    this.content = "";
                }
            } else {
                axios.put(`https://jsramverk-editor-saji19.azurewebsites.net/${this.$currentdoc._id}`, {
                    documentHeading: this.docName,
                    documentText: this.content
                });
                Vue.prototype.$currentdoc._id = "";
                Vue.prototype.$currentdoc.documentHeading = "";
                Vue.prototype.$currentdoc.documentText = "";
                this.docName = "";
                this.content = "";
                this.docid = "";
            }
        },
        emitDocData () {
            this.docData = {
                _id: this.docid,
                content: this.content,
                docName: this.docName
            }
            console.log(this.docData.content)
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
</style>