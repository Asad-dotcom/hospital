import authService from '@/api/services/authService'

export const checkAuthStatus = () => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  return {
    isAuthenticated: !!token,
    token,
    user,
    hasAdminAccess: user.role === 'admin' || user.role === 'super_admin'
  }
}

export const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    return 'Session expired. Please login again.'
  }
  
  if (error.response?.status === 403) {
    return 'You do not have permission to access this resource.'
  }
  
  return error.message || 'An error occurred while processing your request.'
}

export const refreshToken = async () => {
  try {
    const response = await authService.getCurrentUser()
    return response
  } catch (error) {
    handleAuthError(error)
    return null
  }
}
