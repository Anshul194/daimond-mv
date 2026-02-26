import dbConnect from '../../lib/mongodb.js';
import { createStory, getStories } from '../../controllers/storyController.js';
import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '../../middlewares/commonAuth.js';

export async function POST(request) {
    try {
        await dbConnect();
        const authResult = await verifyAdminAccess(request);
        if (authResult.error) return authResult.error;

        const result = await createStory(request);
        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }
}

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const query = Object.fromEntries(searchParams.entries());
        const result = await getStories(query);
        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
