// Admin Dashboard JavaScript
// Check authentication on page load
(function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn') || localStorage.getItem('adminLoggedIn');
  if (isLoggedIn !== 'true') {
    window.location.href = 'login.html';
    return;
  }

  // Set admin name
  const adminEmail = sessionStorage.getItem('adminEmail') || localStorage.getItem('adminEmail');
  if (adminEmail) {
    const name = adminEmail.split('@')[0];
    document.getElementById('adminName').textContent = name.charAt(0).toUpperCase() + name.slice(1);
  }
})();

// DOM Elements
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const logoutBtn = document.getElementById('logoutBtn');
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');
const viewWebsiteBtn = document.getElementById('viewWebsite');

// Sidebar toggle (mobile)
menuToggle?.addEventListener('click', () => {
  sidebar.classList.toggle('show');
});

// Close sidebar on outside click (mobile)
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove('show');
    }
  }
});

// Navigation
function switchSection(sectionName) {
  // Update active nav item
  navItems.forEach(item => {
    if (item.dataset.section === sectionName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update active content section
  contentSections.forEach(section => {
    if (section.id === sectionName + 'Section') {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    faculty: 'Faculty Management',
    students: 'Student Management',
    activities: 'Activities Management',
    achievements: 'Achievements Management',
    gallery: 'Gallery Management',
    content: 'Content Management'
  };
  pageTitle.textContent = titles[sectionName] || 'Dashboard';

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('show');
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add click event to nav items
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.dataset.section;
    switchSection(section);
  });
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.clear();
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
  }
});

// View website
viewWebsiteBtn?.addEventListener('click', () => {
  window.open('../index.html', '_blank');
});

// Faculty Modal
const facultyModal = document.getElementById('facultyModal');
const addFacultyBtn = document.getElementById('addFacultyBtn');
const closeFacultyModal = document.getElementById('closeFacultyModal');
const cancelFacultyBtn = document.getElementById('cancelFacultyBtn');
const facultyForm = document.getElementById('facultyForm');

function openFacultyModal() {
  facultyModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeFacultyModalFunc() {
  facultyModal.classList.remove('show');
  document.body.style.overflow = '';
  facultyForm.reset();
  
  // Clear edit ID
  delete facultyForm.dataset.editId;
  
  // Reset modal title
  document.getElementById('modalTitle').textContent = 'Add Faculty Member';
  
  console.log('Faculty modal closed and reset');
}

addFacultyBtn?.addEventListener('click', openFacultyModal);
closeFacultyModal?.addEventListener('click', closeFacultyModalFunc);
cancelFacultyBtn?.addEventListener('click', closeFacultyModalFunc);

// Close modal on outside click
facultyModal?.addEventListener('click', (e) => {
  if (e.target === facultyModal) {
    closeFacultyModalFunc();
  }
});

// Faculty form submission handler is defined later in the file (with database integration)

// Note: addFacultyToTable is no longer used - faculty is added via loadFacultyData() from database

// Student management
document.getElementById('addStudentBtn')?.addEventListener('click', () => {
  alert('Student addition form would open here. Connect to backend to implement.');
});

document.getElementById('manageToppers')?.addEventListener('click', () => {
  alert('Toppers management form would open here. Connect to backend to implement.');
});

document.getElementById('studentPdfUpload')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    console.log('Uploading PDF:', file.name);
    alert(`PDF "${file.name}" uploaded successfully!\n(Demo: Connect to backend to save)`);
  }
});

// Activity Modal
const activityModal = document.getElementById('activityModal');
const addActivityBtn = document.getElementById('addActivityBtn');
const closeActivityModal = document.getElementById('closeActivityModal');
const cancelActivityBtn = document.getElementById('cancelActivityBtn');
const activityForm = document.getElementById('activityForm');

