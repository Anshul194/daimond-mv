import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import Product from "../../../models/Product";
import ProductInventory from "../../../models/ProductInventory";
import dbConnect from "../../../lib/mongodb.js";
import ProductInventoryDetailAttribute from "@/app/models/ProductInventoryDetailAttribute";

export async function POST(req) {
  try {
    await dbConnect(); // ensure database is connected

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (!jsonData.length) {
      return NextResponse.json(
        { error: "Excel file is empty or invalid" },
        { status: 400 }
      );
    }

    const insertedProducts = [];
    const updatedProducts = [];

    for (const [index, row] of jsonData.entries()) {
      const name = row.name || row.Name;
      const sku = row.sku || row.SKU;
      const categoryId = row.category_id || row.CategoryID;

      if (!name || !categoryId || !sku) {
        console.warn(
          `⚠️ Skipping row ${index + 1}: Missing name/category_id/sku`
        );
        continue;
      }

      const product = await Product.findOne({ name, deletedAt: null });
      const inventory = await ProductInventory.findOne({
        sku,
        deletedAt: null,
      });

      // ✅ If product and inventory exist, update both
      if (product && inventory) {
        await Product.findByIdAndUpdate(product._id, {
          price: parseFloat(row.price || row.Price) || product.price,
          saleprice: parseFloat(row.saleprice || product.saleprice) || null,
          cost: parseFloat(row.cost || product.cost) || null,
          description: row.description || product.description,
          category_id: categoryId,
          subCategory_id: row.subCategory_id || product.subCategory_id,
          status: row.status || product.status,
          badge: row.badge || product.badge,
          brand: row.brand || product.brand,
          productType: row.productType || product.productType,
          soldCount: row.soldCount || product.soldCount,
          minPurchase: row.minPurchase || product.minPurchase,
          maxPurchase: row.maxPurchase || product.maxPurchase,
          isRefundable: row.isRefundable ?? product.isRefundable,
          isInHouse: row.isInHouse ?? product.isInHouse,
          isInventoryWarnAble:
            row.isInventoryWarnAble ?? product.isInventoryWarnAble,
          admin: row.admin || product.admin,
          vendor: row.vendor || product.vendor,
          isTaxable: row.isTaxable ?? product.isTaxable,
          taxClass: row.taxClass || product.taxClass,
          is_diamond: row.is_diamond ?? product.is_diamond,
        });

        await ProductInventory.findByIdAndUpdate(inventory._id, {
          stock_count: row.stock_count || inventory.stock_count,
          sold_count: row.sold_count || inventory.sold_count,
        });

        const att = [];
        if (row.Shape) {
          att.push({
            name: "Shape",
            value: row.Shape,
          });
        }

        if (row.SETTING) {
          att.push({
            name: "Setting",
            value: row.SETTING,
          });
        }

        if (row["BAND TYPE"]) {
          att.push({
            name: "Band Type",
            value: row["BAND TYPE"],
          });
        }

        if (row.Style) {
          att.push({
            name: "Style",
            value: row.Style,
          });
        }

        await Promise.all(
          att.map(async (attribute) => {
            const exisAtt = await ProductInventoryDetailAttribute.findOne({
              attribute_name: attribute.name,
              inventory_details_id: inventory._id,
              product_id: product._id,
            });
            if (exisAtt) {
              await ProductInventoryDetailAttribute.findByIdAndUpdate(
                exisAtt._id,
                {
                  attribute_name: attribute.name,
                  attribute_value: attribute.value,
                }
              );
            } else {
              await ProductInventoryDetailAttribute.create({
                inventory_details_id: inventory._id,
                product_id: product._id,
                attribute_name: attribute.name,
                attribute_value: attribute.value,
              });
            }
          })
        );
        updatedProducts.push({ name, sku });
        continue;
      }

      // ✅ Else: insert new product
      const newProduct = await Product.create({
        name,
        price: parseFloat(row.price || row.Price) || null,
        category_id: categoryId,
        subCategory_id: row.subCategory_id || null,
        description: row.description || "",
        saleprice: parseFloat(row.saleprice || 0) || null,
        cost: parseFloat(row.cost || 0) || null,
        badge: row.badge || null,
        brand: row.brand || null,
        status: row.status || "active",
        productType: row.productType || 1,
        soldCount: row.soldCount || null,
        minPurchase: row.minPurchase || null,
        maxPurchase: row.maxPurchase || null,
        isRefundable: row.isRefundable || false,
        isInHouse: row.isInHouse ?? true,
        isInventoryWarnAble: row.isInventoryWarnAble || false,
        admin: row.admin || null,
        vendor: row.vendor || null,
        isTaxable: row.isTaxable || false,
        taxClass: row.taxClass || null,
        is_diamond: row.is_diamond || false,
      });

      const newInventory = await ProductInventory.create({
        product: newProduct._id,
        sku,
        stock_count: row.stock_count || 0,
        sold_count: row.sold_count || 0,
      });

      console.log(row);
      const att = [];
      if (row.Shape) {
        att.push({
          name: "Shape",
          value: row.Shape,
        });
      }

      if (row.SETTING) {
        att.push({
          name: "Setting",
          value: row.SETTING,
        });
      }

      if (row["BAND TYPE"]) {
        att.push({
          name: "Band Type",
          value: row["BAND TYPE"],
        });
      }

      if (row.Style) {
        att.push({
          name: "Style",
          value: row.Style,
        });
      }

      console.log("Inventory Attributes:", newInventory);
      console.log("product :", newProduct);

      await Promise.all(
        att.map(async (attribute) => {
          await ProductInventoryDetailAttribute.create({
            inventory_details_id: newInventory._id,
            product_id: newProduct._id,
            attribute_name: attribute.name,
            attribute_value: attribute.value,
          });
        })
      );

      insertedProducts.push({ name, sku });
    }

    return NextResponse.json({
      message: "Bulk upload completed",
      insertedCount: insertedProducts.length,
      updatedCount: updatedProducts.length,
      insertedProducts,
      updatedProducts,
    });
  } catch (error) {
    console.error("🔥 Bulk Upload Error:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
