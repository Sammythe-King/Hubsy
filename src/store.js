import { computed, ref } from 'vue'
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

export const cart = ref([])

export function addToCart(lesson){
    const existing = cart.value.find(item => item._id === lesson._id)
    if(!existing){
        cart.value.push(lesson)
        console.log("Store: Added to cart", lesson.title)

    }else{
        console.log("Store: Item already in cart", lesson.title)
    }


}
export function removeFromCart(lessonId){
    cart.value = cart.value.filter(item => item._id !== lessonId)
    console.log("Store Removed Item", lessonId)
}
export function clearCart(){
    cart.value = []
    console.log("Store: Cart cleared")
}

export const cartItemCount = computed(() => {
    return cart.value.length
});