import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

// GET all products
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const products = await Product.find({});
    return NextResponse.json(
      {
        success: true,
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching products",
      },
      { status: 500 }
    );
  }
}

// CREATE a new product
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const productData = await req.json();
    const product = await Product.create(productData);

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating product",
      },
      { status: 400 }
    );
  }
}
