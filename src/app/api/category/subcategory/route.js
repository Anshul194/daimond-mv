import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb.js';
import CategoryService from '../../../services/categoryService.js';

export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');

        if (!categoryId) {
            return NextResponse.json(
                { success: false, message: 'categoryId is required' },
                { status: 400 }
            );
        }

        // Instantiate the service and call the method
        const categoryService = new CategoryService();
        const subCategories = await categoryService.getSubCategoriesByCategoryId(categoryId);

        return NextResponse.json(
            {
                success: true,
                message: 'Subcategories fetched successfully',
                data: subCategories,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error('Error in GET:', err.message);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}