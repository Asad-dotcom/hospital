import authService from './authService'
import patientService from './patientService'
import appointmentService from './appointmentService'
import doctorService from './doctorService'
import { userService } from './userService'

export {
  authService,
  patientService,
  appointmentService,
  doctorService,
  userService
}

// Export as default object for convenience
export default {
  authService,
  patientService,
  appointmentService,
  doctorService,
  userService
}
