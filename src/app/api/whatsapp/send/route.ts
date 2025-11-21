import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/services/whatsapp';

// POST - Send WhatsApp message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, message, pdfBuffer, pdfFilename } = body;

    if (!phoneNumber || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Phone number and message are required'
        },
        { status: 400 }
      );
    }

    // Check if WhatsApp is ready
    if (!whatsappService.isClientReady()) {
      return NextResponse.json(
        {
          success: false,
          error: 'WhatsApp is not connected. Please scan QR code first.'
        },
        { status: 400 }
      );
    }

    // Convert base64 PDF to Buffer if provided
    let buffer: Buffer | undefined;
    if (pdfBuffer) {
      buffer = Buffer.from(pdfBuffer, 'base64');
    }

    // Send message
    await whatsappService.sendMessage(phoneNumber, message, buffer, pdfFilename);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send message'
      },
      { status: 500 }
    );
  }
}
