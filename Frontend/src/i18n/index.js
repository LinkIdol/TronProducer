import Vue from 'vue';
import VueI18n from 'vue-i18n';

import zh from './zh';
import en from './en';
import zh_tw from './zh_tw';

Vue.use(VueI18n);

export default new VueI18n({
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: {
    en,
    zh,
    zh_tw
  },
});
