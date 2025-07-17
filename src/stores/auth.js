import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, db } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(false)
  const isAuthenticated = computed(() => !!user.value && !!profile.value)

  const initAuth = async () => {
    try {
      loading.value = true
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        user.value = session.user
        await loadProfile()
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          user.value = session.user
          await loadProfile()
        } else if (event === 'SIGNED_OUT') {
          user.value = null
          profile.value = null
        }
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      loading.value = false
    }
  }

  const loadProfile = async () => {
    if (!user.value) return

    try {
      const profileData = await db.getProfile(user.value.id)
      profile.value = profileData
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const login = async (identifier, password) => {
    try {
      loading.value = true
      
      // Try to sign in with email first
      let { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password
      })

      // If email login fails, try to find user by other identifiers
      if (error && error.message.includes('Invalid login credentials')) {
        // Find user by username, student_code, or phone
        const { data: profiles } = await supabase
          .from('profiles')
          .select('email')
          .or(`username.eq.${identifier},student_code.eq.${identifier},phone.eq.${identifier}`)
          .single()

        if (profiles?.email) {
          const result = await supabase.auth.signInWithPassword({
            email: profiles.email,
            password: password
          })
          data = result.data
          error = result.error
        }
      }

      if (error) throw error

      user.value = data.user
      await loadProfile()
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const signup = async (userData) => {
    try {
      loading.value = true

      // Check if user already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .or(`username.eq.${userData.username},student_code.eq.${userData.studentCode},phone.eq.${userData.phone},email.eq.${userData.email}`)
        .single()

      if (existingProfile) {
        return { success: false, message: 'المستخدم موجود بالفعل' }
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      })

      if (authError) throw authError

      if (authData.user) {
        // Create profile
        const profileData = {
          user_id: authData.user.id,
          email: userData.email,
          username: userData.username,
          student_code: userData.studentCode,
          phone: userData.phone,
          name: userData.name,
          role: 'student',
          class: userData.class,
          class_name: userData.className
        }

        await db.createProfile(profileData)

        // Auto-enroll student in their class
        if (userData.class) {
          await db.enrollStudent(profileData.user_id, userData.class)
        }

        return { success: true, message: 'تم إنشاء الحساب بنجاح' }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: 'حدث خطأ أثناء إنشاء الحساب' }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      user.value = null
      profile.value = null
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    initAuth,
    loadProfile
  }
})