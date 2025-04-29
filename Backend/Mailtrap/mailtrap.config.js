import { MailtrapClient } from "mailtrap"

const TOKEN = "a7b578009fd69986ac6a48186d5de3ac";
const ENDPOINT = "send.api.mailtrap.io/"

export const client = new MailtrapClient({
  token: TOKEN,
  endpoint:ENDPOINT
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};
  