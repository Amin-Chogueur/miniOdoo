// import { connectToDB } from "@/db/connectToDb";
// import Tool from "@/db/models/toolModel";
// // your MongoDB connection

// import fs from "fs";
// import path from "path";

// export async function GET(req) {
//   try {
//     await connectToDB();

//     // Read tools.json
//     const filePath = path.join(process.cwd(), "tools.json");
//     const toolsData = JSON.parse(fs.readFileSync(filePath, "utf8"));

//     // Insert or update each tool
//     for (const tool of toolsData) {
//       await Tool.updateOne(
//         { code: tool.code },
//         { $set: tool },
//         { upsert: true }
//       );
//     }

//     return new Response(
//       JSON.stringify({ success: true, message: "Tools seeded!" }),
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     console.error(error);
//     return new Response(
//       JSON.stringify({ success: false, error: error.message }),
//       {
//         status: 500,
//       }
//     );
//   }
// }
