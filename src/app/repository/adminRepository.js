import Admin from '../models/admin';

class AdminRepository {
  async findByEmail(email) {
    return Admin.findOne({ email });
  }

  async create(adminData) {
    const admin = new Admin(adminData);
    return admin.save();
  }

  async findById(id) {
    return Admin.findById(id);
  }
}

export default AdminRepository;
