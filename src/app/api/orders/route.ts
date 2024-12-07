import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import mongoose from "mongoose";

// CREATE a new order
export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await mongoose.startSession();
  let ordered: String[] = [];

  try {
    // Start transaction
    session.startTransaction();

    const { name, roomNumber, items, delivery } = await req.json();

    // Validate and process order items
    const processedItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await Product.findById(item.id);

        if (!product) {
          throw new Error(`Product ${item.id} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        // Reduce stock
        // product.stock -= item.quantity;
        // await product.save({ session });
        ordered.push(product.name);

        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    // Calculate total amount
    let totalAmount = processedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    if (delivery) {
      totalAmount += 7;
    }

    // Create order
    const order = await Order.create(
      [
        {
          name,
          roomNumber,
          items: processedItems,
          totalAmount,
          delivery,
        },
      ],
      { session }
    );

    try {
      //   const transporter = nodemailer.createTransport({
      //     service: "gmail",
      //     host: "smtp.gmail.com",
      //     port: 465,
      //     secure: true,
      //     auth: {
      //       user: process.env.NEXT_PUBLIC_EMAIL,
      //       pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      //     },
      //   });

      //   const mailOptions = {
      //     from: process.env.NEXT_PUBLIC_EMAIL,
      //     to: process.env.NEXT_PUBLIC_EMAIL,
      //     subject: "New Order",
      //     text: `New order from ${name} in room ${roomNumber} with total amount of ${totalAmount},\n delivery needed: ${delivery}, \n items:
      //     ${
      //       ordered.length > 0
      //         ? ordered.map((item) => {
      //             return item;
      //           })
      //         : "No items"
      //     }
      //     `,
      //   };

      //   transporter.sendMail(mailOptions, function (error, info) {
      //     if (error) {
      //       throw new Error("Error sending email");
      //     } else {
      //       console.log("Email sent: " + info.response);
      //     }

      const text = `New order from ${name} in room ${roomNumber} with total amount of ${totalAmount},\n delivery needed: ${delivery}, \n items:
    ${
      ordered.length > 0
        ? ordered.map((item) => {
            return item;
          })
        : "No items"
    }
    `;
      fetch("https://hostel-mart-server.onrender.com", {
        method: "GET",
      });

      fetch("https://hostel-mart-server.onrender.com/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          id: order[0]._id,
        }),
      }).then((response) => {
        if (response.ok) {
          console.log("Message sent");
        } else {
          throw new Error("Error sending message");
        }
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error sending message",
        },
        { status: 400 }
      );
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      {
        success: true,
        data: order[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Abort transaction
    await session.abortTransaction();
    session.endSession();

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error creating order",
      },
      { status: 400 }
    );
  }
}

// GET all orders
export async function GET() {
  await dbConnect();

  try {
    const orders = await Order.find({}).populate("items.product");
    return NextResponse.json(
      {
        success: true,
        data: orders,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching orders",
      },
      { status: 500 }
    );
  }
}
