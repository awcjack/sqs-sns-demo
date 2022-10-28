import AWS from "aws-sdk"

// sqs url for publishing message
const SNS_ARN: string = process.env.SNS_ARN || "default SNS ARN"

export async function publishSNSEvent(event: {phoneNumber: string, message: string}) {
  // init aws sns with explicitly credential from env
  const sns = new AWS.SNS({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  })

  // promise for publish message to aws sqs queue
  const sendSNSMessagePromise = sns.publish({
    Message: JSON.stringify(event),
    TopicArn: SNS_ARN,
    MessageGroupId: "messageGroupId",
    MessageDeduplicationId: "messageDeduplicationId"
  }).promise()

  // log sqs error
  const result = await sendSNSMessagePromise.then(data => data).catch(err => {
    console.error(err)
    throw err
  })

  // log sqs result
  console.log(`Publich SNS event result ${JSON.stringify(result)}`)
}