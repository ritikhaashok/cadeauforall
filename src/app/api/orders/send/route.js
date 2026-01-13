import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, address, items } = body || {};

    if (!phone || !String(phone).trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Persist an order locally for easy review
    const ordersPath = path.join(process.cwd(), 'orders.json');
    let existing = [];
    try {
      const raw = await fs.promises.readFile(ordersPath, 'utf8');
      existing = JSON.parse(raw);
    } catch (e) {
      existing = [];
    }

    const entry = { id: Date.now(), name: name || null, phone: String(phone).trim(), address: address || null, items: items || [], created_at: new Date().toISOString() };

    existing.push(entry);
    await fs.promises.writeFile(ordersPath, JSON.stringify(existing, null, 2));

    // Prepare email
    try {
      const { sendContactEmail } = await import('@/lib/mail');
      const recipient = process.env.CONTACT_RECIPIENT_EMAIL;
      if (recipient) {
        const subject = `New order - ${new Date().toLocaleString()}`;
        const textParts = [];
        textParts.push(`Name: ${entry.name || '(none)'}`);
        textParts.push(`Phone: ${entry.phone}`);
        textParts.push(`Address: ${entry.address || '(none)'}`);
        textParts.push('Items:');
        (entry.items || []).forEach((it, idx) => {
          textParts.push(`${idx + 1}. ${it.productName || 'Product'} - qty: ${it.quantity || 1} - $${Number(it.price || 0).toFixed(2)} ${it.customText ? ` - text: ${it.customText}` : ''}`);
        });

        const text = textParts.join('\n');
        const html = `<p><strong>Name:</strong> ${entry.name || '(none)'}</p><p><strong>Phone:</strong> ${entry.phone}</p><p><strong>Address:</strong> ${entry.address || '(none)'}</p><h4>Items</h4><ul>${(entry.items || []).map((it) => `<li>${it.productName || 'Product'} - qty: ${it.quantity || 1} - $${Number(it.price || 0).toFixed(2)}</li>`).join('')}</ul>`;

        // attachments: decode data URLs on items that have image data, or attach local/remote images
        const attachments = [];
        for (let idx = 0; idx < (entry.items || []).length; idx++) {
          const it = (entry.items || [])[idx];
          const img = it.productImage || it.image_url || it.productImageUrl || null;
          if (!img) continue;

          // data URL
          if (typeof img === 'string' && img.startsWith('data:')) {
            const match = img.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/);
            if (match) {
              const contentType = match[1];
              const b64 = match[3];
              const buffer = Buffer.from(b64, 'base64');
              attachments.push({ filename: `item-${idx + 1}.${contentType.split('/')[1].replace('jpeg','jpg')}`, content: buffer, contentType });
            }
            continue;
          }

          // local file reference in public/uploads
          if (typeof img === 'string' && img.startsWith('/uploads/')) {
            try {
              const filePath = path.join(process.cwd(), 'public', img.replace(/^\//, ''));
              const buffer = await fs.promises.readFile(filePath);
              attachments.push({ filename: path.basename(filePath), content: buffer, contentType: 'image/*' });
            } catch (e) {
              // ignore read errors
            }
            continue;
          }

          // remote URL - try fetching
          if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
            try {
              const resp = await fetch(img);
              if (resp.ok) {
                const arrayBuf = await resp.arrayBuffer();
                const buffer = Buffer.from(arrayBuf);
                const contentType = resp.headers.get('content-type') || 'image/*';
                const ext = (contentType.split('/')[1] || 'jpg').split(';')[0].replace('jpeg','jpg');
                attachments.push({ filename: `item-${idx + 1}.${ext}`, content: buffer, contentType });
              }
            } catch (e) {
              // ignore fetch errors
            }
            continue;
          }
        }

        await sendContactEmail({ to: recipient, subject, text, html, attachments });
      }
    } catch (mailErr) {
      console.warn('Error sending order notification email:', mailErr);
    }

    return NextResponse.json({ success: true, entry });
  } catch (err) {
    console.error('/api/orders/send error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}