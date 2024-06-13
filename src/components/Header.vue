<template>
  <header>
    <router-link :to="{ name: 'main' }" class="logo-container">
      <img src="../assets/foto/logo.png" alt="CampVue Logo" />
      <h2>Campbnb</h2>
    </router-link>
    <nav class="right-nav">
      <div class="dropdown" v-if="isAuthenticated">
        <span class="dropbtn">My Account</span>
        <div class="dropdown-content">
          <router-link to="/my-account">My Information</router-link>
          <button @click="logout">Logout</button>
        </div>
      </div>
      <div v-else>
        <button @click="$emit('openModal', 'login')">Login</button>
        <button @click="$emit('openModal', 'createUser')">Sign Up</button>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  props: {
    isAuthenticated: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    logout() {
      sessionStorage.removeItem('token'); // Clear token from sessionStorage
      sessionStorage.removeItem('user'); // Clear user info from sessionStorage
      sessionStorage.removeItem('isAuthenticated'); // Clear authentication status from sessionStorage
      this.$emit('logout');
    }
  }
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0.8);
  position: sticky;
  top: 0;
  z-index: 10;
}

header .logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
}

header .logo-container img {
  height: 40px;
}

header .right-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 8px;
}

.dropdown-content a,
.dropdown-content button {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-content a:hover,
.dropdown-content button:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

button {
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
}

button:hover {
  background-color: #f1f1f1;
}
</style>
