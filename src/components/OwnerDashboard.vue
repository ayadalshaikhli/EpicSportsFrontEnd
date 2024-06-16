<template>
  <div class="container">
    <h2>Create New Campsite</h2>
    <form @submit.prevent="createCampsite" class="form">
      <label class="form-label">
        Name:
        <input v-model="campsite.name" required class="form-input" />
      </label>
      <label class="form-label">
        Description:
        <textarea
          v-model="campsite.description"
          required
          class="form-textarea"
        ></textarea>
      </label>
      <label class="form-label">
        Location:
        <input v-model="campsite.location" required class="form-input" />
      </label>
      <label class="form-label">
        Price Per Night:
        <input
          v-model.number="campsite.pricePerNight"
          type="number"
          step="0.01"
          min="0"
          required
          class="form-input"
        />
      </label>
      <label class="form-label">
        Image:
        <input
          type="file"
          @change="handleFileUpload"
          accept="image/jpeg, image/jpg, image/png"
          class="form-input"
        />
      </label>
      <label class="form-label">
        Amenities:
        <div
          v-for="amenity in amenities"
          :key="amenity.id"
          class="form-checkbox"
        >
          <input
            type="checkbox"
            :value="amenity.id"
            v-model="selectedAmenities"
          />
          <span>{{ amenity.name }}</span>
        </div>
      </label>
      <button type="submit" class="form-button">Create Campsite</button>
    </form>

    <div v-if="error" class="error-message">{{ error }}</div>

    <h2>My Campsites</h2>
    <div v-if="campsites.length" class="campsites-list">
      <div
        v-for="campsite in campsites"
        :key="campsite.id"
        class="campsite-card"
      >
        <button class="delete-button" @click="deleteCampsite(campsite.id)">
          Delete
        </button>
        <div class="campsite-details">
          <h3>{{ campsite.name }}</h3>
          <p>{{ campsite.description }}</p>
          <p><strong>Location:</strong> {{ campsite.location }}</p>
          <p><strong>Price Per Night:</strong> €{{ campsite.pricePerNight }}</p>
          <div
            v-if="campsite.amenities && campsite.amenities.length"
            class="amenities"
          >
            <strong>Amenities:</strong>
            <ul>
              <li
                v-for="amenity in campsite.amenities.split(', ')"
                :key="amenity"
              >
                {{ amenity }}
              </li>
            </ul>
          </div>
        </div>
        <img
          v-if="campsite.imageBase64"
          :src="'data:image/jpeg;base64,' + campsite.imageBase64"
          alt="Campsite Image"
          class="campsite-image"
        />
      </div>
    </div>
    <div v-else>
      <p>No campsites found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Compressor from "compressorjs";

const initialCampsiteState = {
  name: "",
  description: "",
  location: "",
  pricePerNight: 0,
  imageBase64: "",
  amenities: [],
};

const user = ref(null);
const error = ref(null);
const campsite = ref({ ...initialCampsiteState });
const campsites = ref([]);

const fetchUserData = async () => {
  try {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      user.value = JSON.parse(userData);
      await fetchCampsites(user.value.id);
    } else {
      error.value = "User data not found. Please log in again.";
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    error.value = "Failed to fetch user data. Please try again later.";
  }
};

const amenities = ref([
  { id: 10, name: "Beach Access" },
  { id: 12, name: "Boating" },
  { id: 5, name: "Campfire Rings" },
  { id: 1, name: "Fire Pit" },
  { id: 4, name: "Fishing" },
  { id: 8, name: "Hiking" },
  { id: 11, name: "Ocean Views" },
  { id: 9, name: "Quiet Area" },
  { id: 2, name: "Showers" },
  { id: 7, name: "Stargazing" },
  { id: 13, name: "Swimming" },
  { id: 6, name: "Toilets" },
  { id: 3, name: "WiFi" },
]);

const selectedAmenities = ref([]);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const validFileTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!validFileTypes.includes(file.type)) {
    alert("Only JPEG, JPG, and PNG files are allowed.");
    return;
  }

  new Compressor(file, {
    quality: 0.6,
    success(compressedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        campsite.value.imageBase64 = base64String;
      };
      reader.readAsDataURL(compressedFile);
    },
    error(err) {
      console.error("Image compression error:", err);
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
    amenities: selectedAmenities.value,
  };

  console.log("Payload:", payload);
  try {
    const response = await axios.post(
      "https://localhost:7063/api/Campsite/create",
      payload,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    console.log("Response:", response); // Log the response
    successMessage.value = "Campsite created successfully!";
    resetForm();
    window.location.reload();
    await fetchCampsites();
  } catch (err) {
    console.error("Error creating campsite:", err);
    if (err.response) {
      console.log("Server response:", err.response.data);
      console.log("Validation errors:", err.response.data.errors);
    }
    error.value = err.response
      ? err.response.data
      : "An error occurred while creating the campsite";
  }
};

const fetchCampsites = async (userId) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(
      `https://localhost:7063/api/User/${userId}/campsites`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    campsites.value = response.data;
  } catch (err) {
    console.error("Error fetching campsites:", err);
    error.value = "Failed to fetch campsites. Please try again later.";
  }
};

const deleteCampsite = async (campId) => {
  if (confirm("Are you sure you want to delete this campsite?")) {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`https://localhost:7063/api/Campsite/${campId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchCampsites(user.value.id);
    } catch (err) {
      console.error("Error deleting campsite:", err);
      alert("Failed to delete campsite. Please try again later.");
    }
  }
};

fetchUserData();
onMounted(() => {
  if (user.value) {
    fetchCampsites(user.value.id);
  }
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

.campsites-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.campsite-card {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.campsite-details {
  flex: 1;
  margin-right: 20px;
}

.amenities {
  flex: 1;
  margin-right: 20px;
}

.amenities ul {
  list-style-type: disc;
  padding-left: 20px;
}

.campsite-image {
  max-width: 200px;
  height: auto;
  border-radius: 5px;
}

.delete-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.delete-button:hover {
  background-color: darkred;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
