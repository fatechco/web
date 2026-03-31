"use client";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";
import { useState } from "react";

interface PropertyGalleryProps {
  images?: Array<{
    url?: string;
    src?: string;
    alt?: string;
    id?: number | string;
  }> | string[];
}

const PropertyGallery = ({ images = [] }: PropertyGalleryProps) => {
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  // Transform images array to consistent format
  const galleryImages = images.map((img, index) => {
    const imageUrl = typeof img === 'string' ? img : img?.url || img?.src || '';
    return {
      src: imageUrl,
      alt: typeof img === 'string' ? `Property image ${index + 1}` : img?.alt || `Property image ${index + 1}`,
      original: imageUrl,
      thumbnail: imageUrl,
      width: 1200,
      height: 800,
    };
  }).filter(img => img.src); // Remove any images without URL

  // Use fallback images if no images provided
  const hasImages = galleryImages.length > 0;
  
  // If no images, use fallback
  const displayImages = hasImages ? galleryImages : [
    {
      src: "/images/listings/listing-single-8.jpg",
      alt: "Property main image",
      original: "/images/listings/listing-single-8.jpg",
      thumbnail: "/images/listings/listing-single-8.jpg",
      width: 1200,
      height: 800,
    },
    {
      src: "/images/listings/listing-single-3.jpg",
      alt: "Property image 2",
      original: "/images/listings/listing-single-3.jpg",
      thumbnail: "/images/listings/listing-single-3.jpg",
      width: 800,
      height: 600,
    },
    {
      src: "/images/listings/listing-single-5.jpg",
      alt: "Property image 3",
      original: "/images/listings/listing-single-5.jpg",
      thumbnail: "/images/listings/listing-single-5.jpg",
      width: 800,
      height: 600,
    },
  ];

  const mainImage = displayImages[0];
  const secondaryImages = displayImages.slice(1, 5); // Max 4 secondary images

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  return (
    <Gallery options={{ 
      bgOpacity: 0.9,
      zoom: true,
      closeOnScroll: false,
      history: false,
      showHideAnimationType: 'zoom',
      arrowKeys: true,
    }}>
      <div className="row g-4">
        {/* Main Image */}
        <div className="col-lg-8 col-md-12">
          <div className="sp-img-content mb15-md">
            <div className="popup-img preview-img-1 sp-img">
              <Item
                original={mainImage.original || mainImage.src}
                thumbnail={mainImage.thumbnail || mainImage.src}
                width={mainImage.width}
                height={mainImage.height}
                alt={mainImage.alt}
              >
                {({ ref, open }) => (
                  <div 
                    ref={ref as React.Ref<HTMLDivElement>}
                    onClick={open}
                    className="cursor-pointer position-relative overflow-hidden rounded-3"
                    style={{ aspectRatio: "16/10" }}
                  >
                    {!imageError[0] ? (
                      <Image
                      unoptimized
                        src={mainImage.src}
                        fill
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        className="object-fit-cover transition-transform hover-scale"
                        alt={mainImage.alt}
                        priority
                        onError={() => handleImageError(0)}
                      />
                    ) : (
                      <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                        <span className="text-muted">Image not available</span>
                      </div>
                    )}
                  </div>
                )}
              </Item>
            </div>
          </div>
        </div>

        {/* Secondary Images */}
        <div className="col-lg-4 col-md-12">
          <div className="row g-3">
            {secondaryImages.map((image, index) => (
              <div className="col-lg-12 col-md-6 col-sm-6" key={index}>
                <div className="sp-img-content">
                  <div className={`popup-img preview-img-${index + 2} sp-img`}>
                    <Item
                      original={image.original || image.src}
                      thumbnail={image.thumbnail || image.src}
                      width={image.width || 600}
                      height={image.height || 400}
                      alt={image.alt}
                    >
                      {({ ref, open }) => (
                        <div
                          ref={ref as React.Ref<HTMLDivElement>}
                          onClick={open}
                          className="cursor-pointer position-relative overflow-hidden rounded-3"
                          style={{ aspectRatio: "4/3" }}
                        >
                          {!imageError[index + 1] ? (
                            <Image
                            unoptimized
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                              className="object-fit-cover transition-transform hover-scale"
                              src={image.src}
                              alt={image.alt}
                              onError={() => handleImageError(index + 1)}
                            />
                          ) : (
                            <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                              <span className="text-muted small">Image not available</span>
                            </div>
                          )}
                        </div>
                      )}
                    </Item>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show image count if more images available */}
            {displayImages.length > 5 && (
              <div className="col-lg-12 col-md-6 col-sm-6">
                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center text-center p-3"
                  style={{ aspectRatio: "4/3" }}>
                  <div>
                    <span className="text-primary fw-bold fs-3">+{displayImages.length - 5}</span>
                    <span className="text-muted d-block">more images</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-scale {
          transition: transform 0.3s ease;
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }
        
        .object-fit-cover {
          object-fit: cover;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Gallery>
  );
};

export default PropertyGallery;