function openActivityModal() {
  activityModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeActivityModalFunc() {
  activityModal.classList.remove('show');
  document.body.style.overflow = '';
  activityForm.reset();
}

addActivityBtn?.addEventListener('click', openActivityModal);
closeActivityModal?.addEventListener('click', closeActivityModalFunc);
cancelActivityBtn?.addEventListener('click', closeActivityModalFunc);

activityModal?.addEventListener('click', (e) => {
  if (e.target === activityModal) {
    closeActivityModalFunc();
  }
});

// Activity form submission
activityForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';
  
  try {
    const title = document.getElementById('activityTitle').value.trim();
    const description = document.getElementById('activityDescription').value.trim();
    const imageFile = document.getElementById('activityImage').files[0];
    
    if (!title || !description) {
      alert('Please fill in all required fields!');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    if (!imageFile) {
      alert('Please select an image!');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    // Upload image
    console.log('Uploading activity image...');
    const { url: imageUrl, error: uploadError } = await uploadImage(imageFile, 'activity-images');
    
    if (uploadError) {
      console.error('Image upload error:', uploadError);
      alert(`Error uploading image: ${uploadError.message || uploadError}\n\nPlease ensure the 'activity-images' bucket exists and is public.`);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    // Save to database
    const activityData = {
      title,
      description,
      image_url: imageUrl
    };
    
    console.log('Saving activity to database:', activityData);
    const { data, error } = await addActivity(activityData);
    
    if (error) {
      console.error('Database error:', error);
      alert(`Error saving activity: ${error.message || error}`);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    console.log('Activity added successfully!');
    alert('Activity added successfully!');
    closeActivityModalFunc();
    await loadActivitiesData();
    
  } catch (err) {
    console.error('Unexpected error:', err);
    alert(`Unexpected error: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Achievement Modal
const achievementModal = document.getElementById('achievementModal');
const addAchievementBtn = document.getElementById('addAchievementBtn');
const closeAchievementModal = document.getElementById('closeAchievementModal');
const cancelAchievementBtn = document.getElementById('cancelAchievementBtn');
const achievementForm = document.getElementById('achievementForm');

function openAchievementModal() {
  achievementModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeAchievementModalFunc() {
  achievementModal.classList.remove('show');
  document.body.style.overflow = '';
  achievementForm.reset();
}

addAchievementBtn?.addEventListener('click', openAchievementModal);
closeAchievementModal?.addEventListener('click', closeAchievementModalFunc);
cancelAchievementBtn?.addEventListener('click', closeAchievementModalFunc);

achievementModal?.addEventListener('click', (e) => {
  if (e.target === achievementModal) {
    closeAchievementModalFunc();
  }
});

// Achievement form submission
achievementForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Uploading...';
  
  try {
    const title = document.getElementById('achievementTitle').value.trim();
    const imageFile = document.getElementById('achievementImage').files[0];
    
    if (!imageFile) {
      alert('Please select an image!');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    // Upload image
    console.log('Uploading achievement image...');
    const { url: imageUrl, error: uploadError } = await uploadImage(imageFile, 'achievement-images');
    
    if (uploadError) {
      console.error('Image upload error:', uploadError);
      alert(`Error uploading image: ${uploadError.message || uploadError}\n\nPlease ensure the 'achievement-images' bucket exists and is public.`);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    // Save to database
    const achievementData = {
      title: title || 'Achievement',
      image_url: imageUrl
    };
    
    console.log('Saving achievement to database:', achievementData);
    const { data, error } = await addAchievement(achievementData);
    
    if (error) {
      console.error('Database error:', error);
      alert(`Error saving achievement: ${error.message || error}`);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    console.log('Achievement added successfully!');
    alert('Achievement added successfully!');
    closeAchievementModalFunc();
    await loadAchievementsData();
    
  } catch (err) {
    console.error('Unexpected error:', err);
    alert(`Unexpected error: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Gallery management
document.getElementById('uploadGalleryBtn')?.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;
  
  input.onchange = (e) => {
    const files = e.target.files;
    console.log('Uploading images:', Array.from(files).map(f => f.name));
    alert(`${files.length} image(s) uploaded successfully!\n(Demo: Connect to backend to save)`);
  };
  
  input.click();
});

// Content management
document.getElementById('saveContentBtn')?.addEventListener('click', () => {
  alert('Content saved successfully!\n(Demo: Connect to backend to save changes)');
});

// Delete buttons for activities and achievements
document.querySelectorAll('.btn-delete').forEach(btn => {
  btn.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete this item?')) {
      const card = this.closest('.activity-card, .gallery-item');
      if (card) {
        card.remove();
        alert('Item deleted successfully!');
      }
    }
  });
});

// Auto-logout after 30 minutes of inactivity
let inactivityTimer;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    alert('Session expired due to inactivity. Please login again.');
    sessionStorage.clear();
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
  }, 30 * 60 * 1000); // 30 minutes
}

// Reset timer on user activity
['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetInactivityTimer, true);
});

