import { Route, Routes } from "react-router-dom";
import Homepage from "../pages/HomePage";
import MainPage from "../pages/MainPage";

export default function RoutesIndex() {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/main-page" element={<MainPage />} />
        </Routes>
    )

}