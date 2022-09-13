import Sender from "./sender";
import express, { Request, Response } from "express";

const sender = new Sender();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/status', (req: Request, res: Response) => {
    res.status(200).send({
        qr_code: sender.qrCode,
        connected: sender.isConnected
    })
});

app.post('/send', async (req: Request, res: Response) => {
    const {number, message } = req.body;
    try{ 
        await sender.sendText(number, message);
        return res.status(200).json();
    } catch(err) {
        console.error(err)
        res.status(500).send({status: "error", message: err})
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('server starter'))
