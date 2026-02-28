import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb.js';
import * as instagramController from '../../controllers/instagramController.js';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await dbConnect();
        const result = await instagramController.getReels(request);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const authResult = await verifyAdminAccess(request);
        if (authResult.error) return authResult.error;

        const result = await instagramController.createReel(request);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
