import { auth, getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";


// Configure Cloudinary 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(request) {
    try {

        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return new Response(JSON.stringify({ success: false, message: "Unauthorized. Only sellers can add products." }), { status: 401 });
        }

        const formData = await request.formData();

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        
        const files = formData.getAll('images');

        if (!files || files.length === 0) {
            return new Response(JSON.stringify({ success: false, message: "Please upload at least one image." }), { status: 400 });
        }

        const result = await Promise.all(
            files.map(async (file) => {
                const arraybuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arraybuffer);

                return new Promise((resolve, reject) => {
                  const stream =  cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    )
                    stream.end(buffer);
                });
            })
        );

        const image = result.map( result => result.secure_url);

        await connectDB();
        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            images: image,
            date: Date.now()
        })

        return NextResponse.json({ success: true, message: "Product added successfully", product: newProduct }, { status: 201 });
   
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}
