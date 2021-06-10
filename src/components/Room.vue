<template>
  <div :id="code" class="room">
    <header>
      <div class="logo">2CODE<span>.JS</span></div>
      <button class="run" @click="Run()">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 320.001 320.001" style="enable-background: new 0 0 320.001 320.001" xml:space="preserve" > <path d="M295.84,146.049l-256-144c-4.96-2.784-11.008-2.72-15.904,0.128C19.008,5.057,16,10.305,16,16.001v288 c0,5.696,3.008,10.944,7.936,13.824c2.496,1.44,5.28,2.176,8.064,2.176c2.688,0,5.408-0.672,7.84-2.048l256-144 c5.024-2.848,8.16-8.16,8.16-13.952S300.864,148.897,295.84,146.049z" /> </svg>
      </button>
      <button class="close" @click="Close()">
        <svg height="25px" fill="black" viewBox="0 0 329.26933 329" width="25px" xmlns="http://www.w3.org/2000/svg" > <path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0" /> </svg>
      </button>
      <div class="data">
        <button
          v-clipboard="code"
          @click="$toast.success('Room code copied to clipboard')"
          class="code"
          v-if="code.length == 8">
          {{ code }}
        </button>
      </div>
    </header>
    <div class="editor">
      <vue-codeditor
        readonly="false"
        v-model="content"
        mode="javascript"
        theme="chrome"
      />
    </div>
    <div class="console">
      <div class="header">Console</div>
      <div class="body">
        <vue-codeditor
          readonly="true"
          v-model="console"
          mode="javascript"
          theme="chrome"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {db} from "../firebase"
import {debounce} from "debounce"

export default {
  props: ["code", "status"],
  data() {
    return {
      content: "",
      console: "",
      response: ""
    };
  },
  firestore(){
    return {
      response: db.doc(this.code)
    }
  },
  methods: {
    Close() {
      location.reload();
    },
    Run() {
      String.prototype.deleteAll = function (...words) {
        return words.reduce((text, e) => text.split(e).join(""), this);
      };
      try {
        var consolestr = [];
        var code = this.content;
        code = code[code.length - 1] == ";" ? code : code + ";";
        var lastStr = code .split("\n").reduce((last, e) => (e.trim().length > 0 ? e : last)).deleteAll(";", "var ", "let ", "const ", "}", "{");
        var evalCode = "var oldconsole=console.log;alert=function(value){consolestr.push(value);};" + "console.log=function(value){consolestr.push(value);oldconsole(value);};" + code + (lastStr.indexOf("console.log") == -1 ? "console.log(" + lastStr + ");" : "");
        eval(evalCode);
        this.console = consolestr.join("\n");
      } catch (e) {
        this.console = e.name + ": " + e.message;
      }
    },
    debounceUpdate: debounce(function(){
      db.doc(this.code).update({ code: this.content })
    },300)
  },
  created() {
    document.getElementById("container").style.opacity = 0;
    db.doc(this.code).get().then(r => this.content=r.data().code)
  },
  mounted() {
    document.getElementsByTagName("textarea")[0].readOnly = this.status == "publicuser";
    document.getElementsByClassName("ace_cursor")[0].hidden = this.status == "publicuser";
  },
  watch: {
    content() {
      this.debounceUpdate()
    },
    response(){
      this.content = this.response.code
    }
  },
};
</script>

<style>
.console .ace_tooltip {
  display: none !important;
}
.console .ace_gutter-cell {
  background: transparent !important;
}
.console .ace_cursor {
  display: none !important;
}
.rooms {
  display: flex;
}
.room {
  display: block;
  flex: 1;
  height: 98vh;
}
.room:first-of-type {
  padding-right: 10px;
}
.room:last-of-type {
  padding-left: 10px;
}
.room:first-of-type button.close {
  display: none;
}
.room:last-of-type button.close {
  display: inline-block !important;
}
.ace_gutter-cell.ace_info{
  background: transparent!important;
}
</style>
<style scoped>
.console .header {
  color: white;
  padding: 5px 30px;
  font-size: 18px;
  background: rgb(94, 94, 94);
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
}
.console .body {
  height: 17vh;
  overflow-y: auto;
}
.editor {
  height: 69vh;
  margin-bottom: 1vh;
  overflow-y: auto;
}
.run {
  margin-left: 10px;
}
.close {
  margin-left: 30px;
}
.run svg {
  fill: rgb(67, 140, 223);
}
.online {
  color: rgb(67, 140, 223);
  font-size: 18px;
  font-weight: 600;
  margin-right: 30px;
  margin-top: 5px;
  text-transform: uppercase;
}
.offline.online {
  color: rgb(136, 136, 136);
}
.offline.online::before {
  content: "";
}
.online::before {
  content: "•";
  margin-right: 5px;
}
button {
  font-family: "Play", sans-serif !important;
  font-size: 16px;
}
.code {
  background: #e9544f;
  color: white;
  padding: 5px;
  border-radius: 5px;
  border: 2px solid #e9544f;
  box-shadow: 2px 2px 4px 0 red;
  text-transform: uppercase;
  font-weight: 800;
}
header {
  padding: 10px;
  height: 43px;
}
.data,
.logo,
.online {
  display: inline-block;
}
.data,
.online,
.close {
  float: right;
}
.logo {
  margin-left: 20px;
  color: black;
  letter-spacing: 1px;
  font-weight: 800;
  font-size: 30px;
}
.logo span {
  padding: 1px;
  background: rgb(247, 223, 30);
  font-size: 15px;
  letter-spacing: 0;
}
</style>