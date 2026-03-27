import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb.js';
import * as instagramController from '../../../controllers/instagramController.js';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const authResult = await verifyAdminAccess(request);
        if (authResult.error) return authResult.error;

        const resolvedParams = await params;
        const result = await instagramController.updateReel(resolvedParams.id, request);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const authResult = await verifyAdminAccess(request);
        if (authResult.error) return authResult.error;

        const resolvedParams = await params;
        const result = await instagramController.deleteReel(resolvedParams.id);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
