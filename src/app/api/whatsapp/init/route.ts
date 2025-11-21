import { NextResponse } from 'next/server';
import { whatsappService } from '@/services/whatsapp';

// POST - Initialize WhatsApp and get QR code
export async function POST() {
  try {
    const status = whatsappService.getStatus();

    // If already ready, return success
    if (status.ready) {
      return NextResponse.json({
        success: true,
        message: 'WhatsApp is already connected',
        status: 'ready'
      });
    }

    // If already initializing, return current QR code if available
    if (status.initializing) {
      const qrCode = whatsappService.getQRCode();
      return NextResponse.json({
        success: true,
        message: 'WhatsApp is initializing',
        status: 'initializing',
        qrCode: qrCode || null
      });
    }

    // Initialize WhatsApp
    whatsappService.initialize().catch((error) => {
      console.error('WhatsApp initialization error:', error);
    });

    // Wait a moment for QR code to be generated
    await new Promise(resolve => setTimeout(resolve, 5000));

    const qrCode = whatsappService.getQRCode();

    return NextResponse.json({
      success: true,
      message: 'WhatsApp initialization started',
      status: 'initializing',
      qrCode: qrCode || null
    });
  } catch (error: any) {
    console.error('Error initializing WhatsApp:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initialize WhatsApp'
      },
      { status: 500 }
    );
  }
}

// GET - Get current QR code
export async function GET() {
  try {
    const status = whatsappService.getStatus();
    const qrCode = whatsappService.getQRCode();

    return NextResponse.json({
      success: true,
      status: status.ready ? 'ready' : status.initializing ? 'initializing' : 'disconnected',
      qrCode: qrCode || null,
      ready: status.ready,
      initializing: status.initializing,
      hasQR: status.hasQR
    });
  } catch (error: any) {
    console.error('Error getting QR code:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get QR code'
      },
      { status: 500 }
    );
  }
}
