// Faculty Data Loader - Fetches faculty from Supabase and displays on frontend

(async function loadFacultyData() {
  try {
    // Check if Supabase is available
    if (!window.supabase) {
      console.warn('Supabase not initialized. Faculty will display static content.');
      return;
    }

    // Fetch faculty data from Supabase
    const { data: facultyList, error } = await window.supabase
      .from('faculty')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching faculty:', error);
      return;
    }

    // If no faculty data, keep static content
    if (!facultyList || facultyList.length === 0) {
      console.log('No faculty data found in database. Displaying static content.');
      return;
    }

    // Find the faculty grid container
    const facultyGrid = document.querySelector('#faculty .faculty-grid');
    
    if (!facultyGrid) {
      console.warn('Faculty grid container not found');
      return;
    }

    // Clear existing content
    facultyGrid.innerHTML = '';

    // Create faculty cards from database data
    facultyList.forEach(faculty => {
      const facultyCard = document.createElement('article');
      facultyCard.className = 'faculty-card';
      
      // Use photo_url from database or fallback to default
      const photoUrl = faculty.photo_url || 'guru.jpg';
      
      facultyCard.innerHTML = `
        <img src="${photoUrl}" alt="${faculty.name} portrait" loading="lazy">
        <div class="info">
          <h3>${faculty.name}</h3>
          <p class="role">${faculty.role}</p>
        </div>
      `;
      
      facultyGrid.appendChild(facultyCard);
    });

    console.log(`✅ Loaded ${facultyList.length} faculty members from database`);

    // Add fade-in animation
    const cards = facultyGrid.querySelectorAll('.faculty-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });

  } catch (error) {
    console.error('Error loading faculty:', error);
  }
})();

// Load leadership data
(async function loadLeadershipData() {
  try {
    if (!window.supabase) return;

    // Fetch leadership from the database
    const { data: leadershipList, error } = await window.supabase
      .from('leadership')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !leadershipList || leadershipList.length === 0) {
      console.log('Using static leadership content');
      return;
    }

    const leadershipGrid = document.querySelector('#leadership .faculty-grid');
    if (!leadershipGrid) return;

    leadershipGrid.innerHTML = '';

    leadershipList.forEach(leader => {
      const leaderCard = document.createElement('article');
      leaderCard.className = 'faculty-card';
      
      leaderCard.innerHTML = `
        <img src="${leader.photo_url || 'guru.jpg'}" alt="${leader.name} portrait" loading="lazy">
        <div class="info">
          <h3>${leader.name}</h3>
          <p class="role">${leader.position}</p>
        </div>
      `;
      
      leadershipGrid.appendChild(leaderCard);
    });

    console.log(`✅ Loaded ${leadershipList.length} leadership members from database`);
  } catch (error) {
    console.error('Error loading leadership:', error);
  }
})();

// Also load activities
(async function loadActivitiesData() {
  try {
    if (!window.supabase) return;

    const { data: activitiesList, error } = await window.supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !activitiesList || activitiesList.length === 0) {
      console.log('Using static activities content');
      return;
    }

    const activityGrid = document.querySelector('#activities .activity-grid');
    if (!activityGrid) return;

    activityGrid.innerHTML = '';

    activitiesList.forEach(activity => {
      const activityCard = document.createElement('article');
      activityCard.className = 'activity-card';
      
      activityCard.innerHTML = `
        <img src="${activity.image_url || 'assets/img.jpeg'}" alt="${activity.title}" loading="lazy">
        <div class="content">
          <h3>${activity.title}</h3>
          <p>${activity.description || ''}</p>
        </div>
      `;
      
      activityGrid.appendChild(activityCard);
    });

    console.log(`✅ Loaded ${activitiesList.length} activities from database`);
  } catch (error) {
    console.error('Error loading activities:', error);
  }
})();

// Load achievements
(async function loadAchievementsData() {
  try {
    if (!window.supabase) return;

    const { data: achievementsList, error } = await window.supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !achievementsList || achievementsList.length === 0) {
      console.log('Using static achievements content');
      return;
    }

    const achievementsContainer = document.querySelector('#achievements .cards');
    if (!achievementsContainer) return;

    achievementsContainer.innerHTML = '';

    achievementsList.forEach(achievement => {
      const card = document.createElement('article');
      card.className = 'card';
      
      card.innerHTML = `
        <img src="${achievement.image_url}" alt="${achievement.title || 'Achievement'}" loading="lazy">
      `;
      
      achievementsContainer.appendChild(card);
    });

    console.log(`✅ Loaded ${achievementsList.length} achievements from database`);
  } catch (error) {
    console.error('Error loading achievements:', error);
  }
})();

// Load gallery images
(async function loadGalleryData() {
  try {
    if (!window.supabase) return;

    const { data: galleryList, error } = await window.supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !galleryList || galleryList.length === 0) {
      console.log('Using static gallery content');
      return;
    }

    const galleryTrack = document.querySelector('.gallery-track');
    if (!galleryTrack) return;

    galleryTrack.innerHTML = '';

    galleryList.forEach((image, index) => {
      const slide = document.createElement('div');
      slide.className = index === 0 ? 'gallery-slide active' : 'gallery-slide';
      
      slide.innerHTML = `
        <img src="${image.image_url}" alt="${image.caption || 'Gallery Image'}" loading="lazy">
        <div class="gallery-caption">
          <h4>${image.caption || 'AIML Department'}</h4>
          <p>${image.description || ''}</p>
        </div>
      `;
      
      galleryTrack.appendChild(slide);
    });

    // Update dots
    const galleryDots = document.querySelector('.gallery-dots');
    if (galleryDots) {
      galleryDots.innerHTML = galleryList.map((_, i) => 
        `<button class="dot ${i === 0 ? 'active' : ''}" data-slide="${i}" aria-label="Show image ${i + 1}"></button>`
      ).join('');
    }

    console.log(`✅ Loaded ${galleryList.length} gallery images from database`);
  } catch (error) {
    console.error('Error loading gallery:', error);
  }
})();

// Load content (About Us text)
(async function loadContentData() {
  try {
    if (!window.supabase) return;

    const { data: content, error } = await window.supabase
      .from('content')
      .select('*')
      .single();

    if (error || !content) {
      console.log('Using static content');
      return;
    }

    // Update tagline if exists
    if (content.tagline) {
      const taglineElement = document.getElementById('tagline-text');
      if (taglineElement) {
        taglineElement.textContent = `💡 "${content.tagline}"`;
      }
    }

    // Update about description if exists
    if (content.description) {
      const aboutIntro = document.querySelector('.about-intro');
      if (aboutIntro) {
        aboutIntro.textContent = content.description;
      }
    }

    // Update vision if exists
    if (content.vision) {
      const visionCard = document.querySelector('#mission .cards .card:nth-child(1) p');
      if (visionCard) {
        visionCard.textContent = content.vision;
      }
    }

    // Update mission if exists
    if (content.mission) {
      const missionCard = document.querySelector('#mission .cards .card:nth-child(2)');
      if (missionCard) {
        const missionContent = missionCard.querySelector('p');
        if (missionContent) {
          // Keep the list if mission contains bullet points, otherwise just update the text
          if (content.mission.includes('M1:') || content.mission.includes('•')) {
            missionContent.innerHTML = content.mission;
          } else {
            missionContent.textContent = content.mission;
          }
        }
      }
    }

    console.log('✅ Content loaded from database');
  } catch (error) {
    console.error('Error loading content:', error);
  }
})();
