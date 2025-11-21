# WhatsApp Auto-Send Feature Documentation

## Overview

This feature automatically generates and sends PDF notification letters to parents via WhatsApp when an admin approves a student complaint (pengaduan). The system uses WhatsApp Web integration to send professional PDF documents directly to parent phone numbers.

## Features Implemented

### 1. WhatsApp Web Integration
- **Library**: whatsapp-web.js
- **Authentication**: QR code scanning (similar to WhatsApp Web)
- **Session Management**: Persistent session - scan QR code only once
- **Auto-send**: Automatic PDF delivery when complaint is approved

### 2. PDF Generation
- **Library**: pdfkit
- **Template**: Professional Indonesian school letter format
- **Content**:
  - School header and letterhead
  - Student information (nama, NISN, kelas)
  - Complaint details (date, description, reporter)
  - Admin notes and follow-up actions
  - Official signature section
  - Automatic numbering system

### 3. Admin Interface
- **WhatsApp Settings Page**: `/admin/whatsapp-settings`
  - QR code display for authentication
  - Connection status indicator
  - Connect/Disconnect controls
  - Real-time status updates

- **Approval Modal**:
  - Template selection
  - Admin notes input
  - WhatsApp status indicator
  - One-click approve and send

## File Structure

```
kpsipet/
├── src/
│   ├── services/
│   │   ├── whatsapp.ts              # WhatsApp service (QR, send, session)
│   │   └── pdfGenerator.ts          # PDF generation service
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── whatsapp/
│   │   │   │   ├── init/route.ts    # Initialize & get QR code
│   │   │   │   ├── status/route.ts  # Check connection status
│   │   │   │   ├── send/route.ts    # Send WhatsApp message
│   │   │   │   └── disconnect/route.ts  # Logout from WhatsApp
│   │   │   │
│   │   │   └── tindak-lanjut/route.ts  # Approval with auto-send
│   │   │
│   │   └── admin/
│   │       └── whatsapp-settings/page.tsx  # WhatsApp settings page
│   │
│   └── components/
│       └── admin/
│           └── ApprovalModal.tsx     # Approval dialog with WhatsApp
│
└── .wwebjs_auth/                     # WhatsApp session data (gitignored)
```

## How to Use

### Step 1: Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install whatsapp-web.js qrcode pdfkit @types/qrcode @types/pdfkit
```

### Step 2: Connect WhatsApp

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to WhatsApp Settings:
   - Go to `http://localhost:3000/admin/whatsapp-settings`
   - Click **"Connect WhatsApp"** button

3. Scan QR Code:
   - A QR code will appear on the screen
   - Open WhatsApp on your smartphone
   - Go to: **Settings > Linked Devices > Link a Device**
   - Scan the QR code displayed on the screen

4. Wait for Connection:
   - Status will change from "Connecting..." to "Connected"
   - The session is saved - you won't need to scan again

### Step 3: Approve Complaints

1. Go to **Admin > Pengaduan** page

2. Find a complaint with status "Menunggu"

3. Click the **green checkmark icon** (Approve button)

4. In the approval modal:
   - Select a letter template
   - Enter admin notes/follow-up actions
   - Check WhatsApp status indicator:
     - **Green**: Connected - PDF will be sent automatically
     - **Yellow**: Not connected - approval works but no auto-send

5. Click **"Approve & Send"**

6. System will:
   - Create tindak_lanjut record
   - Update pengaduan status to "Disetujui"
   - Generate PDF with school letter format
   - Send PDF to parent's WhatsApp number (from siswa.kontak_ortu)
   - Show success message with WhatsApp send status

## Admin Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. Admin goes to WhatsApp Settings                          │
│     └─> Scans QR code to connect WhatsApp                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Admin reviews complaints in Pengaduan page               │
│     └─> Finds complaint with status "Menunggu"               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Admin clicks Approve button (green checkmark)            │
│     └─> Approval modal opens                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Admin fills approval form                                │
│     ├─> Selects letter template                             │
│     ├─> Writes admin notes/tindak lanjut                     │
│     └─> Checks WhatsApp connection status                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Admin clicks "Approve & Send"                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  6. System processes approval                                │
│     ├─> Creates tindak_lanjut record                         │
│     ├─> Updates pengaduan status to "Disetujui"              │
│     ├─> Generates PDF letter                                 │
│     └─> Sends PDF to parent via WhatsApp (if connected)      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  7. Parent receives WhatsApp notification with PDF           │
│     ├─> Message with greeting and explanation                │
│     └─> PDF attachment with official letter                  │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### WhatsApp Management

#### POST `/api/whatsapp/init`
Initialize WhatsApp client and generate QR code

