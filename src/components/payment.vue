<template>
  <div class="payment-container">
    <!-- Header -->
    <header class="detail-header">
      <button @click="goBack" class="back-btn">← Back to Course</button>
      <div class="header-top">
        <h1 class="page-title">HUBSY</h1>
      </div>
    </header>

    <!-- Loading & Error States -->
    <div v-if="loading" class="loading-state">
      <p>Loading payment details...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>Error: {{ error }}</p>
    </div>

    <!-- Payment Content -->
    <div v-else-if="course" class="payment-content">
      <div class="payment-grid">
        <!-- Left Column: Payment Form -->
        <div class="payment-form">
          <h2 class="section-title">Enter Payment Method</h2>
          
          <div class="payment-tabs">
            <button class="tab-btn active">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              Card
            </button>
            <button class="tab-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              Bank
            </button>
          </div>

          <form class="card-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="you@example.com" />
            </div>

            <div class="form-group">
              <label for="card-number">Card number</label>
              <input type="text" id="card-number" placeholder="1234 1234 1234 1234" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="expiration-date">Expiration date</label>
                <input type="text" id="expiration-date" placeholder="MM / YY" />
              </div>
              <div class="form-group">
                <label for="cvc">Security code</label>
                <input type="text" id="cvc" placeholder="CVC" />
              </div>
            </div>

            <div class="form-group">
              <label for="country">Country</label>
              <select id="country">
                <option value="Nigeria">Nigeria</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
            
            <button type="submit" class="btn btn-primary submit-btn">
              Subscribe & Pay
            </button>
          </form>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="order-summary">
          <h2 class="section-title">Order Summary</h2>
          <div class="summary-card">
            
            <!-- Course Info -->
            <div class="course-item">
              <img :src="course.image || '/placeholder.svg?height=60&width=80'" :alt="course.title" class="course-thumb" />
              <div class="course-details">
                <h3 class="course-title">{{ course.title }}</h3>
                <p class="course-price">${{ course.price }} / session</p>
              </div>
            </div>

            <!-- Payment Plan Selection -->
            <div class="plan-selector">
              <label class="plan-option">
                <input type="radio" v-model="paymentPlan" value="week" />
                <div class="plan-details">
                  <span class="plan-title">Pay per Week</span>
                  <span class="plan-price">${{ weeklyTotal.toFixed(2) }}</span>
                </div>
              </label>
              <label class="plan-option">
                <input type="radio" v-model="paymentPlan" value="month" />
                <div class="plan-details">
                  <span class="plan-title">Pay per Month</span>
                  <span class="plan-price">${{ (monthlyTotal - discount).toFixed(2) }}</span>
                </div>
                <div class="plan-badge">15% OFF</div>
              </label>
            </div>

            <!-- Totals -->
            <div class="totals-section">
              <div class="total-row">
                <span>Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="discount > 0" class="total-row discount">
                <span>Monthly Discount (15%)</span>
                <span>-${{ discount.toFixed(2) }}</span>
              </div>
              <div class="total-row grand-total">
                <span>Total due today</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const course = ref(null)
const loading = ref(true)
const error = ref(null)

// Payment calculation state
const paymentPlan = ref('week') // 'week' or 'month'

// Computed properties for costs
const weeklyTotal = computed(() => {
  if (!course.value) return 0
  return course.value.price * course.value.sessions_per_week
})

const monthlyTotal = computed(() => {
  // Assuming 4 weeks in a month
  return weeklyTotal.value * 4
})

const subtotal = computed(() => {
  return paymentPlan.value === 'week' ? weeklyTotal.value : monthlyTotal.value
})

const discount = computed(() => {
  if (paymentPlan.value === 'month') {
    return monthlyTotal.value * 0.15 // 15% discount
  }
  return 0
})

const total = computed(() => {
  return subtotal.value - discount.value
})

// Fetch course data on load
onMounted(async () => {
  try {
    const lessonId = route.params.id
    loading.value = true
    const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}`)
    
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

const goBack = () => {
  router.go(-1) // Go back to the previous page (course-detail)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.payment-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.detail-header {
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
  padding: 16px 0;
}

.header-top {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  padding: 8px 12px;
  background-color: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 32px;
}

.back-btn:hover {
  background-color: #f5f5f5;
  border-color: #333;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0e0a07;
}

/* States */
.loading-state,
.error-state {
  text-align: center;
  padding: 64px 16px;
  color: #72706b;
  font-size: 16px;
}

/* Content */
.payment-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 32px;
}

.payment-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 48px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: #111;
  margin-bottom: 24px;
}

/* Left: Payment Form */
.payment-form {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 32px;
}

.payment-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
}
.tab-btn svg {
  stroke: #777;
}

.tab-btn.active {
  background-color: #e6f0ff;
  border-color: #0066ff;
  color: #0066ff;
}
.tab-btn.active svg {
  stroke: #0066ff;
}

.card-form .form-group {
  margin-bottom: 20px;
}

.card-form label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.card-form input,
.card-form select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  background-color: #fff;
}
.card-form input:focus {
  outline: none;
  border-color: #0066ff;
  box-shadow: 0 0 0 3px #e6f0ff;
}

.form-row {
  display: flex;
  gap: 16px;
}
.form-row .form-group {
  flex: 1;
}

.submit-btn {
  width: 100%;
  font-size: 16px;
  padding: 14px;
  margin-top: 16px;
}

/* Right: Order Summary */
.summary-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
}

.course-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.course-thumb {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  background-color: #eee;
}

.course-details {
  flex: 1;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.course-price {
  font-size: 14px;
  color: #555;
  margin: 4px 0 0;
}

/* Plan Selector */
.plan-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
}

.plan-option {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.plan-option:has(input:checked) {
  border-color: #0066ff;
  background-color: #e6f0ff;
}

.plan-option input[type="radio"] {
  margin-right: 12px;
  width: 18px;
  height: 18px;
  accent-color: #0066ff;
}

.plan-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.plan-price {
  font-size: 15px;
  font-weight: 600;
  color: #111;
}

.plan-badge {
  font-size: 12px;
  font-weight: 600;
  color: #1a7431;
  background-color: #d1f7dd;
  padding: 4px 8px;
  border-radius: 20px;
  margin-left: 12px;
}

/* Totals */
.totals-section {
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #555;
}
.total-row.discount {
  color: #1a7431;
}
.total-row.grand-total {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin-top: 8px;
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
  background-color: #0066ff;
  color: #fefefe;
}
.btn-primary:hover {
  background-color: #005ce6;
}

/* Responsive */
@media (max-width: 900px) {
  .payment-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>