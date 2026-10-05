import { BrowserRouter, Route, Routes } from "react-router";
import { PlanningPage } from "./page/planning/PlanningPage.tsx";
import { HolidayListPage } from "./page/holidays/HolidayListPage.tsx";
import { RootLayout } from "./page/layout/RootLayout.tsx";
import { DocsPage } from "./page/test/DocsPage.tsx";
import { ComponentsDocsPage } from "./page/test/ComponentsDocsPage.tsx";
import { DefinitionPage } from "./page/definition/DefinitionPage.tsx";
export const AllRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path={"/"} element={<HolidayListPage />} />
          <Route path={"/planning"} element={<PlanningPage />} />
          <Route path={"/definition"} element={<DefinitionPage />} />
          <Route path={"/docs"} element={<DocsPage />} />
          <Route path={"/docs/components"} element={<ComponentsDocsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
