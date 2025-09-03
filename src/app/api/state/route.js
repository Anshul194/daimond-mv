import dbConnect from '../../lib/mongodb.js';
import State from "../../models/state.js";
import Country from "../../models/country.js";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('countryId');

    if (!countryId) {
      return new Response(JSON.stringify({ error: "Country ID is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Verify country exists
    const country = await Country.findById(countryId);
    if (!country) {
      return new Response(JSON.stringify({ error: "Country not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Fetch states for the given country
    const states = await State.find({ country: countryId }).select('name _id');

    return new Response(JSON.stringify(states), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch states" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}