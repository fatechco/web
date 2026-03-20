import React from "react";
import ContentLoader from "react-content-loader";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  columnWidths?: string[];
  hasImage?: boolean;
  hasActions?: boolean;
  actionCount?: number;
  className?: string;
}

export const TableSkeleton = ({
  rows = 5,
  columns = 5,
  columnWidths = [],
  hasImage = false,
  hasActions = false,
  actionCount = 2,
  className = "",
}: TableSkeletonProps) => {
  // Tạo mảng columns để render
  const columnArray = Array.from({ length: columns }, (_, i) => i);
  const rowArray = Array.from({ length: rows }, (_, i) => i);

  // Tính toán độ rộng mỗi cột
  const getColumnWidth = (colIndex: number) => {
    if (columnWidths[colIndex]) {
      return columnWidths[colIndex];
    }
    // Mặc định: cột đầu rộng hơn nếu có image, các cột sau đều nhau
    if (colIndex === 0 && hasImage) return "300px";
    if (colIndex === columns - 1 && hasActions) return "120px";
    return "150px";
  };

  return (
    <div className={`packages_table table-responsive ${className}`}>
      <table className="table-style3 table at-savesearch">
        <thead className="t-head">
          <tr>
            {columnArray.map((colIndex) => (
              <th key={colIndex} scope="col">
                <ContentLoader
                  speed={2}
                  width={getColumnWidth(colIndex)}
                  height={24}
                  viewBox={`0 0 ${parseInt(getColumnWidth(colIndex))} 24`}
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                >
                  <rect 
                    x="0" 
                    y="0" 
                    rx="4" 
                    ry="4" 
                    width={parseInt(getColumnWidth(colIndex))} 
                    height="20" 
                  />
                </ContentLoader>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowArray.map((rowIndex) => (
            <TableRowSkeleton
              key={rowIndex}
              columns={columns}
              hasImage={hasImage}
              hasActions={hasActions}
              actionCount={actionCount}
              columnWidths={columnWidths}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface TableRowSkeletonProps {
  columns: number;
  hasImage: boolean;
  hasActions: boolean;
  actionCount: number;
  columnWidths: string[];
}

const TableRowSkeleton = ({
  columns,
  hasImage,
  hasActions,
  actionCount,
  columnWidths,
}: TableRowSkeletonProps) => {
  const columnArray = Array.from({ length: columns }, (_, i) => i);

  const renderCell = (colIndex: number) => {
    const width = columnWidths[colIndex] || "150px";

    // Cột đầu tiên có thể có image
    if (colIndex === 0 && hasImage) {
      return (
        <th scope="row">
          <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
            <ContentLoader
              speed={2}
              width={110}
              height={94}
              viewBox="0 0 110 94"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <rect x="0" y="0" rx="8" ry="8" width="110" height="94" />
            </ContentLoader>
            <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
              <ContentLoader
                speed={2}
                width={180}
                height={50}
                viewBox="0 0 180 50"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="0" y="0" rx="4" ry="4" width="160" height="20" />
                <rect x="0" y="28" rx="4" ry="4" width="120" height="16" />
              </ContentLoader>
            </div>
          </div>
        </th>
      );
    }

    // Cột cuối cùng có thể có actions
    if (colIndex === columns - 1 && hasActions) {
      return (
        <td>
          <div className="d-flex gap-2">
            {Array.from({ length: actionCount }).map((_, actionIndex) => (
              <ContentLoader
                key={actionIndex}
                speed={2}
                width={30}
                height={30}
                viewBox="0 0 30 30"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <circle cx="15" cy="15" r="15" />
              </ContentLoader>
            ))}
          </div>
        </td>
      );
    }

    // Các cột thông thường
    return (
      <td>
        <ContentLoader
          speed={2}
          width={width}
          height={24}
          viewBox={`0 0 ${parseInt(width)} 24`}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="4" ry="4" width={parseInt(width)} height="20" />
        </ContentLoader>
      </td>
    );
  };

  return <tr>{columnArray.map((colIndex) => (
    <React.Fragment key={colIndex}>
      {renderCell(colIndex)}
    </React.Fragment>
  ))}</tr>;
};