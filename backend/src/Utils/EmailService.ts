import sgMail from '@sendgrid/mail'

// API Key from .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export interface EmailOptions {
    to: string
    subject: string
    text?: string
    html: string
}

// reusable email
export const sendEmail = async (options: EmailOptions): Promise<void> => {
    const msg = {
        to: options.to,
        from: process.env.SENDGRID_FROM!,
        subject: options.subject,
        text: options.text || 'Text undefined',
        html: options.html
    }
    try {
        await sgMail.send(msg)
        console.log(`Email sent successfully to ${options.to} - ${options.subject}`)
    } catch (error: any) {
        console.log('Error sending email ', error?.response?.body || error)
        throw error
    }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
    const msg = {
        to: email, 
        from: process.env.SENDGRID_FROM!, 
        subject: 'Welcome to iVisit - Your adventure starts here!',
        text: `Hi ${name}, thank you for joining our tourism platform.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
                <h2 style="color: #6a1b9a;">Welcome to iVisit, ${name}!</h2>
                <p>We are excited to have you as part of our tourism community.</p>
                <p>With your new account, you will be able to:</p>
                <ul>
                    <li><b>Explore</b> incredible places on the map.</li>
                    <li><b>Create</b> personalized itineraries.</li>
                    <li><b>Mark</b> the places you have already visited.</li>
                    <li><b>Make</b> secure reservations.</li>
                </ul>
                <p>Your virtual passport is ready to be filled with adventures.</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL}" style="background-color: #6a1b9a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start my journey</a>
                </div>
            </div>
        `,
    }

    try {
        await sendEmail(msg)
        console.log('Welcome email sent successfully')
    } catch (error) {
        console.error('Error sending email:', error)
    }
}

// same reservation interface
export interface PaymentConfirmationData {
    name: string
    reservationId: string
    locationName: string
    date: string
    numberOfPeople: number
    totalAmount: number
    paymentId: string
    receiptUrl?: string
}

// send email for payment confirmation
export const sendPaymentConfirmationEmail = async (email: string, data: PaymentConfirmationData) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #6a1b9a;">Payment confirmed! Reservation #${data.reservationId}</h2>
        <p>Hi ${data.name},</p>
    <p>Your payment was successful. Here are the details of your reservation:</p>
    <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr><td><strong>Location:</strong></td><td>${data.locationName}</td></tr>
        <tr><td><strong>Date and time:</strong></td><td>${data.date}</td></tr>
        <tr><td><strong>People:</strong></td><td>${data.numberOfPeople}</td></tr>
        <tr><td><strong>Total paid:</strong></td><td>USD $${data.totalAmount.toFixed(2)}</td></tr>
        <tr><td><strong>Payment ID:</strong></td><td>${data.paymentId}</td></tr>
    </table>

    <p>Your adventure is confirmed! We look forward to seeing you.</p>
    ${data.receiptUrl ? `<p><a href="${data.receiptUrl}" style="background:#6a1b9a;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">View full receipt</a></p>` : ''}
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
            If you have any questions, reply to this email or contact us.
        </p>
    </div>
    `

    await sendEmail({
        to: email,
        subject: `Payment confirmed: ${data.reservationId}`,
        html
    })
}

export const sendReservationConfirmationEmail = async (email: string, name: string, locationName: string, code: string, date: string, time: string) => {
    const msg = {
        to: email, 
        from: process.env.SENDGRID_FROM!, 
        subject: `Reservation Confirmed at ${locationName}! - iVisit`,
        text: `Hi ${name}, your reservation is confirmed. Code: ${code}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
                <h2 style="color: #6a1b9a;">Your reservation is ready!</h2>
                <p>Hi ${name}, we are excited to confirm your upcoming visit through iVisit.</p>
                <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Location:</strong> ${locationName}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Time:</strong> ${time}</p>
                    <h3 style="text-align: center; color: #333; letter-spacing: 2px;">CODE: ${code}</h3>
                </div>
                <p>Please present this code upon arrival at the establishment.</p>
            </div>
        `,
    }

    try {
        await sgMail.send(msg)
        console.log('Reservation confirmation email sent successfully')
    } catch (error) {
        console.error('Error sending confirmation email:', error)
    }
}