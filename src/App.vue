<template>
  <div id="app">
    <Header v-if="!isOwnerPage" :isAuthenticated="isAuthenticated" :user="user" @openModal="openModal" @logout="logout"/>
    <OwnerHeader v-else :isAuthenticated="isAuthenticated" :user="user" @openModal="openModal" @logout="logout"/>
    <AuthModal ref="authModal" @login="onLogin" @logout="onLogout"/>
    <router-view/>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import OwnerHeader from './components/OwnerHeader.vue';
import AuthModal from './components/Auth.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Header,
    OwnerHeader,
    AuthModal,
    Footer
  },
  data() {
    return {
      isAuthenticated: false,
      user: null
    };
  },
  computed: {
    isOwnerPage() {
      return this.$route.name === 'owner-main' || (this.user && this.user.roleId === 1);
    }
  },
  methods: {
    openModal(mode) {
      this.$refs.authModal.openModal(mode);
    },
    onLogin(user) {
      this.isAuthenticated = true;
      this.user = user;
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('isAuthenticated', true);
    },
    onLogout() {
      this.isAuthenticated = false;
      this.user = null;
      sessionStorage.clear();
      this.$router.push('/');
    },
    logout() {
      this.$refs.authModal.logout();
    }
  },
  mounted() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated && user) {
      this.isAuthenticated = true;
      this.user = user;
    }
  }
};
</script>
