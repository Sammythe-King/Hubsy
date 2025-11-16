<template>
  <div class="auth-page-container">
    <div class="auth-wrapper">
      <!-- Left Column: Sign In -->
      <div class="auth-column">
        <form class="auth-form" @submit.prevent="handleLogin">
          <h2 class="auth-title">Sign In</h2>
          <p class="auth-subtitle">Welcome back! Sign in to your Account</p>

          <div v-if="loginError" class="error-message">{{ loginError }}</div>

          <div class="form-group">
            <label for="login-email">Email</label>
            <input type="email" id="login-email" placeholder="iyallasamuel43@gmail.com" v-model="login.email" />
          </div>

          <!-- Login Password Input -->
          <div class="form-group">
            <label for="login-password">Password</label>
            <div class="password-input-wrapper">
              <input
                :type="showLoginPassword ? 'text' : 'password'"
                id="login-password"
                placeholder="••••••••••"
                v-model="login.password"
              />
              <img
                :src="eye"
                @click="toggleLoginPassword"
                class="password-icon"
                alt="Toggle password visibility"
              />
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" v-model="login.rememberMe" />
              Remember Me
            </label>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>

      <!-- Separator -->
      <div class="separator">
        <div class="separator-line"></div>
        <span class="separator-text">Or</span>
        <div class="separator-line"></div>
      </div>

      <!-- Right Column: Create Account -->
      <div class="auth-column">
        <form class="auth-form" @submit.prevent="handleRegister">
          <h2 class="auth-title">Create New Account</h2>
          <p class="auth-subtitle">Create your very own Hubsy Account</p>

          <div v-if="signupError" class="error-message">{{ signupError }}</div>

          <div class="form-group">
            <label for="signup-first-name">First Name*</label>
            <input type="text" id="signup-first-name" v-model="signup.firstName" />
          </div>

          <div class="form-group">
            <label for="signup-last-name">Last Name*</label>
            <input type="text" id="signup-last-name" v-model="signup.lastName" />
          </div>

          <!-- 
            MODIFIED: Changed Phone to Role Dropdown 
          -->
          <div class="form-group">
            <label for="signup-role">Role</label>
            <select id="signup-role" v-model="signup.role">
              <option value="" disabled>Please select one</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          <!-- END MODIFICATION -->

          <div class="form-group">
            <label for="signup-email">Email</label>
            <input type="email" id="signup-email" placeholder="iyallasamuel43@gmail.com" v-model="signup.email" />
          </div>

          <!-- <div class="form-group">
            <label for="signup-dob">Date of birth</label>
            <input type="date" id="signup-dob" v-model="signup.dob" />
          </div> -->

          <!-- Signup Password Input -->
          <div class="form-group">
            <label for="signup-password">Password</label>
            <div class="password-input-wrapper">
              <input
                :type="showSignupPassword ? 'text' : 'password'"
                id="signup-password"
                placeholder="••••••••••"
                v-model="signup.password"
              />
              <img
                :src="eye"
                @click="toggleSignupPassword"
                class="password-icon"
                alt="Toggle password visibility"
              />
            </div>
          </div>

          <!-- <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" v-model="signup.authorize" />
              I authorize Hubsy to send notifications on
              SAIS/Messages/Promotional/informational messages
            </label>
          </div> -->

          <button type="submit" class="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { login as storeLogin } from '@/store.js'
import eye from '@/assets/eye.png'
import { useRouter } from 'vue-router'

const router = useRouter()

const login = ref({
  email: '',
  password: '',
  rememberMe: false
})

// MODIFICATION 1: Changed 'phone' to 'role'
const signup = ref({
  firstName: '',
  lastName: '',
  role: '', // Changed from 'phone'
  email: '',
  password: '',
})
// --- END MODIFICATION ---

const loginError = ref(null)
const signupError = ref(null)

// --- Step 1: The "State" ---
const showLoginPassword = ref(false)
const showSignupPassword = ref(false)

