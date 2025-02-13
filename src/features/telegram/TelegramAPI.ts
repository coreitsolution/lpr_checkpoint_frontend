import { SendMessage } from "./TelegramTypes"
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import { TELEGRAM_URL } from '../../config/apiConfig'

export const sendMessage = async (sendMessage: SendMessage) => {
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