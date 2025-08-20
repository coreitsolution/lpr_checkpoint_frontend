import { getUrls } from '../../config/runtimeConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import {
  Checkpoint,
  CheckpointResponse,
  NewCheckpointSetting,
} from "./checkpointSettingsTypes";
import { mockCheckpoint } from "../../mocks/mockCheckpoints";

export const fetchCheckpoints = async (param?: Record<string, string>): Promise<CheckpointResponse> => {
  const { API_URL } = getUrls();
  if (isDevEnv) {
    return Promise.resolve({
      message: "Mock data",
      status: "success",
      success: true,
      pagination: {
        page: 1,
        maxPage: 1,
        limit: 10,
        count: 1,
        countAll: 1,
      },
      data: [mockCheckpoint],
    });
  }
  return await fetchClient<CheckpointResponse>(combineURL(API_URL, "/checkpoints/get"), {
    method: "GET",
    queryParams: param,
  });
}

export const postCheckpointSetting = async (
  newSetting: NewCheckpointSetting
): Promise<CheckpointResponse> => {
  const { API_URL } = getUrls();
  try {
    if (isDevEnv) {
      const newId = mockCheckpoint.id + 1;
      const settingWithId: Checkpoint = { 
        ...newSetting, 
        id: newId,
        checkpoint_uid: `CHK-${newId.toString().padStart(3, '0')}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return Promise.resolve({
        message: "Mock data",
        status: "success",
        success: true,
        pagination: {
          page: 1,
          maxPage: 1,
          limit: 10,
          count: 1,
          countAll: 1,
        },
        data: [settingWithId],
      });
    }
    return await fetchClient<CheckpointResponse>(combineURL(API_URL, "/checkpoints/post"), {
      method: "POST",
      body: JSON.stringify(newSetting),
    });
  } catch (error) {
    throw new Error((error as { message: string }).message || "Failed to post checkpoint setting");
  }
};