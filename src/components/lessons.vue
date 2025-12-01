<template>
  <div class="lessons-container">
    <!-- Header -->
    <header class="lessons-header">
      <div class="header-content">
        <h1 class="header-title">My Lessons</h1>
        <p class="header-subtitle">Browse and find the perfect after-school activity.</p>
      </div>
    </header>

    <!-- Search & Sort Section -->
    <div class="search-section">
      <div class="search-container">
        <!-- Search Input -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search lessons by title, location, or teacher..."
          class="search-input"
        />

        <!-- Sort Controls -->
        <div class="sort-controls">
          <select v-model="sortAttribute" class="sort-select">
            <option disabled value="">Sort By</option>
            <option value="title">Subject</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
            <option value="spaces">Spaces</option>
          </select>
          <button @click="toggleSortOrder" class="sort-btn">
            {{ sortOrder === 'asc' ? '↑ Asc' : '↓ Desc' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Lessons Grid -->
    <div class="lessons-content">
      <!-- Loading State -->
      <div v-if="loading" class="no-results">
        <p>Loading lessons...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="no-results">
        <p>Error: {{ error }}</p>
      </div>

      <!-- No Results State -->
      <div v-else-if="filteredLessons.length === 0" class="no-results">
        <p>No lessons match your current search or filter criteria.</p>
      </div>

      <!-- Grid of Lesson Cards -->
      <div v-else class="lessons-grid">
        <div v-for="lesson in filteredLessons" :key="lesson._id" class="lesson-card">
          
          <!-- Image Container -->
          <div class="lesson-image-container">
            <img 
              :src="getImageUrl(lesson.image)" 
              @error="$event.target.src = 'https://placehold.co/600x400?text=No+Image'"
              :alt="lesson.title" 
              class="lesson-image" 
            />
            <span class="status-badge" :class="lesson.spaces > 0 ? 'status-available' : 'status-full'">
              Spaces: {{ lesson.spaces }}
            </span>
          </div>

          <!-- Card Body -->
          <div class="lesson-body">
            <h3 class="lesson-title">{{ lesson.title }}</h3>
            <p class="lesson-description">{{ lesson.description }}</p>

            <!-- Lesson Info -->
            <div class="lesson-info">
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <span>${{ lesson.price }}/session</span>
              </div>
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>{{ lesson.location }}</span>
              </div>
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>{{ lesson.teacher }}</span>
              </div>
            </div>

            <!-- Buttons -->
            <div class="lesson-buttons">
              <button @click="viewCourseDetail(lesson._id)" class="btn btn-primary">Details</button>
              
              <button 
                @click="handleAddToCart(lesson)" 
                class="btn btn-secondary"
                :disabled="!isLoggedIn || lesson.spaces <= 0 || isLessonInCart(lesson._id)"
              >
                <span v-if="!isLoggedIn">Login</span>
                <span v-else-if="lesson.spaces <= 0">Full</span>
                <span v-else-if="isLessonInCart(lesson._id)">Added</span>
                <span v-else>+ Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isLoggedIn, cart, addToCart } from '../store.js'

const router = useRouter()
const lessons = ref([])
const loading = ref(true)
const error = ref(null)

const searchQuery = ref('')
const sortAttribute = ref('title')
const sortOrder = ref('asc')

const getImageUrl = (imageName) => {
  if (!imageName) return 'https://placehold.co/600x400?text=No+Image';
  return `https://hubsy.onrender.com/images/${imageName}`;
}

const isLessonInCart = (lessonId) => {
  return cart.value.some(item => item._id === lessonId)
}

const handleAddToCart = (lesson) => {
  addToCart(lesson)
}

const filteredLessons = computed(() => {
  let displayedLessons = lessons.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    displayedLessons = displayedLessons.filter(lesson => 
      lesson.title.toLowerCase().includes(query) ||
      lesson.location.toLowerCase().includes(query) ||
      lesson.teacher.toLowerCase().includes(query) ||
      lesson.price.toString().includes(query)
    )
  }

  if (sortAttribute.value) {
    displayedLessons.sort((a, b) => {
      let valA = a[sortAttribute.value]
      let valB = b[sortAttribute.value]

      if (typeof valA === 'string') {
        valA = valA.toLowerCase()
        valB = valB.toLowerCase()
      }

      let comparison = 0
      if (valA > valB) comparison = 1
      else if (valA < valB) comparison = -1
      
      return sortOrder.value === 'asc' ? comparison : comparison * -1
    })
  }

  return displayedLessons
})

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const viewCourseDetail = (lessonId) => {
  router.push(`/course-detail/${lessonId}`)
}

