import { NextResponse } from 'next/server';
import { whatsappService } from '@/services/whatsapp';

// GET - Check WhatsApp connection status
export async function GET() {
  try {
    const status = whatsappService.getStatus();

    return NextResponse.json({
      success: true,
      ready: status.ready,
      initializing: status.initializing,
      hasQR: status.hasQR,
      status: status.ready ? 'connected' : status.initializing ? 'connecting' : 'disconnected'
    });
  } catch (error: any) {
    console.error('Error getting WhatsApp status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get status'
      },
      { status: 500 }
    );
  }
}
