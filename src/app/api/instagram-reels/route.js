import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb.js';
import * as instagramController from '../../controllers/instagramController.js';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';
import { parseFormData } from '../../middlewares/uploadMiddleware.js';
import { saveFile } from '../../lib/fileUpload.js';

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

        const ct = request.headers.get('content-type') || '';
        let body;
        if (ct.includes('multipart/form-data') || ct.includes('application/x-www-form-urlencoded')) {
            const { fields, files } = await parseFormData(request);
            body = { ...fields };
            if (files.image) {
                body.image = await saveFile(files.image, 'instagram-reels');
            }
        } else {
            body = await request.json();
        }

        const result = await instagramController.createReel(body);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
