import {BrowserRouter, Route, Routes} from "react-router";
import {PlanningPage} from "./page/PlanningPage.tsx";
import {RootLayout} from "./page/layout/RootLayout.tsx";
export const AllRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<RootLayout />}>
                    <Route path={"/"} element={<PlanningPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}