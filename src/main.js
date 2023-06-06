/**
 * SPDX-FileCopyrightText: 2018 John Molakvoæ <skjnldsv@protonmail.com>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { generateFilePath } from "@nextcloud/router";

import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueRouter from "vue-router";
import { router } from "./router/index.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./styles/reset.css";
import "./styles/base.css";

// eslint-disable-next-line
__webpack_public_path__ = generateFilePath(appName, "", "js/");

Vue.mixin({ methods: { t, n } });
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
export default new Vue({
  el: "#content",
  router,
  render: (h) => h(App),
});
