<template>
  <div id="app">
    <div class="modal">
      <div class="action" v-if="status == 'action'">
        <button @click="status = 'create'" class="create">Create</button>
        <button @click="status = 'join'" class="join">Join</button>
      </div>
      <div class="join" v-if="status == 'join'">
        <button class="return" @click="status = 'action'">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 206.108 206.108" style="enable-background: new 0 0 206.108 206.108" xml:space="preserve"> <path d="M152.774,69.886H30.728l24.97-24.97c3.515-3.515,3.515-9.213,0-12.728c-3.516-3.516-9.213-3.515-12.729,0L2.636,72.523 c-3.515,3.515-3.515,9.213,0,12.728l40.333,40.333c1.758,1.758,4.061,2.636,6.364,2.636c2.303,0,4.606-0.879,6.364-2.636 c3.515-3.515,3.515-9.213,0-12.728l-24.97-24.97h122.046c19.483,0,35.334,15.851,35.334,35.334s-15.851,35.334-35.334,35.334H78.531 c-4.971,0-9,4.029-9,9s4.029,9,9,9h74.242c29.408,0,53.334-23.926,53.334-53.334S182.182,69.886,152.774,69.886z" /> </svg>
        </button>
        <p>Room code</p>
        <p><input type="text" v-model="code[0]" maxlength="8" /></p>
        <button @click="Join()" class="join">Join</button>
      </div>
      <div
        class="create"
        v-if="status == 'create' || status == 'private-count'"
      >
        <button class="return" @click="status = 'action'">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 206.108 206.108" style="enable-background: new 0 0 206.108 206.108" xml:space="preserve" > <path d="M152.774,69.886H30.728l24.97-24.97c3.515-3.515,3.515-9.213,0-12.728c-3.516-3.516-9.213-3.515-12.729,0L2.636,72.523 c-3.515,3.515-3.515,9.213,0,12.728l40.333,40.333c1.758,1.758,4.061,2.636,6.364,2.636c2.303,0,4.606-0.879,6.364-2.636 c3.515-3.515,3.515-9.213,0-12.728l-24.97-24.97h122.046c19.483,0,35.334,15.851,35.334,35.334s-15.851,35.334-35.334,35.334H78.531 c-4.971,0-9,4.029-9,9s4.029,9,9,9h74.242c29.408,0,53.334-23.926,53.334-53.334S182.182,69.886,152.774,69.886z" /> </svg>
        </button>
        <p>Room type</p>
        <button @click="Create('public')" class="create">Public</button>
        <button @click="status = 'private-count'" class="join">Private</button>
        <br />
        <div class="private-count" v-if="status == 'private-count'">
          <p>Number of editors</p>
          <button @click="Create('private')" class="join">1</button>
          <button @click="Create('private', 2)" class="join">2</button>
        </div>
      </div>
    </div> 
    <div class="rooms"
      v-if="status.indexOf('user') !== -1 || status.indexOf('host') !== -1"
    >
      <Room
        v-for="rcode in code"
        :key="rcode"
        :code="rcode"
        :status="status"
      />
    </div>
  </div>
</template>

<script>
import Room from "./components/Room.vue";
import Vue from "vue";
import Toast from "vue-toastification";
import {db} from "./firebase"

const options = {
  position: "top-center",
  timeout: 4000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.4,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: true,
  rtl: false,
};
Vue.use(Toast, options);
export default {
  name: "App",
  components: {
    Room,
  },
  data() {
    return {
      code: [],
      status: "action",
    };
  },
  methods: {
    Create(type, count = 1) {
      for (var i1 = 0; i1 < count; i1++) {
        var dict = "WERTYUASDFGHKZXCVBNM123456789";
        var code = ""
        for (var i = 0; i < 8; i++)
          code += dict[Math.floor(Math.random() * dict.length)]
        this.code.push(code)
        this.status = type == "public" ? "publichost" : "privatehost"
        db.doc(code).set({type: type, code: ""})
      }
    },
    Join() {
      if (this.code[0].length == 8)
        db.doc(this.code[0]).get().then(r => {
          if(r.data()==undefined){
            Vue.$toast.error("The room doesn't exist");
            return
          }
          this.status = r.data() == "public"?"publicuser":"privateuser"
        })
      else Vue.$toast.warning("The code must be 8 characters long");
    },
  },
};
</script>

<style scoped>
.rooms{
  padding: 6px;
}
.return {
  padding: 0 !important;
  margin: 5px 7px !important;
  position: absolute;
  top: 5px;
  left: 5px;
  border: transparent !important;
  background: transparent !important;
  width: 20px !important;
}
.private-count p {
  margin-top: 30px !important;
  font-size: 17px !important;
}
.private-count button {
  width: 50px !important;
  margin: 0 25px !important;
}
.console div:first-child {
  text-align: right;
  width: 300px;
  margin-top: 100px;
  background: rgb(51, 51, 51);
  display: inline-block;
  border: 1px solid snow;
  color: snow;
  padding: 3px;
  border-radius: 4px;
}
.console p {
  text-align: left;
  padding: 0 20px;
  margin: 10px 0;
}
.console button {
  margin-top: 4px;
}
.modal p:first-child {
  margin-top: 0;
  font-size: 20px;
}
.modal input {
  text-align: center;
  padding: 5px 0;
  font-weight: 700;
  text-transform: uppercase;
  font-family: "Play", sans-serif !important;
  letter-spacing: 2px;
  font-size: 18px;
  width: 150px;
}
.modal div:first-child {
  position: relative;
  margin-top: 50px;
  padding: 30px;
  display: inline-block;
  background: white;
  border: 5px solid rgba(8, 8, 8, 0.178);
  border-radius: 5px;
}
.modal p,
.modal .private-count {
  text-align: center !important;
}
.modal button {
  width: 150px;
  padding: 8px 0;
  border: #2980b9 1px solid;
  margin: 0 10px;
  border-radius: 4px;
  color: white;
  background: #3498db;
  font-weight: 700;
}
.modal button.join {
  background: #28b362;
  border: #219652 1px solid;
}
.modal,
.console {
  top: 0;
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
<style>
#container,
canvas {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
button {
  background: transparent;
  border-color: transparent;
}
@import url("https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap");
#app {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
body {
  overflow: hidden;
  margin: 0;
  font-family: "Play", sans-serif !important;
  background: transparent;
}
.ace_editor {
  font-size: 16px !important;
}
.ace_fold {
  opacity: 0 !important;
}
.ace_print-margin-layer {
  display: none !important;
}
</style>
