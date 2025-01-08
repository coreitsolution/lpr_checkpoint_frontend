export interface SettingDetail {
  id: number
  name: string
  value: string
  description: string
  created_at: string
  updated_at: string
}

export interface SettingData {
  message?: string
  status?: string
  success?: string
  data?: SettingDetail[]
}