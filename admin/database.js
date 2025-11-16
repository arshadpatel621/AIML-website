// Database helper functions for Supabase

// Faculty Operations
async function fetchFaculty() {
  try {
    const { data, error } = await window.supabase
      .from('faculty')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return { data: null, error };
  }
}

async function addFaculty(facultyData) {
  try {
    const { data, error } = await window.supabase
      .from('faculty')
      .insert([facultyData])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding faculty:', error);
    return { data: null, error };
  }
}

async function updateFaculty(id, facultyData) {
  try {
    const { data, error } = await window.supabase
      .from('faculty')
      .update(facultyData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating faculty:', error);
    return { data: null, error };
  }
}

async function deleteFaculty(id) {
  try {
    const { error } = await window.supabase
      .from('faculty')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting faculty:', error);
    return { error };
  }
}

// Activities Operations
async function fetchActivities() {
  try {
    const { data, error } = await window.supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching activities:', error);
    return { data: null, error };
  }
}

async function addActivity(activityData) {
  try {
    const { data, error } = await window.supabase
      .from('activities')
      .insert([activityData])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding activity:', error);
    return { data: null, error };
  }
}

async function deleteActivity(id) {
  try {
    const { error } = await window.supabase
      .from('activities')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting activity:', error);
    return { error };
  }
}

// Achievements Operations
async function fetchAchievements() {
  try {
    const { data, error } = await window.supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return { data: null, error };
  }
}

async function addAchievement(achievementData) {
  try {
    const { data, error } = await window.supabase
      .from('achievements')
      .insert([achievementData])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding achievement:', error);
    return { data: null, error };
  }
}

async function deleteAchievement(id) {
  try {
    const { error } = await window.supabase
      .from('achievements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return { error };
  }
}

// Gallery Operations
async function fetchGallery() {
  try {
    const { data, error } = await window.supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return { data: null, error };
  }
}

async function addGalleryImage(imageData) {
  try {
    const { data, error } = await window.supabase
      .from('gallery')
      .insert([imageData])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return { data: null, error };
  }
}

async function deleteGalleryImage(id) {
  try {
    const { error } = await window.supabase
      .from('gallery')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return { error };
  }
}

// Leadership Operations
async function fetchLeadership() {
  try {
    const { data, error } = await window.supabase
      .from('leadership')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching leadership:', error);
    return { data: null, error };
  }
}

async function addLeadership(leaderData) {
  try {
    const { data, error } = await window.supabase
      .from('leadership')
      .insert([leaderData])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding leadership:', error);
    return { data: null, error };
  }
}

async function updateLeadership(id, leaderData) {
  try {
    const { data, error } = await window.supabase
      .from('leadership')
      .update(leaderData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating leadership:', error);
    return { data: null, error };
  }
}

async function deleteLeadership(id) {
  try {
    const { error } = await window.supabase
      .from('leadership')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting leadership:', error);
    return { error };
  }
}

// Students Operations
async function fetchStudents() {
  try {
    const { data, error } = await window.supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching students:', error);
    return { data: null, error };
  }
}

async function fetchToppers() {
  try {
    const { data, error } = await window.supabase
      .from('students')
      .select('*')
      .eq('is_topper', true)
      .order('cgpa', { ascending: false })
      .limit(3);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching toppers:', error);
    return { data: null, error };
  }
}

async function addStudent(studentData) {
  try {
    const { data, error } = await window.supabase
      .from('students')
      .insert([studentData])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding student:', error);
    return { data: null, error };
  }
}

async function updateStudent(id, studentData) {
  try {
    const { data, error } = await window.supabase
      .from('students')
      .update(studentData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating student:', error);
    return { data: null, error };
  }
}

async function deleteStudent(id) {
  try {
    const { error } = await window.supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting student:', error);
    return { error };
  }
}

// Content Operations
async function fetchContent() {
  try {
    const { data, error } = await window.supabase
      .from('content')
      .select('*')
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching content:', error);
    return { data: null, error };
  }
}

async function updateContent(contentData) {
  try {
    const { data, error } = await window.supabase
      .from('content')
      .upsert(contentData)
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating content:', error);
    return { data: null, error };
  }
}

// Contact Info Operations
async function fetchContactInfo() {
  try {
    const { data, error } = await window.supabase
      .from('contact_info')
      .select('*')
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return { data: null, error };
  }
}

async function updateContactInfo(contactData) {
  try {
    const { data, error } = await window.supabase
      .from('contact_info')
      .upsert({ id: 1, ...contactData })
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating contact info:', error);
    return { data: null, error };
  }
}

// Contact Messages Operations
async function fetchContactMessages(filter = 'all') {
  try {
    let query = window.supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filter !== 'all') {
      query = query.eq('status', filter);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return { data: null, error };
  }
}

async function addContactMessage(messageData) {
  try {
    const { data, error } = await window.supabase
      .from('contact_messages')
      .insert([messageData])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding contact message:', error);
    return { data: null, error };
  }
}

async function updateContactMessage(id, messageData) {
  try {
    const { data, error } = await window.supabase
      .from('contact_messages')
      .update(messageData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating contact message:', error);
    return { data: null, error };
  }
}

async function deleteContactMessage(id) {
  try {
    const { error } = await window.supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return { error };
  }
}

// Statistics
async function fetchDashboardStats() {
  try {
    const [facultyCount, studentsCount, activitiesCount, achievementsCount, leadershipCount, messagesCount] = await Promise.all([
      window.supabase.from('faculty').select('*', { count: 'exact', head: true }),
      window.supabase.from('students').select('*', { count: 'exact', head: true }),
      window.supabase.from('activities').select('*', { count: 'exact', head: true }),
      window.supabase.from('achievements').select('*', { count: 'exact', head: true }),
      window.supabase.from('leadership').select('*', { count: 'exact', head: true }),
      window.supabase.from('contact_messages').select('*', { count: 'exact', head: true })
    ]);

    return {
      faculty: facultyCount.count || 0,
      students: studentsCount.count || 0,
      activities: activitiesCount.count || 0,
      achievements: achievementsCount.count || 0,
      leadership: leadershipCount.count || 0,
      messages: messagesCount.count || 0
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      faculty: 0,
      students: 0,
      activities: 0,
      achievements: 0,
      leadership: 0,
      messages: 0
    };
  }
}

// Upload image to Supabase Storage
async function uploadImage(file, bucket = 'images') {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await window.supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: urlData } = window.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { url: null, error };
  }
}
