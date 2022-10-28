import { sendSMSNotification } from "./smsNotification"
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

const sns = new AWS.SNS({
  region: "us-east-1"
})

describe("Test case for sending SNS SMS message", () => {
  beforeEach(() => {
    (sns.publish().promise as jest.MockedFunction<any>).mockReset();
  })

  it("Normal Publish", async () => {
    expect(jest.isMockFunction(sns.publish)).toBeTruthy()
    expect(jest.isMockFunction(sns.publish().promise)).toBeTruthy();
    (sns.publish().promise as jest.MockedFunction<any>).mockResolvedValueOnce('mocked data')
    const actualValue = await sendSMSNotification("123", "hello world")
    expect(actualValue).toBeUndefined()
    expect(sns.publish).toBeCalledWith({ Message: "hello world", PhoneNumber: "123" })
    expect(sns.publish().promise).toBeCalledTimes(1)
  })

  it('Throw an error when send message error', async () => {
    const sendMessageErrorMessage = "network error";
    (sns.publish().promise as jest.MockedFunction<any>).mockRejectedValueOnce(sendMessageErrorMessage);
    try {
      await sendSMSNotification("123", "hello world")
    } catch (err) {
      expect(err).toEqual(sendMessageErrorMessage)
    }
    expect(sns.publish).toBeCalledWith({ Message: "hello world", PhoneNumber: "123" })
    expect(sns.publish().promise).toBeCalledTimes(1)
  })
})