**Response:**
```json
{
  "success": true,
  "status": "initializing",
  "qrCode": "data:image/png;base64,..."
}
```

#### GET `/api/whatsapp/status`
Check current WhatsApp connection status

**Response:**
```json
{
  "success": true,
  "ready": true,
  "initializing": false,
  "status": "connected"
}
```

#### POST `/api/whatsapp/disconnect`
Disconnect from WhatsApp

**Response:**
```json
{
  "success": true,
  "message": "WhatsApp disconnected successfully"
}
```

#### POST `/api/whatsapp/send`
Send WhatsApp message with optional PDF

**Request:**
```json
{
  "phoneNumber": "08123456789",
  "message": "Hello from system",
  "pdfBuffer": "base64-encoded-pdf",
  "pdfFilename": "document.pdf"
}
```

### Approval with Auto-Send

#### POST `/api/tindak-lanjut`
Create tindak lanjut (approve complaint) with automatic WhatsApp send

**Request:**
```json
{
  "id_pengaduan": 1,
  "id_user": 1,
  "id_template": 1,
  "catatan_admin": "Siswa akan diberikan sanksi..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tindak lanjut created successfully",
  "tindak_lanjut": { ... },
  "whatsapp": {
    "sent": true,
    "error": null,
    "phoneNumber": "08123456789"
  }
}
```

## Phone Number Format

The system automatically formats Indonesian phone numbers:
- Input: `0812-3456-7890` or `+62 812 3456 7890`
- Processed: `62812345678@c.us` (WhatsApp format)
- Assumes Indonesia (+62) if no country code provided

## PDF Letter Format

The generated PDF includes:

```
┌────────────────────────────────────────────────┐
│           SEKOLAH MENENGAH KEJURUAN             │
│              SMK NEGERI 1 EXAMPLE               │
│  Jl. Pendidikan No. 123, Kota Example          │
│      Telp: (021) 1234567 | Email: ...          │
├────────────────────────────────────────────────┤
│                                                 │
│    SURAT PEMBERITAHUAN PELANGGARAN SISWA       │
│                                                 │
│  Nomor: 001/SP/11/2025                         │
│  Tanggal: 21 November 2025                     │
│                                                 │
│  Kepada Yth,                                   │
│  Orang Tua/Wali Siswa                          │
│  Ahmad Rizki                                   │
│  Di tempat                                     │
│                                                 │
│  Dengan hormat,                                │
│                                                 │
│  Melalui surat ini kami sampaikan bahwa:       │
│                                                 │
│  Nama Siswa  : Ahmad Rizki                     │
│  NISN        : 1234567890                      │
│  Kelas       : XII RPL 1                       │
│                                                 │
│  Telah dilaporkan melakukan pelanggaran...     │
│                                                 │
│  [Description of complaint]                    │
│                                                 │
│  Tindak Lanjut:                                │
│  [Admin notes and actions]                     │
│                                                 │
│  [Closing statement]                           │
│                                                 │
│                       Example, 21 November 2025│
│                       Kepala Sekolah,          │
│                                                 │
│                       (Nama Kepala Sekolah)    │
│                       NIP. ...                 │
└────────────────────────────────────────────────┘
```

## WhatsApp Message Format

When a PDF is sent, the parent receives:

```
Yth. Orang Tua/Wali dari [Nama Siswa]

Dengan hormat, kami sampaikan surat pemberitahuan
terkait pelanggaran yang dilakukan oleh putra/putri
Bapak/Ibu.

Mohon untuk membaca surat terlampir dan memberikan
perhatian lebih kepada putra/putri Bapak/Ibu.

Terima kasih atas perhatian dan kerjasamanya.

Hormat kami,
SMK Negeri 1 Example

[PDF Attachment: Surat_Pemberitahuan_AhmadRizki_001-SP-11-2025.pdf]
```

## Configuration

### Next.js Config

The `next.config.ts` has been configured to handle WhatsApp Web.js:

```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['whatsapp-web.js', 'qrcode', 'pdfkit'],
  turbopack: {},
};
```

This prevents bundling issues with browser-incompatible packages.

### Database Schema

The approval creates a `TindakLanjut` record:

```prisma
model TindakLanjut {
  id_tindak_lanjut Int       @id @default(autoincrement())
  tgl_proses       DateTime
  file_surat       String    // e.g., "001/SP/11/2025"
  catatan_admin    String
  id_pengaduan     Int       @unique
  id_user          Int
  id_template      Int

  pengaduan        Pengaduan
  user             Users
  template         TemplateSurat
}
```

## Troubleshooting

### WhatsApp Won't Connect

**Issue**: QR code not appearing or connection fails

