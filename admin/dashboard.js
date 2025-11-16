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
    leaders: 'Leadership Management',
    faculty: 'Faculty Management',
    students: 'Student Management',
    activities: 'Activities Management',
    achievements: 'Achievements Management',
    gallery: 'Gallery Management',
    content: 'Content Management',
    contact: 'Contact Management'
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

// Student Modal
const studentModal = document.getElementById('studentModal');
const addStudentBtn = document.getElementById('addStudentBtn');
const closeStudentModal = document.getElementById('closeStudentModal');
const cancelStudentBtn = document.getElementById('cancelStudentBtn');
const studentForm = document.getElementById('studentForm');

function openStudentModal() {
  studentModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeStudentModalFunc() {
  studentModal.classList.remove('show');
  document.body.style.overflow = '';
  studentForm.reset();
  delete studentForm.dataset.editId;
  document.getElementById('studentModalTitle').textContent = 'Add Student';
}

addStudentBtn?.addEventListener('click', openStudentModal);
closeStudentModal?.addEventListener('click', closeStudentModalFunc);
cancelStudentBtn?.addEventListener('click', closeStudentModalFunc);

studentModal?.addEventListener('click', (e) => {
  if (e.target === studentModal) {
    closeStudentModalFunc();
  }
});

// Student form submission
studentForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    const name = document.getElementById('studentName').value.trim();
    const rollNumber = document.getElementById('studentRollNumber').value.trim();
    const year = parseInt(document.getElementById('studentYear').value);
    const semester = document.getElementById('studentSemester').value ? parseInt(document.getElementById('studentSemester').value) : null;
    const cgpa = parseFloat(document.getElementById('studentCGPA').value);
    const isTopper = document.getElementById('studentIsTopper').checked;
    const photoFile = document.getElementById('studentPhoto').files[0];

    if (!name || !rollNumber || !year || isNaN(cgpa)) {
      alert('Please fill in all required fields!');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    let photoUrl = null;
    const editId = studentForm.dataset.editId;

    // Upload photo if provided
    if (photoFile) {
      console.log('Uploading student photo...');
      const { url, error } = await uploadImage(photoFile, 'student-photos');

      if (error) {
        console.error('Photo upload error:', error);
        const errorMsg = error.message || error.toString();

        if (errorMsg.includes('Bucket not found') || errorMsg.includes('bucket')) {
          const proceed = confirm(
            '⚠️ Storage bucket "student-photos" not found!\n\n' +
            'To fix this:\n' +
            '1. Go to Supabase Dashboard → Storage\n' +
            '2. Create a new bucket named "student-photos"\n' +
            '3. Make it public\n\n' +
            'OR run the SQL file: create-student-photos-bucket.sql\n\n' +
            'Click OK to save student WITHOUT photo, or Cancel to stop.'
          );

          if (!proceed) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
          }
        } else {
          alert(`Error uploading photo: ${errorMsg}\n\nProceeding without photo.`);
        }
      } else {
        photoUrl = url;
        console.log('Photo uploaded successfully:', photoUrl);
      }
    }

    const studentData = {
      name,
      roll_number: rollNumber,
      year,
      semester,
      cgpa,
      is_topper: isTopper
    };

    // Only add photo_url if we have one
    if (photoUrl) {
      studentData.photo_url = photoUrl;
    }

    if (editId) {
      // Update existing
      const { error } = await updateStudent(editId, studentData);

      if (error) {
        console.error('Update error:', error);
        alert(`Error updating student: ${error.message || error}`);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      alert('Student updated successfully!');
    } else {
      // Add new
      const { error } = await addStudent(studentData);

      if (error) {
        console.error('Insert error:', error);
        alert(`Error adding student: ${error.message || error}`);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      alert('Student added successfully!');
    }

    closeStudentModalFunc();
    await loadStudentsData();

  } catch (err) {
    console.error('Unexpected error:', err);
    alert(`Unexpected error: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
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

// Leader Modal
const leaderModal = document.getElementById('leaderModal');
const addLeaderBtn = document.getElementById('addLeaderBtn');
const closeLeaderModal = document.getElementById('closeLeaderModal');
const cancelLeaderBtn = document.getElementById('cancelLeaderBtn');
const leaderForm = document.getElementById('leaderForm');

function openLeaderModal() {
  leaderModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLeaderModalFunc() {
  leaderModal.classList.remove('show');
  document.body.style.overflow = '';
  leaderForm.reset();
  delete leaderForm.dataset.editId;
  document.getElementById('leaderModalTitle').textContent = 'Add Leader';
}

addLeaderBtn?.addEventListener('click', openLeaderModal);
closeLeaderModal?.addEventListener('click', closeLeaderModalFunc);
cancelLeaderBtn?.addEventListener('click', closeLeaderModalFunc);

leaderModal?.addEventListener('click', (e) => {
  if (e.target === leaderModal) {
    closeLeaderModalFunc();
  }
});

// Leader form submission
leaderForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';
  
  try {
    const name = document.getElementById('leaderName').value.trim();
    const position = document.getElementById('leaderPosition').value.trim();
    const displayOrder = parseInt(document.getElementById('leaderDisplayOrder').value);
    const photoFile = document.getElementById('leaderPhoto').files[0];
    
    if (!name || !position || !displayOrder) {
      alert('Please fill in all required fields!');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    let photoUrl = null;
    const editId = leaderForm.dataset.editId;
    
    // Upload photo if provided or if adding new
    if (photoFile) {
      console.log('Uploading leader photo...');
      const { url, error } = await uploadImage(photoFile, 'leadership-photos');
      
      if (error) {
        console.error('Photo upload error:', error);
        alert(`Error uploading photo: ${error.message || error}\n\nPlease ensure the 'leadership-photos' bucket exists and is public.`);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }
      photoUrl = url;
    } else if (!editId) {
      alert('Please select a photo!');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }
    
    const leaderData = {
      name,
      position,
      display_order: displayOrder
    };
    
    if (photoUrl) {
      leaderData.photo_url = photoUrl;
    }
    
    if (editId) {
      // Update existing
      const { error } = await updateLeadership(editId, leaderData);
      
      if (error) {
        console.error('Update error:', error);
        alert(`Error updating leader: ${error.message || error}`);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }
      
      alert('Leader updated successfully!');
    } else {
      // Add new
      const { error } = await addLeadership(leaderData);
      
      if (error) {
        console.error('Insert error:', error);
        alert(`Error adding leader: ${error.message || error}`);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }
      
      alert('Leader added successfully!');
    }
    
    closeLeaderModalFunc();
    await loadLeadersData();
    
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
    closeLeaderModalFunc();
    closeStudentModalFunc();
  }
});

// Load data when section switches
let currentLeadersData = [];
let currentFacultyData = [];
let currentStudentsData = [];
let currentActivitiesData = [];
let currentAchievementsData = [];
let currentGalleryData = [];

// Define global functions immediately for onclick handlers
window.editLeaderById = async function(id) {
  console.log('Edit leader called with ID:', id);
  
  const leader = currentLeadersData.find(l => l.id === id);
  
  if (!leader) {
    console.error('Leader not found with ID:', id);
    alert('Leader not found!');
    return;
  }
  
  document.getElementById('leaderModalTitle').textContent = 'Edit Leader';
  document.getElementById('leaderName').value = leader.name || '';
  document.getElementById('leaderPosition').value = leader.position || '';
  document.getElementById('leaderDisplayOrder').value = leader.display_order || 1;
  
  leaderForm.dataset.editId = id;
  openLeaderModal();
};

window.deleteLeaderById = async function(id) {
  if (!confirm('Are you sure you want to delete this leader?')) return;
  
  const { error } = await deleteLeadership(id);
  
  if (error) {
    alert(`Error deleting leader: ${error.message || error}`);
    return;
  }
  
  alert('Leader deleted successfully!');
  await loadLeadersData();
};

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

window.editStudentById = async function(id) {
  console.log('Edit student called with ID:', id);

  const student = currentStudentsData.find(s => s.id === id);

  if (!student) {
    console.error('Student not found with ID:', id);
    alert('Student not found!');
    return;
  }

  document.getElementById('studentModalTitle').textContent = 'Edit Student';
  document.getElementById('studentName').value = student.name || '';
  document.getElementById('studentRollNumber').value = student.roll_number || '';
  document.getElementById('studentYear').value = student.year || '';
  document.getElementById('studentSemester').value = student.semester || '';
  document.getElementById('studentCGPA').value = student.cgpa || '';
  document.getElementById('studentIsTopper').checked = student.is_topper || false;

  studentForm.dataset.editId = id;
  openStudentModal();
};

window.deleteStudentById = async function(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;

  const { error } = await deleteStudent(id);

  if (error) {
    alert(`Error deleting student: ${error.message || error}`);
    return;
  }

  alert('Student deleted successfully!');
  await loadStudentsData();
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
    case 'leaders':
      await loadLeadersData();
      break;
    case 'faculty':
      await loadFacultyData();
      break;
    case 'students':
      await loadStudentsData();
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
    case 'contact':
      await loadContactData();
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

// Load students data
async function loadStudentsData() {
  try {
    const { data, error } = await fetchStudents();

    if (error) {
      console.error('Error fetching students:', error);
      alert('Error loading students data. Please check console.');
      return;
    }

    currentStudentsData = data || [];
    const tableBody = document.getElementById('studentsTableBody');

    if (!tableBody) return;

    if (currentStudentsData.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No students found. Add one to get started!</td></tr>';
      return;
    }

    tableBody.innerHTML = currentStudentsData.map(student => `
      <tr data-id="${student.id}">
        <td><img src="${student.photo_url || 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop'}" alt="Student" class="table-img"></td>
        <td>${student.name}</td>
        <td>${student.roll_number || 'N/A'}</td>
        <td>Year ${student.year}</td>
        <td>${student.cgpa ? student.cgpa.toFixed(2) : 'N/A'}</td>
        <td>
          ${student.is_topper ? '<span style="color: gold;"><i class="fa-solid fa-star"></i> Yes</span>' : 'No'}
        </td>
        <td>
          <button class="btn-icon btn-edit" title="Edit" onclick="editStudentById('${student.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-icon btn-delete" title="Delete" onclick="deleteStudentById('${student.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    console.log('Students data loaded:', currentStudentsData.length, 'students');
  } catch (error) {
    console.error('Error loading students:', error);
  }
}

// Load leaders data
async function loadLeadersData() {
  try {
    const { data, error } = await fetchLeadership();
    
    if (error) {
      console.error('Error fetching leaders:', error);
      alert('Error loading leaders data. Please check console.');
      return;
    }
    
    currentLeadersData = data || [];
    const tableBody = document.getElementById('leadersTableBody');
    
    if (!tableBody) return;
    
    if (currentLeadersData.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No leaders found. Add one to get started!</td></tr>';
      return;
    }
    
    tableBody.innerHTML = currentLeadersData.map(leader => `
      <tr data-id="${leader.id}">
        <td><img src="${leader.photo_url || '../guru.jpg'}" alt="Leader" class="table-img"></td>
        <td>${leader.name}</td>
        <td>${leader.position}</td>
        <td>${leader.display_order}</td>
        <td>
          <button class="btn-icon btn-edit" title="Edit" onclick="editLeaderById('${leader.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-icon btn-delete" title="Delete" onclick="deleteLeaderById('${leader.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
    
    console.log('Leaders data loaded:', currentLeadersData.length, 'leaders');
  } catch (error) {
    console.error('Error loading leaders:', error);
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

// Contact Management
let currentContactMessages = [];
let currentMessageFilter = 'all';

// Load contact data
async function loadContactData() {
  await Promise.all([loadContactInfo(), loadContactMessages('all')]);
}

// Load contact info
async function loadContactInfo() {
  try {
    const { data, error } = await fetchContactInfo();
    
    if (error) {
      console.error('Error loading contact info:', error);
      return;
    }
    
    if (data) {
      document.getElementById('contactAddress').value = data.address || '';
      document.getElementById('contactPhone').value = data.phone || '';
      document.getElementById('contactEmail').value = data.email || '';
      document.getElementById('contactAlternateEmail').value = data.alternate_email || '';
      document.getElementById('contactWebsite').value = data.website || '';
      document.getElementById('contactOfficeHours').value = data.office_hours || '';
    }
  } catch (error) {
    console.error('Error loading contact info:', error);
  }
}

// Load contact messages
async function loadContactMessages(filter = 'all') {
  try {
    const { data, error } = await fetchContactMessages(filter);
    
    if (error) {
      console.error('Error loading messages:', error);
      const messagesList = document.getElementById('messagesList');
      if (messagesList) {
        messagesList.innerHTML = '<div style="text-align: center; padding: 40px; color: #dc3545;">Error loading messages. Please check console.</div>';
      }
      return;
    }
    
    currentContactMessages = data || [];
    currentMessageFilter = filter;
    renderMessages(currentContactMessages);
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.filter === filter) {
        btn.classList.add('active');
      }
    });
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// Render messages
function renderMessages(messages) {
  const messagesList = document.getElementById('messagesList');
  if (!messagesList) return;
  
  if (messages.length === 0) {
    messagesList.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666;">
        <i class="fa-solid fa-inbox" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
        <p>No messages found.</p>
      </div>
    `;
    return;
  }
  
  messagesList.innerHTML = messages.map(msg => {
    const date = new Date(msg.created_at).toLocaleString();
    const statusBadge = getStatusBadge(msg.status);
    const isNew = msg.status === 'new';
    
    return `
      <div class="message-item ${isNew ? 'message-new' : ''}" data-id="${msg.id}">
        <div class="message-header">
          <div class="message-sender">
            <strong>${escapeHtml(msg.name)}</strong>
            <span class="message-email">${escapeHtml(msg.email)}</span>
          </div>
          <div class="message-meta">
            ${statusBadge}
            <span class="message-date">${date}</span>
          </div>
        </div>
        <div class="message-body">
          <p>${escapeHtml(msg.message).substring(0, 150)}${msg.message.length > 150 ? '...' : ''}</p>
        </div>
        <div class="message-actions">
          <button class="btn-small btn-primary" onclick="viewMessage('${msg.id}')">View</button>
          <button class="btn-small btn-danger" onclick="deleteMessageById('${msg.id}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function getStatusBadge(status) {
  const badges = {
    'new': '<span class="status-badge status-new">New</span>',
    'read': '<span class="status-badge status-read">Read</span>',
    'replied': '<span class="status-badge status-replied">Replied</span>',
    'archived': '<span class="status-badge status-archived">Archived</span>'
  };
  return badges[status] || badges['new'];
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// View message modal
let currentMessageId = null;
const messageModal = document.getElementById('messageModal');
const closeMessageModal = document.getElementById('closeMessageModal');

function openMessageModal() {
  messageModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMessageModalFunc() {
  messageModal.classList.remove('show');
  document.body.style.overflow = '';
  currentMessageId = null;
}

window.viewMessage = async function(id) {
  const message = currentContactMessages.find(m => m.id === id);
  if (!message) {
    alert('Message not found!');
    return;
  }
  
  currentMessageId = id;
  const messageDetails = document.getElementById('messageDetails');
  const date = new Date(message.created_at).toLocaleString();
  const statusBadge = getStatusBadge(message.status);
  
  messageDetails.innerHTML = `
    <div class="message-detail-header">
      <div>
        <h4>${escapeHtml(message.name)}</h4>
        <p class="message-detail-email"><i class="fa-solid fa-envelope"></i> ${escapeHtml(message.email)}</p>
        <p class="message-detail-date"><i class="fa-solid fa-clock"></i> ${date}</p>
      </div>
      <div>
        ${statusBadge}
      </div>
    </div>
    <div class="message-detail-body">
      <h5>Message:</h5>
      <p>${escapeHtml(message.message).replace(/\n/g, '<br>')}</p>
    </div>
  `;
  
  document.getElementById('messageAdminNotes').value = message.admin_notes || '';
  openMessageModal();
};

closeMessageModal?.addEventListener('click', closeMessageModalFunc);

messageModal?.addEventListener('click', (e) => {
  if (e.target === messageModal) {
    closeMessageModalFunc();
  }
});

// Save contact info
const saveContactInfoBtn = document.getElementById('saveContactInfoBtn');
if (saveContactInfoBtn) {
  saveContactInfoBtn.addEventListener('click', async () => {
    const address = document.getElementById('contactAddress').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const alternateEmail = document.getElementById('contactAlternateEmail').value.trim();
    const website = document.getElementById('contactWebsite').value.trim();
    const officeHours = document.getElementById('contactOfficeHours').value.trim();
    
    if (!address || !phone || !email) {
      alert('Please fill in all required fields (Address, Phone, Email)!');
      return;
    }
    
    const contactData = {
      address,
      phone,
      email,
      alternate_email: alternateEmail || null,
      website: website || null,
      office_hours: officeHours || null
    };
    
    const submitBtn = saveContactInfoBtn;
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    
    try {
      const { error } = await updateContactInfo(contactData);
      
      if (error) {
        alert(`Error saving contact info: ${error.message || error}`);
        return;
      }
      
      alert('Contact info saved successfully!');
    } catch (err) {
      console.error('Unexpected error:', err);
      alert(`Unexpected error: ${err.message}`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Refresh messages
const refreshMessagesBtn = document.getElementById('refreshMessagesBtn');
if (refreshMessagesBtn) {
  refreshMessagesBtn.addEventListener('click', async () => {
    refreshMessagesBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    await loadContactMessages(currentMessageFilter);
    refreshMessagesBtn.innerHTML = '<i class="fa-solid fa-sync-alt"></i> Refresh';
  });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    loadContactMessages(filter);
  });
});

// Message status actions
const markAsReadBtn = document.getElementById('markAsReadBtn');
const markAsRepliedBtn = document.getElementById('markAsRepliedBtn');
const archiveMessageBtn = document.getElementById('archiveMessageBtn');
const saveMessageNotesBtn = document.getElementById('saveMessageNotesBtn');

if (markAsReadBtn) {
  markAsReadBtn.addEventListener('click', async () => {
    if (!currentMessageId) return;
    
    const { error } = await updateContactMessage(currentMessageId, { status: 'read' });
    if (error) {
      alert(`Error: ${error.message || error}`);
      return;
    }
    
    alert('Message marked as read!');
    closeMessageModalFunc();
    await loadContactMessages(currentMessageFilter);
  });
}

if (markAsRepliedBtn) {
  markAsRepliedBtn.addEventListener('click', async () => {
    if (!currentMessageId) return;
    
    const { error } = await updateContactMessage(currentMessageId, { 
      status: 'replied',
      replied_at: new Date().toISOString()
    });
    if (error) {
      alert(`Error: ${error.message || error}`);
      return;
    }
    
    alert('Message marked as replied!');
    closeMessageModalFunc();
    await loadContactMessages(currentMessageFilter);
  });
}

if (archiveMessageBtn) {
  archiveMessageBtn.addEventListener('click', async () => {
    if (!currentMessageId) return;
    
    if (!confirm('Are you sure you want to archive this message?')) return;
    
    const { error } = await updateContactMessage(currentMessageId, { status: 'archived' });
    if (error) {
      alert(`Error: ${error.message || error}`);
      return;
    }
    
    alert('Message archived!');
    closeMessageModalFunc();
    await loadContactMessages(currentMessageFilter);
  });
}

if (saveMessageNotesBtn) {
  saveMessageNotesBtn.addEventListener('click', async () => {
    if (!currentMessageId) return;
    
    const notes = document.getElementById('messageAdminNotes').value.trim();
    
    const { error } = await updateContactMessage(currentMessageId, { admin_notes: notes });
    if (error) {
      alert(`Error: ${error.message || error}`);
      return;
    }
    
    alert('Notes saved!');
  });
}

// Delete message
window.deleteMessageById = async function(id) {
  if (!confirm('Are you sure you want to delete this message?')) return;
  
  const { error } = await deleteContactMessage(id);
  
  if (error) {
    alert(`Error deleting message: ${error.message || error}`);
    return;
  }
  
  alert('Message deleted successfully!');
  await loadContactMessages(currentMessageFilter);
};

// Escape key to close message modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMessageModalFunc();
  }
});

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
