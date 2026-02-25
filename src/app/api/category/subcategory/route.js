import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb.js';
import CategoryService from '../../../services/categoryService.js';

export async function GET(request) {
    try {
        // Connect to database first
        try {
            await dbConnect();
            console.log('Database connected successfully for /category/subcategory');
        } catch (dbError) {
            console.error('Database connection error in /category/subcategory:', dbError.message);
            return NextResponse.json({ 
                success: false, 
                message: 'Database connection failed. Please check your MongoDB connection string and ensure MongoDB is running.',
                error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
            }, { status: 503 }); // 503 Service Unavailable for connection issues
        }

        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        console.log('GET /category/subcategory - categoryId:', categoryId);

        if (!categoryId) {
            return NextResponse.json(
                { success: false, message: 'categoryId is required' },
                { status: 400 }
            );
        }

        // Instantiate the service and call the method
        const categoryService = new CategoryService();
        const subCategories = await categoryService.getSubCategoriesByCategoryId(categoryId);
        console.log('GET /category/subcategory - Found subcategories:', subCategories?.length || 0);

        // Return with body wrapper to match frontend expectation: response.data.body.data
        return NextResponse.json(
            {
                body: {
                    success: true,
                    message: 'Subcategories fetched successfully',
                    data: subCategories,
                }
            },
            { status: 200 }
        );
    } catch (err) {
        console.error('Error in GET /category/subcategory:', err.message);
        console.error('Error stack:', err.stack);
        
        // Check if it's a database connection error
        if (err.message && (err.message.includes('ECONNREFUSED') || err.message.includes('MongoDB connection'))) {
            return NextResponse.json({ 
                success: false, 
                message: 'Database connection failed. Please check your MongoDB connection.',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            }, { status: 503 });
        }
        
        return NextResponse.json(
            { success: false, message: err.message || 'Internal server error' },
            { status: 500 }
        );
    }
}