import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage/LoginPage";
import MainPage from "./pages/mainPage/MainPage";
import SearchPage from "./pages/searchPage/SearchPage";
import CartPage from "./pages/cartPage/CartPage";
import MyPage from "./pages/myPage/MyPage";
import ReservationPage from "./pages/reservationPage/ReservationPage";
import DetailPage from "./pages/detailPage/DetailPage";
import HeaderRoute from "./routes/HeaderRoute";
import MainStyleRoute from "./routes/MainStyleRoute";
import SignupPage from "./pages/loginPage/SignupPage";
import RoomDetailPage from "./pages/roomDetailPage/RoomDetailPage";

function App() {
  return (
    <Routes>
      <Route element={<MainStyleRoute />}>
        <Route element={<HeaderRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/room/:id" element={<RoomDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
