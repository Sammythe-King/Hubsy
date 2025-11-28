import { ref, computed } from 'vue'

// --- 1. USER STATE ---
export const user = ref(null)
export const isLoggedIn = computed(() => !!user.value)

export function login(userData) {
  user.value = userData
  localStorage.setItem('hubsyUser', JSON.stringify(userData))
  console.log("Store: User logged in", user.value.name)
}

export function logout() {
  user.value = null
  localStorage.removeItem('hubsyUser')
  console.log("Store: User logged out")
  window.location.replace('/') 
}

export function loadUser() {
  const storedUser = localStorage.getItem('hubsyUser')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    console.log("Store: User loaded from storage", user.value.name)
  } else {
    console.log("Store: No user in storage.")
  }
}


// --- 2. CART STATE ---
export const cart = ref([])

export const cartItemCount = computed(() => {
  return cart.value.length
});

export function removeFromCart(lessonId) {
  cart.value = cart.value.filter(item => item._id !== lessonId)
  console.log("Store: Removed item", lessonId)
}

export function clearCart() {
  cart.value = []
  console.log("Store: Cart cleared")
}


// --- 3. NOTIFICATION STATE ---
export const notification = ref({ message: null, type: null })
let notificationTimeout = null

export function showNotification(message, type = 'success', duration = 3000) {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
  }
  
  notification.value = { message, type }
  
  notificationTimeout = setTimeout(() => {
    notification.value = { message: null, type: null }
  }, duration)
}


// --- 4. ADD TO CART (Only One Version Now) ---
export function addToCart(lesson) {
  const existing = cart.value.find(item => item._id === lesson._id)
  
  if (!existing) {
    cart.value.push(lesson)
    console.log("Store: Added to cart", lesson.title)
    showNotification(`"${lesson.title}" was added to your cart!`, 'success')
  } else {
    console.log("Store: Item already in cart", lesson.title)
    showNotification(`"${lesson.title}" is already in your cart.`, 'info')
  }
}