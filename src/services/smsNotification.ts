import AWS from "aws-sdk"

export async function sendSMSNotification(phoneNumber: string, message: string) {
  const sns = new AWS.SNS({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  })

  const snsPromise = sns.publish({
    Message: message,
    PhoneNumber: phoneNumber
  }).promise()

  const result = await snsPromise.then(data => data).catch(err => {
    console.error(`Send SMS Notificaiton error ${err}`)
    throw err
  })

  console.log(`Send SMS Notification result ${JSON.stringify(result)}`)
}