import { getContent, updateContent } from '../../controllers/greenBoxController.js';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb.js';

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        await dbConnect();
        const result = await getContent();
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const authResult = await verifyAdminAccess(request);
        if (authResult.error) return authResult.error;

        const result = await updateContent(request);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
