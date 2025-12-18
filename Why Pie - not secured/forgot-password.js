// forgot-password.js
document.addEventListener('DOMContentLoaded', function() {
  const resetForm = document.getElementById('reset-form');
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');
  const backLink = document.getElementById('back-link');

  // Get the referring page from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const fromPage = urlParams.get('from') || 'customer-login.html';

  // Set the back link based on the referring page
  backLink.href = fromPage;

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
    successMessage.classList.remove('active');
  }

  function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.add('active');
    errorMessage.classList.remove('active');
  }

  function hideMessages() {
    errorMessage.classList.remove('active');
    successMessage.classList.remove('active');
  }

  // Form submission
  resetForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('reset-email').value;

    if (!email) {
      showError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    // Simulate API call to send reset email
    simulateSendResetEmail(email)
      .then(() => {
        showSuccess('Password reset instructions have been sent to your email!');
        resetForm.reset();
      })
      .catch(() => {
        showError('Failed to send reset email. Please try again.');
      });
  });

  // Simulate API call
  function simulateSendResetEmail(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        Math.random() > 0.2 ? resolve() : reject();
      }, 1500);
    });
  }

  // Utility function to validate email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});