onMounted(async () => {
  try {
    loading.value = true
    const response = await fetch('https://hubsy.onrender.com/api/lessons')
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    lessons.value = data
    error.value = null
  } catch (err) {
    console.error("Error fetching lessons:", err.message)
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.lessons-container {
  min-height: 100vh;
  background-color: #fefefe;
  font-family: system-ui, -apple-system, sans-serif;
}

.lessons-header {
  border-bottom: 1px solid #c6ccd2;
  background-color: #fefefe;
  padding: 24px 0;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

.header-title {
  font-size: 30px;
  font-weight: 700;
  color: #0e0a07;
}

.header-subtitle {
  font-size: 14px;
  color: #72706b;
  margin-top: 4px;
}

.search-section {
  border-bottom: 1px solid #c6ccd2;
  background-color: #fefefe;
  padding: 16px 0;
}

.search-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #c6ccd2;
  border-radius: 8px;
  font-size: 14px;
  color: #0e0a07;
  background-color: #fefefe;
}

.search-input:focus {
  outline: none;
  border-color: #0e0a07;
}

.sort-controls {
  display: flex;
  gap: 0;
  align-items: center;
}

.sort-select {
  padding: 10px 12px;
  border: 1px solid #c6ccd2;
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-size: 14px;
  color: #0e0a07;
  background-color: #fefefe;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23393833' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 1em;
  padding-right: 28px;
}

.sort-select:focus {
  outline: none;
  border-color: #0e0a07;
}

.sort-btn {
  padding: 10px 16px;
  background-color: #0e0a07;
  color: #fefefe;
  border: none;
  border-radius: 0 8px 8px 0;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.sort-btn:hover {
  background-color: #393833;
}

.lessons-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 16px;
}

.no-results {
  text-align: center;
  padding: 48px 16px;
  color: #72706b;
  font-size: 18px;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.lesson-card {
  border: 1px solid #c6ccd2;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fefefe;
  transition: box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.lesson-card:hover {
  box-shadow: 0 4px 12px rgba(14, 10, 7, 0.1);
}

.lesson-image-container {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background-color: #c6ccd2;
}

.lesson-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-available {
  background-color: #c0392b;
  color: #fefefe;
}

.status-full {
  background-color: #72706b;
  color: #fefefe;
}

.lesson-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.lesson-title {
  font-size: 16px;
  font-weight: 700;
  color: #0e0a07;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lesson-description {
  font-size: 13px;
  color: #72706b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lesson-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #393833;
  margin-top: auto;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  stroke: currentColor;
}

.lesson-buttons {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.btn {
  flex: 1;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-primary {
  background-color: #0e0a07;
  color: #fefefe;
  border: 1px solid #0e0a07;
}

.btn-primary:hover {
  background-color: #393833;
  border-color: #393833;
}

.btn-secondary {
  background-color: #f0c419;
  color: #0e0a07;
  border: 1px solid #c6ccd2;
}

.btn-secondary:hover {
  background-color: #dcb317;
}

.btn:disabled {
  background-color: #c6ccd2;
  color: #72706b;
  cursor: not-allowed;
  border-color: #c6ccd2;
}

@media (max-width: 768px) {
  .lessons-grid {
    grid-template-columns: 1fr;
  }
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input {
    width: 100%;
  }
  .sort-controls {
    width: 100%;
    justify-content: space-between;
  }
  .sort-select, .sort-btn {
    flex: 1;
    border-radius: 8px;
  }
  .sort-select {
    border-right: 1px solid #c6ccd2;
    border-radius: 8px;
  }
}
</style>