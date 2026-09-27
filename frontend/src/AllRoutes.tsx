import {BrowserRouter, Route, Routes} from "react-router";
import {PlanningPage} from "./page/planning/PlanningPage.tsx";
import {HolidayListPage} from "./page/holidays/HolidayListPage.tsx";
import {DefinitionPage} from "./page/definition/DefinitionPage.tsx";
import {RootLayout} from "./page/layout/RootLayout.tsx";
export const AllRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<RootLayout />}>
                    <Route path={"/"} element={<HolidayListPage />} />
                    <Route path={"/planning"} element={<PlanningPage />} />
                    <Route path={"/definition"} element={<DefinitionPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}