import useAuthStore from '@/zustland/authStore';
import {resetToSignIn} from '@/navigation/rootNavigation';
import {refreshTokenService} from './RefreshToken';

type RefreshTokenResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

let inFlight: Promise<{accessToken: string; refreshToken: string}> | null = null;

export async function refreshTokenOnce(): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  if (inFlight) return inFlight;

  const {refreshToken, setToken, setRefreshToken, clear} = useAuthStore.getState();

  inFlight = (async () => {
    if (!refreshToken) {
      clear();
      resetToSignIn();
      throw new Error('Refresh token is missing');
    }

    const res = await refreshTokenService<RefreshTokenResponse>(refreshToken);

    if (!res.ok) {
      clear();
      resetToSignIn();
      throw res.error;
    }

    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = res.data.data;
    setToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    return {accessToken: newAccessToken, refreshToken: newRefreshToken};
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

