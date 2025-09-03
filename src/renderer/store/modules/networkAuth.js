const state = {
  networkCredentials: {}
}

const mutations = {
  SET_NETWORK_CREDENTIALS(state, credentials) {
    state.networkCredentials = { ...state.networkCredentials, ...credentials }
  },
  
  CLEAR_NETWORK_CREDENTIALS(state) {
    state.networkCredentials = {}
  },
  
  UPDATE_NETWORK_CREDENTIAL(state, { hostName, credentials }) {
    state.networkCredentials = {
      ...state.networkCredentials,
      [hostName]: credentials
    }
  }
}

const actions = {
  // 从 localStorage 加载网络认证信息
  loadNetworkCredentials({ commit }) {
    try {
      const stored = localStorage.getItem('networkCredentials')
      if (stored) {
        const credentials = JSON.parse(stored)
        commit('SET_NETWORK_CREDENTIALS', credentials)
      }
    } catch (error) {
      console.error('加载网络认证信息失败:', error)
    }
  },
  
  // 保存网络认证信息到 localStorage
  saveNetworkCredentials({ state }) {
    try {
      localStorage.setItem('networkCredentials', JSON.stringify(state.networkCredentials))
    } catch (error) {
      console.error('保存网络认证信息失败:', error)
    }
  },
  
  // 获取指定主机的认证信息
  getCredentialsForHost({ state }, hostName) {
    return state.networkCredentials[hostName] || null
  },
  
  // 更新指定主机的认证信息
  updateCredentialsForHost({ commit }, { hostName, credentials }) {
    commit('UPDATE_NETWORK_CREDENTIAL', { hostName, credentials })
  }
}

const getters = {
  // 获取所有网络认证信息
  allNetworkCredentials: state => state.networkCredentials,
  
  // 检查是否有网络认证信息
  hasNetworkCredentials: state => Object.keys(state.networkCredentials).length > 0
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
