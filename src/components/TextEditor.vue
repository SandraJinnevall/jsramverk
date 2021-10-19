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
            <v-icon v-if="owner === true" v-on:click="getallUsers()">mdi-share</v-icon>
            <v-icon id="pdf" v-on:click="downloadPDF()">mdi-file-pdf-box</v-icon>
            <v-icon v-on:click="comment()">mdi-comment</v-icon>
            <div v-if="share === true">
                <div v-for="user in allusersArray" :key="user._id">
                    <input type="checkbox" :id="user._id" :value="user._id" v-model="sharedWith">
                    <label :for="user._id">{{user.name}}</label>
                </div>
            </div>
            <p v-if="this.docid">Current editing document: {{this.docName}}</p>
            <p v-if="!this.docid">Create a new document below</p>
            <p> Name your document: <input class="docname" type="text" v-on:keyup="emitDocData()" v-model="docName"></p>
            <!-- <textarea id="textarea" v-on:keyup="emitDocData()" style="width:800px; height:200px; border:1px solid black;" v-model="content"></textarea> -->
            <div id="canvas" v-on:keyup="emitDocData()">
                <quill-editor
                        v-model="content"
                    />
            </div>
            <p v-if="owner === false">Only the owner [{{this.ownerName}}] can share this document</p>
            <div style="display: inline-flex; margin-top:15px;" v-on:click="showComments()">
                <p>Show Comments</p>
                <v-icon v-if="showC === false" style="width:10px; height:10px; margin-top:7px; margin-left:10px; font-size: 20px;">mdi-menu-up</v-icon>
                <v-icon v-if="showC === true" style="width:10px; height:10px; margin-top:7px; margin-left:10px; font-size: 20px;">mdi-menu-down</v-icon>
            </div>
            <div v-if="showC === true">
                <p v-if="docComments.length === 0" style="font-style: oblique; margin-left:10px;">- There is no comments</p>
                <div class="commets" v-for="(item) in docComments" :key="item._id">
                    <div style="display: inline-flex; margin-top:15px;">
                        <v-icon style="width:10px; height:10px; margin-top:7px; margin-right:10px; font-size: 20px;" v-on:click="deleteComment(item._id)">mdi-delete</v-icon>
                        <div style="width:10px; height:10px; margin-top:7px; margin-right:10px" :style="{ 'background-color': item.color }"></div>
                        <p v-on:click="highlightComment(item)">{{item.comment}}</p>
                    </div>
                </div>
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
            savesucess: false,
            infoalert: false,
            socket: io(),
            docData: {},
            userID: Vue.prototype.$currentuserID,
            userName: Vue.prototype.$currentuserName,
            sharedWith: Vue.prototype.$currentdoc.sharedWith,
            allusersArray: [],
            owner: false,
            share: false,
            counter: 0,
            currentComment: "",
            docComments: [],
            showC: false
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
        }
    },
    methods: {
        savedData: function() {
            this.share = false;
            this.showC = false;
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
                    data: {
                       documentText: this.content
                    },
                    method: 'POST',
                    responseType: 'blob',
                })
                .then(function (response) {
                        console.log("vad?", response)
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
        comment () {
            if (this.$currentdoc._id === "") {
                this.$alert("You need to save the document before commenting");
                return
            }
            var colors = ["red", "blue", "orange", "pink", "blue"];
            var currcolor = colors[this.counter];
            if (this.counter === colors.length) {
                this.counter = 0;
            }
            if (window.getSelection().toString() === "") {
                this.$alert("You need to select the text you want to comment")
            } else {
                var markedtext = window.getSelection().toString();
                var sel = window.getSelection();
                var span = document.createElement("span");
                var startM = sel.getRangeAt(0).cloneRange().startOffset;
                var endM = sel.getRangeAt(0).cloneRange().endOffset;
                span.style.backgroundColor = currcolor;
                this.counter += 1;

                var text = window.prompt("Write a comment");            
                if (text !== "" || this.$currentdoc._id !== "") {
                    if (sel.rangeCount) {
                        var range = sel.getRangeAt(0).cloneRange();
                        range.surroundContents(span);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                    axios.post(`http://localhost:1337/comments/`, {
                        color: currcolor,
                        start: startM,
                        end: endM,
                        markedText: markedtext,
                        comment: text,
                        documentID: this.$currentdoc._id
                    });
                } else {
                    if (text === "") {
                        this.$alert("Your comment needs a text")
                    }
                    return
                }
            }
        },
        async deleteComment (id) {
            this.showC = false;
            await axios.delete(`http://localhost:1337/comments/${id}`);
        },
        async showComments () {
            this.showC = true;
            this.docComments = [];
            if (Vue.prototype.$currentdoc._id) {
                const response = await axios.get("http://localhost:1337/comments/");
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