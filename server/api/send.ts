import { Resend } from "resend";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Debug: Check if API key is available
  if (!config.resendApiKey) {
    console.error("RESEND_API_KEY is not configured");
    throw createError({
      statusCode: 500,
      statusMessage: "Email service not configured",
    });
  }

  const resend = new Resend(config.resendApiKey);

  // Only allow POST requests
  if (getMethod(event) !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }

  try {
    const body = await readBody(event);
    const { email } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Valid email is required",
      });
    }

    // Send confirmation email to user
    const { data: userEmail, error: userError } = await resend.emails.send({
      from: "Pilcrow <no-reply@news.pilcrow.no>",
      to: [email],
      subject: "Velkommen til vårt nyhetsbrev!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Velkommen til vårt nyhetsbrev!</h2>
          <p>Tusen takk for at du abonnerer. Vi vil holde deg oppdatert med våre siste nyheter og oppdateringer.</p>
          <p>Med vennlig hilsen,<br>Jonas i Pilcrow</p>
        </div>
      `,
    });

    // Add contact to audience
    const { data: contactData, error: contactError } =
      await resend.contacts.create({
        email: email,
        unsubscribed: false,
        audienceId: "70b83151-bc72-49b1-a3ed-66854c24e683",
      });

    if (contactError) {
      console.error("Contact creation error:", contactError);
    }

    if (userError) {
      console.error("User email error:", userError);
    }

    // Send notification email to admin
    const { data: adminEmail, error: adminError } = await resend.emails.send({
      from: "Pilcrow <no-reply@news.pilcrow.no>",
      to: ["jonas@pilcrow.no"],
      subject: "Ny abonnent - Pilcrow",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Signup</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    if (adminError) {
      console.error("Admin email error:", adminError);
    }

    // Return success response
    return {
      success: true,
      message: "Successfully signed up!",
      data: {
        userEmail: userEmail?.id,
        adminEmail: adminEmail?.id,
        contact: contactData?.id,
      },
    };
  } catch (error: unknown) {
    console.error("Signup error:", error);

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // Otherwise, create a generic server error
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
