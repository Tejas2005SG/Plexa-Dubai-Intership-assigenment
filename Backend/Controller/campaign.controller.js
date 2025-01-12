import multer from "multer";
import mongoose from "mongoose";
import { User } from "../Models/user.model.js"; // Path to User model
import Campaign from "../Models/campaign.model.js"; // Path to Campaign model
import { Parser } from "json2csv";
const upload = multer();

export const campaignUpload = async (req, res) => {
  try {
    if (!req.file) {
/*************  ✨ Codeium Command 🌟  *************/
      return res.status(400).json({ message: "No file uploaded." });
    }

    const invalidPANs = new Set();
    const previewData = [];
    const campaignDataMap = new Map();

    const buffer = req.file.buffer.toString();
    const rows = buffer.split("\n").slice(1); // Skip header row

    const panNumbers = [];
    rows.forEach((row) => {
      const columns = row.split(",").map((col) => col.trim().replace(/^"|"$/g, ""));
      if (columns.length >= 7) {
        const panNumber = columns[4] ? columns[4].trim().toUpperCase() : null;
        if (panNumber) panNumbers.push(panNumber);
      }
    });

    const users = await User.find({ panCardNumber: { $in: panNumbers } });
    const userMap = new Map(users.map((user) => [user.panCardNumber, user]));

    for (const row of rows) {
      const columns = row.split(",").map((col) => col.trim().replace(/^"|"$/g, ""));
      if (columns.length < 7) continue;

      const [billName, description, startDate, endDate, pan_number, place, campaign_name, amount] = columns;

      const sanitizedPAN = pan_number.trim().toUpperCase();
      const user = userMap.get(sanitizedPAN);

      const campaignData = {
        billName: billName || "",
        description: description || "",
        startDate: startDate || "",
        endDate: endDate || "",
        pan_number: sanitizedPAN,
        place: place || "",
        campaign_name: campaign_name || `${billName}_${new Date().toISOString().split("T")[0]}`, // Use CSV-provided campaign_name
        amount: amount || "",
      };

      previewData.push(campaignData);

      if (!user) {
        invalidPANs.add(sanitizedPAN);
        continue;
      }

      if (!campaignDataMap.has(user._id.toString())) {
        campaignDataMap.set(user._id.toString(), {
          user: user._id,
          campaignData: {
            billName: [],
            description: [],
            startDate: [],
            endDate: [],
            pan_number: [],
            place: [],
            campaign_name: [],
            amount: [],
          },
          status: ["Pending"],
          uploadedAt: new Date(),
        });
      }

      const userCampaignData = campaignDataMap.get(user._id.toString()).campaignData;
      userCampaignData.billName.push(campaignData.billName);
      userCampaignData.description.push(campaignData.description);
      userCampaignData.startDate.push(campaignData.startDate);
      userCampaignData.endDate.push(campaignData.endDate);
      userCampaignData.pan_number.push(campaignData.pan_number);
      userCampaignData.place.push(campaignData.place);
      userCampaignData.campaign_name.push(campaignData.campaign_name);
      userCampaignData.amount.push(campaignData.amount);
    }

    const campaigns = [];

    for (const campaign of campaignDataMap.values()) {
      const newCampaign = new Campaign(campaign);
      await newCampaign.save();
      campaigns.push(newCampaign);

      await User.findByIdAndUpdate(
        newCampaign.user,
        { $push: { campaigns: newCampaign._id } },
        { new: true }
      );
    }

    res.status(200).json({
      message: "Campaigns uploaded successfully.",
      validData: campaigns,
      preview: previewData,
      invalidPANs: Array.from(invalidPANs),
    });
  } catch (error) {
    console.error("Error processing file:", error.message);
    res.status(500).json({ message: "Error processing file." });
  }
};

// Edit Campaign by ID
export const campaignEdit = async (req, res) => {
    try {
      const { id } = req.params;
      const { updatedData } = req.body; // Data from the frontend
      const campaign = await Campaign.findById(id);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found." });
      }
      
      // Updating specific fields (except pan_number)
      const editableFields = ['billName', 'description', 'startDate', 'endDate', 'amount', 'place'];
      editableFields.forEach(field => {
        if (updatedData[field] && Array.isArray(updatedData[field])) {
          campaign.campaignData[field] = updatedData[field];
        }
      });
  
      const updatedCampaign = await campaign.save(); // Save the updated campaign to DB
  
      res.status(200).json({ message: "Campaign updated successfully.", updatedCampaign });
    } catch (error) {
      console.error("Error updating campaign:", error.message);
      res.status(500).json({ message: "Error updating campaign." });
    }
  };

