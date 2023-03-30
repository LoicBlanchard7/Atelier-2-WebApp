// store.js
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      account: null,
      deco: null
    }
  },
  mutations: {
    newAccount(state, newAccount) {
      state.account = newAccount
      state.deco = ""
    },
    deconnect(state, deconnect) {
      state.deco = deconnect
      state.account = ""
    }
  }
})

export default store;
