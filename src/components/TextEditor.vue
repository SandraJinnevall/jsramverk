<template>
    <div style="display: inline-flex; width: 100%; backgroundColor: #F8F9FA;">      
        <div class="texteditor">
            <div class="toolbar" style="display: inline-flex; width: 100%; ">
                <p style="margin-right:50%;"><v-icon style="color: #5C84F1;">mdi-file-document</v-icon> <input class="docname" type="text" v-on:keyup="emitDocData()" v-model="docName"></p>

                <v-icon style="color: #333;" v-on:click="savedData()">mdi-content-save</v-icon>
                <v-icon style="color: #333;" id="pdf" v-on:click="downloadPDF()">mdi-file-pdf-box</v-icon>
                <v-icon style="color: #333;" v-on:click="comment()">mdi-comment</v-icon>
                <v-icon style="color: #333;" v-on:click="getallUsers(), dialog = true">mdi-share</v-icon>
                <v-row justify="center">
                    <v-dialog v-model="dialog" scrollable max-width="200px">
                        <v-card>
                            <v-card-title>Share with</v-card-title>
                            <v-divider></v-divider>
                            <v-card-text style="height: 300px;">
                                <div v-if="owner === true">
                                    <div v-for="user in allusersArray" :key="user._id">
                                        <input style="margin-right:4px;" type="checkbox" :id="user._id" :value="user._id" v-model="sharedWith">
                                        <label :for="user._id">{{user.name}}</label>
                                    </div>
                                </div>
                                <p v-if="owner === false">Only the owner [{{ownerName}}] can share this document</p>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-btn
                                color="blue darken-1"
                                text
                                @click="dialog = false, sharedWith = []"
                                >
                                Close
                                </v-btn>
                                <v-btn
                                color="blue darken-1"
                                text
                                @click="dialog = false"
                                v-if="owner === true"
                                >
                                Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-row>
            </div>
            <div v-on:keyup="emitDocData()">
                <quill-editor style="backgroundColor: white;" v-model="content"/>
            </div>
        </div>
        <v-expansion-panels style="width: 26%; height: 40px; padding-top: 132px; margin-right: 5%;">
            <v-expansion-panel v-on:click="showComments()">
                <v-expansion-panel-header>Comments</v-expansion-panel-header>
                <v-expansion-panel-content v-if="showC === true">
                    <div class="commets" v-for="(item) in docComments" :key="item._id">
                        <div style="display: inline-flex; margin-top:15px;">
                            <v-icon style="width:10px; height:10px; margin-top:7px; margin-right:10px; font-size: 20px;" v-on:click="deleteComment(item._id)">mdi-delete</v-icon>
                            <div style="width:10px; height:10px; margin-top:7px; margin-right:10px" :style="{ 'background-color': item.color }"></div>
                            <p v-on:click="highlightComment(item)">{{item.comment}}</p>
                        </div>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
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
import VueSimpleAlert from "vue-simple-alert";
Vue.use(VueSimpleAlert);



