<template>
  <section class="hero">
    <div class="hero-content">
      <h2>Find your perfect campsite</h2>
      <p>Explore the great outdoors and book your adventure today!</p>
      <SearchBar @search="emitSearch" />
    </div>
  </section>
</template>

<script setup>
import { defineEmits } from 'vue';
import SearchBar from './SearchBar.vue';

const emit = defineEmits(['search']);

const emitSearch = (searchParams) => {
  emit('search', searchParams);
};
</script>
