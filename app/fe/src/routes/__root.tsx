import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NavBar } from "../components/NavBar";

export const Route = createRootRoute({
  component: () => (
    <div>
      <NavBar />
      <Outlet />
    </div>
  ),
});
