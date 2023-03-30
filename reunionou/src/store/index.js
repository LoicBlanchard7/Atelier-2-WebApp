// store.js
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      token: ''
    }
  },
  mutations: {
    setToken(state, newToken) {
      state.token = newToken
    }
  }
})

export default store;