export default {
    components: { 
        quillEditor
    },
    data: function() {
        return {
            docid: Vue.prototype.$currentdoc._id,
            content: Vue.prototype.$currentdoc.documentText,
            docName: Vue.prototype.$currentdoc.documentHeading,
            ownerName: Vue.prototype.$currentdoc.ownerName,
            socket: io(),
            docData: {},
            userID: Vue.prototype.$currentuserID,
            userName: Vue.prototype.$currentuserName,
            sharedWith: Vue.prototype.$currentdoc.sharedWith,
            allusersArray: [],
            owner: false,
            share: false,
            docComments: [],
            showC: false,
            dialog: false
        }
    },
    created () {
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
        }
    },
    methods: {
        savedData: function() {
            this.share = false;
            this.showC = false;
            if (this.$currentdoc._id === "") {
                if (this.docName === "" || this.content === "") {
                    this.$alert("Sorry! The heading and content must be filled in to save a document!")
                } else {
                    axios.post(`https://jsramverk-editor-saji19.azurewebsites.net/`, {
                        documentHeading: this.docName,
                        documentText: this.content,
                        userId: this.userID,
                        sharedWith: this.sharedWith,
                        ownerName: Vue.prototype.$currentuserName
                    });
                    this.docName = "";
                    this.content = "";
                    this.sharedWith = [];
                    this.owner = true;
                    this.$alert("Your document is now saved and can be found in your archive")
                }
            } else {
                axios.put(`https://jsramverk-editor-saji19.azurewebsites.net/${this.$currentdoc._id}`, {
                    documentText: this.content
                });
                Vue.prototype.$currentdoc._id = "";
                Vue.prototype.$currentdoc.documentHeading = "";
                Vue.prototype.$currentdoc.documentText = "";
                Vue.prototype.$currentdoc.sharedWith = "";
                this.docName = "";
                this.content = "";
                this.docid = "";
                this.sharedWith = [];
                this.owner = true;
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
        },
        async getallUsers () {
            this.share = true;
            this.allusersArray = [];
            const result = await axios.post(
                'https://jsramverk-editor-saji19.azurewebsites.net/graphql', {
                query: `
                        {
                            allUsers {
                                name,
                                _id
                            }
                        }
                    `
            })
            var allusersdata = result.data.data.allUsers;
            if (allusersdata === null) {
                this.getallUsers()
            } else {
                for (let i = 0; i < allusersdata.length; i++) {
                    if (allusersdata[i]._id !== Vue.prototype.$currentuserID) {
                        this.allusersArray.push(allusersdata[i])
                    }
                }  
            } 
        },
        async downloadPDF () {
            var title = this.docName;
            await axios({
                    url: `https://jsramverk-editor-saji19.azurewebsites.net/generatePDF/`,
                    // url: `http://localhost:1337/generatePDF/`,
                    data: {
                       documentText: this.content
                    },
                    method: 'POST',
                    responseType: 'blob',
                })
                .then(function (response) {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', title+'.pdf');
                        document.body.appendChild(link);
                        link.click();
                })
                .catch(function (error) {
                    console.log(error)
            });
        },
        async comment () {
            if (this.$currentdoc._id === "") {
                this.$alert("You need to save the document before commenting");
                return
            }
            //Set color
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            var currcolor = color;
            //if a string is not selected then... else..
            if (window.getSelection().toString() === "") {
                this.$alert("You need to select the text you want to comment")
            } else {
                var markedtext = window.getSelection().toString();
                var sel = window.getSelection();
                var span = document.createElement("span");
                var startM = sel.getRangeAt(0).cloneRange().startOffset;
                var endM = sel.getRangeAt(0).cloneRange().endOffset;
                span.style.backgroundColor = currcolor;

                var text = window.prompt("Write a comment");     
                //if the comment text is empty
                if (text === "") {
                    this.$alert("Your comment needs a text")
                    return
                }       
                if (text !== "" || this.$currentdoc._id !== "") {
                    if (sel.rangeCount) {
                        var range = sel.getRangeAt(0).cloneRange();
                        range.surroundContents(span);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                    await axios.post(`https://jsramverk-editor-saji19.azurewebsites.net/comments/`, {
                        color: currcolor,
                        start: startM,
                        end: endM,
                        markedText: markedtext,
                        comment: text,
                        documentID: this.$currentdoc._id
                    });
                    await axios.put(`https://jsramverk-editor-saji19.azurewebsites.net/${this.$currentdoc._id}`, {
                        documentText: this.content
                    });
                } else {
                    return
                }
            }
        },
        async deleteComment (id) {
            this.showC = false;
            await axios.delete(`https://jsramverk-editor-saji19.azurewebsites.net/comments/${id}`);
        },
        async showComments () {
            this.showC = true;
            this.docComments = [];
            if (Vue.prototype.$currentdoc._id) {
                const response = await axios.get("https://jsramverk-editor-saji19.azurewebsites.net/comments/");
                const allcomments = response.data.comments;
                for (var i = 0; i < allcomments.length; i++) {
                    if (allcomments[i].documentID === Vue.prototype.$currentdoc._id) {
                        console.log(allcomments[i])
                        this.docComments.push(allcomments[i]);
                    }
                }
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

#textarea {
    background-color: white;
}
</style>