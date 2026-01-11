import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const promptsDir = path.join(process.cwd(), "public/data/prompts");
    const folders = fs
      .readdirSync(promptsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error reading prompts directory:", error);
    return NextResponse.json([], { status: 500 });
  }
}
