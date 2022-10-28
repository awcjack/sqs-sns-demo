import { SQSEvent } from "aws-lambda"
import { sendSMSNotification as sendSMSNotificationFunction } from "../services/smsNotification"

type Response = { batchItemFailures: { itemIdentifier: string }[]}
interface SQSEventFormat {
  phoneNumber: string
  message: string
}

export async function sendSMSNotification(event: SQSEvent) {
  // throw error when record is missing
  if (!event.Records || event.Records.length === 0) {
    throw new Error("Empty Records")
  }

  const response: Response = { batchItemFailures: [] }

  for (let i = 0; i < event.Records.length; i++) {
    try {
      const requestBody: SQSEventFormat = JSON.parse(event.Records[i].body)
      await sendSMSNotificationFunction(requestBody.phoneNumber, requestBody.message)
    } catch (err) {
      // mark failed to process those event in sqs
      response.batchItemFailures.push({ itemIdentifier: event.Records[i].messageId })
    }
  }

  return response
}

exports.sendSMSNotification = sendSMSNotification