import sgMail from '@sendgrid/mail'

// API Key from .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const sendWelcomeEmail = async (email: string, name: string) => {
    const msg = {
        to: email, 
        from: process.env.SENDGRID_FROM!, 
        subject: 'Welcome to Amenities - Your adventure starts here!',
        text: `Hi ${name}, thank you for joining our tourism platform.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
                <h2 style="color: #6a1b9a;">Welcome to Amenities, ${name}!</h2>
                <p>We are excited to have you as part of our tourism community.</p>
                <p>With your new account, you will be able to:</p>
                <ul>
                    <li><b>Explore</b> amazing places on the map.</li>
                    <li><b>Create</b> personalized itineraries.</li>
                    <li><b>Mark</b> the places you have already visited.</li>
                    <li><b>Rate</b> your experiences.</li>
                </ul>
                <p>Your virtual passport is ready to be filled with adventures.</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" style="background-color: #6a1b9a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start my journey</a>
                </div>
            </div>
        `,
    }

    try {
        await sgMail.send(msg)
        console.log('Welcome email sent successfully')
    } catch (error) {
        console.error('Error sending email:', error)
    }
}