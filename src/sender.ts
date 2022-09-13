import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { create, Whatsapp, Message, SocketState } from 'venom-bot';

export  type Qrcode = {
    base64Qr: string;
    asciiQR: string;
    attemps: number;
}

class Sender {
    private client: Whatsapp;
    private connected: boolean;
    private qr: Qrcode;

    get isConnected(): boolean {
        return this.connected;
    }

    get qrCode(): Qrcode {
        return this.qr;
    }

    constructor() {
        this.initialize();
    }

    public async sendText(to: string, body: string) {
        if (!isValidPhoneNumber(to, "BR")) {
            throw new Error("This number is not valid");
        }

        let phoneNumber = parsePhoneNumber(to, "BR")?.format("E.164").replace('+', '') as string;
        phoneNumber = phoneNumber
            .includes("@c.us") ? 
            phoneNumber 
            : `${phoneNumber}@c.us`;

        await this.client.sendText(phoneNumber, body)
    }
    private initialize() {

        const qr = (base64Qr: string, asciiQR: string, attemps: number) => { 
            this.qr = { base64Qr, asciiQR, attemps }
        };
        const status = (statusSession: string) => {
            this.connected = ["isLogged", "qrReadSuccess", "chatsAvaible", "connectBrowserWs", "initWhatsapp", "successChat"].includes(statusSession);
         };
        const start = (client: Whatsapp) => {
            this.client = client;
        };

        create('wpp-save-hw', qr, status)
            .then((client) => start(client))
            .catch((error) => console.error(error))
    }

}

export default Sender;