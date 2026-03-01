// Character sets
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:',<.>/?`~";
const SIMILAR = "il1Lo0O";

// DOM Elements
const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const excludeSimilarCheckbox = document.getElementById("excludeSimilar");

// Event listeners for real-time updates
lengthSlider.addEventListener("input", function() {
    lengthValue.textContent = this.value;
    createPassword();
});

uppercaseCheckbox.addEventListener("change", createPassword);
lowercaseCheckbox.addEventListener("change", createPassword);
numbersCheckbox.addEventListener("change", createPassword);
symbolsCheckbox.addEventListener("change", createPassword);
excludeSimilarCheckbox.addEventListener("change", createPassword);

/**
 * Filter characters based on similar characters option
 * @param {string} chars - Character set to filter
 * @returns {string} Filtered character set
 */
function filterSimilarCharacters(chars) {
    if (!excludeSimilarCheckbox.checked) {
        return chars;
    }
    return chars.split('').filter(char => !SIMILAR.includes(char)).join('');
}

/**
 * Generate a random password based on user options
 */
function createPassword() {
    const length = parseInt(lengthSlider.value);
    let password = "";
    let availableChars = "";

    // Build character set based on checkboxes
    if (uppercaseCheckbox.checked) {
        availableChars += filterSimilarCharacters(UPPERCASE);
    }
    if (lowercaseCheckbox.checked) {
        availableChars += filterSimilarCharacters(LOWERCASE);
    }
    if (numbersCheckbox.checked) {
        availableChars += filterSimilarCharacters(NUMBERS);
    }
    if (symbolsCheckbox.checked) {
        availableChars += filterSimilarCharacters(SYMBOLS);
    }

    // Validate that at least one character type is selected
    if (availableChars.length === 0) {
        passwordInput.value = "";
        updateStrengthIndicator("");
        return;
    }

    // Ensure at least one character from each selected type
    if (uppercaseCheckbox.checked) {
        const filteredUppercase = filterSimilarCharacters(UPPERCASE);
        if (filteredUppercase.length > 0) {
            password += filteredUppercase[Math.floor(Math.random() * filteredUppercase.length)];
        }
    }
    if (lowercaseCheckbox.checked) {
        const filteredLowercase = filterSimilarCharacters(LOWERCASE);
        if (filteredLowercase.length > 0) {
            password += filteredLowercase[Math.floor(Math.random() * filteredLowercase.length)];
        }
    }
    if (numbersCheckbox.checked) {
        const filteredNumbers = filterSimilarCharacters(NUMBERS);
        if (filteredNumbers.length > 0) {
            password += filteredNumbers[Math.floor(Math.random() * filteredNumbers.length)];
        }
    }
    if (symbolsCheckbox.checked) {
        const filteredSymbols = filterSimilarCharacters(SYMBOLS);
        if (filteredSymbols.length > 0) {
            password += filteredSymbols[Math.floor(Math.random() * filteredSymbols.length)];
        }
    }

    // Fill the rest of the password
    while (password.length < length) {
        password += availableChars[Math.floor(Math.random() * availableChars.length)];
    }

    // Shuffle password
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    passwordInput.value = password;
    updateStrengthIndicator(password);
}

/**
 * Update strength indicator and requirements checklist
 * @param {string} password - The current password
 */
function updateStrengthIndicator(password) {
    // Check requirements
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_\-=+\[\]{}|;:'",<.>/?`~]/.test(password);

    // Update check icons and text
    updateCheckItem("check-length", hasLength);
    updateCheckItem("check-uppercase", hasUppercase);
    updateCheckItem("check-lowercase", hasLowercase);
    updateCheckItem("check-numbers", hasNumbers);
    updateCheckItem("check-symbols", hasSymbols);

    // Calculate strength
    let strengthScore = 0;
    if (hasLength) strengthScore++;
    if (hasUppercase) strengthScore++;
    if (hasLowercase) strengthScore++;
    if (hasNumbers) strengthScore++;
    if (hasSymbols) strengthScore++;

    // Bonus points for length
    if (password.length >= 12) strengthScore++;
    if (password.length >= 16) strengthScore++;

    // Update strength bar and text
    updateStrengthBar(strengthScore, password.length);
}

/**
 * Update individual check item
 * @param {string} elementId - The element ID to update
 * @param {boolean} passed - Whether the check passed
 */
function updateCheckItem(elementId, passed) {
    const element = document.getElementById(elementId);
    const parentItem = element.closest(".check-item");

    if (passed) {
        element.textContent = "✓";
        parentItem.classList.add("passed");
    } else {
        element.textContent = "❌";
        parentItem.classList.remove("passed");
    }
}

/**
 * Update strength bar appearance and text
 * @param {number} score - Strength score (0-7)
 * @param {number} length - Password length
 */
function updateStrengthBar(score, length) {
    const strengthFill = document.getElementById("strengthFill");
    const strengthText = document.getElementById("strengthText");

    // Remove all strength classes
    strengthFill.classList.remove("weak", "medium", "strong");

    // Determine strength level based on password length
    if (length === 0) {
        strengthFill.classList.add("weak");
        strengthText.textContent = "No password";
    } else if (length < 12) {
        strengthFill.classList.add("weak");
        strengthText.textContent = "🔴 Weak";
    } else if (length < 20) {
        strengthFill.classList.add("medium");
        strengthText.textContent = "🟡 Medium";
    } else {
        strengthFill.classList.add("strong");
        strengthText.textContent = "🟢 Strong";
    }
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 */
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add("show"), 5);
    
    // Remove after 1 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 100);
    }, 1000);
}

/**
 * Copy password to clipboard
 */
function copyPassword() {
    if (passwordInput.value) {
        navigator.clipboard.writeText(passwordInput.value).then(() => {
            showToast("✓ Password copied!");
        }).catch(() => {
            // Fallback for older browsers
            passwordInput.select();
            document.execCommand("copy");
            showToast("✓ Password copied!");
        });
    }
}

// Initialize password on page load
window.addEventListener("load", createPassword);