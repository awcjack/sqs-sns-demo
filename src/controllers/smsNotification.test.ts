import { sendSMSNotification } from "./smsNotification"
import { sendSMSNotification as sendSMSNotificationFunction } from "../services/smsNotification"

jest.mock("../services/smsNotification", () => ({
  sendSMSNotification: jest.fn()
}))

describe("Test case for HTTP event", () => {
  it("Normal event", async () => {
    const result = await sendSMSNotification({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Records: [{
        body: "{\"phoneNumber\":\"+123\",\"message\":\"hello world\"}",
        messageId: "1"
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      {
        body: "{\"phoneNumber\":\"+123\",\"message\":\"hello world2\"}",
        messageId: "2"
      }]
    })
    expect(result).toEqual({ batchItemFailures: [] })
    expect(sendSMSNotificationFunction).toBeCalledWith("+123", "hello world")
    expect(sendSMSNotificationFunction).toBeCalledWith("+123", "hello world2")
  })

  it("empty record", async () => {
    await expect(sendSMSNotification({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Records: []
    })).rejects.toThrow("Empty Records")
  })

  it("Some event failed to process", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sendSMSNotificationFunction.mockResolvedValueOnce(undefined)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sendSMSNotificationFunction.mockRejectedValueOnce("Mocking Error")
    const result = await sendSMSNotification({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Records: [{
        body: "{\"phoneNumber\":\"+123\",\"message\":\"hello world\"}",
        messageId: "1"
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      {
        body: "{\"phoneNumber\":\"+123\",\"message\":\"hello world2\"}",
        messageId: "2"
      }]
    })
    expect(result).toEqual({ batchItemFailures: [{ itemIdentifier: "2" } ] })
    expect(sendSMSNotificationFunction).toBeCalledWith("+123", "hello world")
    expect(sendSMSNotificationFunction).toBeCalledWith("+123", "hello world2")
  })
})