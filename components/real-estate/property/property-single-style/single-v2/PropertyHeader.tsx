// components/real-estate/property/property-single-style/single-v2/PropertyHeader.tsx
import type { Property } from "@/types/property";

interface PropertyHeaderProps {
  property: Property;
}

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  // Tính số năm đã qua từ năm xây dựng
  const getYearAgo = () => {
    if (!property.year_built) return null;
    const currentYear = new Date().getFullYear();
    const yearsAgo = currentYear - property.year_built;
    if (yearsAgo === 0) return "This year";
    if (yearsAgo === 1) return "1 year ago";
    return `${yearsAgo} years ago`;
  };

  const yearAgo = getYearAgo();

  return (
    <>
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          <h2 className="sp-lg-title">{property.title}</h2>
          <div className="pd-meta mb15 d-md-flex align-items-center">
            <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">
              {property.full_address || property.address}
            </p>
          </div>
          <div className="property-meta d-flex align-items-center">
            <a
              className="ff-heading text-thm fz15 bdrr1 pr10 bdrrn-sm"
              href="#"
            >
              <i className="fas fa-circle fz10 pe-2" />
              For {property.type === 'sale' ? 'sale' : 'rent'}
            </a>
            {yearAgo && (
              <a
                className="ff-heading bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm"
                href="#"
              >
                <i className="far fa-clock pe-2" />
                {yearAgo}
              </a>
            )}
            <a className="ff-heading ml10 ml0-sm fz15" href="#">
              <i className="flaticon-view pe-2 align-text-top" />
              {property.views?.toLocaleString() || 0}
            </a>
          </div>
        </div>
      </div>
      {/* End .col-lg--8 */}

      <div className="col-lg-4">
        <div className="single-property-content">
          <div className="property-action text-lg-end">
            <div className="d-flex mb20 mb10-md align-items-center justify-content-lg-end">
              <a className="icon mr10" href="#">
                <span className="flaticon-like" />
              </a>
              <a className="icon mr10" href="#">
                <span className="flaticon-new-tab" />
              </a>
              <a className="icon mr10" href="#">
                <span className="flaticon-share-1" />
              </a>
              <a className="icon" href="#">
                <span className="flaticon-printer" />
              </a>
            </div>
            <h3 className="price mb-0">{property.price_formatted || `$${property.price.toLocaleString()}`}</h3>
            <p className="text space fz15">
              {property.area?.toLocaleString()} / m²
            </p>
          </div>
        </div>
      </div>
      {/* End .col-lg--4 */}
    </>
  );
};

export default PropertyHeader;