/**
 * Skeleton Loader Component
 * TEC Ecosystem - Reusable skeleton loading states
 * 
 * @module components/ui/SkeletonLoader
 * @version 1.0.0
 */

/**
 * Skeleton Loader Component
 * Provides various skeleton loading patterns with shimmer effect
 */
export default function SkeletonLoader({ variant = 'card', count = 1, className = '' }) {
  /**
   * Base skeleton styles with shimmer animation
   */
  const baseStyles = 'bg-gray-800 animate-pulse relative overflow-hidden';
  
  /**
   * Shimmer effect overlay
   */
  const shimmerStyles = `
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-transparent before:via-gray-700/20 before:to-transparent
    before:animate-shimmer
  `;

  /**
   * Render card skeleton
   */
  const CardSkeleton = () => (
    <div className={`${baseStyles} ${shimmerStyles} rounded-lg p-6 ${className}`}>
      <div className="h-12 w-12 bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      <div className="mt-4 h-8 bg-gray-700 rounded w-1/3"></div>
    </div>
  );

  /**
   * Render text skeleton
   */
  const TextSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      <div className={`${baseStyles} ${shimmerStyles} h-4 rounded w-full`}></div>
      <div className={`${baseStyles} ${shimmerStyles} h-4 rounded w-5/6`}></div>
      <div className={`${baseStyles} ${shimmerStyles} h-4 rounded w-4/6`}></div>
    </div>
  );

  /**
   * Render button skeleton
   */
  const ButtonSkeleton = () => (
    <div className={`${baseStyles} ${shimmerStyles} h-12 rounded-lg w-32 ${className}`}></div>
  );

  /**
   * Render list item skeleton
   */
  const ListItemSkeleton = () => (
    <div className={`${baseStyles} ${shimmerStyles} rounded-lg p-4 flex items-center gap-4 ${className}`}>
      <div className="h-12 w-12 bg-gray-700 rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );

  /**
   * Render avatar skeleton
   */
  const AvatarSkeleton = () => (
    <div className={`${baseStyles} ${shimmerStyles} h-12 w-12 rounded-full ${className}`}></div>
  );

  /**
   * Render table row skeleton
   */
  const TableRowSkeleton = () => (
    <div className={`${baseStyles} ${shimmerStyles} rounded p-4 flex items-center gap-4 ${className}`}>
      <div className="h-4 bg-gray-700 rounded w-1/6"></div>
      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/6"></div>
      <div className="h-4 bg-gray-700 rounded w-1/6"></div>
      <div className="h-4 bg-gray-700 rounded w-1/6"></div>
    </div>
  );

  /**
   * Render image skeleton
   */
  const ImageSkeleton = () => (
    <div className={`${baseStyles} ${shimmerStyles} aspect-video rounded-lg ${className}`}></div>
  );

  /**
   * Select skeleton variant
   */
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return <CardSkeleton />;
      case 'text':
        return <TextSkeleton />;
      case 'button':
        return <ButtonSkeleton />;
      case 'list-item':
        return <ListItemSkeleton />;
      case 'avatar':
        return <AvatarSkeleton />;
      case 'table-row':
        return <TableRowSkeleton />;
      case 'image':
        return <ImageSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  /**
   * Render multiple skeletons if count > 1
   */
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={i < count - 1 ? 'mb-4' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}

/**
 * Add shimmer animation to globals.css or tailwind config:
 * 
 * @keyframes shimmer {
 *   0% { transform: translateX(-100%); }
 *   100% { transform: translateX(100%); }
 * }
 * 
 * .animate-shimmer {
 *   animation: shimmer 2s infinite;
 * }
 */
