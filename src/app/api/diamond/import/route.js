import dbConnect from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { getDiamonds } from "../../../controllers/diamondController.js";
import * as XLSX from "xlsx";
import Diamond from "@/app/models/diamond";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const excelFile = formData.get("file");

    if (!excelFile || !excelFile.name.endsWith(".xlsx")) {
      return NextResponse.json(
        { success: false, message: "Invalid Excel file (must be .xlsx)" },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await excelFile.arrayBuffer());

    // Read workbook
    const workbook = XLSX.read(buffer);
    const sheetNames = workbook.SheetNames;

    let totalImported = 0;
    let totalSkipped = 0;

    console.log("📋 Sheets found:", sheetNames);

    for (const sheetName of sheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      console.log(
        `📄 Processing sheet: ${sheetName} with ${jsonData.length} rows`
      );

      for (const row of jsonData) {
        try {
          // Validate required fields
          if (!row["SHAPE"] || isNaN(parseFloat(row["Weight"]))) {
            console.warn("⚠️ Skipping invalid row:", row);
            totalSkipped++;
            continue;
          }

          const checkExisting = await Diamond.findOne({
            certino: row["CERTINO"],
          });

          console.log(" ==>  " + row["CLARITY"]);

          if (checkExisting) {
            await Diamond.findByIdAndUpdate(checkExisting._id, {
              clarity: row["CLARITY"],
              shape: row["SHAPE"],
              weight: parseFloat(row["Weight"]),
              color: row["COLOR"],
              cut: row["CUT"],
              polish: row["POLISH"],
              symm: row["SYMM"],
              lab: row["LAB"],
              measurements: row["MEASUREMENTS"],
              net: parseFloat(row["NET $"]),
              video: row["View Video"],
              viewCart: row["View Cert"],
            });
          } else {
            await Diamond.create({
              clarity: row["CLARITY"],
              shape: row["SHAPE"],
              weight: parseFloat(row["Weight"]),
              color: row["COLOR"],
              cut: row["CUT"],
              polish: row["POLISH"],
              symm: row["SYMM"],
              lab: row["LAB"],
              certino: row["CERTINO"],
              measurements: row["MEASUREMENTS"],
              net: parseFloat(row["NET $"]),
              video: row["View Video"],
              viewCart: row["View Cert"],
            });
          }

          totalImported++;
        } catch (err) {
          console.error(`❌ Insert failed (sheet: ${sheetName}):`, err.message);
          totalSkipped++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "All sheets processed",
      stats: {
        totalImported,
        totalSkipped,
        sheetsProcessed: sheetNames.length,
        sheetNames,
      },
    });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = await getDiamonds(query);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error("GET /diamond error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
