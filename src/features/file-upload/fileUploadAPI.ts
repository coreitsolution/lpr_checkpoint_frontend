import { getUrls } from '../../config/runtimeConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import { FileUploadDetail, FileUpload, FileDelete, DeleteRequestData } from "./fileUploadTypes"

export const postFilesData = async (newFile: FormData): Promise<FileUpload> => {
  const { API_URL } = getUrls();
  try {
    if (isDevEnv) {
      const fileData: FileUploadDetail[] = [{
        filename: "",
        originalName: "",
        mimetype: "",
        sizeMB: 0,
        title: "",
        url: "",
      }]
      const fileUpload: FileUpload = {
        data: fileData
      }
      return Promise.resolve(fileUpload)
    }
  
    return await fetchClient<FileUpload>(combineURL(API_URL, "/upload"), {
      method: "POST",
      isFormData: true,
      headers: { 
        Accept: 'application/json',
      },
      body: newFile,
    })
  } 
  catch (error: any) {
    throw new Error((error as { message: string }).message || "Unknown error occurred while uploading files.")
  }
}

export const deleteFilesData = async (url: DeleteRequestData): Promise<FileDelete> => {
  const { API_URL } = getUrls();
  try {
    if (isDevEnv) {
      const fileData: DeleteRequestData = {
        url: "",
      }
      const fileUpload: FileDelete = {
        data: fileData
      }
      return Promise.resolve(fileUpload)
    }
    return await fetchClient<FileDelete>(combineURL(API_URL, "/upload/remove"), {
      method: "POST",
      headers: { 
        Accept: 'application/json',
      },
      body: JSON.stringify(url),
    })
  } 
  catch (error: any) {
    throw new Error((error as { message: string }).message || "Unknown error occurred while deleting files.")
  }
}