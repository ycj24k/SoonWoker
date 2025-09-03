<template>
  <el-dialog
    :title="$t('networkAuth.title')"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :append-to-body="true"
    :z-index="9999"
  >
    <div class="network-auth-content">
      <p class="auth-description">
        {{ $t('networkAuth.description') }}
      </p>
      
      <div class="network-paths">
        <div 
          v-for="(path, index) in networkPaths" 
          :key="index"
          class="network-path-item"
        >
          <div class="path-info">
            <span class="path-label">{{ $t('networkAuth.pathLabel') }}</span>
            <span class="path-value">{{ path.path }}</span>
          </div>
          
          <div class="auth-fields">
            <el-input
              v-model="path.userName"
              :placeholder="$t('networkAuth.userName')"
              size="small"
              style="width: 150px; margin-right: 10px;"
            />
            <el-input
              v-model="path.password"
              type="password"
              :placeholder="$t('networkAuth.password')"
              size="small"
              style="width: 150px;"
              show-password
            />
          </div>
        </div>
      </div>
    </div>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">{{ $t('networkAuth.cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">
        {{ $t('networkAuth.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'NetworkAuthDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    networkPaths: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    handleCancel() {
      this.$emit('cancel')
    },
    
    async handleConfirm() {
      // 验证所有路径都填写了用户名和密码
      for (let path of this.networkPaths) {
        if (!path.userName || !path.password) {
          this.$message.error(this.$t('networkAuth.authRequired'))
          return
        }
      }
      
      this.loading = true
      
      try {
        // 保存到本地存储
        this.saveNetworkCredentials()
        
        // 构建 net_info 数据
        const netInfo = this.networkPaths.map(path => ({
          host_name: this.extractHostName(path.path),
          user_name: path.userName,
          password: path.password
        }))
        
        this.$emit('confirm', netInfo)
      } catch (error) {
        console.error('保存网络认证信息失败:', error)
        this.$message.error('保存认证信息失败')
      } finally {
        this.loading = false
      }
    },
    
    extractHostName(path) {
      // 从网络路径中提取主机名
      // 支持格式：\\hostname\path, //hostname/path, \\192.168.1.1\path
      if (path.startsWith('\\\\')) {
        // Windows 网络路径 \\hostname\path
        const parts = path.substring(2).split('\\')
        return parts[0]
      } else if (path.startsWith('//')) {
        // Unix 网络路径 //hostname/path
        const parts = path.substring(2).split('/')
        return parts[0]
      } else if (path.includes(':')) {
        // 可能包含 IP 地址
        const match = path.match(/^([^\\\/:]+)/)
        return match ? match[1] : 'unknown'
      }
      return 'unknown'
    },
    
    saveNetworkCredentials() {
      // 保存到 localStorage
      const credentials = {}
      this.networkPaths.forEach(path => {
        const hostName = this.extractHostName(path.path)
        credentials[hostName] = {
          userName: path.userName,
          password: path.password,
          lastUsed: new Date().toISOString()
        }
      })
      
      localStorage.setItem('networkCredentials', JSON.stringify(credentials))
      
      // 同时保存到 Vuex store（若可用）
      if (this.$store && this.$store.commit) {
        this.$store.commit('SET_NETWORK_CREDENTIALS', credentials)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.network-auth-content {
  .auth-description {
    margin-bottom: 20px;
    color: #606266;
    font-size: 14px;
  }
  
  .network-paths {
    .network-path-item {
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 15px;
      background-color: #fafafa;
      
      .path-info {
        margin-bottom: 10px;
        
        .path-label {
          font-weight: bold;
          color: #303133;
          margin-right: 10px;
        }
        
        .path-value {
          color: #409eff;
          font-family: monospace;
          background-color: #f0f9ff;
          padding: 2px 6px;
          border-radius: 3px;
        }
      }
      
      .auth-fields {
        display: flex;
        align-items: center;
      }
    }
  }
}

.dialog-footer {
  text-align: right;
}
</style>
