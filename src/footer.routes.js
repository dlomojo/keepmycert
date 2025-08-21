/**
 * Footer navigation routes and content
 */

const year = new Date().getFullYear();

const footerRoutes = {
  brand: {
    name: "KeepMyCert",
    description: "Never miss a certification renewal again. Track all your IT certifications in one place.",
    route: "/",
  },
  menus: [
    {
      name: "company",
      items: [
        { name: "about us", route: "/about" },
        { name: "blog", route: "/blog" },
        { name: "pricing", route: "/pricing" }
      ],
    },
    {
      name: "help & support",
      items: [
        { name: "contact us", route: "/contact" },
        { name: "knowledge center", route: "/knowledge-center" },
        { name: "custom development", route: "/custom-development" },
      ],
    },
    {
      name: "legal",
      items: [
        { name: "terms & conditions", route: "/terms" },
        { name: "privacy policy", route: "/privacy" },
        { name: "licenses", route: "/licenses" },
      ],
    },
  ],
  copyright: (
    <>
      Copyright © {year} KeepMyCert by{" "}
      <a href="https://detachedsolution.us" target="_blank" rel="noreferrer">
        Detached Solutions
      </a>
      . All Rights Reserved.
    </>
  ),
};

export default footerRoutes;