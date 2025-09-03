import ColorCode from '../models/ColorCode.js';
import mongoose from 'mongoose';
import slugify from 'slugify';

class ColorCodeRepository {
  async findAll() {
    try {
      return await ColorCode.find({ deletedAt: null }).sort({ createdAt: -1 });
    } catch (err) {
      console.error('Repo findAll error:', err);
      throw err;
    }
  }

  async getAll(filterConditions, sortConditions, page, limit) {
  try {
    const skip = (page - 1) * limit;

    const query = ColorCode.find(filterConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const results = await query.exec();
    const totalDocuments = await ColorCode.countDocuments(filterConditions);

    return {
      results,
      totalDocuments,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
    };
  } catch (error) {
    console.error('ColorCodeRepo getAll error:', error);
    throw error;
  }
}


  async findById(id) {
    try {
      return await ColorCode.findOne({ _id: id, deletedAt: null });
    } catch (err) {
      console.error('Repo findById error:', err);
      throw err;
    }
  }

  async findByName(name) {
    try {
      return await ColorCode.findOne({ name: name, deletedAt: null });
    } catch (err) {
      console.error('Repo findByName error:', err);
      throw err;
    }
  }

  async findByColorCode(colorCode) {
    try {
      return await ColorCode.findOne({ colorCode: colorCode, deletedAt: null });
    } catch (err) {
      console.error('Repo findByColorCode error:', err);
      throw err;
    }
  }


async create(data) {
  // Check for duplicates by name
  const existingName = await this.findByName(data.name);
  if (existingName) {
    throw new Error('ColorCode with this name already exists');
  }

  // Check for duplicates by color code
  const existingCode = await this.findByColorCode(data.colorCode);
  if (existingCode) {
    throw new Error('ColorCode with this color code already exists');
  }

  // Create and save
  const colorCode = new ColorCode(data);
  return colorCode.save();
}


async update(id, data) {
  try {
    const colorCodeDoc = await ColorCode.findById(id);
    if (!colorCodeDoc) return null;

    // Check duplicate name if changed
    if (data.name && data.name !== colorCodeDoc.name) {
      const existingName = await ColorCode.findOne({
        name: data.name,
        deletedAt: null,
        _id: { $ne: id }
      });
      if (existingName) {
        throw new Error('ColorCode with this name already exists');
      }

      // Generate unique slug manually here
      const baseSlug = slugify(data.name, { lower: true, strict: true });
      let uniqueSlug;
      do {
        const randomNumber = Math.floor(100 + Math.random() * 900);
        uniqueSlug = `${baseSlug}-${randomNumber}`;
      } while (await ColorCode.exists({ slug: uniqueSlug, deletedAt: null, _id: { $ne: id } }));

      data.slug = uniqueSlug;  // override slug in update data
    }

    // Check duplicate colorCode if changed
    if (data.colorCode && data.colorCode !== colorCodeDoc.colorCode) {
      const existingCode = await ColorCode.findOne({
        colorCode: data.colorCode,
        deletedAt: null,
        _id: { $ne: id }
      });
      if (existingCode) {
        throw new Error('ColorCode with this color code already exists');
      }
    }

    // Set new data, including new slug if generated
    colorCodeDoc.set(data);

    return await colorCodeDoc.save();

  } catch (err) {
    console.error('Repo update error:', err);
    throw err;
  }
}




  async delete(id) {
    try {
      console.log('Repo delete called with:', id);
      // Soft delete by setting deletedAt timestamp
      return await ColorCode.findByIdAndUpdate(
        id, 
        { deletedAt: new Date() }, 
        { new: true }
      );
    } catch (err) {
      console.error('Repo delete error:', err);
      throw err;
    }
  }

  // Method for permanent deletion (if needed)
  async permanentDelete(id) {
    try {
      console.log('Repo permanent delete called with:', id);
      return await ColorCode.findByIdAndDelete(id);
    } catch (err) {
      console.error('Repo permanent delete error:', err);
      throw err;
    }
  }
}

export default ColorCodeRepository;