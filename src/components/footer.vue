<template>
  <footer class="footer">
    <div class="footer-container">

      <!-- Logo / About -->
      <div class="footer-about">
        <h2 class="footer-logo">Hubsy</h2>
        <p>Your trusted platform for after-school learning, growth, and creativity. Join thousands of students discovering their potential every day.</p>
      </div>

      <!-- Quick Links -->
      <div class="footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Classes</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div class="footer-info">
        <h3>Contact</h3>
        <div class="footer-item">
          <img :src="locationIcon" alt="location" class="icon" />
          <p>Port Harcourt, Nigeria</p>
        </div>
        <div class="footer-item">
          <img :src="emailIcon" alt="email" class="icon" />
          <p>support@hubsy.com</p>
        </div>
        <div class="footer-item">
          <img :src="phoneIcon" alt="phone" class="icon" />
          <p>+234 800 000 0000</p>
        </div>
      </div>

      <!-- Socials -->
      <div class="footer-social">
        <h3>Follow Us</h3>
        <div class="social-icons">
          <a href="#"><img :src="instagramIcon" alt="Instagram" /></a>
          <a href="#"><img :src="twitterIcon" alt="Twitter"></a>
          <a href="#"><img :src="facebookIcon" alt="Facebook"></a>
        </div>
      </div>

    </div>

    <div class="footer-bottom">
      <p>© 2025 Hubsy. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import instagramIcon from '@/assets/instagram.png'
import twitterIcon from '@/assets/social-media.png'
import facebookIcon from '@/assets/facebook.png'
import locationIcon from '@/assets/location.png'
import emailIcon from '@/assets/email.png'
import phoneIcon from '@/assets/phone-call.png'
</script>

<style scoped>
.footer {
  background-color: #111;
  color: #f5f5f5;
  padding: 3rem 7rem 1rem;
  font-family: 'Poppins', sans-serif;
}

.footer-container {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start; 
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  gap: 50px;
}

/* ===== Footer About ===== */
.footer-logo {
  font-size: 2rem;
  font-weight: 700;
  color: #ffcc00;
  margin-bottom: 0.7rem;
  margin-top: 6px;
}

.footer-about {
  flex: 1;
  min-width: 230px;
}

.footer-about p {
  line-height: 1.6;
  color: #ccc;
}

/* ===== Footer Links ===== */
.footer-links {
  flex: 1;
  min-width: 180px;
  margin-left: 20px;

}

.footer-links h3 {
  margin-bottom: 1rem;
  color: #fff;
}

.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #ffcc00;
}

/* ===== Footer Contact ===== */
.footer-info {
  flex: 2;
  min-width: 200px;
  margin-left: 0px;
}

.footer-info h3 {
  margin-bottom: 1rem;
  color: #fff;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 0.6rem;
}

.footer-item img.icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: brightness(0) invert(1); /* makes icons white */
}

/* ===== Footer Social ===== */
.footer-social {
  flex: 3;
  min-width: 200px;
  margin-left: 0px;
}

.footer-social h3 {
  margin-bottom: 1rem;
  color: #fff;
}

.footer-social .social-icons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.social-icons img {
  height: 32px;
  width: 32px;
  filter: brightness(0) invert(1); /* white icons */
  transition: filter 0.3s, transform 0.3s;
}

.social-icons img:hover {
  filter: brightness(0) saturate(100%) invert(73%) sepia(99%) saturate(446%) hue-rotate(12deg) brightness(101%) contrast(102%);
  transform: scale(1.1);
}

/* ===== Footer Bottom ===== */
.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  border-top: 1px solid #222;
  padding-top: 1rem;
  color: #888;
  font-size: 0.9rem;
}
</style>
