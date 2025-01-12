import { MailtrapClient } from "mailtrap"

const TOKEN = "48295a46cac835ce2b77e385b0f56840";
const ENDPOINT = "https://send.api.mailtrap.io/"

export const client = new MailtrapClient({
  token: TOKEN,
  endpoint:ENDPOINT
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};
  