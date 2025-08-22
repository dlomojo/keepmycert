// src/layouts/MainLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

// Material Kit 2 React components
import MKBox from "@/components/MKBox";

// Material Kit 2 React examples
import DefaultNavbar from "@/examples/Navbars/DefaultNavbar";
import DefaultFooter from "@/examples/Footers/DefaultFooter";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

function MainLayout() {
  const [transparent, setTransparent] = useState(true);

  useEffect(() => {
    function handleTransparent() {
      setTransparent(window.scrollY === 0);
    }

    window.addEventListener("scroll", handleTransparent);
    return () => window.removeEventListener("scroll", handleTransparent);
  }, []);

  return (
    <>
      <DefaultNavbar
        routes={routes}
        action={{
          type: "external",
          route: "/auth/login",
          label: "Sign In",
          color: "info",
        }}
        transparent={transparent}
        light={true}
      />
      <MKBox sx={{ minHeight: "calc(100vh - 400px)" }}>
        <Outlet />
      </MKBox>
      <DefaultFooter content={footerRoutes} />
    </>
  );
}

export default MainLayout;