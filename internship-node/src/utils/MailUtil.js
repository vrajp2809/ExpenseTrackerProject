
const mailer = require('nodemailer');

const sendingMail = async (to , subject , text) =>{
    const transporter = mailer.createTransport({
        service:'gmail',
        auth:{
            user:"expensetrackertesting123@gmail.com",
            pass:"yyfb msps htqq mpll"

        }
    })

    const mailOptions = {
        from:"expensetrackertesting123@gmail.com",
        to:to,
        subject:subject,
        text:text
    }


    const mailresponse = await transporter.sendMail(mailOptions);
    console.log(mailresponse);
    return mailresponse;
}

module.exports = {
    sendingMail
}