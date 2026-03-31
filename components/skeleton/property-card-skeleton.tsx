import ContentLoader from "react-content-loader";

interface PropertyCardSkeletonProps {
  colstyle?: boolean;
  className?: string;
}

export const PropertyCardSkeleton = ({ colstyle = false, className = "" }: PropertyCardSkeletonProps) => {
  // Skeleton cho grid style (colstyle = true)
  if (colstyle) {
    return (
      <div className={`property-card-skeleton ${className}`}>
        <ContentLoader
          speed={2}
          width="100%"
          height={400}
          viewBox="0 0 350 400"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          {/* Image */}
          <rect x="0" y="0" rx="8" ry="8" width="100%" height="250" />
          
          {/* Badges */}
          <rect x="15" y="15" rx="4" ry="4" width="60" height="24" />
          <rect x="85" y="15" rx="4" ry="4" width="80" height="24" />
          
          {/* Title */}
          <rect x="15" y="270" rx="4" ry="4" width="85%" height="20" />
          
          {/* Address */}
          <rect x="15" y="300" rx="4" ry="4" width="70%" height="16" />
          
          {/* Price */}
          <rect x="15" y="330" rx="4" ry="4" width="40%" height="24" />
          
          {/* Features */}
          <rect x="15" y="365" rx="4" ry="4" width="30%" height="20" />
          <rect x="55%" y="365" rx="4" ry="4" width="30%" height="20" />
        </ContentLoader>
      </div>
    );
  }

  // Skeleton cho list style (colstyle = false)
  return (
    <div className={`property-card-skeleton ${className}`}>
      <ContentLoader
        speed={2}
        width="100%"
        height={200}
        viewBox="0 0 800 200"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        {/* Image */}
        <rect x="0" y="0" rx="8" ry="8" width="200" height="200" />
        
        {/* Content */}
        {/* Badges */}
        <rect x="220" y="10" rx="4" ry="4" width="60" height="24" />
        <rect x="290" y="10" rx="4" ry="4" width="80" height="24" />
        
        {/* Title */}
        <rect x="220" y="45" rx="4" ry="4" width="70%" height="20" />
        
        {/* Address */}
        <rect x="220" y="75" rx="4" ry="4" width="60%" height="16" />
        
        {/* Price */}
        <rect x="220" y="105" rx="4" ry="4" width="35%" height="24" />
        
        {/* Features */}
        <rect x="220" y="145" rx="4" ry="4" width="20%" height="18" />
        <rect x="340" y="145" rx="4" ry="4" width="20%" height="18" />
        <rect x="460" y="145" rx="4" ry="4" width="20%" height="18" />
        
        {/* Divider */}
        <rect x="220" y="175" rx="2" ry="2" width="90%" height="1" />
        
        {/* Agent/Action */}
        <rect x="220" y="185" rx="4" ry="4" width="30%" height="15" />
        <rect x="85%" y="180" rx="4" ry="4" width="40" height="18" />
      </ContentLoader>
    </div>
  );
};

// Skeleton cho grid layout (3 cột)
export const PropertyGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="row">
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className="col-lg-4 col-md-6 mb-4">
          <PropertyCardSkeleton colstyle={true} />
        </div>
      ))}
    </div>
  );
};

// Skeleton cho list layout
export const PropertyListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div>
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className="mb-4">
          <PropertyCardSkeleton colstyle={false} />
        </div>
      ))}
    </div>
  );
};

// Skeleton đơn giản hơn, chỉ hiển thị ảnh và text cơ bản
export const SimplePropertyCardSkeleton = () => {
  return (
    <div className="property-card-skeleton">
      <ContentLoader
        speed={2}
        width="100%"
        height={300}
        viewBox="0 0 350 300"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        {/* Image */}
        <rect x="0" y="0" rx="8" ry="8" width="100%" height="200" />
        
        {/* Title */}
        <rect x="0" y="215" rx="4" ry="4" width="80%" height="18" />
        
        {/* Price */}
        <rect x="0" y="245" rx="4" ry="4" width="40%" height="20" />
        
        {/* Location */}
        <rect x="0" y="275" rx="4" ry="4" width="60%" height="14" />
      </ContentLoader>
    </div>
  );
};

// Skeleton cho slider/carousel
export const PropertySliderSkeleton = ({ slidesPerView = 3 }: { slidesPerView?: number }) => {
  return (
    <div className="property-slider-skeleton">
      <div className="row">
        {Array(slidesPerView).fill(0).map((_, index) => (
          <div key={index} className="col-md-4">
            <PropertyCardSkeleton colstyle={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;