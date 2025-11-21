import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import QRCode from 'qrcode';

class WhatsAppService {
  private client: Client | null = null;
  private qrCode: string = '';
  private isReady: boolean = false;
  private isInitializing: boolean = false;

  constructor() {
    // Initialize client on server start (optional)
  }

  // Initialize WhatsApp client and generate QR code
  async initialize(): Promise<void> {
    if (this.isInitializing) {
      throw new Error('WhatsApp is already initializing');
    }

    if (this.client && this.isReady) {
      throw new Error('WhatsApp is already connected');
    }

    this.isInitializing = true;

    try {
      // Create new client with local authentication to save session
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: 'kpsipet-whatsapp',
          dataPath: '.wwebjs_auth'
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ]
        }
      });

      // QR code event - when QR code is generated
      this.client.on('qr', async (qr) => {
        console.log('QR Code received, generating image...');
        try {
          // Generate QR code as data URL
          this.qrCode = await QRCode.toDataURL(qr);
          console.log('QR Code generated successfully');
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      });

      // Ready event - when client is authenticated and ready
      this.client.on('ready', () => {
        console.log('WhatsApp client is ready!');
        this.isReady = true;
        this.isInitializing = false;
        this.qrCode = ''; // Clear QR code after successful connection
      });

      // Authenticated event
      this.client.on('authenticated', () => {
        console.log('WhatsApp authenticated successfully');
      });

      // Auth failure event
      this.client.on('auth_failure', (msg) => {
        console.error('Authentication failed:', msg);
        this.isReady = false;
        this.isInitializing = false;
      });

      // Disconnected event
      this.client.on('disconnected', (reason) => {
        console.log('WhatsApp disconnected:', reason);
        this.isReady = false;
        this.isInitializing = false;
        this.client = null;
      });

      // Initialize the client
      await this.client.initialize();
      console.log('WhatsApp client initialization started');
    } catch (error) {
      this.isInitializing = false;
      console.error('Error initializing WhatsApp client:', error);
      throw error;
    }
  }

  // Get current QR code
  getQRCode(): string {
    return this.qrCode;
  }

  // Check if client is ready
  isClientReady(): boolean {
    return this.isReady;
  }

  // Check if client is initializing
  isClientInitializing(): boolean {
    return this.isInitializing;
  }

  // Get connection status
  getStatus(): { ready: boolean; initializing: boolean; hasQR: boolean } {
    return {
      ready: this.isReady,
      initializing: this.isInitializing,
      hasQR: this.qrCode !== ''
    };
  }

  // Send message with PDF attachment
  async sendMessage(
    phoneNumber: string,
    message: string,
    pdfBuffer?: Buffer,
    pdfFilename?: string
  ): Promise<void> {
    if (!this.client || !this.isReady) {
      throw new Error('WhatsApp client is not ready. Please scan QR code first.');
    }

    try {
      // Format phone number (remove any non-numeric characters except +)
      let formattedNumber = phoneNumber.replace(/[^\d+]/g, '');

      // If number doesn't start with country code, assume Indonesia (+62)
      if (!formattedNumber.startsWith('+')) {
        if (formattedNumber.startsWith('0')) {
          formattedNumber = '62' + formattedNumber.substring(1);
        } else if (!formattedNumber.startsWith('62')) {
          formattedNumber = '62' + formattedNumber;
        }
      } else {
        formattedNumber = formattedNumber.substring(1); // Remove + sign
      }

      // Add WhatsApp suffix
      const chatId = `${formattedNumber}@c.us`;

      console.log(`Sending message to ${chatId}`);

      // Check if number is registered on WhatsApp
      const isRegistered = await this.client.isRegisteredUser(chatId);
      if (!isRegistered) {
        throw new Error(`Number ${phoneNumber} is not registered on WhatsApp`);
      }

      // Send message
      await this.client.sendMessage(chatId, message);

      // Send PDF if provided
      if (pdfBuffer && pdfFilename) {
        const media = new MessageMedia(
          'application/pdf',
          pdfBuffer.toString('base64'),
          pdfFilename
        );
        await this.client.sendMessage(chatId, media, {
          caption: 'Surat Pemberitahuan Orang Tua'
        });
      }

      console.log(`Message sent successfully to ${phoneNumber}`);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Disconnect WhatsApp client
  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.destroy();
        this.client = null;
        this.isReady = false;
        this.isInitializing = false;
        this.qrCode = '';
        console.log('WhatsApp client disconnected successfully');
      } catch (error) {
        console.error('Error disconnecting WhatsApp client:', error);
        throw error;
      }
    }
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();
