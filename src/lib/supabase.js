import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper functions for database operations
export const db = {
  // Profile operations
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async createProfile(profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Classes operations
  async getClasses() {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('id')
    
    if (error) throw error
    return data
  },

  async getClassById(classId) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single()
    
    if (error) throw error
    return data
  },

  // Videos operations
  async getVideos() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getVideosByClass(classId) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getVideoById(videoId) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single()
    
    if (error) throw error
    return data
  },

  async createVideo(videoData) {
    const { data, error } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Announcements operations
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createAnnouncement(announcementData) {
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcementData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteAnnouncement(announcementId) {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', announcementId)
    
    if (error) throw error
  },

  // Enrollments operations
  async getStudentEnrollments(studentId) {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        classes (*)
      `)
      .eq('student_id', studentId)
    
    if (error) throw error
    return data
  },

  async enrollStudent(studentId, classId) {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({ student_id: studentId, class_id: classId })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}