**Solutions**:
1. Restart the development server
2. Delete `.wwebjs_auth` folder and reconnect
3. Check if Chromium dependencies are installed (Windows usually has them)
4. Check console for error messages

### WhatsApp Disconnects Frequently

**Issue**: Connection drops randomly

**Solutions**:
1. Don't logout from WhatsApp on your phone
2. Keep your phone connected to internet
3. Don't use "Logout from all devices" in WhatsApp settings
4. Check if session files in `.wwebjs_auth` are corrupted

### PDF Not Sending

**Issue**: Approval works but WhatsApp not sent

**Solutions**:
1. Check WhatsApp connection status in settings
2. Verify parent phone number is valid and registered on WhatsApp
3. Check console logs for error messages
4. Verify the phone number format in database

### Phone Number Not Registered

**Error**: "Number is not registered on WhatsApp"

**Solutions**:
1. Verify the phone number in siswa.kontak_ortu is correct
2. Confirm the number is active on WhatsApp
3. Try formatting the number with country code (e.g., +6281234567890)

### Build Errors

**Issue**: Build fails with module resolution errors

**Solutions**:
1. Ensure Next.js config has `serverExternalPackages` configured
2. Delete `.next` folder and rebuild
3. Clear node_modules and reinstall dependencies

## Limitations

1. **WhatsApp Business API**: This uses WhatsApp Web, not the official Business API
   - Subject to WhatsApp's terms of service
   - May be rate-limited for bulk sending
   - Personal number recommended over business number

2. **Server Requirements**:
   - Needs Chromium/Chrome to run headless browser
   - Memory: Minimum 512MB for WhatsApp client
   - Storage: Session data requires ~50MB

3. **Phone Number Requirements**:
   - Parent numbers must be registered on WhatsApp
   - International numbers need correct country code
   - Invalid numbers will cause send to fail

4. **Session Management**:
   - Session expires if you logout from phone
   - Multi-device limit: 4 linked devices maximum
   - Need to re-scan if session corrupted

5. **PDF Size**:
   - Keep PDFs under 16MB (WhatsApp limit)
   - Current implementation generates ~50-100KB PDFs

## Security Considerations

1. **Session Storage**: `.wwebjs_auth` contains authentication data
   - Added to `.gitignore` - never commit to git
   - Secure the server where session data is stored
   - Regularly backup session data

2. **Phone Numbers**: Parent phone numbers are sensitive data
   - Ensure database is secure
   - Validate phone numbers before sending
   - Log all WhatsApp sends for audit trail

3. **Admin Access**: Only authorized admins should:
   - Access WhatsApp settings
   - Connect/disconnect WhatsApp
   - Approve complaints

## Production Deployment

### Deployment Checklist

- [ ] Set up environment variables
- [ ] Configure Chromium dependencies on server
- [ ] Secure `.wwebjs_auth` directory with proper permissions
- [ ] Set up monitoring for WhatsApp connection status
- [ ] Configure backup for session data
- [ ] Test phone number formatting for your region
- [ ] Set up logging for WhatsApp sends
- [ ] Configure error notifications
- [ ] Test QR code scanning workflow
- [ ] Verify PDF generation works on production server

### Server Requirements

**Minimum**:
- Node.js 18+
- 1GB RAM
- 10GB Storage
- Chromium/Chrome installed

**Recommended**:
- Node.js 20+
- 2GB RAM
- 20GB Storage
- Linux server (Ubuntu 20.04+)

### Environment Setup (Production)

1. Install Chromium dependencies (Ubuntu):
```bash
sudo apt-get update
sudo apt-get install -y chromium-browser
```

2. Set environment variables:
```bash
# .env.production
DATABASE_URL="your-production-database-url"
```

3. Build and start:
```bash
npm run build
npm start
```

## Future Enhancements

Potential improvements for future versions:

1. **Bulk Sending**: Queue system for multiple approvals
2. **Templates**: Customizable PDF templates via admin
3. **Scheduling**: Schedule sends for specific times
4. **Read Receipts**: Track if parent read the message
5. **Multi-language**: Support for multiple languages
6. **Rich Media**: Add school logo to PDFs
7. **Parent Portal**: Allow parents to confirm receipt
8. **Analytics**: Dashboard for send success rates
9. **Retry Logic**: Automatic retry on send failures
10. **WhatsApp Business API**: Upgrade to official API

## Support

For issues or questions:
1. Check console logs for error messages
2. Review this documentation
3. Check WhatsApp Web.js documentation: https://wwebjs.dev/
4. Verify database schema and data integrity

## License & Credits

- **whatsapp-web.js**: MIT License
- **pdfkit**: MIT License
- **qrcode**: MIT License

Built for KP SIPET - School Complaint Management System
