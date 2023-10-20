<template>
  <div class="container h-100 py-lg-5">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-lg-12 col-xl-11">
        <div class="card text-black" style="border-radius: 25px;">
          <div class="card-body p-md-5">
            <div class="row justify-content-center">
              <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Login</p>
                <form @submit.prevent="login" class="mx-1 mx-md-4">
                  <div class="d-flex flex-row align-items-center mb-4">
                    <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div class="form-outline flex-fill mb-0">
                      <input
                      v-model="email"
                      type="email"
                      id="form3Example3c"
                      class="form-control"
                      placeholder="Your e-mail here..."
                      />
                      <label class="form-label mt-3" for="form3Example3c">E-mail</label>
                    </div>
                  </div>
                  <div class="d-flex flex-row align-items-center mb-4">
                    <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                    <div class="form-outline flex-fill mb-0">
                      <input
                      v-model="password"
                      type="password"
                      id="form3Example4c"
                      class="form-control"
                      placeholder="*********"
                      />
                      <label class="form-label mt-3" for="form3Example4c">Password</label>
                    </div>
                  </div>
                  <p class="text-success">*Remember to start the bot before make the authentication!</p>
                  <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4 gap-3">
                    <button type="submit" class="btn btn-primary btn-lg">Login</button>
                    <button
                    type="button"
                    class="btn btn-outline-primary btn-lg"
                    @click="goToRegister"
                    >
                    Register
                  </button>
                </div>
              </form>
            </div>
            <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
              <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
              class="img-fluid"
              alt="Sample image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref, inject } from "vue";
import axios from "axios";
import { useRouter} from "vue-router";
import Swal from "sweetalert2";

export default {
  name: "AuthPage",
  setup() {
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    let makeSpin = inject('makeSpin');

    if (localStorage.getItem("token")) {
      router.push({ name: "chat" });
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You are already logged in!",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    const login = () => {
      const payload = {
        email: email.value,
        password: password.value,
      };

      makeSpin.value = true;

      axios
        .post("login", payload, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((response) => {
          makeSpin.value = false;

          Swal.fire({
            icon: (response.data.status === 200) ? "success" : 'error',
            title: "Success!",
            text: response.data.message,
            showConfirmButton: false,
            timer: 2000,
          });
          
          if (response.data.status === 200) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);

            router.push({ name: "chat" });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message,
            showConfirmButton: false,
            timer: 2000,
          });
        });
    };

    const goToRegister = () => {
      router.push({ name: "register" });
    };

    return {
      email,
      password,
      login,
      goToRegister,
    };
  },
};
</script>

<style scoped></style>
