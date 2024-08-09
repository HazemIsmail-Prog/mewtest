import { defineStore } from "pinia";
import axios from "@/axios";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      authUser: null,
      authErrors: {},
      isLoading: false,
    };
  },
  actions: {
    // ######################## Get Authenticated User ####################################/
    async getUser() {
      this.isLoading = true;
      try {
        const response = await axios.get("/api/user");
        this.authUser = response.data;
      } catch (error) {
        this.authUser = null;
      }
      this.authErrors = {};
      this.isLoading = false;
    },

    // ######################## Login & Register ####################################/
    authenticate(apiRoute, formData) {
      this.isLoading = true;
      this.authErrors = {};
      axios
        .post(apiRoute, formData)
        .then(() => {
          this.router.push({ name: "documents" });
          this.isLoading = false;
        })
        .catch((res) => {
          this.authErrors = res.response.data.errors;
          this.isLoading = false;
        });
    },

    // ######################## Logout User ####################################/
    logout() {
      this.isLoading = true;

      this.authErrors = {};
      axios.post("/logout").then(() => {
        this.authUser = null;
        this.router.push({ name: "login" });
        this.isLoading = false;
      });
    },
  },
});
