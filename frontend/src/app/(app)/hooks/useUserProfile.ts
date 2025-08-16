// src/app/(app)/hooks/useUserProfile.ts
'use client';
import { useEffect, useState, useMemo } from 'react';
import { API } from '../_api/api';

const api = new API();

export interface UserProfile {
  user_id: number;
  created_at: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other' | string;
  height: number;      // cm
  weight: number;      // kg
  activity_level: string;
  allergies: string[];
  likes: string[];
  dislikes: string[];
  diet: string;
  goal: string;
  avatarUrl?: string;   // optional
}

export function useUserProfile(userId: number) {
  const [data, setData]   = useState<UserProfile | null>(null);
  const [loading, setL]   = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setL(true);
        // adjust path to your actual endpoint
        const res = await api.getJsonData<UserProfile>(`users/${userId}/profile`);
        if (alive) setData(res);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setL(false);
      }
    })();
    return () => { alive = false; };
  }, [userId]);

  // derived numbers — keeps your render clean
  const derived = useMemo(() => {
    if (!data) return { bmi: null as number | null };
    const bmi = +(data.weight / Math.pow(data.height / 100, 2)).toFixed(1);
    return { bmi };
  }, [data]);

  return { data, loading, error, ...derived };
}