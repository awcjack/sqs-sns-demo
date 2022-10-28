import { publishSNSEvent } from "./publishToSNS"
import AWS from 'aws-sdk'

jest.mock('aws-sdk', () => {
  const SNSMocked = {
    publish: jest.fn().mockReturnThis(),
    promise: jest.fn()
  }
  return {
    SNS: jest.fn(() => SNSMocked)
  }
})

const SNS = new AWS.SNS({
  region: "us-east-1"
})

describe("Test case for publich SNS Event", () => {
  beforeEach(() => {
    (SNS.publish().promise as jest.MockedFunction<any>).mockReset();
  })

  it("Normal Publish", async () => {
    expect(jest.isMockFunction(SNS.publish)).toBeTruthy()
    expect(jest.isMockFunction(SNS.publish().promise)).toBeTruthy();
    (SNS.publish().promise as jest.MockedFunction<any>).mockResolvedValueOnce('mocked data')
    const actualValue = await publishSNSEvent({
      phoneNumber: "123",
      message: "hello world"
    })
    expect(actualValue).toBeUndefined()
    expect(SNS.publish).toBeCalledWith({ Message: "{\"phoneNumber\":\"123\",\"message\":\"hello world\"}", TopicArn: "default SNS ARN" })
    expect(SNS.publish().promise).toBeCalledTimes(1)
  })

  it('Throw an error when send message error', async () => {
    const publishErrorMessage = "network error";
    (SNS.publish().promise as jest.MockedFunction<any>).mockRejectedValueOnce(publishErrorMessage);
    try {
      await publishSNSEvent({
        phoneNumber: "123",
        message: "hello world"
      })
    } catch (err) {
      expect(err).toEqual(publishErrorMessage)
    }
    expect(SNS.publish).toBeCalledWith({ Message: "{\"phoneNumber\":\"123\",\"message\":\"hello world\"}", TopicArn: "default SNS ARN" })
    expect(SNS.publish().promise).toBeCalledTimes(1)
  })
})