import bcrypt from 'bcryptjs';
import AdminRepository from '../repository/adminRepository.js';

class AdminService {
  constructor() {
    this.adminRepo = new AdminRepository();
  }

  async getUserByEmail(email) {
    return this.adminRepo.findByEmail(email);
  }

  async signup({ email, password, username }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.adminRepo.create({ email, password: hashedPassword, username });
  }

  async validateCredentials(email, password) {
    const user = await this.adminRepo.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async getUserById(id) {
    return this.adminRepo.findById(id);
  }
}

export default AdminService;
