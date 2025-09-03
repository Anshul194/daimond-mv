import dbConnect from '../../lib/mongodb.js';
import City from "../../models/city.js";
import State from "../../models/state.js";

export async function GET(request) {
  try {
    await dbConnect();

    // Extract stateId from query parameters
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get('stateId');

    if (!stateId) {
      return new Response(JSON.stringify({ error: "State ID is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Verify state exists
    const state = await State.findById(stateId);
    if (!state) {
      return new Response(JSON.stringify({ error: "State not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Fetch cities for the given state
    const cities = await City.find({ state: stateId }).select('name _id');

    return new Response(JSON.stringify(cities), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch cities" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}