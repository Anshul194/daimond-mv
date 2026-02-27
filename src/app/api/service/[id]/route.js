import dbConnect from '../../../lib/mongodb.js';
import { getServiceById, updateService, deleteService } from '../../../controllers/serviceController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../../middlewares/commonAuth.js';

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const result = await getServiceById(id);
        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const authResult = await verifyAdminAccess(request);
        if (authResult.error) return authResult.error;

        const { id } = params;
        const result = await updateService(id, request);
        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const authResult = await verifyAdminAccess(request);
        if (authResult.error) return authResult.error;

        const { id } = params;
        const result = await deleteService(id);
        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
