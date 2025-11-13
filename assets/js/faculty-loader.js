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

// Load leadership data - Enhanced with DOM ready check
(async function loadLeadershipData() {
  // Wait for DOM to be ready
  const waitForDOM = () => {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  };

  // Wait for Supabase to be initialized
  const waitForSupabase = () => {
    return new Promise((resolve) => {
      if (window.supabase) {
        resolve();
        return;
      }
      
      // Check periodically for Supabase
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.supabase) {
          clearInterval(checkInterval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          resolve(); // Resolve anyway, function will handle missing Supabase
        }
      }, 100);
    });
  };

  try {
    // Wait for both DOM and Supabase to be ready
    await waitForDOM();
    await waitForSupabase();

    if (!window.supabase) {
      console.warn('Supabase not initialized. Leadership will display static content.');
      return;
    }

    const leadershipGrid = document.querySelector('#leadership .faculty-grid');
    if (!leadershipGrid) {
      console.warn('Leadership grid container not found in DOM. Using static content.');
      return;
    }

    console.log('🔄 Fetching leadership from database...');
    
    // Fetch leadership from the database
    const { data: leadershipList, error } = await window.supabase
      .from('leadership')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('❌ Error fetching leadership:', error);
      console.log('📋 Using static leadership content from HTML');
      return;
    }

    if (!leadershipList || leadershipList.length === 0) {
      console.log('ℹ️ No leadership found in database. Using static leadership content from HTML.');
      return;
    }

    console.log(`✅ Found ${leadershipList.length} leader(s) in database`);

    // Clear existing static content
    leadershipGrid.innerHTML = '';

    // Create leader cards from database
    leadershipList.forEach((leader, index) => {
      const leaderCard = document.createElement('article');
      leaderCard.className = 'faculty-card';
      leaderCard.style.opacity = '0';
      leaderCard.style.transform = 'translateY(20px)';
      
      // Use photo_url from database or fallback
      const photoUrl = leader.photo_url || 'guru.jpg';
      
      leaderCard.innerHTML = `
        <img src="${photoUrl}" alt="${leader.name} portrait" loading="lazy" onerror="this.onerror=null; this.src='guru.jpg';">
        <div class="info">
          <h3>${leader.name || 'Leader'}</h3>
          <p class="role">${leader.position || 'Position'}</p>
        </div>
      `;
      
      leadershipGrid.appendChild(leaderCard);
      
      // Fade-in animation with staggered delay
      setTimeout(() => {
        leaderCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        leaderCard.style.opacity = '1';
        leaderCard.style.transform = 'translateY(0)';
      }, index * 100);
    });

    console.log(`✨ Successfully loaded and displayed ${leadershipList.length} leader(s) from database`);
    console.log('💡 Tip: Leaders are automatically synced from admin panel updates');
  } catch (error) {
    console.error('❌ Unexpected error loading leadership:', error);
    console.log('📋 Falling back to static content from HTML');
  }
})();

// Load activities
(async function loadActivitiesData() {
  try {
    if (!window.supabase) {
      console.warn('Supabase not initialized. Activities will display static content.');
      return;
    }

    console.log('Fetching activities from database...');
    
    const { data: activitiesList, error } = await window.supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching activities:', error);
      console.log('Using static activities content');
      return;
    }

    if (!activitiesList || activitiesList.length === 0) {
      console.log('No activities found in database. Using static activities content.');
      return;
    }

    const activityGrid = document.querySelector('#activities .activity-grid');
    if (!activityGrid) {
      console.error('Activities grid container not found in DOM');
      return;
    }

    console.log(`Found ${activitiesList.length} activities in database`);

    // Clear existing content
    activityGrid.innerHTML = '';

    // Create activity cards
    activitiesList.forEach((activity, index) => {
      const activityCard = document.createElement('article');
      activityCard.className = 'activity-card';
      activityCard.style.opacity = '0';
      activityCard.style.transform = 'translateY(20px)';
      
      activityCard.innerHTML = `
        <img src="${activity.image_url || 'assets/img.jpeg'}" alt="${activity.title}" loading="lazy" onerror="this.onerror=null; this.src='assets/img.jpeg';">
        <div class="content">
          <h3>${activity.title}</h3>
          <p>${activity.description || ''}</p>
        </div>
      `;
      
      activityGrid.appendChild(activityCard);
      
      // Fade-in animation
      setTimeout(() => {
        activityCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        activityCard.style.opacity = '1';
        activityCard.style.transform = 'translateY(0)';
      }, index * 100);
    });

    console.log(`✅ Successfully loaded and displayed ${activitiesList.length} activities from database`);
  } catch (error) {
    console.error('Unexpected error loading activities:', error);
  }
})();

