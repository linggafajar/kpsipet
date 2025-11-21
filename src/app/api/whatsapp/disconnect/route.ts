import { NextResponse } from 'next/server';
import { whatsappService } from '@/services/whatsapp';

// POST - Disconnect WhatsApp
export async function POST() {
  try {
    await whatsappService.disconnect();

    return NextResponse.json({
      success: true,
      message: 'WhatsApp disconnected successfully'
    });
  } catch (error: any) {
    console.error('Error disconnecting WhatsApp:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to disconnect WhatsApp'
      },
      { status: 500 }
    );
  }
}
