document.addEventListener('DOMContentLoaded', () => {
  const modeSelect = document.getElementById('mode');
  const dicewareSection = document.getElementById('diceware-section');
  const customWordsInput = document.getElementById('customWords');
  const lengthInput = document.getElementById('length');
  const generateBtn = document.getElementById('generateBtn');
  const result = document.getElementById('result');
  const strength = document.getElementById('strength');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const copyBtn = document.getElementById('copyBtn');

  // Copy password
  copyBtn.addEventListener('click', () => {
    const pwd = result.textContent;
    if (pwd && pwd !== '...') {
      navigator.clipboard.writeText(pwd).then(() => {
        copyBtn.textContent = '✅';
        setTimeout(() => copyBtn.textContent = '📋', 1000);
      });
    }
  });

  // Toggle Diceware input
  modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'custom') {
      dicewareSection.style.display = 'block';
      lengthInput.disabled = true;
    } else {
      dicewareSection.style.display = 'none';
      lengthInput.disabled = false;
    }
  });

  // Toggle theme
  themeToggle.addEventListener('change', () => {
    body.classList.toggle('dark', themeToggle.checked);
  });

  // Generate Password
  generateBtn.addEventListener('click', () => {
    let password = '';
    if (modeSelect.value === 'random') {
      const length = parseInt(lengthInput.value) || 12;
      password = generateRandomPassword(length);
    } else {
      const words = customWordsInput.value.split(',').map(w => w.trim()).filter(w => w !== '');
      if (words.length === 0) {
        alert('Please enter at least one custom word.');
        return;
      }
      password = generateDicewarePassword(words);
    }

    result.textContent = password;
    strength.textContent = analyzeStrength(password);
  });

  function generateRandomPassword(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    return pwd;
  }

  function generateDicewarePassword(words) {
    shuffle(words);
    const capitalized = words.map(w => Math.random() < 0.5 ? w.charAt(0).toUpperCase() + w.slice(1) : w);
    const extras = getRandomExtras(3);
    return capitalized.join('-') + extras;
  }

  function getRandomExtras(n) {
    const extraChars = '0123456789!@#$%^&*';
    let extras = '';
    for (let i = 0; i < n; i++) {
      extras += extraChars[Math.floor(Math.random() * extraChars.length)];
    }
    return extras;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function analyzeStrength(pwd) {
    const feedback = [];
    if (pwd.length < 12) feedback.push('Too short');
    if (!/[A-Z]/.test(pwd)) feedback.push('Add uppercase');
    if (!/[a-z]/.test(pwd)) feedback.push('Add lowercase');
    if (!/[0-9]/.test(pwd)) feedback.push('Add digit');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) feedback.push('Add symbol');
    return feedback.length === 0 ? 'Strong ✅' : feedback.join(', ');
  }

  // ===== Feedback Modal Logic =====
  const feedbackBtn = document.getElementById('feedbackBtn');
  const feedbackModal = document.getElementById('feedbackModal');
  const closeBtn = feedbackModal.querySelector('.close');
  const feedbackForm = document.getElementById('feedbackForm');

  feedbackBtn.addEventListener('click', () => {
    feedbackModal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    feedbackModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === feedbackModal) {
      feedbackModal.style.display = 'none';
    }
  });

  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(feedbackForm);
    const data = Object.fromEntries(formData.entries());

    const webhookURL = "https://script.google.com/macros/s/AKfycbyWVGM4uYdv-Z0hN2F59rGdq32XksIvMYFH5MN2Tlc-7vCiK4YBNoQpOl0CkxmfBNE/exec";

    try {
      await fetch(webhookURL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data),
      });

      alert('Thank you for your feedback!');
      feedbackModal.style.display = 'none';
      feedbackForm.reset();
    } catch (err) {
      alert('Error submitting feedback.');
    }
  });
});
