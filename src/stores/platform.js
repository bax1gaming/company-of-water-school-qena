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
      
      // Add mock data for demo purposes
      const mockClasses = [
        {
          id: 'first-general',
          name: 'الصف الأول - تخصص عام',
          description: 'المبادئ الأساسية في هندسة المياه والصرف الصحي',
          students: 45,
          videos: [
            {
              id: 'video-1',
              title: 'مقدمة في هندسة المياه',
              duration: '45:30',
              trainer: 'د. أحمد محمد',
              uploadDate: '2025-01-15',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            }
          ]
        },
        {
          id: 'second-water',
          name: 'الصف الثاني - تخصص مياه شرب',
          description: 'تقنيات معالجة وتوزيع مياه الشرب',
          students: 38,
          videos: [
            {
              id: 'video-2',
              title: 'معالجة مياه الشرب',
              duration: '52:15',
              trainer: 'د. فاطمة علي',
              uploadDate: '2025-01-16',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            }
          ]
        },
        {
          id: 'second-sewage',
          name: 'الصف الثاني - تخصص صرف صحي',
          description: 'أنظمة جمع ومعالجة مياه الصرف الصحي',
          students: 42,
          videos: []
        },
        {
          id: 'third-water',
          name: 'الصف الثالث - تخصص مياه شرب',
          description: 'تخصص مياه شرب - المستوى المتقدم',
          students: 35,
          videos: []
        },
        {
          id: 'third-sewage',
          name: 'الصف الثالث - تخصص صرف صحي',
          description: 'تخصص صرف صحي - المستوى المتقدم',
          students: 40,
          videos: []
        }
      ]

      try {
        const { data, error } = await supabase
          .from('classes')
          .select(`
            *,
            videos (*)
          `)
          .order('created_at', { ascending: true })

        if (error) {
          console.warn('Could not fetch classes from database, using mock data:', error)
          classes.value = mockClasses
        } else {
          classes.value = data && data.length > 0 ? data : mockClasses
        }
      } catch (dbError) {
        console.warn('Database connection failed, using mock data:', dbError)
        classes.value = mockClasses
      }
    } catch (error) {
      console.warn('Error fetching classes:', error)
      classes.value = []
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