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
                <v-btn v-on:click="savedData()" icon>
                     SAVE
                </v-btn>
                <v-spacer></v-spacer>
            </v-toolbar>
                <div class="texteditor">
                    <vue-editor v-model="content"></vue-editor>
                </div>
            </v-card>
        </v-app>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-quill-editor'


export default {
    components: { 
        VueEditor
    },
    data: function() {
        return {
            content: "",
        }
    },
    methods: {
        savedData: function() {
            let regex = /(<([^>]+)>)/ig;
            console.log(this.content.replace(regex, ""));
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
    max-height: 650px;
}

</style>
