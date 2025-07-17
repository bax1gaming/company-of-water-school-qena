import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../lib/supabase'
import { useAuthStore } from './auth'

export const usePlatformStore = defineStore('platform', () => {
  const announcements = ref([])
  const classes = ref([])
  const videos = ref([])
  const loading = ref(false)

  const loadAnnouncements = async () => {
    try {
      loading.value = true
      const data = await db.getAnnouncements()
      announcements.value = data
    } catch (error) {
      console.error('Error loading announcements:', error)
    } finally {
      loading.value = false
    }
  }

  const loadClasses = async () => {
    try {
      loading.value = true
      const data = await db.getClasses()
      
      // Load videos for each class
      const classesWithVideos = await Promise.all(
        data.map(async (cls) => {
          const classVideos = await db.getVideosByClass(cls.id)
          return {
            ...cls,
            videos: classVideos,
            students: cls.students_count
          }
        })
      )
      
      classes.value = classesWithVideos
    } catch (error) {
      console.error('Error loading classes:', error)
    } finally {
      loading.value = false
    }
  }

  const loadVideos = async () => {
    try {
      loading.value = true
      const data = await db.getVideos()
      videos.value = data
    } catch (error) {
      console.error('Error loading videos:', error)
    } finally {
      loading.value = false
    }
  }

  const addAnnouncement = async (announcement) => {
    try {
      const authStore = useAuthStore()
      const announcementData = {
        title: announcement.title,
        content: announcement.content,
        author_id: authStore.profile.id,
        author_name: authStore.profile.name
      }
      
      const newAnnouncement = await db.createAnnouncement(announcementData)
      announcements.value.unshift(newAnnouncement)
      return { success: true }
    } catch (error) {
      console.error('Error adding announcement:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteAnnouncement = async (announcementId) => {
    try {
      await db.deleteAnnouncement(announcementId)
      const index = announcements.value.findIndex(a => a.id === announcementId)
      if (index !== -1) {
        announcements.value.splice(index, 1)
      }
      return { success: true }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      return { success: false, error: error.message }
    }
  }

  const addVideo = async (classId, video) => {
    try {
      const authStore = useAuthStore()
      const videoData = {
        title: video.title,
        class_id: classId,
        trainer_id: authStore.profile.id,
        trainer_name: authStore.profile.name,
        duration: video.duration,
        video_url: video.videoUrl || null,
        file_name: video.fileName || null
      }
      
      const newVideo = await db.createVideo(videoData)
      
      // Update local classes data
      const classIndex = classes.value.findIndex(c => c.id === classId)
      if (classIndex !== -1) {
        classes.value[classIndex].videos.push(newVideo)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error adding video:', error)
      return { success: false, error: error.message }
    }
  }

  const getClassById = (id) => {
    return classes.value.find(c => c.id === id)
  }

  const getVideoById = async (id) => {
    try {
      // First check if video is in local cache
      for (const cls of classes.value) {
        const video = cls.videos.find(v => v.id == id)
        if (video) return video
      }
      
      // If not found locally, fetch from database
      const video = await db.getVideoById(id)
      return video
    } catch (error) {
      console.error('Error getting video:', error)
      return null
    }
  }

  const initializePlatform = async () => {
    await Promise.all([
      loadAnnouncements(),
      loadClasses(),
      loadVideos()
    ])
  }

  return {
    announcements,
    classes,
    videos,
    loading,
    loadAnnouncements,
    loadClasses,
    loadVideos,
    addAnnouncement,
    deleteAnnouncement,
    addVideo,
    getClassById,
    getVideoById,
    initializePlatform
  }
})