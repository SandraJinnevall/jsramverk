<template>
    <div>
        <v-app id="inspire">
            <v-card
            color="white"
            flat
            height="200px"
            tile
            >
            <v-toolbar dense>
                <v-spacer></v-spacer>
        
                <v-btn v-on:click="savedData()" icon>
                     SAVE
                </v-btn>
                <v-spacer></v-spacer>
            </v-toolbar>
                <div class="texteditor">
                    <quill-editor ref="myTextEditor"
                            v-model="content"
                            :options="editorOption">
                    </quill-editor>
                </div>
            </v-card>
        </v-app>
    </div>
</template>

<script>
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import { quillEditor } from 'vue-quill-editor'

export default {
    components: {
       quillEditor   
    },
    data: function() {
        return {
            content: "",
            editorOption: {
                modules: {
                    toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['clean'],
                    ['link', 'image', 'video'],
                    ],
                }
             }
        }
    },
    methods: {
        savedData: function() {
            let regex = /(<([^>]+)>)/ig;
            console.log(this.content.replace(regex, ""));
        }
    }
}

Vue.use(VueQuillEditor, /* { default global options } */)
</script>

<style scoped>
.quill-editor {
  width: 60%;
  height: 300px;
  margin: 0 auto;
  display: block;
  padding-top: 80px;
}

.ql-toolbar .ql-snow {
    padding:1px;
}

</style>
