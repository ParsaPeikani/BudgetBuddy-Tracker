import { NextApiRequest, NextApiResponse } from "next";
import User from "@/Models/user";
import connectDB from "@/pages/lib/connectDB";
import { Webhook } from "svix";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
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

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = wh.verify(JSON.stringify(req.body), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as {
      data: any;
      type: string;
    };

    // Process the event as needed
    console.log("This is the verified event:", evt);
    // Creating a new user in the database if the event type is "user.created"
    if (evt.type === "user.created") {
      // Data for new user
      const newUser = new User({
        externalId: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
      });
      // Save the new user to the database
      newUser
        .save()
        .then((user: object) => console.log("New user created:", user))
        .catch((err: any) => console.error("Error creating new user:", err));
    } else if (evt.type === "user.deleted") {
      // Deleting a user from the database if the event type is "user.deleted"
      const deletedUser = await User.findOneAndDelete({
        externalId: evt.data.id,
      });

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: "User deleted successfully", deletedUser });
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    res.status(400).json({ error: "Error occurred while verifying webhook." });
  }
}
