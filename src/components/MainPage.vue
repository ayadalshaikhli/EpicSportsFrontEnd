<template>
  <HeroSection @search="handleSearch" />
  <SearchResults :searchParams="searchParams" :initialLoad="initialLoad" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HeroSection from './HeroSection.vue';
import SearchResults from './SearchResults.vue';

const searchParams = ref(null);
const initialLoad = ref(true);

const handleSearch = (params) => {
  searchParams.value = params;
  initialLoad.value = false;
};

// Fetch all campsites on initial load
onMounted(() => {
  searchParams.value = {};
});
</script>
