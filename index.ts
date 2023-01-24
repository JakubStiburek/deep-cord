import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Deepgram } from "@deepgram/sdk";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const deepgramApiKey = process.env.DEEPGRAM_API_SECRET;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;

const deepgram = deepgramApiKey ? new Deepgram(deepgramApiKey) : undefined;
const mimeType = 'audio/mpeg';
const fileUrl = 'https://res.cloudinary.com/dws5jjmgt/video/upload/v1674560454/deep-cord/deep-cord-demo_mlkter.mp3';

cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    secure: true
});

app.post('/file', (req: Request, res: Response) => {
    const fileName = 'test.mp3';
    cloudinary.uploader.upload(`static/${fileName}`, { resource_type: 'auto', public_id: `deep-cord/${fileName}` })
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.error(error);
        });
});

app.get('/transcribe', (req: Request, res: Response) => {
    if (deepgram === undefined) {
        res.send('Missing Deepgram API key');
    }

    deepgram?.transcription.preRecorded(
        { url: fileUrl, mimetype: mimeType },
        { punctuate: true, model: 'general', language: 'en-US', tier: 'enhanced', times: true },
    )
        .then((transcription) => {
            res.send({
                transcription: transcription.results?.channels[0].alternatives[0].transcript,
            });
        })
        .catch((err) => {
            console.error(err);
        });
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});