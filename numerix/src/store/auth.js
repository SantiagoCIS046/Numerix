import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user")) || null,
  }),

  getters: {
    isSubscribed: (state) => {
      return state.user?.estado === 1;
    },
  },

  actions: {
    setAuth(data) {
      this.token = data.token;
      this.user = data.usuario;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.usuario));
    },

    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
