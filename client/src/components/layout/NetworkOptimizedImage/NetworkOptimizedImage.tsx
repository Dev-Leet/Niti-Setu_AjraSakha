import { LazyImage } from '@/components/common/LazyImage/LazyImage';
import { useNetworkOptimization } from '@/hooks/useNetworkOptimization';

interface NetworkOptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const NetworkOptimizedImage = ({ src, alt, className, width, height }: NetworkOptimizedImageProps) => {
  const { shouldLoadImages, imageQuality, isSlowConnection } = useNetworkOptimization();

  if (!shouldLoadImages) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center text-gray-500 text-sm`}
        style={{ width, height }}
      >
        Image loading disabled on slow connection
      </div>
    );
  }

  const optimizedSrc = isSlowConnection ? `${src}?quality=${Math.round(imageQuality * 100)}` : src;

  return <LazyImage src={optimizedSrc} alt={alt} className={className} width={width} height={height} />;
};