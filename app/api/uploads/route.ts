import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "uploads" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  }
}

// En fait meme avec AXIOS j'avais un pbm de HEADER, puis apparemment c parce qu'il fallait tt gérer côté client (et donc exposé la var d'env) => ce que j'ai fait ms tjs pbm de HEADER !!!
// => donc impossible d'utiliser uploadthing !!! Je vais tenter avec Cloudinary
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import FormData from "form-data";

// export async function POST(req: NextRequest) {
//   const formProfileImgData = await req.formData();
//   const file = formProfileImgData.get("files");
//   if (!file) {
//     return NextResponse.json({ error: "No file" }, { status: 400 });
//   }

//   if (!(file instanceof File)) {
//     return NextResponse.json(
//       { error: "Le fichier est manquant" },
//       { status: 400 }
//     );
//   }

//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   const uploadForm = new FormData();
//   uploadForm.append("files", buffer, {
//     filename: file.name,
//     contentType: file.type,
//     knownLength: buffer.length,
//   });
//   uploadForm.append("route", "profileImage");

//   try {
//     const res = await axios.post(
//       "https://uploadthing.com/api/uploadFiles",
//       uploadForm,
//       {
//         headers: {
//           ...uploadForm.getHeaders(),
//           "x-uploadthing-api-key": process.env.UPLOADTHING_SECRET ?? "",
//         },
//       }
//     );
//     return NextResponse.json(res.data);
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error?.response?.data || "Erreur upload" },
//       { status: 500 }
//     );
//   }
// }

// Avec l'utilisation de uploadthing et FETCH ms pbm =>  quand tu utilises fetch avec un FormData côté serveur, undici ajoute automatiquement un header Content-Type qui n’est pas accepté par uploadthing. => erreur nav : MyAccount.tsx:153 Erreur upload image : {error: 'Invalid HTTP header: Content-Type=multipart/form-data; boundary=----formdata-undici-077267912184'}
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   console.log(
//     "💛💙💚🤎process.env.UPLOADTHING_SECRET ",
//     process.env.UPLOADTHING_SECRET
//   );

//   const formProfileImgData = await req.formData();
//   const file = formProfileImgData.get("files");
//   if (!file) {
//     return NextResponse.json({ error: "No file" }, { status: 400 });
//   }
//   const uploadForm = new FormData();
//   uploadForm.append("files", file);
//   uploadForm.append("route", "profileImage");

//   console.log("💛💙💚❤️🤍🤎uploadForm", uploadForm);

//   const res = await fetch("https://uploadthing.com/api/uploadFiles", {
//     method: "POST",
//     body: uploadForm,
//     headers: {
//       "x-uploadthing-api-key": process.env.UPLOADTHING_SECRET ?? "",
//     },
//   });
//   const data = await res.json();
//   if (!res.ok) {
//     return NextResponse.json(data, { status: res.status });
//   }
//   return NextResponse.json(data);
// }

// Pour stocker les images en local
// import { writeFile } from "fs/promises";
// import { NextRequest, NextResponse } from "next/server";
// import path from "path";

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const file = formData.get("file") as File;
//   if (!file) {
//     return NextResponse.json({ error: "No file" }, { status: 400 });
//   }
//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);
//   const uploadDir = path.join(process.cwd(), "public", "uploads");
//   const filePath = path.join(uploadDir, file.name);
//   try {
//     await writeFile(filePath, buffer);
//     return NextResponse.json({
//       url: `/uploads/${file.name}`,
//     });
//   } catch (e) {
//     return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
//   }
// }
