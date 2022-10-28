import { publishSQSEvent } from "./publishToSQS"
import AWS from 'aws-sdk'

jest.mock('aws-sdk', () => {
  const SQSMocked = {
    sendMessage: jest.fn().mockReturnThis(),
    promise: jest.fn()
  }
  return {
    SQS: jest.fn(() => SQSMocked)
  }
})

const sqs = new AWS.SQS({
  region: "us-east-1"
})

describe("Test case for publich SQS Event", () => {
  beforeEach(() => {
    (sqs.sendMessage().promise as jest.MockedFunction<any>).mockReset();
  })

  it("Normal Publish", async () => {
    expect(jest.isMockFunction(sqs.sendMessage)).toBeTruthy()
    expect(jest.isMockFunction(sqs.sendMessage().promise)).toBeTruthy();
    (sqs.sendMessage().promise as jest.MockedFunction<any>).mockResolvedValueOnce('mocked data')
    const actualValue = await publishSQSEvent({
      phoneNumber: "123",
      message: "hello world"
    })
    expect(actualValue).toBeUndefined()
    expect(sqs.sendMessage).toBeCalledWith({ MessageBody: "{\"phoneNumber\":\"123\",\"message\":\"hello world\"}", QueueUrl: "default SQS URL" })
    expect(sqs.sendMessage().promise).toBeCalledTimes(1)
  })

  it('Throw an error when send message error', async () => {
    const sendMessageErrorMessage = "network error";
    (sqs.sendMessage().promise as jest.MockedFunction<any>).mockRejectedValueOnce(sendMessageErrorMessage);
    try {
     await publishSQSEvent({
        phoneNumber: "123",
        message: "hello world"
      })
    } catch (err) {
      expect(err).toEqual(sendMessageErrorMessage)
    }
    expect(sqs.sendMessage).toBeCalledWith({ MessageBody: "{\"phoneNumber\":\"123\",\"message\":\"hello world\"}", QueueUrl: "default SQS URL" })
    expect(sqs.sendMessage().promise).toBeCalledTimes(1)
  })
})