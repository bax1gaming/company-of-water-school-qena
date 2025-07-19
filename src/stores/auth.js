import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)
  const isAuthenticated = computed(() => !!session.value && !!user.value)

  const initAuth = async () => {
    try {
      loading.value = true
      
      // Get initial session
      const { data: { session: initialSession } } = await supabase.auth.getSession()
      
      if (initialSession) {
        session.value = initialSession
        await fetchUserProfile(initialSession.user.id)
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        session.value = newSession
        
        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id)
        } else {
          user.value = null
        }
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      user.value = data
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const login = async (username, password) => {
    try {
      loading.value = true
      
      // First, find the user by username, student_code, phone, or email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .or(`username.eq.${username},student_code.eq.${username},phone.eq.${username},email.eq.${username}`)
        .single()

      if (userError || !userData) {
        throw new Error('المستخدم غير موجود')
      }

      // Use the email for Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password
      })

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const signup = async (userData) => {
    try {
      loading.value = true

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .or(`username.eq.${userData.username},student_code.eq.${userData.studentCode},phone.eq.${userData.phone},email.eq.${userData.email}`)
        .single()

      if (existingUser) {
        throw new Error('المستخدم موجود بالفعل')
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      })

      if (authError) throw authError

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username: userData.username,
          student_code: userData.studentCode,
          phone: userData.phone,
          email: userData.email,
          name: userData.name,
          role: 'student',
          class_id: userData.class,
          class_name: userData.className
        })

      if (profileError) throw profileError

      return { success: true, message: 'تم إنشاء الحساب بنجاح' }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      user.value = null
      session.value = null
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    session,
    loading,
    isAuthenticated,
    initAuth,
    login,
    signup,
    logout
  }
})