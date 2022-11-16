
export const state = () => ({
  authState: false,
  authUser: {},
  drawer: false,
  my_custom_value: 0,
  title: 'Default Title',
  userlist: []
})

export const getters = {
  getAuthState (state) {
    return state.authState
  },
  getAuthUser (state) {
    return state.authUser
  },
  getDrawer (state) {
    return state.drawer
  },
  getTitle (state) {
    return state.title
  },
  getUserlist (state) {
    return state.userlist
  }
}

export const mutations = {
  SET_FETCHED(state, trueFalse) {
    state.authState = trueFalse
  },
  SET_AUTHUSER(state, authUser) {
    state.authUser = authUser
  },
  SET_DRAWER(state, drawer) {
    state.drawer = drawer
  },
  increase: state => state.my_custom_value++,
  SET_TITLE(state, title) {
    console.log('title', title)
    state.title = title
  },
  SET_USERLIST(state, list) {
    state.userlist = list
  },
}

export const actions = {
  logIn({ commit }) {
      commit('SET_FETCHED', true)
  },
  logOut({ commit }) {
      commit('SET_FETCHED', false)
  },
  setProfileImage({ commit }, state, profilepic) {
    console.log('state',state)

  }
}
