import { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    res
      .status(500)
      .json({ error: "Server misconfiguration: WEBHOOK_SECRET is missing." });
    return;
  }

  // Directly access headers from the req object
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    res.status(400).json({ error: "Error occurred -- no svix headers" });
    return;
  }

  // Assuming you're parsing JSON body, ensure your Next.js API route is setup to do so
  // Next.js automatically parses JSON bodies, but ensure you've not disabled this feature

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    // Verify the payload with the headers
    // Note: You need to ensure body is a raw string for signature verification
    // This might require configuring body parsing in Next.js or using a different approach
    const evt = wh.verify(JSON.stringify(req.body), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as {
      data: any;
      type: string;
    };

    // Process the event as needed
    console.log("Verified event:", evt);
    if (evt.type === "user.created") {
      console.log(
        "This is the user first name, last name and email address: ",
        evt.data.first_name,
        evt.data.last_name,
        evt.data.email_addresses[0].email_address
      );
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    res.status(400).json({ error: "Error occurred while verifying webhook." });
  }
}
