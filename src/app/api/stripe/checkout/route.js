import dbConnect from "@/app/lib/mongodb";
import OrderSession from "@/app/models/OrderSession";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await dbConnect();
    const {
      cartItems,
      customerDetails,
      totalAmount,
      couponCode,
      couponDiscount,
      tax,
      tax_id,
      taxPercent,
    } = await req.json();

    console.log("Received data:", {
      cartItems,
      customerDetails,
      totalAmount,
      couponCode,
      couponDiscount,
      tax,
      tax_id,
      taxPercent,
    });

    // Defensive server-side tax computation: if `tax` is falsy or zero, compute from totalAmount and taxPercent
    const parsedTotal = Number(totalAmount) || 0;
    const parsedTax = Number(tax) || 0;
    const parsedTaxPercent = Number(taxPercent) || 0;
    const effectiveTaxAmount = parsedTax > 0 ? parsedTax : Math.round((parsedTotal * parsedTaxPercent) / 100 * 100) / 100;

    console.log('Computed tax values:', { parsedTotal, parsedTax, parsedTaxPercent, effectiveTaxAmount });

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.pid_name,
          id: item.pid_id,
        },
        unit_amount: Math.round(Number(item.pid_price) * 100), // ✅ FIXED
      },
      quantity: 1,
    }));

    const orderSession = await OrderSession.create({
      cartItems,
      customerDetails,
      totalAmount,
      couponCode: couponCode || "N/A",
      couponDiscount: couponDiscount || 0,
      // Store the effective tax amount and percent computed server-side
      tax: effectiveTaxAmount,
      taxPercent: parsedTaxPercent,
      tax_id,
    });

    console.log("Order session created:", orderSession);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Order Total",
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Tax (${parsedTaxPercent}%)`,
            },
            unit_amount: Math.max(0, Math.round(effectiveTaxAmount * 100)),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      billing_address_collection: "required",
      customer_email: customerDetails.email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`, // ✅ Add session_id to success URL
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/cancel`,
      metadata: {
        order_id: orderSession._id.toString(), // Store order session ID in metadata
      },
    });

    // Save Stripe session id back to orderSession for correlation
    try {
      await OrderSession.findByIdAndUpdate(orderSession._id, { sessionId: session.id });
    } catch (e) {
      console.warn('Failed to save sessionId to OrderSession:', e.message);
    }

    return Response.json({ id: session.id });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
