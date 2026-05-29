/* eslint-disable max-lines */
"use server";

import { prisma } from "@/lib/core/prisma";
import { getYouTubeStats } from "@/lib/platforms/youtube";
import { getInstagramStats } from "@/lib/platforms/instagram";
import { protectedAction } from "@/lib/core/action-utils";
import { Account } from "@prisma/client";

interface PlatformStats {
  type: 'youtube' | 'instagram';
  data: {
    views?: number;
    subscribers?: number;
    reach?: number;
    followers?: number;
  } | null;
}

export async function getDashboardStats() {
  return protectedAction(async function fetchStats(userId) {
    try {
      // 1. Total Posts (Local DB)
      const totalPosts = await prisma.postActivity.count({
        where: { userId }
      });

      // 2. Fetch platform stats in parallel
      const accounts = await prisma.account.findMany({
        where: { userId }
      });

      if (!accounts || !Array.isArray(accounts)) {
        return [
          { label: 'Total Posts', value: totalPosts.toString(), change: '+100%', icon: 'Description' },
          { label: 'Total Reach', value: '0', change: '0%', icon: 'TrendingUp' },
          { label: 'Community', value: '0', change: 'no accounts', icon: 'Group' },
          { label: 'Engagement', value: '0.0%', change: 'Avg. Rate', icon: 'Favorite' },
        ];
      }

      const platformPromises = accounts.map(async (acc: Account): Promise<PlatformStats | null> => {
        try {
          if (acc.provider === "google") {
            return { type: 'youtube', data: await getYouTubeStats(userId, acc.id) };
          } else if (acc.provider === "facebook") {
            return { type: 'instagram', data: await getInstagramStats(userId, acc.id) };
          }
          return null;
        } catch (err) {
          console.error(`Failed to fetch stats for ${acc.provider}:`, err);
          return null;
        }
      });

      const resultsArray = await Promise.all(platformPromises);
      const platformResults = (resultsArray || []).filter((res): res is PlatformStats => res !== null);

      let totalReach = 0;
      let totalFollowers = 0;
      let activePlatforms = 0;

      (platformResults || []).forEach(res => {
        if (!res?.data) return;
        activePlatforms++;
        if (res.type === 'youtube') {
          totalReach += res.data.views || 0;
          totalFollowers += res.data.subscribers || 0;
        } else if (res.type === 'instagram') {
          totalReach += res.data.reach || 0;
          totalFollowers += res.data.followers || 0;
        }
      });

      // 3. Fake Engagement Logic (until we have individual post metrics)
      const engagement = totalReach > 0 ? (totalFollowers / totalReach * 100).toFixed(1) : "0.0";

      return [
        { 
          label: 'Total Posts', 
          value: totalPosts.toString(), 
          change: '+100%', 
          icon: 'Description' 
        },
        { 
          label: 'Total Reach', 
          value: formatNumber(totalReach), 
          change: '+12.5%', 
          icon: 'TrendingUp' 
        },
        { 
          label: 'Community', 
          value: formatNumber(totalFollowers), 
          change: `across ${activePlatforms} platforms`, 
          icon: 'Group' 
        },
        { 
          label: 'Engagement', 
          value: `${engagement}%`, 
          change: 'Avg. Rate', 
          icon: 'Favorite' 
        },
      ];
    } catch (err: unknown) {
      console.error("fetchStats Error:", err);
      return [
        { label: 'Total Posts', value: '0', change: 'Error', icon: 'Description' },
        { label: 'Total Reach', value: '0', change: 'Error', icon: 'TrendingUp' },
        { label: 'Community', value: '0', change: 'Error', icon: 'Group' },
        { label: 'Engagement', value: '0.0%', change: 'Error', icon: 'Favorite' },
      ];
    }
  });
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
