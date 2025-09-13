import Admin from '../models/admin';

class VendorRepository {
    
  async getAllVendors(query = {}) {
    // Destructure and parse query params
    const {
      page = 1,
      limit = 10,
      filters = '{}',
      searchFields = '{}',
      sort = '{}'
    } = query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
    const parsedSearchFields = typeof searchFields === 'string' ? JSON.parse(searchFields) : searchFields;
    const parsedSort = typeof sort === 'string' ? JSON.parse(sort) : sort;

    // Base filter: only vendors, not deleted
    const filter = { role: 'vendor', deletedAt: null };

    // Add additional filters
    for (const [key, value] of Object.entries(parsedFilters)) {
      filter[key] = value;
    }

    // Add search fields (partial match)
    const searchConditions = [];
    for (const [field, term] of Object.entries(parsedSearchFields)) {
      searchConditions.push({ [field]: { $regex: term, $options: 'i' } });
    }
    if (searchConditions.length > 0) {
      filter.$or = searchConditions;
    }

    // Sort
    const sortConditions = {};
    for (const [field, direction] of Object.entries(parsedSort)) {
      sortConditions[field] = direction === 'asc' ? 1 : -1;
    }

    // Pagination
    const skip = (pageNum - 1) * limitNum;

    // Query
    const results = await Admin.find(filter)
      .sort(sortConditions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalDocuments = await Admin.countDocuments(filter);

    return {
      results,
      totalDocuments,
      currentPage: pageNum,
      totalPages: Math.ceil(totalDocuments / limitNum),
    };
  }
  
}

export default VendorRepository;
