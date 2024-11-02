import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import db from "@/lib/prismaDb"; // Adjust path to your Prisma instance
import { NextResponse } from "next/server";

export  async function POST(req: NextApiRequest, res: NextApiResponse) {
    const data= await req.json();
    console.log(data)
  const { username, password ,name ,email}  =data

  console.log(username, password ,name ,email)


  try {
    // Check if username or email already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          {username: username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await db.user.create({
      data: {
        name:name,
        username:username,
        email:email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal server error" });
  }
}
