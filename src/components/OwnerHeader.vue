<template>
    <header>
      <router-link :to="{ name: 'owner-main' }" class="logo-container">
        <img src="../assets/foto/logo.png" alt="CampVue Logo" />
        <h2>Campbnb</h2>
      </router-link>
      <nav class="right-nav">
        <div class="dropdown" v-if="isAuthenticated">
          <span class="dropbtn">My Account</span>
          <div class="dropdown-content">
            <router-link to="/owner">My Campsites</router-link>
            <router-link to="/owner-account">My Information</router-link>
            <button @click="logout">Logout</button>
          </div>
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