import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import {PASSOWRD_RESET_REQUEST_TEMPLATE} from "./emailTemplate.js"
import {PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplate.js"
import { client, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Verify Your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    
  } catch (error) {
  
    throw new Error(`Error in sending Verification email : ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipients = [{ email }];

  try {
    const response = await client.send({
      from: sender,
      to: recipients,
      template_uuid: "d40fafc0-d331-4a40-8929-4f150b3100dd",
      template_variables: {
        company_info_name: "Campaign-Invoice System",
        name: name,
      },
    });

   
  } catch (error) {
    
    throw new Error(`Error in sending Welcome email : ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL)=>{
  const recipient = [{email}];

  try {
    const response = await client.send({
      from:sender,
      to:recipient,
      subject:"Reset Password",
      html:PASSOWRD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category:"Reset Password"
    })
    
    

  } catch (error) {
    throw new Error(`Error in sending Forgot Password  : ${error}`);
    
  }
}

export const sendResetSuccessEmail = async (email, resetURL)=>{
  const recipient = [{email}];

  try {
    const response = await client.send({
      from:sender,
      to:recipient,
      subject:"Reset Password",
      html:PASSWORD_RESET_SUCCESS_TEMPLATE,
      category:" Password Reset"
    })
    
  

  } catch (error) {
   
    throw new Error(`Error in sending Reset Email  : ${error}`);
    
  }
}
