import {
  SettingDetail,
  SettingDetailShort
} from "../features/settings/settingsTypes";

export const mockSettings: SettingDetail[] = [
  {
    id: 1,
    key: "live_view_count",
    name: "Live view",
    value: "3",
    description: "Live view",
    created_at: "2024-12-17T14:35:00Z",
    updated_at: "2024-12-17T14:35:00Z",
  },
  {
    id: 2,
    key: "checkpoint_name",
    name: "Checkpoint name",
    value: "Office",
    description: "Checkpoint name",
    created_at: "2024-12-17T14:35:00Z",
    updated_at: "2024-12-17T14:35:00Z",
  }
]

export const mockSettingsShort: SettingDetailShort = 
{
  live_view_count: "3",
  checkpoint_name: "Office",
}
