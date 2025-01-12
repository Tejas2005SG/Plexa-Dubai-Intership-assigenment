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
  
    throw error(`Error in sending Verification email : ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipients = [{ email }];

  try {
    const response = await client.send({
      from: sender,
      to: recipients,
      template_uuid: "e62c8783-179a-4372-a7a8-7bd6f8c75d3f",
      template_variables: {
        company_info_name: "Auth-Project",
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
    throw error(`Error in sending Forgot Password  : ${error}`);
    
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
   
    throw error(`Error in sending Reset Email  : ${error}`);
    
  }
}
