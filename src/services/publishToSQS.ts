import AWS from "aws-sdk"

// sqs url for publishing message
const SQS_URL: string = process.env.SQS_URL || "default SQS URL"

export async function publishSQSEvent(event: {phoneNumber: string, message: string}) {
  // init aws sqs with explicitly credential from env
  const sqs = new AWS.SQS({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  })

  // promise for publish message to aws sqs queue
  const sendSQSMessagePromise = sqs.sendMessage({
    MessageBody: JSON.stringify(event),
    QueueUrl: SQS_URL
  }).promise()

  // log sqs error
  const result = await sendSQSMessagePromise.then(data => data).catch(err => {
    console.error(err)
    throw err
  })

  // log sqs result
  console.log(`Publich SQS event result ${JSON.stringify(result)}`)
}