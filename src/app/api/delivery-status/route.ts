import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Status from "@/models/Status";

// GET delivery status
export async function GET() {
  await dbConnect();

  try {
    const status = await Status.findOne();
    if (!status) {
      return NextResponse.json(
        {
          success: true,
          data: status,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: status,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching status",
      },
      { status: 500 }
    );
  }
}

// UPDATE delivery status to true
export async function POST() {
  await dbConnect();

  try {
    const status = await Status.findOne();
    if (!status) {
      let newStatus = await Status.create({ delivering: true });
      newStatus.save();
      return NextResponse.json(
        {
          success: false,
          message: "Status not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: status,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching status",
      },
      { status: 500 }
    );
  }
}
