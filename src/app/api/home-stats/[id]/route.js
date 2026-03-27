import { updateStat, deleteStat } from '../../../controllers/homeStatController.js';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb.js';

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const authResult = await verifyAdminAccess(request);
        if (authResult.error) return authResult.error;

        const resolvedParams = await params;
        const result = await updateStat(resolvedParams.id, request);
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
        const result = await deleteStat(resolvedParams.id);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
