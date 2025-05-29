import { getUrls } from '../../config/runtimeConfig';
import { SendMessage } from "./TelegramTypes"
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"

export const sendMessage = async (sendMessage: SendMessage) => {
  const { TELEGRAM_URL } = getUrls();
  try {
    if (isDevEnv) {
      return Promise.resolve()
    }
    const response = await fetchClient(combineURL(TELEGRAM_URL, "/send-message"), {
      method: "POST",
      body: JSON.stringify(sendMessage),
      isService1: true,
    })
    return response
  } 
  catch (error) {
    throw new Error(`Failed to send message: ${error}`)
  }
}