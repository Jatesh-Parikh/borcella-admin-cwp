import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export const GET = async (
  req: NextRequest,
  { params }: { params: { query: string } }
) => {
  try {
    noStore();
    await connectToDB();

    const searchedProducts = await Product.find({
      $or: [
        { title: { $regex: params.query, $options: "i" } },
        { category: { $regex: params.query, $options: "i" } },
        { tags: { $in: [new RegExp(params.query, "i")] } }, // $in is used to match an array of values
      ],
    });

    return NextResponse.json(searchedProducts, { status: 200 });
  } catch (err) {
    console.log("[search_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
