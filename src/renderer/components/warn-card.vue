<template>
  <div class="card">
    <div class="title">
      <img src="../assets/gantan.png" class="icon" />{{ data.printName }}
    </div>
    <div class="content">{{ $t(`index.${data.tag}`) }}</div>
    <div v-if="data.err == 0">
      <el-button
        size="small"
        style="width: 100%; margin-top: 10px"
        class="btn"
        @click="ok"
      >
        OK
      </el-button>
    </div>
    <div v-if="data.err == 1">
      <el-button
        size="small"
        style="width: 40%; margin-top: 10px"
        class="btn"
        :disabled="loading"
        @click="ok"
      >
        OK
      </el-button>
      <el-button
        size="small"
        style="width: 40%; margin-top: 10px"
        class="btn"
        :loading="loading"
        @click="retry"
      >
        {{ !loading ? $t("warnCard.retry") : "" }}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "warn-card",
  props: {
    data: Object,
  },
  data() {
    return {
      loading: false,
    };
  },
  mounted() {},
  methods: {
    ok(retry) {
      this.$emit("ok", this.data.pid, retry);
      this.data.show = false;
    },
    retry() {
      this.loading = true;
      if (
        (this.data.code >= 1280 && this.data.code <= 1288) ||
        this.data.code == 65552 ||
        this.data.code == 65553 ||
        this.data.code == 65554 ||
        this.data.code == 65555 ||
        this.data.code == 65556 ||
        this.data.code == 65557 ||
        this.data.code == 65558 ||
        this.data.code == 65559 ||
        this.data.code == 65560 ||
        this.data.code == 65561 ||
        this.data.code == 65562 ||
        this.data.code == 65563
      ) {
        this.$axios({
          method: "post",
          url: "/printer/movetoReject?printerid=" + this.data.pid,
        })
          .then((res) => {
            setTimeout(() => {
              this.$axios({
                method: "post",
                url: "/printer/resetprinter?printerid=" + this.data.pid,
              }).then((res) => {
                this.ok(true);
              });
            }, 5000);
          })
          .catch((e) => {
            setTimeout(() => {
              this.$axios({
                method: "post",
                url: "/printer/resetprinter?printerid=" + this.data.pid,
              }).then((res) => {
                this.ok(true);
              });
            }, 5000);
          });
      }
      if (
        this.data.code == 1024 ||
        this.data.code == 65617 ||
        this.data.code == 65618 ||
        this.data.code == 65619 ||
        this.data.code == 65630
      ) {
        this.$axios({
          method: "post",
          url: "/printer/resetprinter?printerid=" + this.data.pid,
        }).then((res) => {
          this.ok(true);
        });
      }
    },
  },
};
</script>

<style scoped>
.card {
  width: 124px;
  background-color: #fff;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-top: 20px;
}
.icon {
  width: 14px;
  height: 14px;
}
.title {
  font-size: 12px;
  font-weight: bold;
  text-align: left;
}
.content {
  font-size: 10px;
  margin-top: 5px;
  text-align: left;
}
.btn {
  background-color: #e7e7eb;
  border: #e7e7eb;
}
</style>
