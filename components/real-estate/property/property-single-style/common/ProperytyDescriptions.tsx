import React, { useState } from "react";
import type { Property } from "@/types/property";

interface ProperytyDescriptionsProps {
  property: Property;
}

const ProperytyDescriptions = ({ property }: ProperytyDescriptionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const description = property.description || "No description available.";
  
  // Có thể giới hạn độ dài mô tả khi chưa mở rộng
  const shouldTruncate = description.length > 300 && !isExpanded;
  const truncatedDescription = shouldTruncate 
    ? description.substring(0, 300) + "..." 
    : description;

  return (
    <>
      <p className="text mb10">
        {truncatedDescription}
      </p>
      
      {/* Hiển thị nút "Show more" nếu mô tả dài */}
      {description.length > 300 && (
        <div className="agent-single-accordion">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            <div className="accordion-item">
              <div
                id="flush-collapseOne"
                className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
                aria-labelledby="flush-headingOne"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body p-0">
                  {/* Nội dung mở rộng chỉ hiển thị khi isExpanded = true */}
                  {isExpanded && (
                    <p className="text mt-3">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              <h2 className="accordion-header" id="flush-headingOne">
                <button
                  className={`accordion-button p-0 ${isExpanded ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-expanded={isExpanded}
                  aria-controls="flush-collapseOne"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              </h2>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ProperytyDescriptions;