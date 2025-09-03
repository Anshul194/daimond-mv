import BlogService from '../services/blogService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';
import initRedis from '../config/redis.js';

const blogService = new BlogService();
const redis = initRedis();

export async function createBlog(form) {
  try {
    const title = form.get('title');
    const description = form.get('description');
    const content = form.get('content');
    const BlogCategory = form.get('BlogCategory');
    const BlogSubCategory = form.get('BlogSubCategory') || null;

    let coverImage = '', thumbnailImage = '';

    const coverFile = form.get('coverImage');
    const thumbFile = form.get('thumbnailImage');

    if (coverFile instanceof File) {
      validateImageFile(coverFile);
      coverImage = await saveFile(coverFile, 'blog-cover-images');
    }

    if (thumbFile instanceof File) {
      validateImageFile(thumbFile);
      thumbnailImage = await saveFile(thumbFile, 'blog-thumbnail-images');
    }

    const blogData = {
      title,
      description,
      content,
      BlogCategory,
      BlogSubCategory,
      coverImage,
      thumbnailImage
    };

    const created = await blogService.create(blogData);

    // ❌ Clear Redis cache
    await redis.del('allBlogs');

    return {
      status: 201,
      body: successResponse(created, 'Blog created successfully')
    };
  } catch (err) {
    return {
      status: 500,
      body: errorResponse('Server error', 500, err.message)
    };
  }
}


export async function getAllBlogs(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const filters = searchParams.get('filters') || searchParams.get('searchFields') || '{}';

    const sort = searchParams.get('sort') || '{}';

    // const cacheKey = `allBlogs:page=${page}&limit=${limit}&filters=${filters}&sort=${sort}`;

    // // ✅ Try Redis cache first
    // const cachedData = await redis.get(cacheKey);
    // if (cachedData) {
    //   return {
    //     status: 200,
    //     body: successResponse(JSON.parse(cachedData), 'Blogs fetched (cache)')
    //   };
    // }

    const query = { page, limit, filters, sort };
    const blogs = await blogService.getAll(query);

    // // ✅ Store in Redis
    // await redis.set(cacheKey, JSON.stringify(blogs));

    return {
      status: 200,
      body: successResponse(blogs, 'Blogs fetched successfully')
    };
  } catch (err) {
    console.error('getAllBlogs controller error:', err);
    return {
      status: 500,
      body: errorResponse('Server error', 500, err.message)
    };
  }
}


export async function getBlogById(id) {
  try {
    const blog = await blogService.getById(id);
    if (!blog) {
      return {
        status: 404,
        body: errorResponse('Blog not found', 404)
      };
    }

    return {
      status: 200,
      body: successResponse(blog, 'Blog fetched')
    };
  } catch (err) {
    return {
      status: 500,
      body: errorResponse('Server error', 500)
    };
  }
}


export async function updateBlog(id, form) {
  try {
    let updateData = {};
    for (let key of ['title', 'description', 'content', 'BlogCategory', 'BlogSubCategory']) {
      const val = form.get(key);
      if (val) updateData[key] = val;
    }

    const coverFile = form.get('coverImage');
    const thumbFile = form.get('thumbnailImage');

    if (coverFile instanceof File) {
      validateImageFile(coverFile);
      updateData.coverImage = await saveFile(coverFile, 'blog-cover-images');
    }

    if (thumbFile instanceof File) {
      validateImageFile(thumbFile);
      updateData.thumbnailImage = await saveFile(thumbFile, 'blog-thumbnail-images');
    }

    const updated = await blogService.update(id, updateData);
    if (!updated) {
      return {
        status: 404,
        body: errorResponse('Blog not found', 404)
      };
    }

    // ❌ Clear Redis cache
    await redis.del('allBlogs');

    return {
      status: 200,
      body: successResponse(updated, 'Blog updated successfully')
    };
  } catch (err) {
    return {
      status: 500,
      body: errorResponse('Server error', 500, err.message)
    };
  }
}


export async function deleteBlog(id) {
  try {
    const deleted = await blogService.delete(id);
    if (!deleted) {
      return {
        status: 404,
        body: errorResponse('Blog not found', 404)
      };
    }

    // ❌ Clear Redis cache
    await redis.del('allBlogs');

    return {
      status: 200,
      body: successResponse(deleted, 'Blog deleted successfully')
    };
  } catch (err) {
    return {
      status: 500,
      body: errorResponse('Server error', 500)
    };
  }
}

// At the top or wherever your function is defined:
export async function getBlogsByCategoryId(categoryId) {
  try {
    const data = await blogService.getBlogsByCategoryId(categoryId);

    return {
      status: 200,
      body: successResponse(data, 'Blogs by category fetched'),
    };
  } catch (err) {
    return {
      status: 500,
      body: errorResponse('Failed to fetch blogs by category', 500),
    };
  }
}

export async function getBlogsBySubCategoryId(subCategoryId) {
  try {
    const data = await blogService.getBlogsBySubCategoryId(subCategoryId);
    return {
      status: 200,
      body: successResponse(data, 'Blogs by subcategory fetched'),
    };
  } catch (err) {
    return {
      status: 500,
      body: errorResponse('Failed to fetch blogs by subcategory', 500),
    };
  }
}




