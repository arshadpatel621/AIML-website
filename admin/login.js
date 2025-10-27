// Admin Login JavaScript
// This is a frontend-only demo. In production, connect to your backend API.

// Default admin credentials (CHANGE THESE!)
const ADMIN_CREDENTIALS = {
  email: 'admin@gndecb.ac.in',
  password: 'admin123' // Change this password!
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const loginBtn = loginForm.querySelector('.login-btn');
const togglePasswordBtn = document.getElementById('togglePassword');
const forgotPasswordLink = document.getElementById('forgotPassword');
const alert = document.getElementById('alert');
const alertMessage = document.getElementById('alertMessage');

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  const icon = togglePasswordBtn.querySelector('i');
  icon.classList.toggle('fa-eye');
  icon.classList.toggle('fa-eye-slash');
});

// Show alert message
function showAlert(message, type = 'error') {
  alert.className = `alert alert-${type} show`;
  alertMessage.textContent = message;
  
  setTimeout(() => {
    alert.classList.remove('show');
  }, 5000);
}

// Check if user is already logged in
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn') || localStorage.getItem('adminLoggedIn');
  if (isLoggedIn === 'true') {
    window.location.href = 'dashboard.html';
  }
}

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const remember = rememberCheckbox.checked;

  // Validate inputs
  if (!email || !password) {
    showAlert('Please fill in all fields');
    return;
  }

  // Show loading state
  loginBtn.classList.add('loading');
  loginBtn.disabled = true;

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check credentials
  // TODO: Replace with actual API call to your backend
  // Example: const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    // Store login state
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('adminLoggedIn', 'true');
    storage.setItem('adminEmail', email);
    storage.setItem('loginTime', new Date().toISOString());

    showAlert('Login successful! Redirecting...', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  } else {
    showAlert('Invalid email or password');
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;
  }
});

// Forgot password handler
forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  showAlert('Please contact the system administrator to reset your password.', 'success');
});

// Auto-fill remembered email
window.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  
  const rememberedEmail = localStorage.getItem('adminEmail');
  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberCheckbox.checked = true;
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Alt + L to focus email input
  if (e.altKey && e.key === 'l') {
    e.preventDefault();
    emailInput.focus();
  }
});
