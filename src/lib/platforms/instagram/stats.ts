export const fetchInstagramStats = async (igUserId: string, accessToken: string) => {
  const url = `https://graph.facebook.com/v20.0/${igUserId}?fields=followers_count,media_count,name&access_token=${accessToken}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) return null;

  const insightsUrl = `https://graph.facebook.com/v20.0/${igUserId}/insights?metric=reach,impressions&period=days_28&access_token=${accessToken}`;
  const insightsRes = await fetch(insightsUrl);
  const insightsData = await insightsRes.json();

  let reach = 0;
  if (insightsData.data) {
    const reachData = insightsData.data.find((m: { name: string; values: Array<{ value: number }> }) => m.name === 'reach');
    if (reachData?.values?.length > 0) reach = reachData.values[0].value;
  }

  return {
    followers: data.followers_count,
    media: data.media_count,
    name: data.name,
    reach
  };
};
