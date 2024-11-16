// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
import './assets/index1.css';
import App from './App'
import router from './router'
import axios from 'axios'
import VueI18n from 'vue-i18n'
import cnlang from './lang/cn.js'
import ocnlang from './lang/ocn'
import enlang from './lang/en.js'
Vue.config.productionTip = false
Vue.use(ElementUI);
/* eslint-disable no-new */
Vue.use(VueI18n);
var type = navigator.appName;
if (type == "Netscape"){
    var lang = navigator.language;//获取浏览器配置语言，支持非IE浏览器
}else{
    var lang = navigator.userLanguage;//获取浏览器配置语言，支持IE5+ == navigator.systemLanguage
};
var lang1 = lang.substr(0, 2);//获取浏览器配置语言前两位
console.log(lang,lang1);
let lan = 'en';
if(lang1=='zh'){
  if(lang == 'zh-TW' || lang == 'zh-HK'){
    lan = 'ozh';
  }else{
    lan = 'zh';
  }
}else if(lang1=="en"){
  lan = 'en';
}
if(!localStorage.getItem('lang')){
  localStorage.setItem("lang",lan);
}

const i18n = new VueI18n({
  //locale: lan, // 默认语言
  locale:(function(){
    if(localStorage.getItem('lang')){
      return localStorage.getItem('lang')
    }
    return 'en'
  }()),
  messages: {
  	'zh': cnlang,
    'ozh': ocnlang,
	  'en': enlang
  }
})
axios.defaults.baseURL = 'http://localhost:5080';
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
