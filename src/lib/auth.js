import { supabase } from './supabase'

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })
  
  if (error) throw error
  
  // Create profile in database
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      email: email,
      full_name: name,
      created_at: new Date().toISOString()
    })
  }
  
  return { data, error }
}

export async function signIn(email, password, rememberMe = false) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  
  // Store session based on remember me
  if (rememberMe) {
    localStorage.setItem('session_expiry', 'long')
  } else {
    localStorage.setItem('session_expiry', 'short')
  }
  
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  localStorage.removeItem('creator_logged_in')
  localStorage.removeItem('creator_email')
  localStorage.removeItem('creator_name')
  localStorage.removeItem('session_expiry')
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}

// Social login helpers (setup required in Supabase dashboard)
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard'
    }
  })
  return { data, error }
}

export async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: window.location.origin + '/dashboard'
    }
  })
  return { data, error }
}