// Load achievements
(async function loadAchievementsData() {
  try {
    if (!window.supabase) {
      console.warn('Supabase not initialized. Achievements will display static content.');
      return;
    }

    console.log('Fetching achievements from database...');
    
    const { data: achievementsList, error } = await window.supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      console.log('Using static achievements content');
      return;
    }

    if (!achievementsList || achievementsList.length === 0) {
      console.log('No achievements found in database. Using static achievements content.');
      return;
    }

    const achievementsContainer = document.querySelector('#achievements .cards');
    if (!achievementsContainer) {
      console.error('Achievements container not found in DOM');
      return;
    }

    console.log(`Found ${achievementsList.length} achievements in database`);

    // Clear existing content
    achievementsContainer.innerHTML = '';

    // Create achievement cards
    achievementsList.forEach((achievement, index) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      card.innerHTML = `
        <img src="${achievement.image_url}" alt="${achievement.title || 'Achievement'}" loading="lazy" onerror="this.onerror=null; this.src='assets/img.jpeg';">
      `;
      
      achievementsContainer.appendChild(card);
      
      // Fade-in animation
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });

    console.log(`✅ Successfully loaded and displayed ${achievementsList.length} achievements from database`);
  } catch (error) {
    console.error('Unexpected error loading achievements:', error);
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
        taglineElement.textContent = content.tagline.includes('💡') ? content.tagline : `💡 "${content.tagline}"`;
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

// Load toppers (top 3 students marked as toppers)
(async function loadToppersData() {
  try {
    if (!window.supabase) {
      console.warn('Supabase not initialized. Toppers will display static content.');
      return;
    }

    console.log('🔄 Fetching toppers from database...');

    const { data: toppersList, error } = await window.supabase
      .from('students')
      .select('*')
      .eq('is_topper', true)
      .order('cgpa', { ascending: false })
      .limit(3);

    if (error) {
      console.error('❌ Error fetching toppers:', error);
      console.log('📋 Using static toppers content from HTML');
      return;
    }

    if (!toppersList || toppersList.length === 0) {
      console.log('ℹ️ No toppers found in database. Using static toppers content from HTML.');
      return;
    }

    console.log(`✅ Found ${toppersList.length} topper(s) in database`);

    const topperTrack = document.querySelector('.topper-track');
    if (!topperTrack) {
      console.warn('Topper track container not found in DOM');
      return;
    }

    // Clear existing content
    topperTrack.innerHTML = '';

    // Create topper cards from database
    toppersList.forEach((topper, index) => {
      const topperCard = document.createElement('div');
      topperCard.className = 'topper-card';
      topperCard.style.opacity = '0';
      topperCard.style.transform = 'translateY(20px)';

      // Use photo_url from database or fallback to placeholder
      const photoUrl = topper.photo_url || 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop';

      topperCard.innerHTML = `
        <img src="${photoUrl}" alt="${topper.name}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop';">
        <div class="meta">
          <h4>${index + 1}. ${topper.name.toUpperCase()}${topper.roll_number ? ' (' + topper.roll_number + ')' : ''}</h4>
          <p>${topper.cgpa ? topper.cgpa.toFixed(2) : 'N/A'}</p>
        </div>
      `;

      topperTrack.appendChild(topperCard);

      // Fade-in animation with staggered delay
      setTimeout(() => {
        topperCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        topperCard.style.opacity = '1';
        topperCard.style.transform = 'translateY(0)';
      }, index * 100);
    });

    console.log(`✨ Successfully loaded and displayed ${toppersList.length} topper(s) from database`);
    console.log('💡 Tip: Toppers are automatically synced from admin panel updates');
  } catch (error) {
    console.error('❌ Unexpected error loading toppers:', error);
    console.log('📋 Falling back to static content from HTML');
  }
})();