// Delete Specific Row by ID
export const campaignDelete = async (req, res) => {
  try {
    const { id } = req.params; // Extract campaign ID from URL
    const { rowIndex } = req.body; // Extract row index from request body

    console.log(`Deleting row at index ${rowIndex} from campaign ID: ${id}`);

    if (!id || rowIndex === undefined) {
      return res.status(400).json({ message: "Campaign ID and row index are required." });
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    const { campaignData } = campaign;

    // Include campaign_name in fields for row deletion
    const fields = ["billName", "description", "startDate", "endDate", "amount", "place", "pan_number", "campaign_name"];

    fields.forEach(field => {
      if (Array.isArray(campaignData[field]) && rowIndex >= 0 && rowIndex < campaignData[field].length) {
        console.log(`Deleting field '${field}' at index ${rowIndex}`);
        campaignData[field].splice(rowIndex, 1);
      } else {
        console.log(`Field '${field}' is invalid or rowIndex ${rowIndex} is out of bounds.`);
      }
    });

    await campaign.save(); // Save the updated campaign data
    res.status(200).json({ message: "Row deleted successfully." });
  } catch (error) {
    console.error("Error deleting campaign row:", error);
    res.status(500).json({ message: "Error deleting campaign row.", error: error.message });
  }
};

// Accept or Reject Campaign
export const campaignAcceptReject = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Accepting 'status' instead of 'action'

  try {
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (status === "Approved" || status === "Rejected") {
      campaign.status = status;  // Directly set the status
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }

    await campaign.save();
    res.status(200).json({ message: `Campaign ${status.toLowerCase()} successfully`, campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch All Campaigns
export const fetchCampaigns = async (req, res) => {
  try {
    console.log('Fetching campaigns...');

    // Fetch all campaigns from the database
    const campaigns = await Campaign.find({});

    // Format the campaigns before sending them to the frontend
    const formattedCampaigns = campaigns.map(campaign => {
      let campaignName = 'No name available';
      let status = 'Pending'; // Default to 'Pending' if status is not set
      let uploadedAt = null;  // Default to null if no uploadedAt is available

      if (campaign.campaignData) {
        // Handle campaign_name (which can be an array or string)
        if (Array.isArray(campaign.campaignData.campaign_name) && campaign.campaignData.campaign_name.length > 0) {
          campaignName = campaign.campaignData.campaign_name[0];  // Use the first item in the array
        } else if (campaign.campaignData.campaign_name) {
          campaignName = campaign.campaignData.campaign_name;  // If it's a string, use it directly
        }

        // Handle status
        if (Array.isArray(campaign.status) && campaign.status.length > 0) {
          status = campaign.status[0];  // Default to first status if it's an array
        } else if (campaign.status) {
          status = campaign.status;  // If status is a single value, use it
        }
      }

      // Handle uploadedAt date
      if (campaign.uploadedAt) {
        uploadedAt = campaign.uploadedAt;
      }

      return {
        id: campaign._id,  // Send campaign ID
        campaign_name: campaignName,  // The formatted campaign name
        uploadedAt,  // The upload date
        status,  // The campaign status
      };
    });

    console.log('Formatted campaigns:', formattedCampaigns);

    // Send the formatted campaigns to the frontend
    res.json(formattedCampaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error.message);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

// downlaod campaign as CSV
export const downloadCampaign = async (req, res) => {
  const campaignId = req.params.id;
  try {
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const {
      campaignData: {
        billName,
        description,
        startDate,
        endDate,
        pan_number,
        place,
        campaign_name,
        amount,
      },
    } = campaign;

    // Prepare the rows for CSV
    const rows = [];
    for (let i = 0; i < billName.length; i++) {
      rows.push({
        "Bill Name": billName[i] || '',
        "Description": description[i] || '',
        "Start Date": startDate[i] || '',
        "End Date": endDate[i] || '',
        "PAN Number": pan_number[i] || '',
        "Place": place[i] || '',
        "Campaign Name": campaign_name[i] || '',
        "Amount": amount[i] || '',
      });
    }

    const fields = [
      "Bill Name",
      "Description",
      "Start Date",
      "End Date",
      "PAN Number",
      "Place",
      "Campaign Name",
      "Amount",
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment(`campaign_${campaignId}.csv`);
    res.send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).json({ error: "An error occurred while generating the CSV" });
  }
};


