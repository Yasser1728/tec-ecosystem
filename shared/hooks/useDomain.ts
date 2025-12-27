import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getDomainConfig } from '@/domains/registry';
import type { DomainConfig } from '@/types/domain';

interface UseDomainReturn {
  config: DomainConfig | null;
  loading: boolean;
  error: Error | null;
}

export const useDomain = (): UseDomainReturn => {
  const router = useRouter();
  const [config, setConfig] = useState<DomainConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const pathParts = router.pathname.split('/');
        const domainSlug = pathParts[1];
        
        if (domainSlug) {
          const domainConfig = await getDomainConfig(domainSlug);
          setConfig(domainConfig);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(new Error(`Failed to load domain config: ${errorMessage}`));
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, [router.pathname]);
  
  return { config, loading, error };
};
