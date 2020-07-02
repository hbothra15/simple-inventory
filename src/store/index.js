import Vue from 'vue'
import Vuex from 'vuex'
import purchase from './purchase'
import sales from './sales'
import quote from './quote'
import inventory from './inventory'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      purchase,
      sales,
      inventory,
      quote
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
