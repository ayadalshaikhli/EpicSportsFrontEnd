<template>
    <div class="container">
      <h2>Create New Campsite</h2>
      <form @submit.prevent="createCampsite" class="form">
        <label class="form-label">
          Name:
          <input v-model="campsite.name" required class="form-input"/>
        </label>
        <label class="form-label">
          Description:
          <textarea v-model="campsite.description" required class="form-textarea"></textarea>
        </label>
        <label class="form-label">
          Location:
          <input v-model="campsite.location" required class="form-input"/>
        </label>
        <label class="form-label">
          Price Per Night:
          <input v-model.number="campsite.pricePerNight" type="number" step="0.01" required class="form-input"/>
        </label>
        <label class="form-label">
          Image:
          <input type="file" @change="handleFileUpload" class="form-input"/>
        </label>
        <label class="form-label">
          Amenities:
          <div v-for="amenity in amenities" :key="amenity.id" class="form-checkbox">
            <input type="checkbox" :value="amenity.id" v-model="selectedAmenities"/>
            <span>{{ amenity.name }}</span>
          </div>
        </label>
        <button type="submit" class="form-button">Create Campsite</button>
      </form>
  
      <h2>Your Campsites</h2>
      <div v-if="campsites.length" class="campsites">
        <div v-for="campsite in campsites" :key="campsite.id" class="campsite-card">
          <h3>{{ campsite.name }}</h3>
          <p>{{ campsite.description }}</p>
          <p><strong>Location:</strong> {{ campsite.location }}</p>
          <p><strong>Price Per Night:</strong> ${{ campsite.pricePerNight }}</p>
          <p v-if="campsite.amenities.length"><strong>Amenities:</strong> {{ campsite.amenities.join(', ') }}</p>
          <img v-if="campsite.imageBase64" :src="'data:image/jpeg;base64,' + campsite.imageBase64" alt="Campsite Image" class="campsite-image"/>
        </div>
      </div>
      <div v-else>
        <p>No campsites found.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import Compressor from 'compressorjs';
  
  const initialCampsiteState = {
    name: '',
    description: '',
    location: '',
    pricePerNight: 0,
    imageBase64: '',
    amenities: [], // List of amenity IDs
  };
  
  const campsite = ref({ ...initialCampsiteState });
  const campsites = ref([]);
  const userId = 1; // Replace with the actual user ID
  
  const amenities = ref([
    { id: 10, name: 'Beach Access' },
    { id: 12, name: 'Boating' },
    { id: 5, name: 'Campfire Rings' },
    { id: 1, name: 'Fire Pit' },
    { id: 4, name: 'Fishing' },
    { id: 8, name: 'Hiking' },
    { id: 11, name: 'Ocean Views' },
    { id: 9, name: 'Quiet Area' },
    { id: 2, name: 'Showers' },
    { id: 7, name: 'Stargazing' },
    { id: 13, name: 'Swimming' },
    { id: 6, name: 'Toilets' },
    { id: 3, name: 'WiFi' },
  ]);
  
  const selectedAmenities = ref([]);
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
  
    new Compressor(file, {
      quality: 0.6, // Adjust the quality as needed
      success(compressedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result.split(',')[1];
          campsite.value.imageBase64 = base64String;
        };
        reader.readAsDataURL(compressedFile);
      },
      error(err) {
        console.error('Image compression error:', err);
      },
    });
  };
  
  const resetForm = () => {
    campsite.value = { ...initialCampsiteState };
    selectedAmenities.value = [];
  };
  
  const createCampsite = async () => {
    const payload = {
      ...campsite.value,
      amenities: selectedAmenities.value // Sending amenities as list of IDs
    };
  
    // Log the payload to the console
    console.log('Payload:', payload);
  
    try {
      await axios.post('https://localhost:7063/api/Campsite/create', payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        }
      });
      alert('Campsite created successfully');
      resetForm();
      fetchCampsites(); // Fetch campsites again to update the list
    } catch (err) {
      console.error('Error creating campsite:', err);
      if (err.response) {
        console.log('Server response:', err.response.data);
        console.log('Validation errors:', err.response.data.errors);
      }
    }
  };
  
  const fetchCampsites = async () => {
    try {
      const response = await axios.get(`https://localhost:7063/api/User/${userId}/campsites`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        }
      });
      campsites.value = response.data.map(campsite => ({
        ...campsite,
        amenities: campsite.amenities || []
      }));
    } catch (err) {
      console.error('Error fetching campsites:', err);
    }
  };
  
  onMounted(() => {
    fetchCampsites();
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  .form {
    display: flex;
    flex-direction: column;
  }
  
  .form-label {
    margin-bottom: 15px;
    color: #555;
  }
  
  .form-input,
  .form-textarea {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .form-textarea {
    resize: vertical;
  }
  
  .form-checkbox {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .form-checkbox input[type="checkbox"] {
    margin-right: 10px;
  }
  
  .form-button {
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
  }
  
  .form-button:hover {
    background-color: #0056b3;
  }
  
  .campsites {
    margin-top: 30px;
  }
  
  .campsite-card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .campsite-card h3 {
    margin-top: 0;
    color: #333;
  }
  
  .campsite-card p {
    margin: 5px 0;
  }
  
  .campsite-image {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    margin-top: 10px;
  }
  </style>
  