// --- Step 2: The "Action" ---
const toggleLoginPassword = () => {
  showLoginPassword.value = !showLoginPassword.value
}
const toggleSignupPassword = () => {
  showSignupPassword.value = !showSignupPassword.value
}
// --- END ---

const handleLogin = async () => {
  loginError.value = null // Clear old errors
  try {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(login.value),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to login')
    }

    // Success!
    const userData = await response.json()
    storeLogin(userData) // 2. Call the store function to save the user
    router.push('/')      // 3. Redirect to the homepage

  } catch (err) {
    loginError.value = err.message
    console.error('Login error:', err)
  }
}

const handleRegister = async () => {
  signupError.value = null // Clear old errors
  try {
    // Basic frontend check
    if (!signup.value.firstName || !signup.value.lastName || !signup.value.email || !signup.value.password || !signup.value.role) {
      throw new Error("Please fill out all required fields.");
    }

    const response = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signup.value),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to register')
    }

    // Success!
    const newUser = await response.json()
    storeLogin(newUser) // 2. Log the new user in right away
    router.push('/')     // 3. Redirect to the homepage

  } catch (err) {
    signupError.value = err.message
    console.error('Register error:', err)
  }
}
</script>

<style scoped>
/* --- Password Toggle Style --- */
.error-message {
  background-color: #fef2f2;
  color: #B0AEAB; /* Use your app's red */
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #fbcbc8;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper input {
  width: 100%;
  /* Make room for the icon on the right */
  padding: 12px 45px 12px 16px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f7f7f7;
  box-sizing: border-box;
}

.password-icon {
  position: absolute;
  top: 50%;
  right: 16px;
  /* This vertically centers it perfectly */
  transform: translateY(-50%);
  cursor: pointer;
  width: 20px;
  height: auto;
}
/* --- End Password Toggle Style --- */


.auth-page-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px); /* Adjust based on header/footer height */
  background-color: #f9f9f9;
  padding: 48px 24px;
}

.auth-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 900px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.auth-column {
  flex: 1;
  padding: 40px;
}

.auth-title {
  font-size: 24px;
  font-weight: 700;
  color: #0E0A07;
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 14px;
  color: #777;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

/* MODIFICATION 2: Added .form-group select to this rule */
.form-group input[type="email"],
.form-group input[type="text"],
.form-group input[type="tel"],
.form-group input[type="date"],
.form-group select {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f7f7f7;
  box-sizing: border-box; /* Important for padding */
  
  /* These lines style the select box */
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 1em;
  cursor: pointer;
}
/* END MODIFICATION */

.form-group input::placeholder {
  color: #aaa;
}

/* MODIFICATION 3: Added .form-group select:focus */
.form-group input:focus,
.password-input-wrapper input:focus,
.form-group select:focus {
  outline: none;
  border-color: #393833;
  background-color: #fff;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 13px;
  color: #555;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  max-width: 60%; /* Prevent layout breaking */
}

.checkbox-container input[type="checkbox"] {
  margin-right: 8px;
}

.forgot-password {
  color: #72706B;
  text-decoration: none;
  font-weight: 500;
}
.forgot-password:hover {
  text-decoration: underline;
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.btn-primary {
  background-color: #72706B;
}
.btn-primary:hover {
  background-color: #393833;
  color: white;
}

.separator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.separator-line {
  width: 1px;
  flex: 1;
  background-color: #e0e0e0;
}

.separator-text {
  padding: 16px 0;
  font-size: 14px;
  font-weight: 500;
  color: #888;
}

@media (max-width: 768px) {
  .auth-wrapper {
    flex-direction: column;
  }
  .separator {
    flex-direction: row;
    padding: 0 40px;
    width: 100%;
  }
  .separator-line {
    height: 1px;
    width: 100%;
    flex: 1;
  }
  .separator-text {
    padding: 0 16px;
  }
}
</style>