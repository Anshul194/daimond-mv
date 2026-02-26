import dbConnect from '../../../lib/mongodb.js';
import { updateStory, deleteStory } from '../../../controllers/storyController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const authResult = await verifyAdminAccess(request);
        if (authResult.error) return authResult.error;

        const awaitedParams = await params;
        const { id } = awaitedParams;
        const result = await updateStory(id, request);
        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const authResult = await verifyAdminAccess(request);
        if (authResult.error) return authResult.error;

        const awaitedParams = await params;
        const { id } = awaitedParams;
        const result = await deleteStory(id);
        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
