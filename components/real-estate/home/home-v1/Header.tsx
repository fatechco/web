// components/common/Header.tsx
"use client";

import MainMenu from "@/components/real-estate/common/MainMenu";
import SidebarPanel from "@/components/real-estate/common/sidebar-panel";
import LoginSignupModal from "@/components/real-estate/common/login-signup-modal";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Header: React.FC = () => {
  const [navbar, setNavbar] = useState<boolean>(false);

  const changeBackground = (): void => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <>
      <header
        className={`header-nav nav-homepage-style main-menu ${
          navbar ? "sticky slideInDown animated" : ""
        }`}
      >
        <nav className="posr">
          <div className="container posr menu_bdrt1">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="logos mr40">
                    <Link href="/" className="header-logo logo1">
                      <Image
                        width={138}
                        height={44}
                        src="/images/header-logo.svg"
                        alt="Header Logo"
                        priority
                      />
                    </Link>
                    <Link href="/" className="header-logo logo2">
                      <Image
                        width={138}
                        height={44}
                        src="/images/header-logo2.svg"
                        alt="Header Logo Dark"
                        priority
                      />
                    </Link>
                  </div>
                  {/* End Logo */}

                  <MainMenu />
                  {/* End Main Menu */}
                </div>
              </div>
              {/* End .col-auto */}

              <div className="col-auto">
                <div className="d-flex align-items-center">
                  <button
                    className="login-info d-flex align-items-center bg-transparent border-0"
                    data-bs-toggle="modal"
                    data-bs-target="#loginSignupModal"
                    type="button"
                  >
                    <i className="far fa-user-circle fz16 me-2" />
                    <span className="d-none d-xl-block">Login / Register</span>
                  </button>

                  <Link
                    className="ud-btn add-property menu-btn bdrs60 mx-2 mx-xl-4"
                    href="/dashboard-add-property"
                  >
                    Add Property
                    <i className="fal fa-arrow-right-long" />
                  </Link>

                  <button
                    className="sidemenu-btn filter-btn-right bg-transparent border-0 p-0"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#SidebarPanel"
                    aria-controls="SidebarPanelLabel"
                    type="button"
                  >
                    <Image
                      width={25}
                      height={9}
                      className="img-1"
                      src="/images/icon/nav-icon-white.svg"
                      alt="humberger menu"
                    />
                    <Image
                      width={25}
                      height={9}
                      className="img-2 d-none"
                      src="/images/icon/nav-icon-dark.svg"
                      alt="humberger menu dark"
                    />
                  </button>
                </div>
              </div>
              {/* End .col-auto */}
            </div>
            {/* End .row */}
          </div>
        </nav>
      </header>
      {/* End Header */}

      {/* Signup Modal */}
      <div className="signup-modal">
        <div
          className="modal fade"
          id="loginSignupModal"
          tabIndex={-1}
          aria-labelledby="loginSignupModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
            <LoginSignupModal />
          </div>
        </div>
      </div>
      {/* End Signup Modal */}

      {/* Desktop Sidebar Menu */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="SidebarPanel"
        aria-labelledby="SidebarPanelLabel"
      >
        <SidebarPanel />
      </div>
      {/* Sidebar Panel End */}
    </>
  );
};

export default Header;