import VendorRepository from '../repository/vendorRepository.js';

class VendorService {
  constructor() {
    this.vendorRepo = new VendorRepository();
  }

async getAllVendors(query) {
    try {
        return await this.vendorRepo.getAllVendors(query);
    } catch (error) {
        // Handle or log the error as needed
        throw error;
    }
}
}


export default VendorService;
