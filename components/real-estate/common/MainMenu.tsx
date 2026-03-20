// components/common/MainMenu.tsx
"use client";

import {
  homeItems,
  blogItems,
  listingItems,
  propertyItems,
  pageItems,
  HomeItem,
  BlogItem,
  ListingItem,
  PropertyItem,
  PageItem,
} from "@/data/navItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type TopMenuType = "home" | "blog" | "pages" | "property" | "listing" | "";

const MainMenu: React.FC = () => {
  const pathname = usePathname();
  const [topMenu, setTopMenu] = useState<TopMenuType>("");
  const [submenu, setSubmenu] = useState<string>("");

  useEffect(() => {
    // Check home items
    homeItems.forEach((elm: HomeItem) => {
      if (elm.href.split("/")[1] === pathname.split("/")[1]) {
        setTopMenu("home");
      }
    });

    // Check blog items
    blogItems.forEach((elm: BlogItem) => {
      if (elm.href.split("/")[1] === pathname.split("/")[1]) {
        setTopMenu("blog");
      }
    });

    // Check page items
    pageItems.forEach((elm: PageItem) => {
      if (elm.href.split("/")[1] === pathname.split("/")[1]) {
        setTopMenu("pages");
      }
    });

    // Check property items
    propertyItems.forEach((item: PropertyItem) => {
      item.subMenuItems.forEach((elm) => {
        if (elm.href.split("/")[1] === pathname.split("/")[1]) {
          setTopMenu("property");
          setSubmenu(item.label);
        }
      });
    });

    // Check listing items
    listingItems.forEach((item: ListingItem) => {
      item.submenu.forEach((elm) => {
        if (elm.href.split("/")[1] === pathname.split("/")[1]) {
          setTopMenu("listing");
          setSubmenu(item.title);
        }
      });
    });
  }, [pathname]);

  const handleActive = (link: string): string => {
    if (link.split("/")[1] === pathname.split("/")[1]) {
      return "menuActive";
    }
    return "";
  };

  return (
    <ul className="ace-responsive-menu">
      {/* Home Menu */}
      <li className="visible_list dropitem">
        <a className="list-item" href="#">
          <span className={topMenu === "home" ? "title menuActive" : "title"}>
            Home
          </span>
          <span className="arrow"></span>
        </a>
        <ul className="sub-menu">
          {homeItems.map((item: HomeItem, index: number) => (
            <li key={index}>
              <Link 
                className={handleActive(item.href)} 
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>

      {/* Listing Mega Menu */}
      <li className="megamenu_style dropitem">
        <a className="list-item" href="#">
          <span className={topMenu === "listing" ? "title menuActive" : "title"}>
            Listing
          </span>
          <span className="arrow"></span>
        </a>
        <ul className="row dropdown-megamenu sub-menu">
          {listingItems.map((item: ListingItem, index: number) => (
            <li className="col mega_menu_list" key={index}>
              <h4 className="title">{item.title}</h4>
              <ul className="sub-menu">
                {item.submenu.map((submenuItem, subIndex: number) => (
                  <li key={subIndex}>
                    <Link
                      className={handleActive(submenuItem.href)}
                      href={submenuItem.href}
                    >
                      {submenuItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </li>

      {/* Property Menu */}
      <li className="visible_list dropitem">
        <a className="list-item" href="#">
          <span className={topMenu === "property" ? "title menuActive" : "title"}>
            Property
          </span>
          <span className="arrow"></span>
        </a>
        <ul className="sub-menu">
          {propertyItems.map((item: PropertyItem, index: number) => (
            <li key={index} className="dropitem">
              <a href="#">
                <span
                  className={
                    submenu === item.label ? "title menuActive" : "title"
                  }
                >
                  {item.label}
                </span>
                <span className="arrow"></span>
              </a>
              <ul className="sub-menu">
                {item.subMenuItems.map((subMenuItem, subIndex: number) => (
                  <li key={subIndex}>
                    <Link
                      className={handleActive(subMenuItem.href)}
                      href={subMenuItem.href}
                    >
                      {subMenuItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </li>

      {/* Blog Menu */}
      <li className="visible_list dropitem">
        <a className="list-item" href="#">
          <span className={topMenu === "blog" ? "title menuActive" : "title"}>
            Blog
          </span>
          <span className="arrow"></span>
        </a>
        <ul className="sub-menu">
          {blogItems.map((item: BlogItem, index: number) => (
            <li key={index}>
              <Link 
                className={handleActive(item.href)} 
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>

      {/* Pages Menu */}
      <li className="visible_list dropitem">
        <a className="list-item" href="#">
          <span className={topMenu === "pages" ? "title menuActive" : "title"}>
            Pages
          </span>
          <span className="arrow"></span>
        </a>
        <ul className="sub-menu">
          {pageItems.map((item: PageItem, index: number) => (
            <li key={index}>
              <Link 
                className={handleActive(item.href)} 
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
};

export default MainMenu;