resetInactivityTimer();

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Alt + number keys to switch sections
  if (e.altKey && !isNaN(e.key)) {
    const sections = ['dashboard', 'faculty', 'students', 'activities', 'achievements', 'gallery', 'content'];
    const index = parseInt(e.key) - 1;
    if (sections[index]) {
      switchSection(sections[index]);
    }
  }
  
  // Escape to close modals
  if (e.key === 'Escape') {
    closeFacultyModalFunc();
    closeActivityModalFunc();
    closeAchievementModalFunc();
  }
});

// Load data when section switches
let currentFacultyData = [];
let currentActivitiesData = [];
let currentAchievementsData = [];
let currentGalleryData = [];

// Define global functions immediately for onclick handlers
window.editFacultyById = async function(id) {
  console.log('Edit faculty called with ID:', id);
  console.log('Current faculty data:', currentFacultyData);
  
  const faculty = currentFacultyData.find(f => f.id === id);
  
  if (!faculty) {
    console.error('Faculty not found with ID:', id);
    alert('Faculty member not found!');
    return;
  }
  
  console.log('Found faculty:', faculty);
  
  document.getElementById('modalTitle').textContent = 'Edit Faculty Member';
  document.getElementById('facultyName').value = faculty.name || '';
  document.getElementById('facultyRole').value = faculty.role || '';
  
  // Store ID for update
  const facultyForm = document.getElementById('facultyForm');
  if (facultyForm) {
    facultyForm.dataset.editId = id;
  }
  
  console.log('Opening modal for edit');
  openFacultyModal();
};

window.deleteFacultyById = async function(id) {
  console.log('Delete faculty called with ID:', id);
  
  if (!confirm('Are you sure you want to delete this faculty member?')) {
    console.log('Delete cancelled by user');
    return;
  }
  
  console.log('Attempting to delete faculty with ID:', id);
  const { error } = await deleteFaculty(id);
  
  if (error) {
    console.error('Delete error:', error);
    alert(`Error deleting faculty member: ${error.message || error}`);
    return;
  }
  
  console.log('Faculty deleted successfully');
  alert('Faculty member deleted successfully!');
  await loadFacultyData();
};

window.deleteActivityById = async function(id) {
  if (!confirm('Are you sure you want to delete this activity?')) return;
  
  const { error } = await deleteActivity(id);
  
  if (error) {
    alert('Error deleting activity!');
    return;
  }
  
  alert('Activity deleted successfully!');
  await loadActivitiesData();
};

window.deleteAchievementById = async function(id) {
  if (!confirm('Are you sure you want to delete this achievement?')) return;
  
  const { error } = await deleteAchievement(id);
  
  if (error) {
    alert('Error deleting achievement!');
    return;
  }
  
  alert('Achievement deleted successfully!');
  await loadAchievementsData();
};

window.deleteGalleryImageById = async function(id) {
  if (!confirm('Are you sure you want to delete this image?')) return;
  
  const { error } = await deleteGalleryImage(id);
  
  if (error) {
    alert('Error deleting image!');
    return;
  }
  
  alert('Image deleted successfully!');
  await loadGalleryData();
};

// Override switchSection to load data
const originalSwitchSection = switchSection;
window.switchSection = async function(sectionName) {
  originalSwitchSection(sectionName);
  
  // Load data based on section
  switch(sectionName) {
    case 'dashboard':
      await loadDashboardStats();
      break;
    case 'faculty':
      await loadFacultyData();
      break;
    case 'activities':
      await loadActivitiesData();
      break;
    case 'achievements':
      await loadAchievementsData();
      break;
    case 'gallery':
      await loadGalleryData();
      break;
    case 'content':
      await loadContentData();
      break;
  }
};

