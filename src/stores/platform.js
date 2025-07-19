import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const usePlatformStore = defineStore('platform', () => {
  const announcements = ref([])
  const classes = ref([])
  const videos = ref([])
  const loading = ref(false)

  const fetchAnnouncements = async () => {
    try {
      loading.value = true
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      announcements.value = data || []
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchClasses = async () => {
    try {
      loading.value = true
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          videos (*)
        `)
        .order('created_at', { ascending: true })

      if (error) throw error
      classes.value = data || []
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchVideos = async () => {
    try {
      loading.value = true
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      videos.value = data || []
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      loading.value = false
    }
  }

  const addAnnouncement = async (announcement) => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert(announcement)
        .select()
        .single()

      if (error) throw error
      announcements.value.unshift(data)
      return { success: true }
    } catch (error) {
      console.error('Error adding announcement:', error)
      return { success: false, message: error.message }
    }
  }

  const deleteAnnouncement = async (id) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      const index = announcements.value.findIndex(a => a.id === id)
      if (index !== -1) {
        announcements.value.splice(index, 1)
      }
      return { success: true }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      return { success: false, message: error.message }
    }
  }

  const addVideo = async (video) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert(video)
        .select()
        .single()

      if (error) throw error
      
      // Update the class in the classes array
      const classIndex = classes.value.findIndex(c => c.id === video.class_id)
      if (classIndex !== -1) {
        if (!classes.value[classIndex].videos) {
          classes.value[classIndex].videos = []
        }
        classes.value[classIndex].videos.push(data)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error adding video:', error)
      return { success: false, message: error.message }
    }
  }

  const getClassById = (id) => {
    return classes.value.find(c => c.id === id)
  }

  const getVideoById = (id) => {
    for (const cls of classes.value) {
      if (cls.videos) {
        const video = cls.videos.find(v => v.id === id)
        if (video) return video
      }
    }
    return null
  }

  const initializeData = async () => {
    await Promise.all([
      fetchAnnouncements(),
      fetchClasses(),
      fetchVideos()
    ])
  }

  return {
    announcements,
    classes,
    videos,
    loading,
    fetchAnnouncements,
    fetchClasses,
    fetchVideos,
    addAnnouncement,
    deleteAnnouncement,
    addVideo,
    getClassById,
    getVideoById,
    initializeData
  }
})