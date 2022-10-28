import { publishSNSEvent } from "./publishToSNS"
import { publishSNSEvent as publishSNSEventFunction } from "../services/publishToSNS"

jest.mock("../services/publishToSNS", () => ({
  publishSNSEvent: jest.fn()
}))

describe("Test case for HTTP event", () => {
  it("Normal event", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await publishSNSEvent({
      body: "{\"phoneNumber\":\"+123\",\"message\":\"hello world\"}" 
    })
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        ok: 1
      }),
    })
    expect(publishSNSEventFunction).toBeCalledWith({
      phoneNumber: "+123",
      message: "hello world"
    })
  })

  it("Invalid phone number event", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await publishSNSEvent({
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
    const result = await publishSNSEvent({
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
    const result = await publishSNSEvent({
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
    const result = await publishSNSEvent({})
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        ok: 0,
        error: "Missing request body"
      }),
    })
  })

  it("Error from SNS", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    publishSNSEventFunction.mockRejectedValue("Mocking Error")
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await publishSNSEvent({
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