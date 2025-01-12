import Campaign from "../Models/campaign.model.js";
import Invoice from "../Models/invoice.model.js"; // Import the Invoice model
import { User } from "../Models/user.model.js";

export const fetchInvoices = async (req, res) => {
  try {
    // Select only the required fields from Campaign
    const campaigns = await Campaign.find()
      .select('campaignData.campaign_name status uploadedAt user') // Only select the necessary fields
      .exec();

    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({ message: "No campaigns found." });
    }

    // Map the campaigns to the desired invoice details
    const invoiceDetails = campaigns.map((campaign) => ({
      id: campaign._id,
      campaignName: campaign.campaignData.campaign_name[0], // Assuming campaign_name is an array
      status: campaign.status[0], // Assuming status is an array
      userId: campaign.user, // Storing only the user._id (not populated)
      uploadedDate: campaign.uploadedAt.toLocaleDateString(),
    }));

    // Optionally store invoices in the database
    for (const invoice of invoiceDetails) {
      // Save each invoice to the database
      await Invoice.create({
        user: invoice.userId, // Save the user._id reference
      });
    }

    res.json(invoiceDetails);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Error fetching invoices." });
  }
};
