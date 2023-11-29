import Inibase from "inibase";
import { createTransport } from "nodemailer";
export default defineWrappedResponseHandler(async (event: any) => {
  const db = new Inibase(
    event.context.database.slug,
    useRuntimeConfig().databasePath
  );

  let body = await readBody(event);
  if (!body.email) throw new Error("params_not_correct");
  let user = await db.get(
    "user",
    {
      email: body.email,
    },
    undefined,
    true
  );

  if (!user) throw new Error("404");

  const transporter = createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
      pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: body.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  return [true, "email_sent"];
});
