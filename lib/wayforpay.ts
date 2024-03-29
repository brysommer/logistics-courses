import { WFP, WFP_CONFIG } from 'overshom-wayforpay';

WFP_CONFIG.DEFAULT_PAYMENT_CURRENCY = 'UAH';

export const wfp = new WFP({
    MERCHANT_ACCOUNT: 'itgin_online',
    MERCHANT_SECRET_KEY: process.env.WAY_FOR_PAY_SECRET!,
    MERCHANT_DOMAIN_NAME: process.env.NEXT_PUBLIC_APP_URL!,
    // service URL needed to receive webhooks
    SERVICE_URL: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`,
});