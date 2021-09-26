<template>
    <div>
        <input type="text" name="name" ref="newText" value="" v-model="this.text" v-on:keyup="update()" />
        <canvas 
            ref="game" 
            width="640" 
            height="480"
            style="border:1px solid black;">
        </canvas>
        <p>
           <button v-on:click="move('right')">Right</button>
           <button v-on:click="move('left')">Left</button>
           <button v-on:click="move('up')">Up</button>
           <button v-on:click="move('down')">Down</button>

        </p>
    </div>
</template>
<script>
    import io from "socket.io-client"

    export default {
        data () {
            return {
                text: "",
                socket: {},
                context: {},
                position: {
                    x: 0,
                    y: 0
                }
            }
        },
        created () {
            this.socket = io("http://localhost:1337");           
        },
        mounted () {
            this.context = this.$refs.game.getContext("2d");
            // this.context.fillRect(this.position.x, this.position.y, 20, 20);
            this.socket.on("position", data => {
                this.position = data;
                this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
                this.context.fillRect(this.position.x, this.position.y, 20, 20);
                
            });      
            this.socket.on("text", data => {
                this.text = data;
            });     
        },
        methods: {
            move (direction) {
                this.socket.emit("move", direction);
            },
            update() {
                this.socket.emit("text", this.$refs.newText.value);
            }

        }
    }
</script>
