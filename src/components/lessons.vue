<template>
  <div class="lessons-container">
    <!-- Header -->
    <header class="lessons-header">
      <div class="header-content">
        <h1 class="header-title">My Lessons</h1>
        <p class="header-subtitle">Track your enrolled classes and upcoming sessions</p>
      </div>
    </header>

    <!-- Filter Tabs -->
    <div class="filter-tabs-section">
      <div class="filters-container">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="activeFilter = filter"
          class="filter-btn"
          :class="{ active: activeFilter === filter }"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="search-section">
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search your lessons..."
          class="search-input"
        />
        <button class="sort-btn">Sort</button>
      </div>
    </div>

    <!-- Lessons Grid -->
    <div class="lessons-content">
      <!-- added loading state -->
      <div v-if="loading" class="no-results">
        <p>Loading lessons...</p>
      </div>

      <!-- added error state -->
      <div v-else-if="error" class="no-results">
        <p>Error: {{ error }}</p>
      </div>

      <!-- added check for empty array -->
      <div v-else-if="filteredLessons.length === 0" class="no-results">
        <p>No lessons found</p>
      </div>

      <div v-else class="lessons-grid">
        <div v-for="lesson in filteredLessons" :key="lesson._id" class="lesson-card">
          <!-- Image -->
          <div class="lesson-image-container">
            <img :src="lesson.image || '/placeholder.svg?height=160&width=320'" :alt="lesson.title" class="lesson-image" />
            <span class="status-badge" :class="'status-' + (lesson.status || 'In Progress').toLowerCase().replace(' ', '-')">
              {{ lesson.status || 'In Progress' }}
            </span>
          </div>

          <!-- Content -->
          <div class="lesson-body">
            <h3 class="lesson-title">{{ lesson.title }}</h3>
            <p class="lesson-description">{{ lesson.description }}</p>

            <!-- Lesson Info -->
            <div class="lesson-info">
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{{ lesson.nextSession || 'TBD' }}</span>
              </div>
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
                <span>{{ lesson.frequency || 'Self-paced' }}</span>
              </div>
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>{{ lesson.instructor || 'Staff' }}</span>
              </div>
            </div>

            <!-- Buttons -->
            <div class="lesson-buttons">
              <button class="btn btn-primary">View Details</button>
              <button class="btn btn-secondary">Messages</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const activeFilter = ref('All')
const searchQuery = ref('')
const filters = ['All', 'Upcoming', 'In Progress', 'Completed', 'Archived']
const lessons = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    console.log("[v0] Fetching lessons from http://localhost:5000/api/lessons")
    const response = await fetch('http://localhost:5000/api/lessons')
    console.log("[v0] Response status:", response.status)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log("[v0] Fetched lessons:", data)
    lessons.value = data
    error.value = null
  } catch (err) {
    console.error("[v0] Error fetching lessons:", err.message)
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const filteredLessons = computed(() => {
  return lessons.value.filter(lesson => {
    const lessonStatus = lesson.status || 'In Progress'
    const matchesFilter = activeFilter.value === 'All' || lessonStatus === activeFilter.value
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      || (lesson.instructor && lesson.instructor.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesFilter && matchesSearch
  })
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.lessons-container {
  min-height: 100vh;
  background-color: #fefefe;
}

/* Header */
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

/* Filter Tabs */
.filter-tabs-section {
  border-bottom: 1px solid #c6ccd2;
  background-color: #fefefe;
}

.filters-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.filter-btn {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  border: 1px solid #c6ccd2;
  background-color: #f5f5f5;
  color: #393833;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  font-size: 14px;
}

.filter-btn:hover {
  border-color: #0e0a07;
}

.filter-btn.active {
  background-color: #0e0a07;
  color: #fefefe;
  border-color: #0e0a07;
}

/* Search Section */
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

.search-input::placeholder {
  color: #72706b;
  opacity: 0.7;
}

.search-input:focus {
  outline: none;
  border-color: #0e0a07;
}

.sort-btn {
  padding: 10px 16px;
  background-color: #0e0a07;
  color: #fefefe;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.sort-btn:hover {
  background-color: #393833;
}

/* Lessons Content */
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

/* Lessons Grid */
.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* Lesson Card */
.lesson-card {
  border: 1px solid #c6ccd2;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fefefe;
  transition: box-shadow 0.3s;
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

.status-upcoming {
  background-color: #0e0a07;
  color: #fefefe;
}

.status-in-progress {
  background-color: #72706b;
  color: #fefefe;
}

.status-completed {
  background-color: #c6ccd2;
  color: #393833;
}

.status-archived {
  background-color: #393833;
  color: #fefefe;
}

/* Lesson Body */
.lesson-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

/* Lesson Info */
.lesson-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #393833;
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

/* Buttons */
.lesson-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
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
  background-color: #fefefe;
  color: #0e0a07;
  border: 1px solid #c6ccd2;
}

.btn-secondary:hover {
  background-color: #f5f5f5;
  border-color: #72706b;
}

/* Responsive */
@media (max-width: 768px) {
  .lessons-grid {
    grid-template-columns: 1fr;
  }

  .header-title {
    font-size: 24px;
  }

  .search-container {
    flex-direction: column;
  }

  .sort-btn {
    width: 100%;
  }
}
</style>
