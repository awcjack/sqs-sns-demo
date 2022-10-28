import { publishSQSEvent } from "./publishToSQS"
import { publishSQSEvent as publishSQSEventFunction } from "../services/publishToSQS"

jest.mock("../services/publishToSQS", () => ({
  publishSQSEvent: jest.fn()
}))

describe("Test case for HTTP event", () => {
  it("Normal event", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await publishSQSEvent({
      body: "{\"phoneNumber\":\"+123\",\"message\":\"hello world\"}" 
    })
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        ok: 1
      }),
    })
    expect(publishSQSEventFunction).toBeCalledWith({
      phoneNumber: "+123",
      message: "hello world"
    })
  })

  it("Invalid phone number event", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await publishSQSEvent({
      body: "{\"phoneNumber\":\"+1234567891234567890\",\"message\":\"hello world\"}"
    })
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        ok: 0,
        error: "Missing phone number or invalid phone number"
      }),
    })
  })

  it("Missing phone number event", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await publishSQSEvent({
      body: "{\"message\":\"hello world\"}"
    })
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        ok: 0,
        error: "Missing phone number or invalid phone number"
      }),
    })
  })

  it("Missing message event", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await publishSQSEvent({
      body: "{\"phoneNumber\":\"+123\"}" 
    })
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        ok: 0,
        error: "Missing message"
      }),
    })
  })

  it("Missing body", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await publishSQSEvent({})
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        ok: 0,
        error: "Missing request body"
      }),
    })
  })

  it("Error from SQS", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    publishSQSEventFunction.mockRejectedValue("Mocking Error")
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await publishSQSEvent({
      body: "{\"phoneNumber\":\"+123\",\"message\":\"hello world\"}" 
    })
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        ok: 0,
        error: "Mocking Error"
      }),
    })
  })
})