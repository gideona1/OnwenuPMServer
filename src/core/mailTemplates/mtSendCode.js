export const mtSendCode = (code, name) => {
    return {
        html: `
        <p>Hi ${name},<br/>Here is your one-time code:</p>
        <b style="font-size: 24px; color: #cf0037;">${code}</b>
        <br/>
        <p>Enter this code into the prompt to log in.</p>
        <b>Please do not share this code with anyone.</b>
        <br/>
        <p>Best, <br/>Onwenu PM</p> `,
        text: `Hi ${name}, \nhere is your one-time code: \n${code}. Enter this code into the prompt to log in. \n Please do not share this code with anyone.`,
        subject: "Your one-time code"
    };
}