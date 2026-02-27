import { NextResponse } from "next/server";
import { updateCollection, deleteCollection } from "../../../controllers/collectionController.js";
import dbConnect from "../../../lib/mongodb.js";

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const response = await updateCollection(req, { params });
        return NextResponse.json(response, { status: response.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const response = await deleteCollection(req, { params });
        return NextResponse.json(response, { status: response.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
