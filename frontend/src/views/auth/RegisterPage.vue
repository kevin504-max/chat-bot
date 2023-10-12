<template>
    <div class="container h-100 pt-lg-5">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-lg-12 col-xl-11">
                <div class="card text-black" style="border-radius: 25px;">
                    <div class="card-body p-md-5">
                        <div class="row justify-content-center">
                            <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                
                                <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Register</p>
                                
                                <form class="mx-1 mx-md-4" @submit.stop.prevent="register">
                                    
                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <input 
                                            v-model="username"
                                            type="text" id="form3Example1c" class="form-control" 
                                            placeholder="Type your username..."
                                            />
                                            <label class="form-label mt-3" for="form3Example1c">Username</label>
                                        </div>
                                    </div>
                                    
                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <input 
                                            v-model="email"
                                            type="email" id="form3Example3c" class="form-control"
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
                                            type="password" id="form3Example4c" class="form-control" 
                                            placeholder="Your password here..."
                                            />
                                            <label class="form-label mt-3" for="form3Example4c">Password</label>
                                        </div>
                                    </div>

                                    <div class="d-flex flex-row align-items-center mb-4">
                                        <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                                        <div class="form-outline flex-fill mb-0">
                                            <input 
                                            v-model="confirmPassword"
                                            type="password" id="form3Example4c" class="form-control" 
                                            placeholder="Confirm your password..."
                                            />
                                            <label class="form-label mt-3" for="form3Example4c">Confim Password</label>
                                        </div>
                                    </div>
                                    
                                    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4 gap-3">

                                        <button type="submit" class="btn btn-primary btn-lg">Register</button>
                                        <button type="button" class="btn btn-outline-primary btn-lg" @click="$router.push({ name: 'login' })">Login</button>
                                    </div>
                                    
                                </form>
                                
                            </div>
                            <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                
                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                                class="img-fluid" alt="Sample image">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'RegisterPage',
    data () {
        return {
            'name': '',
            'email': '',
            'password': '',
            'confirmPassword': ''
        };
    },
    methods: {
        register () {
           const payload = {
                username: this.username,
                email: this.email,
                password: this.password,
                confirmPassword: this.confirmPassword,
            };
            
            axios.post('register', payload).then((response) => {
                this.$swal({
                    icon: 'success',
                    title: 'Sucess!',
                    text: response.data.message,
                    showConfirmButton: false,
                    timer: 2500
                })
                setTimeout(() => {
                    this.$router.push({ name: 'chat' })
                }, 2000);
            }).catch((error) => {
                this.$swal({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response.data.message,
                    showConfirmButton: false,
                    timer: 2500
                })
            });
        },
    }
}
</script>

<style scoped></style>