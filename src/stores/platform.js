import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlatformStore = defineStore('platform', () => {
  const announcements = ref([
    {
      id: 1,
      title: 'إعلان هام: بداية الفصل الدراسي الجديد',
      content: 'يسعدنا أن نعلن عن بداية الفصل الدراسي الجديد. نتمنى لجميع الطلاب التوفيق والنجاح.',
      date: '2025-01-15',
      author: 'إدارة المنصة'
    },
    {
      id: 2,
      title: 'تحديث المناهج الدراسية',
      content: 'تم تحديث المناهج الدراسية لتواكب أحدث التطورات في مجال مياه الشرب والصرف الصحي.',
      date: '2025-01-10',
      author: 'إدارة المنصة'
    }
  ])

  const classes = ref([
    {
      id: 'first-general',
      name: 'الصف الأول - تخصص عام',
      description: 'المبادئ الأساسية في هندسة المياه والصرف الصحي',
      students: 45,
      videos: [
        {
          id: 1,
          title: 'مقدمة في هندسة المياه',
          duration: '45:30',
          uploadDate: '2025-01-10',
          trainer: 'د. محمد أحمد'
        },
        {
          id: 2,
          title: 'أساسيات الصرف الصحي',
          duration: '38:15',
          uploadDate: '2025-01-08',
          trainer: 'د. سارة محمود'
        }
      ]
    },
    {
      id: 'second-water',
      name: 'الصف الثاني - تخصص مياه شرب',
      description: 'تقنيات معالجة وتوزيع مياه الشرب',
      students: 32,
      videos: [
        {
          id: 3,
          title: 'عمليات معالجة المياه',
          duration: '52:20',
          uploadDate: '2025-01-12',
          trainer: 'د. أحمد علي'
        }
      ]
    },
    {
      id: 'second-sewage',
      name: 'الصف الثاني - تخصص صرف صحي',
      description: 'أنظمة جمع ومعالجة مياه الصرف الصحي',
      students: 28,
      videos: [
        {
          id: 4,
          title: 'تصميم شبكات الصرف الصحي',
          duration: '41:45',
          uploadDate: '2025-01-11',
          trainer: 'د. فاطمة حسن'
        }
      ]
    },
    {
      id: 'third-water',
      name: 'الصف الثالث - تخصص مياه شرب',
      description: 'تخصص مياه شرب - المستوى المتقدم',
      students: 25,
      videos: []
    },
    {
      id: 'third-sewage',
      name: 'الصف الثالث - تخصص صرف صحي',
      description: 'تخصص صرف صحي - المستوى المتقدم',
      students: 22,
      videos: []
    }
  ])

  const addAnnouncement = (announcement) => {
    announcements.value.unshift({
      id: Date.now(),
      ...announcement,
      date: new Date().toISOString().split('T')[0]
    })
  }

  const addVideo = (classId, video) => {
    const classIndex = classes.value.findIndex(c => c.id === classId)
    if (classIndex !== -1) {
      classes.value[classIndex].videos.push({
        id: Date.now(),
        ...video,
        uploadDate: new Date().toISOString().split('T')[0]
      })
    }
  }

  const getClassById = (id) => {
    return classes.value.find(c => c.id === id)
  }

  const getVideoById = (id) => {
    for (const cls of classes.value) {
      const video = cls.videos.find(v => v.id == id)
      if (video) return video
    }
    return null
  }

  return {
    announcements,
    classes,
    addAnnouncement,
    addVideo,
    getClassById,
    getVideoById
  }
})