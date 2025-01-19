// DOM Elements
const mainContent = document.getElementById('main-content');
const overlay = document.getElementById('overlay');
const history = document.getElementById('history');
const profileSlide = document.getElementById('profile-slide');
const fileUpload = document.getElementById('file-upload');
const uploadButton = document.getElementById('upload-button');

// Utility Functions
function toggleBlur() {
    mainContent.classList.toggle('blur');
    overlay.classList.toggle('active');
}

function closeAllPanels() {
    history.classList.remove('active');
    profileSlide.classList.remove('active');
    mainContent.classList.remove('blur');
    overlay.classList.remove('active');
}

// Event Handlers
function showRegister() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('register-form').classList.add('active');
    closeAllPanels();
}

function showLogin() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('login-form').classList.add('active');
    closeAllPanels();
}

function loginSuccess() {
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('chat').classList.add('active');
}

function toggleHistory() {
    const isHistoryActive = history.classList.contains('active');
    
    // Close profile if open
    if (profileSlide.classList.contains('active')) {
        profileSlide.classList.remove('active');
    }
    
    history.classList.toggle('active');
    toggleBlur();
    
    // If closing history, remove blur
    if (isHistoryActive) {
        mainContent.classList.remove('blur');
        overlay.classList.remove('active');
    }
}

function toggleProfile() {
    const isProfileActive = profileSlide.classList.contains('active');
    
    // Close history if open
    if (history.classList.contains('active')) {
        history.classList.remove('active');
    }
    
    profileSlide.classList.toggle('active');
    toggleBlur();
    
    // If closing profile, remove blur
    if (isProfileActive) {
        mainContent.classList.remove('blur');
        overlay.classList.remove('active');
    }
}

function showUploadOption() {
    const assignmentType = document.getElementById('assignment-type').value;
    
    if (assignmentType) {
        fileUpload.style.display = 'block';
        uploadButton.style.display = 'block';
    } else {
        fileUpload.style.display = 'none';
        uploadButton.style.display = 'none';
    }
}

function uploadFile() {
    const file = fileUpload.files[0];
    
    if (file) {
        // Add animation class to feedback div
        const feedback = document.querySelector('.feedback');
        feedback.style.animation = 'fadeIn 0.3s ease';
        
        // Show success message
        feedback.innerHTML = `<p>File "${file.name}" uploaded successfully!</p>`;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            feedback.style.animation = '';
        }, 300);
    } else {
        alert('Please select a file to upload.');
    }
}

// Event Listeners
overlay.addEventListener('click', closeAllPanels);

// Handle escape key to close panels
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllPanels();
    }
});