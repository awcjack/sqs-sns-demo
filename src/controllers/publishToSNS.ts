import { APIGatewayProxyEvent } from "aws-lambda"
import { publishSNSEvent as publishSNSEventFunction } from "../services/publishToSNS"

interface SNSEventRequest {
  phoneNumber: string
  message: string
}

export async function publishSNSEvent(event: APIGatewayProxyEvent) {
  // throw error when missing request body
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: 0,
        error: "Missing request body"
      })
    }
  }

  const requestBody: SNSEventRequest = JSON.parse(event.body)
  const E164PhoneNumberRegex = /^\+[0-9]{1,15}$/
  // throw error when missing phone number in request body or wrong phone number format
  if (!requestBody.phoneNumber || !E164PhoneNumberRegex.test(requestBody.phoneNumber)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: 0,
        error: "Missing phone number or invalid phone number"
      })
    }
  }
  // throw error when missing message in request body
  if (!requestBody.message) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: 0,
        error: "Missing message"
      })
    }
  }


  try {
    await publishSNSEventFunction({
      phoneNumber: requestBody.phoneNumber,
      message: requestBody.message
    })
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: 0,
        error: err
      })
    }
  }

  // return result to client
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: 1
    }),
  }
}

exports.publishSNSEvent = publishSNSEvent