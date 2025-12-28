const state = {
  setFormDefault: {
    is_blend: false,
    record_screen: false,
    record_screen_path: '',
    print_record_logo: false,
    install_dongle_count: 0 // Changed from boolean to number (0-256)
  }
}

const mutations = {
  SET_FORM_DEFAULT(state, payload) {
    state.setFormDefault = payload
  },
  UPDATE_FORM_DEFAULT(state, payload) {
    state.setFormDefault = { ...state.setFormDefault, ...payload }
  }
}

const actions = {
  setFormDefault({ commit }, payload) {
    commit('SET_FORM_DEFAULT', payload)
  },
  updateFormDefault({ commit }, payload) {
    commit('UPDATE_FORM_DEFAULT', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
