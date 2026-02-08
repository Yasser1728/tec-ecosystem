/**
 * Pull to Refresh Component
 * TEC Ecosystem - Mobile pull-to-refresh functionality
 * 
 * @module components/ui/PullToRefresh
 * @version 1.0.0
 */

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n/translations';

/**
 * Pull to Refresh Component
 * Provides pull-to-refresh functionality for mobile views
 */
export default function PullToRefresh({ onRefresh, children }) {
  const { language } = useLanguage();
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const threshold = 80; // Distance in pixels to trigger refresh
  
  const t = translations[language].mobile;

  /**
   * Handle touch start
   */
  const handleTouchStart = (e) => {
    // Only start pull if at top of page
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  /**
   * Handle touch move
   */
  const handleTouchMove = (e) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    // Only pull down, not up
    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance * 0.5, threshold * 1.5)); // Dampen the pull
    }
  };

  /**
   * Handle touch end
   */
  const handleTouchEnd = async () => {
    setIsPulling(false);

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      
      try {
        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 500);
      }
    } else {
      setPullDistance(0);
    }
  };

  /**
   * Get pull status message
   */
  const getPullStatus = () => {
    if (isRefreshing) return t.refreshing;
    if (pullDistance >= threshold) return t.releasing;
    return t.pullToRefresh;
  };

  /**
   * Cleanup effect
   */
  useEffect(() => {
    return () => {
      setPullDistance(0);
      setIsPulling(false);
      setIsRefreshing(false);
    };
  }, []);

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-gradient-to-b from-gray-900 to-transparent transition-all duration-200"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance / threshold,
        }}
      >
        <div className="flex flex-col items-center gap-2 pt-4">
          {/* Spinner or Arrow */}
          <div className={`
            text-2xl
            ${isRefreshing ? 'animate-spin' : ''}
            ${pullDistance >= threshold && !isRefreshing ? 'animate-bounce' : ''}
          `}>
            {isRefreshing ? '⟳' : pullDistance >= threshold ? '↓' : '↓'}
          </div>
          
          {/* Status Text */}
          <p className="text-xs text-gray-400 font-medium">
            {getPullStatus()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
