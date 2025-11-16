<template>
  <div class="cart-page-container">
    <div class="cart-header">
      <h1>My Cart</h1>
      <router-link to="/lessons" class="btn-continue-shopping" v-if="cart.length > 0">
        &larr; Continue Shopping
      </router-link>
    </div>

    <!-- Show if cart is empty -->
    <div class="cart-empty" v-if="cart.length === 0">
      <p>Your cart is empty.</p>
      <router-link to="/lessons" class="btn btn-primary">
        Browse Lessons
      </router-link>
    </div>
    
    <!-- Shows only if the cart is NOT empty -->
    <div class="cart-content" v-else>
      
      <!-- ===== PART A: CART LIST ===== -->
      <div class="cart-list">
        <!-- Global Plan Toggle -->
        <div class="global-plan-toggle">
          <label>Apply to all items:</label>
          <div class="plan-buttons">
            <button @click="applyGlobalPlan('week')" :class="{ active: globalPlan === 'week' }">Pay per Week</button>
            <button @click="applyGlobalPlan('month')" :class="{ active: globalPlan === 'month' }">Pay per Month (15% Off)</button>
          </div>
        </div>

        <!-- Loop through each item in the cart -->
        <div v-for="item in cart" :key="item._id" class="cart-item">
          <img :src="item.image || '/placeholder.svg?height=80&width=100'" :alt="item.title" class="item-image" />
          <div class="item-details">
            <h3 class="item-title">{{ item.title }}</h3>
            
            <!-- ===== PART B: Individual Plan Logic ===== -->
            <div class="item-plan-toggle">
              <button @click="setItemPlan(item._id, 'week')" :class="{ active: itemPlans[item._id] === 'week' }">Week</button>
              <button @click="setItemPlan(item._id, 'month')" :class="{ active: itemPlans[item._id] === 'month' }">Month</button>
            </div>
            
            <p class="item-price-breakdown">
              ${{ item.price }}/session &times; {{ item.sessions_per_week }} sessions/wk
              <span v-if="itemPlans[item._id] === 'month'"> &times; 4 wks (15% off)</span>
            </p>
          </div>
          
          <div class="item-price-total">
            <span class="item-price-final">${{ calculateItemTotal(item).toFixed(2) }}</span>
            <span class="item-price-subtext">per {{ itemPlans[item._id] }}</span>
          </div>
          
          <div class="item-remove">
            <button @click="removeFromCart(item._id)" class="btn-remove" title="Remove item">
              &times;
            </button>
          </div>
        </div>
      </div>
      
      <!-- ===== PART C: SUMMARY & CHECKOUT FORM ===== -->
      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${{ cartTotal.toFixed(2) }}</span>
        </div>
        <div class="summary-row" v-if="totalDiscount > 0">
          <span class="text-discount">Monthly Discount (15%)</span>
          <span class="text-discount">-${{ totalDiscount.toFixed(2) }}</span>
        </div>
        
        <div class="summary-total">
          <span>Total Due</span>
          <span>${{ (cartTotal - totalDiscount).toFixed(2) }}</span>
        </div>

        <div class="checkout-form">
          <h3>Checkout Information</h3>
          <div class="form-group">
            <label for="checkout-name">Name</label>
            <input type="text" id="checkout-name" v-model="checkoutForm.name" />
            <span v-if="!isNameValid" class="validation-error">Name must be letters only</span>
          </div>
          <div class="form-group">
            <label for="checkout-phone">Phone</label>
            <input type="tel" id="checkout-phone" v-model="checkoutForm.phone" placeholder="e.g. 08012345678" />
            <span v-if="!isPhoneValid" class="validation-error">Phone must be numbers only</span>
          </div>

          <button 
            @click="handleSubmitOrder" 
            class="btn-checkout"
            :disabled="!isFormValid"
          >
            Submit Order
          </button>
          <p class="checkout-message">{{ orderStatus }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { user, cart, cartItemCount, removeFromCart, clearCart } from '../store.js'


// --- Checkout Form State ---
const checkoutForm = ref({ name: '', phone: '' })
const orderStatus = ref('') 
const router = useRouter()

// --- Payment Plan Logic (Part B) ---
const globalPlan = ref('week')
const itemPlans = ref({}) // Stores plan for each item, e.g. { 'lessonId1': 'week', 'lessonId2': 'month' }

// Initialize item plans when cart changes
onMounted(() => {
  // Pre-fill form with logged-in user's name
  if (user.value) {
    checkoutForm.value.name = user.value.name
  }
  // Set default plan for all cart items
  cart.value.forEach(item => {
    if (!itemPlans.value[item._id]) {
      itemPlans.value[item._id] = 'week'
    }
  })
})

const setItemPlan = (lessonId, plan) => {
  itemPlans.value[lessonId] = plan
}

const applyGlobalPlan = (plan) => {
  globalPlan.value = plan
  cart.value.forEach(item => {
    itemPlans.value[item._id] = plan
  })
}

const calculateItemTotal = (item) => {
  const plan = itemPlans.value[item._id]
  const weeklyCost = item.price * item.sessions_per_week
  
  if (plan === 'month') {
    return (weeklyCost * 4) * 0.85 // 15% discount
  }
  return weeklyCost // Weekly cost
}

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => {
    const weeklyCost = item.price * item.sessions_per_week
    return total + (weeklyCost * (itemPlans.value[item._id] === 'month' ? 4 : 1))
  }, 0)
})

