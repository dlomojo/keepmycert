import OpenAI from 'openai';
import { put } from '@vercel/blob';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, { access: 'public' });
    
    // Parse with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract certificate information from this document. Return JSON with:
              {
                "title": "certification name",
                "issuer": "issuing organization", 
                "certificateNumber": "certificate ID/number",
                "acquiredOn": "issue date (YYYY-MM-DD)",
                "expiresOn": "expiry date (YYYY-MM-DD)",
                "holderName": "certificate holder name"
              }`
            },
            {
              type: "image_url",
              image_url: { url: blob.url }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('No completion received');
    }

    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content || '{}');
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid response format');
    }
    
    // Sanitize and validate output
    const sanitizeString = (str: unknown) => {
      if (typeof str !== 'string') return null;
      return str.replace(/<[^>]*>/g, '').trim().slice(0, 200);
    };
    
    const validateDate = (dateStr: unknown) => {
      if (typeof dateStr !== 'string') return null;
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : dateStr;
    };
    
    return Response.json({ 
      success: true, 
      data: {
        title: sanitizeString(result.title),
        issuer: sanitizeString(result.issuer),
        certificateNumber: sanitizeString(result.certificateNumber),
        acquiredOn: validateDate(result.acquiredOn),
        expiresOn: validateDate(result.expiresOn),
        holderName: sanitizeString(result.holderName)
      },
      fileUrl: blob.url 
    });
    
  } catch (error) {
    console.error('Document parse error:', error);
    return Response.json({ 
      error: 'Failed to parse document' 
    }, { status: 500 });
  }
}