let config: Record<string, any> | null = null;

export async function loadConfig(): Promise<void> {
  const res = await fetch('/config.json');
  if (!res.ok) {
    throw new Error(`Failed to load config: ${res.status}`);
  }
  config = await res.json();
}

export function getConfig() {
  if (!config) {
    throw new Error('Config not loaded yet');
  }
  return config;
}

export function getUrls() {
  const cfg = getConfig();

  return {
    IMAGE_URL: cfg.VITE_IMAGE_BASE_URL,
    FILE_URL: cfg.VITE_FILE_UPLOAD_BASE_URL,
    STREAM_URL: `${cfg.VITE_STREAM_BASE_URL}/api${cfg.VITE_API_VERSION}`,
    API_URL: `${cfg.VITE_BASE_URL}/lpr-node-api/api${cfg.VITE_API_VERSION}`,
    TELEGRAM_URL: `${cfg.VITE_TELEGRAM_BASE_URL}/bot`,
    WEB_SOCKET_SERVICE: cfg.VITE_WEB_SOCKET_SERVICE_REALTIME,
    TELEGRAM_CHAT_ID: cfg.VITE_BASE_TELEGRAM_CHAT_ID,
    SERVICE_1_URL: `${cfg.VITE_SERVICE_1_BASE_URL}/api${cfg.VITE_API_VERSION}`,
    SERVICE_1_TOKEN: cfg.VITE_SERVICE_1_TOKEN
  };
}