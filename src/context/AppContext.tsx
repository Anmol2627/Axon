'use client';

// ============================================================
// Axon — App State Context
// Client-side state: current user session, UI preferences.
// Integrated with Supabase Auth for real-time authentication
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Profile } from '@/lib/models';
import { supabase } from '@/lib/supabase';

interface AppState {
  currentUser: User | null;
  currentProfile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (profile: Profile) => void;
  refreshUser: () => void;
}

const AppContext = createContext<AppState | null>(null);

async function getDataService() {
  const mod = await import('@/lib/dataService');
  return mod.dataService;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCurrentUser(null);
        setCurrentProfile(null);
        setIsLoading(false);
        return;
      }
      
      const userId = session.user.id;
      const ds = await getDataService();
      
      // We might need to wait for the trigger to insert the user record
      let user = await ds.getUser(userId);
      let attempts = 0;
      while (!user && attempts < 3) {
        await new Promise(r => setTimeout(r, 1000));
        user = await ds.getUser(userId);
        attempts++;
      }
      
      const profile = await ds.getProfile(userId);
      setCurrentUser(user ?? null);
      setCurrentProfile(profile ?? null);
    } catch (e) {
      console.error('Failed to load user:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
    const collapsed = localStorage.getItem('axon_sidebar_collapsed') === 'true';
    setSidebarCollapsed(collapsed);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser();
    });

    return () => subscription.unsubscribe();
  }, [loadUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Sign in failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name }
        }
      });
      if (error) throw error;
      
      localStorage.setItem('axon_needs_onboarding', 'true');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentProfile(null);
  }, []);

  const updateProfile = useCallback(async (profile: Profile) => {
    setCurrentProfile(profile);
    const ds = await getDataService();
    await ds.upsertProfile(profile);
  }, []);

  const handleSetSidebar = useCallback((v: boolean) => {
    setSidebarCollapsed(v);
    localStorage.setItem('axon_sidebar_collapsed', String(v));
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentProfile,
        isAuthenticated: !!currentUser,
        isLoading,
        sidebarCollapsed,
        setSidebarCollapsed: handleSetSidebar,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
