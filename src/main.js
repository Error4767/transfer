import { createApp } from 'vue';
import App from './App.vue';
import "@/assets/css/reset.css";

import Router from "./Router/Router.js";

const app = createApp(App);
app.use(Router);
app.mount('#app')