const totalDiscount = computed(() => {
  return cart.value.reduce((discount, item) => {
    if (itemPlans.value[item._id] === 'month') {
      const weeklyCost = item.price * item.sessions_per_week
      return discount + (weeklyCost * 4 * 0.15) // 15% discount
    }
    return discount
  }, 0)
})


// --- Checkout Form Validation (Part C) ---
const nameRegex = /^[A-Za-z\s]+$/
const phoneRegex = /^[0-9]+$/

const isNameValid = computed(() => {
  return checkoutForm.value.name.length > 0 && nameRegex.test(checkoutForm.value.name)
})
const isPhoneValid = computed(() => {
  return checkoutForm.value.phone.length > 0 && phoneRegex.test(checkoutForm.value.phone)
})
const isFormValid = computed(() => {
  return isNameValid.value && isPhoneValid.value && cart.value.length > 0
})

// --- Submit Order ---
const handleSubmitOrder = async () => {
  if (!isFormValid.value) return

  orderStatus.value = 'Submitting order...'
  
  // This is the data we'll send to the backend
  const orderData = {
    name: checkoutForm.value.name,
    phone: checkoutForm.value.phone,
    items: cart.value.map(item => ({
      lessonId: item._id,
      title: item.title,
      plan: itemPlans.value[item._id],
      cost: calculateItemTotal(item)
    })),
    total: (cartTotal.value - totalDiscount.value)
  }

  try {
    // --- THIS IS STEP 1: `POST` to /api/orders ---
    // (We will build this backend route in the next step)
    
    /*
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    if (!response.ok) throw new Error('Failed to submit order.')
    */

    // --- THIS IS STEP 2: `PUT` to /api/lessons/:id ---
    // We update the spaces for each item
    for (const item of cart.value) {
      // In a real app, you'd check how many spaces to subtract.
      // For this coursework, we just update it.
      // We'll assume the PUT route subtracts 1 space
      /*
      await fetch(`http://localhost:5000/api/lessons/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // This tells the backend to decrease spaces by 1
          // We'll need to build this logic in the backend
          $inc: { spaces: -1 } 
        })
      })
      */
    }

    // For now, we'll just simulate success:
    console.log("Order submitted:", orderData)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Fake 1s delay
    
    // --- THIS IS STEP 3: Success! ---
    orderStatus.value = "Order submitted successfully! Thank you."
    clearCart() // Empty the cart from the global store
    // Optionally, redirect them after a few seconds
    // setTimeout(() => router.push('/'), 3000)
    router.push('/order-confirmation')

  } catch (err) {
    console.error("Order submission error:", err)
    orderStatus.value = `Error: ${err.message}`
  }
}

</script>

