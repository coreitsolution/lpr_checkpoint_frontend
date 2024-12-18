export interface FileUpload {
  data?: FileUploadDetail[]
}

export interface FileDelete {
  data?: DeleteRequestData
}

export interface FileUploadDetail {
  filename: string
  originalName: string
  mimetype: string
  sizeMB: number
  title: string
  url: string 
}

export interface MultipartRequestData {
  files: File[]
}

export interface DeleteRequestData {
  url: string
}