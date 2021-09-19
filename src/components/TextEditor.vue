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
                    <p> Name your document: <input class="docname" type="text" v-model="docName" required></p>
                    <vue-editor v-model="content" required></vue-editor>
                </div>
            </v-card>
        </v-app>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-quill-editor';
import Vue from 'vue';
import axios from "axios";

export default {
    components: { 
        VueEditor
    },
    data: function() {
        return {
            docid: this.$currentdoc._id,
            content: this.$currentdoc.documentText,
            docName: this.$currentdoc.documentHeading,
            savesucess: false,
            infoalert: false
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
