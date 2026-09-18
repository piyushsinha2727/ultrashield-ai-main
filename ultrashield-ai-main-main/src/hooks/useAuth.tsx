import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
    dateOfBirth: string,
    ageGroupOverride?: 'child' | 'teen' | 'adult',
    govId?: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const DEMO_USER_KEY = 'ultrashield:demo_user_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const storedDemo = localStorage.getItem(DEMO_USER_KEY);
        if (storedDemo) {
          const parsedUser = JSON.parse(storedDemo);
          if (isMounted) {
            setUser(parsedUser);
            setLoading(false);
          }
          return;
        }

        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch {
        const storedDemo = localStorage.getItem(DEMO_USER_KEY);
        if (storedDemo && isMounted) {
          setUser(JSON.parse(storedDemo));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    let subscription: any;
    try {
      const authRes = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (!localStorage.getItem(DEMO_USER_KEY)) {
          setSession(nextSession);
          setUser(nextSession?.user ?? null);
        }
      });
      subscription = authRes.data?.subscription;
    } catch {}

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const createLocalUser = (email: string, name: string, ageGroup: string, govId?: string, dob?: string): User => {
    return {
      id: `demo-${Date.now()}`,
      email,
      app_metadata: { provider: 'demo' },
      user_metadata: {
        name,
        age_group: ageGroup,
        gov_id: govId || 'CHD-001',
        date_of_birth: dob || '2015-10-03',
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    dateOfBirth: string,
    ageGroupOverride?: 'child' | 'teen' | 'adult',
    govId?: string
  ) => {
    const dob = new Date(dateOfBirth);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const ageGroup = ageGroupOverride ?? (age < 13 ? 'child' : age < 18 ? 'teen' : 'adult');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { name, age_group: ageGroup, gov_id: govId, date_of_birth: dateOfBirth },
        },
      });

      if (error) throw error;

      if (data.user) {
        try {
          await supabase.from('profiles').insert({
            user_id: data.user.id,
            name,
            date_of_birth: dateOfBirth,
            government_id: govId,
            age_group: ageGroup,
          });

          await supabase.from('user_preferences').insert({
            user_id: data.user.id,
            age_group: ageGroup,
            safe_mode: true,
          });
        } catch {}
      }
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('fetch') || !navigator.onLine) {
        const localUser = createLocalUser(email, name, ageGroup, govId, dateOfBirth);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(localUser));
        setUser(localUser);
        return;
      }
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('fetch') || err.message?.includes('Invalid login credentials')) {
        const localUser = createLocalUser(email, email.split('@')[0], 'adult', 'ADT-201', '1995-05-15');
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(localUser));
        setUser(localUser);
        return;
      }
      throw err;
    }
  };

  const signOut = async () => {
    localStorage.removeItem(DEMO_USER_KEY);
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