// Load dashboard statistics
async function loadDashboardStats() {
  try {
    const stats = await fetchDashboardStats();
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card h3');
    if (statCards[0]) statCards[0].textContent = stats.students;
    if (statCards[1]) statCards[1].textContent = stats.faculty;
    if (statCards[2]) statCards[2].textContent = stats.activities;
    if (statCards[3]) statCards[3].textContent = stats.achievements;
    
    console.log('Dashboard stats loaded:', stats);
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
}

// Load faculty data
async function loadFacultyData() {
  try {
    const { data, error } = await fetchFaculty();
    
    if (error) {
      console.error('Error fetching faculty:', error);
      alert('Error loading faculty data. Please check console.');
      return;
    }
    
    currentFacultyData = data || [];
    const tableBody = document.getElementById('facultyTableBody');
    
    if (!tableBody) return;
    
    if (currentFacultyData.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No faculty members found. Add one to get started!</td></tr>';
      return;
    }
    
    tableBody.innerHTML = currentFacultyData.map(faculty => `
      <tr data-id="${faculty.id}">
        <td><img src="${faculty.photo_url || '../guru.jpg'}" alt="Faculty" class="table-img"></td>
        <td>${faculty.name}</td>
        <td>${faculty.role}</td>
        <td>${faculty.department || 'AIML'}</td>
        <td>
          <button class="btn-icon btn-edit" title="Edit" onclick="editFacultyById('${faculty.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-icon btn-delete" title="Delete" onclick="deleteFacultyById('${faculty.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
    
    console.log('Faculty data loaded:', currentFacultyData.length, 'members');
  } catch (error) {
    console.error('Error loading faculty:', error);
  }
}


// Load activities data
async function loadActivitiesData() {
  try {
    const { data, error } = await fetchActivities();
    
    if (error) {
      console.error('Error fetching activities:', error);
      return;
    }
    
    currentActivitiesData = data || [];
    const container = document.querySelector('#activitiesSection .card-grid');
    
    if (!container) return;
    
    if (currentActivitiesData.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 40px; grid-column: 1/-1;">No activities found. Add one to get started!</p>';
      return;
    }
    
    container.innerHTML = currentActivitiesData.map(activity => `
      <div class="activity-card" data-id="${activity.id}">
        <img src="${activity.image_url || '../assets/img.jpeg'}" alt="Activity">
        <div class="card-content">
          <h3>${activity.title}</h3>
          <p>${activity.description}</p>
          <div class="card-actions">
            <button class="btn-icon btn-delete" onclick="deleteActivityById('${activity.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
    
    console.log('Activities data loaded:', currentActivitiesData.length, 'items');
  } catch (error) {
    console.error('Error loading activities:', error);
  }
}


// Load achievements data
async function loadAchievementsData() {
  try {
    const { data, error } = await fetchAchievements();
    
    if (error) {
      console.error('Error fetching achievements:', error);
      return;
    }
    
    currentAchievementsData = data || [];
    const container = document.querySelector('#achievementsSection .gallery-grid');
    
    if (!container) return;
    
    if (currentAchievementsData.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 40px; grid-column: 1/-1;">No achievements found. Add one to get started!</p>';
      return;
    }
    
    container.innerHTML = currentAchievementsData.map(achievement => `
      <div class="gallery-item" data-id="${achievement.id}">
        <img src="${achievement.image_url}" alt="Achievement">
        <div class="gallery-overlay">
          <button class="btn-icon btn-delete" onclick="deleteAchievementById('${achievement.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
    
    console.log('Achievements data loaded:', currentAchievementsData.length, 'items');
  } catch (error) {
    console.error('Error loading achievements:', error);
  }
}


// Load gallery data
async function loadGalleryData() {
  try {
    const { data, error } = await fetchGallery();
    
    if (error) {
      console.error('Error fetching gallery:', error);
      return;
    }
    
    currentGalleryData = data || [];
    const container = document.querySelector('#gallerySection .gallery-grid');
    
    if (!container) return;
    
    if (currentGalleryData.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 40px; grid-column: 1/-1;">No gallery images found. Upload one to get started!</p>';
      return;
    }
    
    container.innerHTML = currentGalleryData.map(image => `
      <div class="gallery-item" data-id="${image.id}">
        <img src="${image.image_url}" alt="Gallery">
        <div class="gallery-overlay">
          <button class="btn-icon btn-delete" onclick="deleteGalleryImageById('${image.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
    
    console.log('Gallery data loaded:', currentGalleryData.length, 'images');
  } catch (error) {
    console.error('Error loading gallery:', error);
  }
}


// Load content data
async function loadContentData() {
  try {
    const { data, error } = await fetchContent();
    
    if (error || !data) {
      console.log('No content data found or error:', error);
      return;
    }
    
    // Populate form fields
    const taglineInput = document.querySelector('#contentSection input[type="text"]');
    const textareas = document.querySelectorAll('#contentSection textarea');
    
    if (taglineInput && data.tagline) taglineInput.value = data.tagline;
    if (textareas[0] && data.description) textareas[0].value = data.description;
    if (textareas[1] && data.vision) textareas[1].value = data.vision;
    if (textareas[2] && data.mission) textareas[2].value = data.mission;
    
    console.log('Content data loaded');
  } catch (error) {
    console.error('Error loading content:', error);
  }
}

// Update faculty form submission to handle database
const originalFacultyFormHandler = facultyForm.onsubmit;
facultyForm.removeEventListener('submit', originalFacultyFormHandler);

facultyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';
  
  try {
    const nameInput = document.getElementById('facultyName');
    const roleInput = document.getElementById('facultyRole');
    const photoInput = document.getElementById('facultyPhoto');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const role = roleInput ? roleInput.value : '';
    const photoFile = photoInput ? photoInput.files[0] : null;
    
    console.log('=== Faculty Form Debug ===');
    console.log('Name input element:', nameInput);
    console.log('Name value:', name);
    console.log('Role input element:', roleInput);
    console.log('Role value:', role);
    console.log('Photo file:', photoFile);
    console.log('========================');
    
    // Validation
    if (!name) {
      alert('Please enter faculty name!');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    if (!role) {
      alert('Please select a role!');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    let photoUrl = null;
    
    // Upload photo if provided
    if (photoFile) {
      console.log('Uploading photo to Supabase storage...');
      const { url, error } = await uploadImage(photoFile, 'faculty-photos');
      if (error) {
        console.error('Photo upload error:', error);
        const errorMsg = error.message || error.toString();
        
        if (errorMsg.includes('row-level security') || errorMsg.includes('policy')) {
          alert('⚠️ Storage bucket permissions not configured.\n\n' +
                'To fix this:\n' +
                '1. Go to Supabase Dashboard → Storage\n' +
                '2. Create/select "faculty-photos" bucket\n' +
                '3. Make it public OR add RLS policies\n\n' +
                'Proceeding without photo for now...');
        } else {
          alert(`Error uploading photo: ${errorMsg}\n\nProceeding without photo.`);
        }
      } else {
        photoUrl = url;
        console.log('Photo uploaded successfully:', photoUrl);
      }
    }
    
    const facultyData = {
      name,
      role,
      department: 'AIML',
      photo_url: photoUrl
    };
    
    console.log('Saving faculty data to database:', facultyData);
    
    // Check if editing
    const editId = facultyForm.dataset.editId;
    
    if (editId) {
      // Update existing
      console.log('Updating faculty with ID:', editId);
      const { error } = await updateFaculty(editId, facultyData);
      
      if (error) {
        console.error('Update error:', error);
        alert(`Error updating faculty member: ${error.message || error}`);
        return;
      }
      
      console.log('Faculty updated successfully');
      alert('Faculty member updated successfully!');
      delete facultyForm.dataset.editId;
    } else {
      // Add new
      console.log('Adding new faculty member');
      const { data, error } = await addFaculty(facultyData);
      
      if (error) {
        console.error('Insert error:', error);
        alert(`Error adding faculty member: ${error.message || error}\n\nCheck console for details.`);
        return;
      }
      
      console.log('Faculty added successfully:', data);
      alert('Faculty member added successfully!');
    }
    
    closeFacultyModalFunc();
    await loadFacultyData();
  } catch (err) {
    console.error('Unexpected error:', err);
    alert(`Unexpected error: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Update save content button
const saveContentBtn = document.getElementById('saveContentBtn');
if (saveContentBtn) {
  saveContentBtn.addEventListener('click', async () => {
    const taglineInput = document.querySelector('#contentSection input[type="text"]');
    const textareas = document.querySelectorAll('#contentSection textarea');
    
    const contentData = {
      id: 1, // Assuming single content record
      tagline: taglineInput?.value || '',
      description: textareas[0]?.value || '',
      vision: textareas[1]?.value || '',
      mission: textareas[2]?.value || ''
    };
    
    const { error } = await updateContent(contentData);
    
    if (error) {
      alert('Error saving content!');
      return;
    }
    
    alert('Content saved successfully!');
  });
}

// Initialize - Load dashboard stats on page load
(async function init() {
  console.log('Admin Dashboard Loaded');
  console.log('Press Alt + 1-7 for quick navigation');
  console.log('Supabase connected:', !!window.supabase);
  
  // Load initial dashboard stats
  await loadDashboardStats();
  
  // Load faculty data initially (so it's ready when section is clicked)
  await loadFacultyData();
})();
