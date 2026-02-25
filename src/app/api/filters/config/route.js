import dbConnect from '../../../lib/mongodb.js';
import ProductAttribute from '../../../models/productAttribute.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await dbConnect();

        // Fetch relevant attributes
        const attributes = await ProductAttribute.find({
            title: { $in: [/shape/i, /metal type/i, /stone/i, /carat/i] },
            deletedAt: null
        }).lean();

        const config = {
            shapes: [],
            metals: [],
            stones: [],
            carats: []
        };

        attributes.forEach(attr => {
            const title = attr.title.toLowerCase();
            const terms = attr.terms || [];

            if (title.includes('shape')) {
                config.shapes = terms;
            } else if (title.includes('metal')) {
                config.metals = terms;
            } else if (title.includes('stone')) {
                config.stones = terms;
            } else if (title.includes('carat')) {
                config.carats = terms;
            }
        });

        return NextResponse.json({
            success: true,
            data: config
        });
    } catch (err) {
        console.error('GET /api/filters/config error:', err);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
