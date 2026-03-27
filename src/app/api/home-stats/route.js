import { getStats, createStat } from '../../controllers/homeStatController.js';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb.js';

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const query = Object.fromEntries(searchParams.entries());
        const result = await getStats(query);
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

        const result = await createStat(request);
        return NextResponse.json(result.body, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
