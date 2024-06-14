<template>
  <router-link :to="`/campsite/${campsite.id}`" class="campsite-card">
    <img v-if="campsite.imageBase64" :src="`data:image/jpeg;base64,${campsite.imageBase64}`" alt="Campsite" class="card-image" />
    <h3>{{ campsite.name }}</h3>
    <p>{{ campsite.location }}</p>
    <p>Price per night: {{ campsite.pricePerNight }} €</p>
    <p>Rating: {{ campsite.averageRating }} ★</p>
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  campsite: {
    type: Object,
    required: true
  }
});
</script>
