<template>
  <div class="course-detail-container">
    <!-- Header -->
    <header class="detail-header">
      <button @click="goBack" class="back-btn">← Back to Lessons</button>
      <div class="header-top">
        <h1 class="page-title">HUBSY</h1>
      </div>
    </header>

    <!-- Loading & Error States -->
    <div v-if="loading" class="loading-state">
      <p>Loading course details...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>Error: {{ error }}</p>
    </div>

    <!-- Course Content -->
    <div v-else-if="course" class="course-content">
      <div class="course-main">
        <!-- Left Column -->
        <div class="course-left">
          <!-- Course Image -->
          <div class="course-image-section">
            <img 
              :src="getImageUrl(course.image)" 
              @error="$event.target.src = 'https://placehold.co/600x400?text=No+Image'"
              :alt="course.title" 
              class="course-image" 
            />
          </div>

          <!-- Course Title & Description -->
          <div class="course-info">
            <h2 class="course-title">{{ course.title }}</h2>
            <p class="course-description">{{ course.description }}</p>

            <!-- Instructor Info -->
            <div class="instructor-section">
              <div class="instructor-avatar">{{ course.teacher ? course.teacher.charAt(0) : '?' }}</div>
              <div class="instructor-details">
                <p class="instructor-name">{{ course.teacher }}</p>
                <div class="instructor-rating">
                  <span class="rating-star">★</span>
                  <span class="rating-value">{{ course.rating }}</span>
                  <span class="rating-count">({{ Math.floor(Math.random() * 500 + 100) }} reviews)</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="course-actions">
              <button @click="handleAddToCart" class="btn btn-primary" :disabled="!isLoggedIn || isInCart || !hasSpaces">

                <span v-if="!isLoggedIn">Login to Add</span>
                <span v-else-if="!hasSpaces">Out of Stock</span>
                <span v-else-if="isInCart">Added to Cart</span>
                <span v-else>Add to Cart</span>

              </button>
              <button class="btn btn-secondary">Message Instructor</button>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="course-right">
          <!-- Course Stats Card -->
          <div class="stats-card">
            <div class="price-section">
              <span class="currency">$</span>
              <span class="price">{{ course.price }}</span>
              <span class="price-label">per session</span>
            </div>

            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Sessions/Week</span>
                <span class="stat-value">{{ course.sessions_per_week }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Duration</span>
                <span class="stat-value">{{ course.duration_weeks }} wks</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Session Length</span>
                <span class="stat-value">{{ course.session_duration_min }} min</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Age Range</span>
                <span class="stat-value">{{ course.age_min }}-{{ course.age_max }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Class Size</span>
                <span class="stat-value">Up to {{ course.students_limit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="tabs-section">
        <div class="tabs-container">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            class="tab-btn"
            :class="{ active: activeTab === tab }"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- 
            --- THIS IS THE CORRECTED SECTION ---
          -->
          <div v-if="activeTab === 'Overview'" class="overview-content">
            <h3 class="section-title">Overview</h3>
            <div class="features-grid">
              
              <!-- 1. Show Location (if it exists) -->
              <div v-if="course.location" class="feature-item">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <span>Location: {{ course.location }}</span>
              </div>
              
              <!-- 2. Loop over features (if they exist) -->
              <div v-if="course.features && course.features.length" v-for="feature in course.features" :key="feature" class="feature-item">
                <div class="feature-icon">✓</div>
                <!-- 3. Print the 'feature', not 'course.location' -->
                <span>{{ feature }}</span>
              </div>

            </div>
          </div>
          <!-- --- END OF CORRECTION --- -->


          <div v-else-if="activeTab === 'Schedule'" class="schedule-content">
            <h3 class="section-title">Schedule</h3>
            <p class="schedule-info">
              {{ course.sessions_per_week }} sessions per week, {{ course.duration_weeks }} weeks total
            </p>
            <p class="schedule-detail">Each session is {{ course.session_duration_min }} minutes long</p>
          </div>

          <div v-else-if="activeTab === 'Teacher'" class="teacher-content">
            <h3 class="section-title">About the Instructor</h3>
            <p class="teacher-bio">{{ course.teacher }} is an experienced educator passionate about making learning engaging and effective.</p>
          </div>

          <div v-else-if="activeTab === 'Reviews'" class="reviews-content">
            <h3 class="section-title">Student Reviews</h3>
            <p class="review-rating">Average Rating: {{ course.rating }} ★</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <p>Course not found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// This import is correct
import { isLoggedIn, cart, addToCart } from "../store.js" 

const course = ref(null)
const loading = ref(true)
const error = ref(null)
const activeTab = ref('Overview')
const route = useRoute()
const router = useRouter()
const tabs = ['Overview', 'Schedule', 'Teacher', 'Reviews']

// This function is now correct
const isInCart = computed(() => {
  if(!course.value) return false;
  // .some() checks if any item in the cart array matches this condition
  return cart.value.some(item => item._id === course.value._id);
});

// This function is correct
const hasSpaces = computed(() => {
  return course.value && course.value.spaces && course.value.spaces > 0;
});

const getImageUrl = (imageName) => {
  if (!imageName) return 'https://placehold.co/600x400?text=No+Image';
  return `https://hubsy.onrender.com/images/${imageName}`;
}

// This onMounted is correct
onMounted(async () => {
  try {
    const lessonId = route.params.id
    loading.value = true

    const response = await fetch(`https://hubsy.onrender.com/api/lessons/${lessonId}`)

    if (!response.ok) {
      throw new Error(`Course not found: ${response.status}`)
    }

    const data = await response.json()
    course.value = data
    error.value = null
  } catch (err) {
    console.error("Error fetching course:", err.message)
    error.value = err.message
  } finally {
    loading.value = false
  }
})

// This goBack is correct
const goBack = () => {
  window.history.back()
}

// This handleAddToCart is correct
const handleAddToCart = () => {
  if (course.value){
    addToCart(course.value);
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.course-detail-container {
  min-height: 100vh;
  background-color: #fefefe;
}

/* Header */
.detail-header {
  border-bottom: 1px solid #c6ccd2;
  background-color: #fefefe;
  padding: 16px 0;
}

.header-top {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  padding: 8px 12px;
  background-color: transparent;
  border: 1px solid #c6ccd2;
  border-radius: 6px;
  color: #0e0a07;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background-color: #f5f5f5;
  border-color: #0e0a07;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0e0a07;
}

/* Loading & Error States */
.loading-state,
.error-state,
.not-found {
  text-align: center;
  padding: 64px 16px;
  color: #72706b;
  font-size: 16px;
}

/* Course Content */
.course-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 16px;
}

.course-main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 48px;
}

/* Left Column */
.course-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.course-image-section {
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 12px;
  overflow: hidden;
  background-color: #c6ccd2;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-title {
  font-size: 28px;
  font-weight: 700;
  color: #0e0a07;
  line-height: 1.3;
}

.course-description {
  font-size: 15px;
  color: #72706b;
  line-height: 1.6;
}

/* Instructor Section */
.instructor-section {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 1px solid #c6ccd2;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.instructor-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #0e0a07;
  color: #fefefe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.instructor-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
}

.instructor-name {
  font-weight: 600;
  color: #0e0a07;
  font-size: 14px;
}

.instructor-rating {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 13px;
}

.rating-star {
  color: #0e0a07;
}

.rating-value {
  font-weight: 600;
  color: #0e0a07;
}

.rating-count {
  color: #72706b;
}

/* Action Buttons */
.course-actions {
  display: flex;
  gap: 12px;
}

/* Right Column */
.course-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Stats Card */
.stats-card {
  border: 1px solid #c6ccd2;
  border-radius: 12px;
  padding: 24px;
  background-color: #fefefe;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 24px;
  border-bottom: 1px solid #c6ccd2;
  padding-bottom: 24px;
}

.currency {
  font-size: 18px;
  color: #393833;
}

.price {
  font-size: 32px;
  font-weight: 700;
  color: #0e0a07;
}

.price-label {
  font-size: 13px;
  color: #72706b;
  margin-left: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #72706b;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #0e0a07;
}

/* Trial Section */
.trial-section {
  border: 1px solid #c6ccd2;
  border-radius: 12px;
  padding: 20px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trial-title {
  font-size: 16px;
  font-weight: 700;
  color: #0e0a07;
}

.trial-description {
  font-size: 13px;
  color: #72706b;
  line-height: 1.5;
}

/* Tabs Section */
.tabs-section {
  margin-top: 48px;
  border-top: 1px solid #c6ccd2;
  padding-top: 32px;
}

.tabs-container {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid #c6ccd2;
  padding-bottom: 12px;
}

.tab-btn {
  padding: 8px 0;
  background-color: transparent;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #72706b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #0e0a07;
}

.tab-btn.active {
  color: #0e0a07;
  border-bottom-color: #0e0a07;
}

.tab-content {
  min-height: 300px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #0e0a07;
  margin-bottom: 16px;
}

/* Overview Content */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #c6ccd2;
  border-radius: 8px;
  background-color: #f5f5f5;
  font-size: 14px;
  color: #0e0a07;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #0e0a07;
  color: #fefefe;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0; /* Prevents icon from shrinking */
}

/* Schedule Content */
.schedule-info,
.schedule-detail {
  font-size: 14px;
  color: #72706b;
  line-height: 1.6;
  margin-bottom: 12px;
}

.schedule-info {
  font-weight: 600;
  color: #0e0a07;
}

/* Teacher Content */
.teacher-bio {
  font-size: 14px;
  color: #72706b;
  line-height: 1.6;
}

/* Reviews Content */
.review-rating {
  font-size: 16px;
  font-weight: 600;
  color: #0e0a07;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #0e0a07;
  color: #fefefe;
}

.btn-primary:hover {
  background-color: #393833;
}

.btn-secondary {
  background-color: transparent;
  color: #0e0a07;
  border: 1px solid #c6ccd2;
}

.btn-secondary:hover {
  background-color: #f5f5f5;
  border-color: #0e0a07;
}

.btn:disabled {
  background-color: #c6ccd2;
  color: #72706B;
  cursor: not-allowed;
}
.btn:disabled:hover {
  background-color: #c6ccd2;
}

/* Responsive */
@media (max-width: 768px) {
  .course-main {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .course-title {
    font-size: 22px;
  }

  .course-actions {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .tabs-container {
    flex-direction: column;
    gap: 0;
    border-bottom: none;
    padding-bottom: 0;
  }

  .tab-btn {
    border-bottom: 1px solid #c6ccd2;
    padding: 12px 0;
  }

  .tab-btn.active {
    border-bottom: 2px solid #0e0a07;
  }
}
</style>