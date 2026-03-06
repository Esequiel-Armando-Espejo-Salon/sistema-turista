import Stripe from "stripe";
import dotenv from 'dotenv';
dotenv.config();

export class StripeService {
    private stripe: Stripe;

    constructor() {

        const secretKey = process.env.STRIPE_SECRET_KEY! as string
        if(!secretKey){
            throw new Error('Stripe Secret key is undefined or not exist in env')
        }

        this.stripe = new Stripe(secretKey, {
            apiVersion: '2026-02-25.clover'
        });
    }

    /**
     * @param amount Amount in USD (e.g., 150.50 -> multiplied by 100 internally)
     * @param metadata Data to identify the reservation (returned in webhooks)
     * @returns PaymentIntent created
     */
    async createPayment (amount: number, metadata: Record<string, string>= {}): Promise<Stripe.PaymentIntent> {
        if(amount < 0){
            throw new Error('The amount must be greater than 0')
        }
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: 'usd',
                payment_method_types: ['card'],
                metadata: {
                    ...metadata
                },
                capture_method: 'automatic',
                setup_future_usage: 'off_session' // remember payment method
            })
            return paymentIntent
        } catch (error: any) {
            console.error('Error creating PaymentIntent:', {
                message: error.message,
                type: error.type,
                code: error.code,
                param: error.param,
            });
            // Send error to frontend
            throw new Error(
                'The payment could not be created. Please try again or contact support.'
            )
        }
    }

    async updatePayment (id: string, params: Stripe.PaymentIntentUpdateParams) : Promise<Stripe.PaymentIntent> {
        try {
            if(params.amount && typeof params.amount === 'number'){
                params.amount = Math.round(params.amount * 100)
            }
            const updateIntent = await this.stripe.paymentIntents.update(id, params)
            return updateIntent
        } catch (error: any) {
            this.handleError(error, 'updating')
            throw new Error('the payment could not be updated')
        }
    }

    // webhooks
    async getPaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
        return this.stripe.paymentIntents.retrieve(id)
    }

    private handleError(error: any, action: string){
        console.error(`Error ${action} payment intent`, {
            message: error.message,
            type: error.type,
            code: error.code,
            param: error.param
        })
    }
}