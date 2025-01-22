export interface SettingDetail {
  id: number
  key: string
  name: string
  value: string
  description: string
  created_at: string
  updated_at: string
}

export interface SettingDetailShort {
  live_view_count: string
  checkpoint_name: string
}


export interface SettingData {
  message?: string
  status?: string
  success?: string
  data?: SettingDetail[]
}

export interface SettingDataShort {
  message?: string
  status?: string
  success?: string
  data?: SettingDetailShort
}