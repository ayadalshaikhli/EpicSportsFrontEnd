<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <div v-if="mode === 'login'">
        <h3>Login</h3>
        <form @submit.prevent="login">
          <input type="text" v-model="userName" placeholder="Username" required>
          <input type="password" v-model="passwordhash" placeholder="Password" required>
          <button type="submit">Login</button>
          <button type="button" @click="mode = 'resetPassword'">Forgot Password?</button>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </form>
      </div>
      <div v-else-if="mode === 'resetPassword'">
        <h3>Reset Password</h3>
        <form @submit.prevent="resetPassword">
          <input type="email" v-model="email" placeholder="Email" required>
          <button type="submit">Send Reset Link</button>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </form>
      </div>
      <div v-else-if="mode === 'createUser'">
        <h3>Create New User</h3>
        <form @submit.prevent="createUser">
          <input type="text" v-model="firstName" placeholder="First Name" required>
          <input type="text" v-model="lastName" placeholder="Last Name" required>
          <input type="text" v-model="userName" placeholder="User Name" required>
          <input type="tel" v-model="phoneNumber" placeholder="Phone Number" pattern="^\d{9}$" required>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="userType" v-model="roleid" value="2" required>
              <span class="radio-custom"></span>
              Camper
            </label>
            <label class="radio-label">
              <input type="radio" name="userType" v-model="roleid" value="1" required>
              <span class="radio-custom"></span>
              Owner
            </label>
          </div>
          <input type="email" v-model="email" placeholder="Email" required>
          <input type="password" v-model="passwordhash" placeholder="Password" required>
          <button type="submit">Create Account</button>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router/router.js'; 

export default {
  data() {
    return {
      isOpen: false,
      mode: 'login',
      email: '',
      passwordhash: '',
      firstName: '',
      lastName: '',
      userName: '',
      phoneNumber: '',
      roleid: '',
      isAuthenticated: false,
      user: null,
      errorMessage: ''
    };
  },
  methods: {
    openModal(mode = 'login') {
      this.mode = mode;
      this.isOpen = true;
    },
    closeModal() {
      this.isOpen = false;
      this.errorMessage = ''; // Clear any existing error messages
    },
    async login() {
      if (!this.userName || !this.passwordhash) {
        this.errorMessage = 'Please fill in all fields.';
        return;
      }

      try {
        const response = await axios.post('https://localhost:7063/api/Auth/login', {
          username: this.userName,
          passwordHash: this.passwordhash
        });
        const token = response.data.token;
        const user = response.data.user;
        sessionStorage.setItem('token', token); // store token in session storage
        sessionStorage.setItem('user', JSON.stringify(user)); // store user info in session storage
        sessionStorage.setItem('isAuthenticated', true); // store authentication status
        this.isAuthenticated = true;
        this.user = user;
        this.$emit('login', this.user);
        this.closeModal();

        // Debugging role ID
        console.log('User role ID:', user.roleId);
        
        // Redirect based on role
        if (user.roleId === 1) {
          router.push('/owner'); // Redirect to owner dashboard
        } else if (user.roleId === 2) {
          router.push('/'); // Redirect to main page for campers
        }
      } catch (error) {
        console.error('Login failed', error);
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    },
    async createUser() {
      if (!this.firstName || !this.lastName || !this.userName || !this.phoneNumber || !this.email || !this.passwordhash || !this.roleid) {
        this.errorMessage = 'Please fill in all fields.';
        return;
      }

      try {
        await axios.post('https://localhost:7063/api/User', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.userName,
          phoneNumber: this.phoneNumber,
          email: this.email,
          passwordHash: this.passwordhash,
          roleid: this.roleid
        });
        this.mode = 'login';
        this.errorMessage = 'Account created successfully. Please log in.';
      } catch (error) {
        console.error('Create user failed', error);
        this.errorMessage = 'Error creating account. Please try again.';
      }
    },
    resetPassword() {
      console.log('Reset password for:', this.email);
    },
    logout() {
      sessionStorage.clear(); // Clear session storage
      this.isAuthenticated = false;
      this.user = null;
      this.$emit('logout');
    }
  }
};
</script>

<style>
.error-message {
  color: red;
  margin-top: 10px;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 300px;
  border-radius: 10px;
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
