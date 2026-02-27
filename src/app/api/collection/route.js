import { NextResponse } from "next/server";
import { getAllCollections, createCollection } from "../../controllers/collectionController.js";
import dbConnect from "../../lib/mongodb.js";

export async function GET(req) {
    try {
        await dbConnect();
        const response = await getAllCollections(req);
        return NextResponse.json(response, { status: response.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const response = await createCollection(req);
        return NextResponse.json(response, { status: response.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
