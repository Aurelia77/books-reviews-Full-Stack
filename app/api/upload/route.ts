import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, file.name);
  try {
    await writeFile(filePath, buffer);
    return NextResponse.json({
      url: `/uploads/${file.name}`,
    });
  } catch (e) {
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  }
}