<style scoped>
.cart-page-container {
  max-width: 1200px;
  margin: 32px auto;
  padding: 24px;
  min-height: 60vh;
}
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ececec;
  padding-bottom: 16px;
  margin-bottom: 32px;
}
.cart-header h1 {
  font-size: 28px;
  color: #0E0A07;
  margin: 0;
}
.btn-continue-shopping {
  font-weight: 600;
  color: #393833;
  text-decoration: none;
  transition: color 0.2s;
}
.btn-continue-shopping:hover {
  color: #c0392b;
}

.cart-empty {
  text-align: center;
  font-size: 18px;
  color: #72706B;
  padding: 64px 0;
}
.cart-empty p {
  margin-bottom: 24px;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  align-items: flex-start;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.global-plan-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 8px;
}
.global-plan-toggle label {
  font-weight: 600;
  color: #393833;
  font-size: 14px;
}

.plan-buttons button {
  padding: 8px 12px;
  border: 1px solid #c6ccd2;
  background-color: #fff;
  color: #393833;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.plan-buttons button:first-child {
  border-radius: 6px 0 0 6px;
}
.plan-buttons button:last-child {
  border-radius: 0 6px 6px 0;
  border-left: none;
}
.plan-buttons button.active {
  background-color: #393833;
  color: white;
  border-color: #393833;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto;
  align-items: center;
  gap: 16px;
  background-color: #fefefe;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.item-image {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  background-color: #eee;
}

.item-details {
  flex: 1;
}
.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #0E0A07;
  margin: 0 0 8px 0;
}
.item-plan-toggle button {
  padding: 4px 8px;
  border: 1px solid #c6ccd2;
  background-color: #fff;
  font-size: 12px;
  cursor: pointer;
}
.item-plan-toggle button:first-child { border-radius: 4px 0 0 4px; }
.item-plan-toggle button:last-child { border-radius: 0 4px 4px 0; border-left: none; }
.item-plan-toggle button.active { background-color: #393833; color: white; border-color: #393833; }

.item-price-breakdown {
  font-size: 12px;
  color: #72706B;
  margin: 8px 0 0;
}
.item-price-breakdown span {
  color: #c0392b;
  font-weight: 500;
}

.item-price-total {
  text-align: right;
}
.item-price-final {
  font-size: 16px;
  font-weight: 600;
  color: #0E0A07;
}
.item-price-subtext {
  font-size: 12px;
  color: #72706B;
  display: block;
}

.btn-remove {
  background: none;
  border: none;
  font-size: 24px;
  color: #c0392b;
  cursor: pointer;
  padding: 0 8px;
  line-height: 1;
}

.cart-summary {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  position: sticky; /* Makes it stick on scroll */
  top: 32px;
}
.cart-summary h2 {
  font-size: 20px;
  color: #0E0A07;
  margin: 0 0 24px 0;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #393833;
  margin-bottom: 12px;
}
.summary-row .text-discount {
  color: #c0392b;
  font-weight: 500;
}
.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 700;
  color: #0E0A07;
  margin-top: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

.checkout-form {
  margin-top: 24px;
  border-top: 1px solid #e0e0e0;
  padding-top: 24px;
}
.checkout-form h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}
.form-group {
  margin-bottom: 12px;
}
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #393833;
  margin-bottom: 6px;
}
.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #c6ccd2;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box; /* Important */
}
.form-group input:focus {
  outline: none;
  border-color: #393833;
}
.validation-error {
  font-size: 12px;
  color: #c0392b;
  margin-top: 4px;
}

.btn-checkout {
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
  background-color: #393833;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;
}
.btn-checkout:disabled {
  background-color: #c6ccd2;
  cursor: not-allowed;
}
.checkout-message {
  font-size: 14px;
  font-weight: 500;
  color: #0E0A07;
  text-align: center;
  margin-top: 16px;
}

.btn-primary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #0e0a07;
  color: #fefefe;
  text-decoration: none;
}

@media (max-width: 900px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  .cart-summary {
    grid-row: 1; 
  }
}
@media (max-width: 600px) {
  .cart-item {
    grid-template-columns: 80px 1fr auto;
    gap: 12px;
  }
  .item-image { width: 80px; height: 64px; }
  .item-details { grid-column: 2 / 4; }
  .item-price-total { grid-column: 1; text-align: left; }
  .item-remove { grid-column: 4; grid-row: 1; }
}
</style>