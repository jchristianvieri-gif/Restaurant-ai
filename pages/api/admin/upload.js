import { extractProductInfoFromImage } from '../../../lib/langchain-extract';
import { manualProductExtraction } from '../../../lib/ai-fallback';
import { createClient } from '@supabase/supabase-js';
import { IncomingForm } from 'formidable';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data menggunakan formidable
    const form = new IncomingForm();
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    if (!files.image) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageFile = files.image[0];
    console.log('File received:', imageFile.originalFilename);

    // Read file buffer
    const imageBuffer = fs.readFileSync(imageFile.filepath);

    let productInfo;
    try {
      // Coba ekstrak dengan AI pertama
      productInfo = await extractProductInfoFromImage(imageBuffer);
      console.log('AI Extraction success:', productInfo);
    } catch (aiError) {
      console.log('AI Extraction failed, using fallback:', aiError.message);
      // Fallback ke manual extraction
      productInfo = manualProductExtraction({ originalname: imageFile.originalFilename });
      console.log('Fallback extraction:', productInfo);
    }

    // Upload image to Supabase Storage
    const fileName = `products/${Date.now()}-${imageFile.originalFilename}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageBuffer, {
        contentType: imageFile.mimetype,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    // Save product to database
    const { data: productData, error: dbError } = await supabase
      .from('products')
      .insert([
        {
          name: productInfo.name,
          description: productInfo.description,
          price: productInfo.price,
          image_url: urlData.publicUrl,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to save product' });
    }

    // Clean up temporary file
    fs.unlinkSync(imageFile.filepath);

    res.status(200).json({
      success: true,
      product: productData[0],
      ai_extraction: productInfo,
      used_fallback: !process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_ai_key_here'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
