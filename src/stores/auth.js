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
      
      // Get initial session with error handling
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        
        if (initialSession) {
          session.value = initialSession
          await fetchUserProfile(initialSession.user.id)
        }
      } catch (sessionError) {
        console.warn('Could not get initial session:', sessionError)
        // Continue without session
      }

      // Listen for auth changes with error handling
      try {
        supabase.auth.onAuthStateChange(async (event, newSession) => {
          session.value = newSession
          
          if (newSession?.user) {
            await fetchUserProfile(newSession.user.id)
          } else {
            user.value = null
          }
        })
      } catch (authError) {
        console.warn('Could not set up auth listener:', authError)
      }
    } catch (error) {
      console.warn('Error initializing auth:', error)
      // Don't throw error, just log it
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
      
      console.log('Starting signup process...', userData)

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            role: 'student'
          }
        }
      })

      if (authError) throw authError
      console.log('Auth user created:', authData)

      if (!authData.user) {
        throw new Error('فشل في إنشاء المستخدم')
      }

      // Create user profile with the auth user ID
      const { data: profileData, error: profileError } = await supabase
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
        .select()

      if (profileError) {
        console.error('Profile creation error:', profileError)
        throw profileError
      }
      
      console.log('Profile created successfully:', profileData)

      return { 
        success: true, 
        message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' 
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { 
        success: false, 
        message: getErrorMessage(error.message) || 'حدث خطأ أثناء إنشاء الحساب' 
      }
    } finally {
      loading.value = false
    }
  }

  const getErrorMessage = (error) => {
    if (error?.includes('duplicate key')) {
      if (error.includes('username')) return 'اسم المستخدم موجود بالفعل'
      if (error.includes('email')) return 'البريد الإلكتروني موجود بالفعل'
      if (error.includes('phone')) return 'رقم الهاتف موجود بالفعل'
      if (error.includes('student_code')) return 'كود الطالب موجود بالفعل'
      return 'البيانات موجودة بالفعل'
    }
    if (error?.includes('User already registered')) return 'البريد الإلكتروني مسجل بالفعل'
    return error
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