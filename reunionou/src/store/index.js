// store.js
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      token: '',
      uid: '',
      refresh: ''
    }
  },
  mutations: {
    connectAccount(state, account) {
      state.uid = account.uid;
      state.token = account.access_token;
      state.refresh = account.refresh_token;
    },
    newAccount(state, newAccount) {
      state.account = newAccount
    }
  }
})

export default store;
