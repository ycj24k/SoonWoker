import Vue from 'vue'
import Router from 'vue-router'
import axios from "axios"
import main from '@/components/main'
import finger from '@/components/finger'
import login from '@/components/login'
import admin from '@/components/admin'
import less from 'less'
import uploader from 'vue-simple-uploader'


Vue.use(uploader)
Vue.use(less)
Vue.use(Router)
Vue.prototype.$axios = axios
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/main',
      name: 'main',
      component: main
    },
    {
      path: '/finger',
      name: 'finger',
      component: finger
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    }
  ]
})
