import api from '../index';

class SpecializationService {
// Fixed version
async getSpecializations() {
  const response = await api.get('/specializations');
  return response.data.data || response.data;
}
}

export default new SpecializationService();