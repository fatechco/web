"use client";
import { Property } from "@/types/property";
import Image from "next/image";
import Link from "next/link";
import { Tooltip as ReactTooltip } from "react-tooltip";


interface PropertyDataTableProps {
  properties: Property[];
  onDelete: (id: number) => void;
  onEdit: (property: Property) => void;
  isDeleting?: boolean;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Pending":
      return "pending-style style1";
    case "Published":
      return "pending-style style2";
    case "Processing":
      return "pending-style style3";
    default:
      return "";
  }
};

const PropertyDataTable = ({ 
  properties, 
  onDelete, 
  onEdit,
  isDeleting 
}: PropertyDataTableProps) => {
  if (!properties.length) {
    return (
      <div className="text-center py-5">
        <p className="text-gray-500">No properties found</p>
      </div>
    );
  }

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Listing title</th>
          <th scope="col">Date Published</th>
          <th scope="col">Status</th>
          <th scope="col">Price</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {properties.map((property) => (
          <tr key={property.id}>
            <th scope="row">
              <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                <div className="list-thumb">
                  <Image
                    width={110}
                    height={94}
                    className="w-100"
                    src={property.images || "/placeholder.png"}
                    alt={property.title}
                  />
                </div>
                <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                  <div className="h6 list-title">
                    <Link href={`/property/${property.id}`}>
                      {property.title}
                    </Link>
                  </div>
                  <p className="list-text mb-0">{property.location}</p>
                </div>
              </div>
            </th>
            <td className="vam">{property.updated_at}</td>
            <td className="vam">
              <span className={getStatusStyle(property.status)}>
                {property.status}
              </span>
            </td>
            <td className="vam">{property.price}</td>
            <td className="vam">
              <div className="d-flex">
                <button
                  className="icon"
                  style={{ border: "none" }}
                  onClick={() => onEdit(property)}
                  data-tooltip-id={`edit-${property.id}`}
                  disabled={isDeleting}
                >
                  <span className="fas fa-pen fa" />
                </button>
                <button
                  className="icon"
                  style={{ border: "none" }}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this property?')) {
                      onDelete(property.id);
                    }
                  }}
                  data-tooltip-id={`delete-${property.id}`}
                  disabled={isDeleting}
                >
                  <span className="flaticon-bin" />
                </button>

                <ReactTooltip
                  id={`edit-${property.id}`}
                  place="top"
                  content="Edit"
                />
                <ReactTooltip
                  id={`delete-${property.id}`}
                  place="top"
                  content="Delete"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PropertyDataTable;