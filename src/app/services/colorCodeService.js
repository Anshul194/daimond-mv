import ColorCodeRepository from '../repository/colorCodeRepository.js';

class ColorCodeService {
  constructor() {
    this.colorCodeRepo = new ColorCodeRepository();
  }

  // async getAllColorCodes() {
  //   try {
  //     return await this.colorCodeRepo.findAll();
  //   } catch (error) {
  //     console.error('Service getAllColorCodes error:', error.message);
  //     throw error;
  //   }
  // }

  async getAllColorCodes(query) {
  try {
    console.log("Query Parameters:", query);
    const { page = 1, limit = 10, filters = "{}", searchFields = "{}", sort = "{}" } = query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    console.log("Page Number:", pageNum);
    console.log("Limit Number:", limitNum);

    // Parse JSON strings to objects
    const parsedFilters = JSON.parse(filters);
    const parsedSearchFields = JSON.parse(searchFields);
    const parsedSort = JSON.parse(sort);

    // Basic filter conditions
    const filterConditions = { deletedAt: null };

    // Apply filters
    for (const [key, value] of Object.entries(parsedFilters)) {
      filterConditions[key] = value;
    }

    // Apply search conditions
    const searchConditions = [];
    for (const [field, term] of Object.entries(parsedSearchFields)) {
      searchConditions.push({ [field]: { $regex: term, $options: "i" } });
    }
    if (searchConditions.length > 0) {
      filterConditions.$or = searchConditions;
    }

    // Apply sort
    const sortConditions = {};
    for (const [field, direction] of Object.entries(parsedSort)) {
      sortConditions[field] = direction === "asc" ? 1 : -1;
    }

    // Fetch with filters, search, sort, pagination
    const colorCodes = await this.colorCodeRepo.getAll(
      filterConditions,
      sortConditions,
      pageNum,
      limitNum
    );

    return colorCodes;
  } catch (error) {
    console.error('Service getAllColorCodes error:', error.message);
    throw new AppError("Cannot fetch color codes", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}


  async getColorCodeById(id) {
    try {
      return await this.colorCodeRepo.findById(id);
    } catch (error) {
      console.error('Service getColorCodeById error:', error.message);
      throw error;
    }
  }

  async createColorCode(data) {
    try {
      return await this.colorCodeRepo.create(data);
    } catch (error) {
      console.error('Service createColorCode error:', error.message);
      throw error;
    }
  }

  async updateColorCode(id, data) {
    try {
      console.log('Service updateColorCode called with:', id, data);
      const updated = await this.colorCodeRepo.update(id, data);
      console.log('Service updated result:', updated);
      return updated;
    } catch (error) {
      console.error('Service updateColorCode error:', error.message);
      throw error;
    }
  }

  async deleteColorCode(id) {
    try {
      console.log('Service deleteColorCode called with:', id);
      const deleted = await this.colorCodeRepo.permanentDelete(id);
      console.log('Service deleted result:', deleted);
      return deleted;
    } catch (error) {
      console.error('Service deleteColorCode error:', error.message);
      throw error;
    }
  }
}

export default ColorCodeService;
