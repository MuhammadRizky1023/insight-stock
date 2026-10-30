import { inngest } from '@/lib/ingest/client'
import { sendDailyNewsSummary, sendSignUpEmail } from '@/lib/ingest/function'
import {serve} from 'inngest/next'

export const {GET, POST, PUT} = serve({
    client: inngest,
    functions: [sendSignUpEmail, sendDailyNewsSummary]
})