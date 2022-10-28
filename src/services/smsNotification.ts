import AWS from "aws-sdk"

export async function sendSMSNotification(phoneNumber: string, message: string) {
  // init aws sqs with explicitly credential from env
  const sns = new AWS.SNS({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  })

  // promise for sending sms message via aws sns
  const snsPromise = sns.publish({
    Message: message,
    PhoneNumber: phoneNumber
  }).promise()

  // log sqs error
  const result = await snsPromise.then(data => data).catch(err => {
    console.error(`Send SMS Notificaiton error ${err}`)
    throw err
  })

  // log sqs result
  console.log(`Send SMS Notification result ${JSON.stringify(result)}`)
}