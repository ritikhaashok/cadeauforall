import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const phone = formData.get("phone");
    const description = formData.get("description") || "";
    const file = formData.get("image");

    if (!phone || !String(phone).trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    let imageUrl = null;

    if (file && file.size) {
      const originalName = file.name || `upload-${Date.now()}`;
      const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9_.-]/g, "-")}`;

      // Try uploading to Supabase storage first (preferred)
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("contact-uploads")
          .upload(safeName, buffer, { contentType: file.type });

        if (uploadError) {
          console.warn("Supabase storage upload error:", uploadError.message || uploadError);
        } else if (uploadData) {
          const { data: pub } = supabase.storage.from("contact-uploads").getPublicUrl(safeName);
          imageUrl = pub?.publicUrl || null;
        }
      } catch (supErr) {
        console.warn("Supabase storage upload exception:", supErr);
      }

      // Fallback to saving locally if Supabase upload failed
      if (!imageUrl) {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await fs.promises.mkdir(uploadsDir, { recursive: true });
        const filePath = path.join(uploadsDir, safeName);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.promises.writeFile(filePath, buffer);
        imageUrl = `/uploads/${safeName}`;
      }
    }

    // Insert into Supabase table `contact_submissions` when available
    try {
      const { data: insertData, error: insertError } = await supabase
        .from("contact_submissions")
        .insert([{ phone: String(phone).trim(), description: String(description), image_url: imageUrl }]);

      if (insertError) {
        console.warn("Supabase insert error for contact_submissions:", insertError.message || insertError);
      }
    } catch (e) {
      console.warn("Supabase insert exception:", e);
    }

    // Also persist locally to contact_submissions.json for easy review during development
    const submissionsPath = path.join(process.cwd(), "contact_submissions.json");
    let existing = [];
    try {
      const raw = await fs.promises.readFile(submissionsPath, "utf8");
      existing = JSON.parse(raw);
    } catch (e) {
      existing = [];
    }

    const entry = {
      id: Date.now(),
      phone: String(phone).trim(),
      description: String(description),
      image: imageUrl,
      created_at: new Date().toISOString(),
    };

    existing.push(entry);
    await fs.promises.writeFile(submissionsPath, JSON.stringify(existing, null, 2));

    // Send email notification to site owner if configured
    try {
      const { sendContactEmail } = await import('@/lib/mail');

      const recipient = process.env.CONTACT_RECIPIENT_EMAIL;
      if (recipient) {
        const subject = `New contact submission - ${new Date().toLocaleString()}`;
        const text = `Phone: ${entry.phone}\nDescription: ${entry.description}\nImage: ${entry.image || 'none'}\nReceived: ${entry.created_at}`;
        const html = `<p><strong>Phone:</strong> ${entry.phone}</p><p><strong>Description:</strong> ${entry.description || '(none)'}</p><p><strong>Image:</strong> ${entry.image ? `<a href="${entry.image}">${entry.image}</a>` : 'none'}</p><p><small>Received: ${entry.created_at}</small></p>`;

        // if we have a local file (starts with /uploads/) attach it
        const attachments = [];
        if (entry.image && entry.image.startsWith('/uploads/')) {
          try {
            const filePath = path.join(process.cwd(), 'public', entry.image.replace(/^\//, ''));
            const buffer = await fs.promises.readFile(filePath);
            attachments.push({ filename: path.basename(filePath), content: buffer, contentType: 'image/*' });
          } catch (e) {
            // ignore file read errors
          }
        }

        await sendContactEmail({ to: recipient, subject, text, html, attachments });
      }
    } catch (mailErr) {
      console.warn('Error sending contact notification email:', mailErr);
    }

    return NextResponse.json({ success: true, entry, imageUrl });
  } catch (err) {
    console.error("/api/contact/submit error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
