import Vue from "vue";
import App from "./App.vue";
import vueCodeditor from "vue-codeditor";
import Clipboard from "v-clipboard";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import {firestorePlugin} from "vuefire";

const options = {
  position: "top-center",
  timeout: 2500,
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
Vue.component(vueCodeditor);
Vue.use(Clipboard);
Vue.use(firestorePlugin)

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
