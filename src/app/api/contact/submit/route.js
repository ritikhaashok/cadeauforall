import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const phone = body?.phone;
    const description = body?.description || "";

    if (!phone || !String(phone).trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // No image handling for contact submissions - keep contact form text-only
    const imageUrl = null;

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
        const text = `Phone: ${entry.phone}\nDescription: ${entry.description}\nReceived: ${entry.created_at}`;
        const html = `<p><strong>Phone:</strong> ${entry.phone}</p><p><strong>Description:</strong> ${entry.description || '(none)'}</p><p><small>Received: ${entry.created_at}</small></p>`;

        await sendContactEmail({ to: recipient, subject, text, html, attachments: [] });
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
