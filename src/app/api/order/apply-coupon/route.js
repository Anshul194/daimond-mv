import dbConnect from '../../../lib/mongodb.js';
import { applyCouponToOrder } from '../../../controllers/orderController.js';

export async function POST(request) {
    try {
        await dbConnect();
        return await applyCouponToOrder(request);
    } catch (err) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}