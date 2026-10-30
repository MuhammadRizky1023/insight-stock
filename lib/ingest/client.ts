import {Inngest} from 'inngest'
export const inngest =new Inngest({
    id: 'SignSignal',
    api: {
        gemini: {
            apiKey: process.env.GOOGLE_GEMINI_API!
        }
    }

});