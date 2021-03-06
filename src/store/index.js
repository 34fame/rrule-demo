import Vue from 'vue'
import Vuex from 'vuex'

import app from './store-app'

Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    modules: {
      app
    },

    strict: process.env.DEV
  })

  return Store
}
