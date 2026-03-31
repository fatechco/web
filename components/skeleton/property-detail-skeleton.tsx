import ContentLoader from "react-content-loader";

export const PropertyDetailSkeleton = () => {
  return (
    <section className="pt60 pb0 bgc-white">
      <div className="container">
        {/* Header Skeleton */}
        <div className="row">
          <div className="col-12">
            <ContentLoader
              speed={2}
              width="100%"
              height={100}
              viewBox="0 0 1200 100"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              {/* Title */}
              <rect x="0" y="10" rx="4" ry="4" width="600" height="36" />
              {/* Price */}
              <rect x="0" y="60" rx="4" ry="4" width="200" height="28" />
            </ContentLoader>
          </div>
        </div>

        {/* Gallery Skeleton */}
        <div className="row mb30 mt30">
          <div className="col-12">
            <ContentLoader
              speed={2}
              width="100%"
              height={500}
              viewBox="0 0 1200 500"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              {/* Main Image */}
              <rect x="0" y="0" rx="12" ry="12" width="800" height="500" />
              {/* Thumbnails */}
              <rect x="820" y="0" rx="8" ry="8" width="100" height="100" />
              <rect x="820" y="110" rx="8" ry="8" width="100" height="100" />
              <rect x="820" y="220" rx="8" ry="8" width="100" height="100" />
              <rect x="820" y="330" rx="8" ry="8" width="100" height="100" />
              <rect x="820" y="440" rx="8" ry="8" width="100" height="50" />
            </ContentLoader>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="pt60 pb90 bgc-f7">
        <div className="container">
          <div className="row wrap">
            {/* Left Column */}
            <div className="col-lg-8">
              {/* Description Skeleton */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <ContentLoader
                  speed={2}
                  width="100%"
                  height={300}
                  viewBox="0 0 800 300"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <rect x="0" y="0" rx="4" ry="4" width="200" height="28" />
                  <rect x="0" y="45" rx="4" ry="4" width="100%" height="16" />
                  <rect x="0" y="70" rx="4" ry="4" width="100%" height="16" />
                  <rect x="0" y="95" rx="4" ry="4" width="90%" height="16" />
                  <rect x="0" y="120" rx="4" ry="4" width="95%" height="16" />
                  <rect x="0" y="145" rx="4" ry="4" width="85%" height="16" />
                  <rect x="0" y="170" rx="4" ry="4" width="100%" height="16" />
                  <rect x="0" y="195" rx="4" ry="4" width="80%" height="16" />
                </ContentLoader>
              </div>

              {/* Property Details Skeleton */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <ContentLoader
                  speed={2}
                  width="100%"
                  height={400}
                  viewBox="0 0 800 400"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <rect x="0" y="0" rx="4" ry="4" width="180" height="28" />
                  {/* 2-column grid of details */}
                  <rect x="0" y="50" rx="4" ry="4" width="45%" height="50" />
                  <rect x="55%" y="50" rx="4" ry="4" width="45%" height="50" />
                  <rect x="0" y="120" rx="4" ry="4" width="45%" height="50" />
                  <rect x="55%" y="120" rx="4" ry="4" width="45%" height="50" />
                  <rect x="0" y="190" rx="4" ry="4" width="45%" height="50" />
                  <rect x="55%" y="190" rx="4" ry="4" width="45%" height="50" />
                  <rect x="0" y="260" rx="4" ry="4" width="45%" height="50" />
                  <rect x="55%" y="260" rx="4" ry="4" width="45%" height="50" />
                  <rect x="0" y="330" rx="4" ry="4" width="45%" height="50" />
                  <rect x="55%" y="330" rx="4" ry="4" width="45%" height="50" />
                </ContentLoader>
              </div>

              {/* Address Skeleton */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <ContentLoader
                  speed={2}
                  width="100%"
                  height={150}
                  viewBox="0 0 800 150"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <rect x="0" y="0" rx="4" ry="4" width="150" height="28" />
                  <rect x="0" y="45" rx="4" ry="4" width="70%" height="20" />
                  <rect x="0" y="75" rx="4" ry="4" width="85%" height="20" />
                  <rect x="0" y="105" rx="4" ry="4" width="60%" height="20" />
                </ContentLoader>
              </div>

              {/* Amenities Skeleton */}
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <ContentLoader
                  speed={2}
                  width="100%"
                  height={250}
                  viewBox="0 0 800 250"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <rect x="0" y="0" rx="4" ry="4" width="200" height="28" />
                  {/* Amenities grid */}
                  <rect x="0" y="50" rx="4" ry="4" width="30%" height="30" />
                  <rect x="35%" y="50" rx="4" ry="4" width="30%" height="30" />
                  <rect x="70%" y="50" rx="4" ry="4" width="30%" height="30" />
                  <rect x="0" y="100" rx="4" ry="4" width="30%" height="30" />
                  <rect x="35%" y="100" rx="4" ry="4" width="30%" height="30" />
                  <rect x="70%" y="100" rx="4" ry="4" width="30%" height="30" />
                  <rect x="0" y="150" rx="4" ry="4" width="30%" height="30" />
                  <rect x="35%" y="150" rx="4" ry="4" width="30%" height="30" />
                  <rect x="70%" y="150" rx="4" ry="4" width="30%" height="30" />
                </ContentLoader>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="col-lg-4">
              <div className="default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white position-relative">
                {/* Agent Info Skeleton */}
                <ContentLoader
                  speed={2}
                  width="100%"
                  height={300}
                  viewBox="0 0 400 300"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <rect x="0" y="0" rx="4" ry="4" width="180" height="28" />
                  <circle cx="60" cy="80" r="50" />
                  <rect x="130" y="60" rx="4" ry="4" width="150" height="20" />
                  <rect x="130" y="90" rx="4" ry="4" width="120" height="16" />
                  <rect x="0" y="160" rx="4" ry="4" width="100%" height="40" />
                  <rect x="0" y="210" rx="4" ry="4" width="100%" height="40" />
                  <rect x="0" y="260" rx="4" ry="4" width="100%" height="40" />
                </ContentLoader>
              </div>

              {/* Schedule Form Skeleton */}
              <div className="default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white position-relative mt-4">
                <ContentLoader
                  speed={2}
                  width="100%"
                  height={350}
                  viewBox="0 0 400 350"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <rect x="0" y="0" rx="4" ry="4" width="150" height="28" />
                  <rect x="0" y="50" rx="4" ry="4" width="100%" height="45" />
                  <rect x="0" y="110" rx="4" ry="4" width="100%" height="45" />
                  <rect x="0" y="170" rx="4" ry="4" width="100%" height="45" />
                  <rect x="0" y="230" rx="4" ry="4" width="100%" height="45" />
                  <rect x="0" y="290" rx="4" ry="4" width="100%" height="45" />
                </ContentLoader>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};