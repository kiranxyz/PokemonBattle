import { BrowserRouter, Routes, Route } from "react-router";
import { RootLayout } from "@/layouts";
import { Home, Login, NotFound, Register, PokemonBattle2 } from "@/pages";
import { RequireAuth, RequireNoAuth } from "@/routeGuards";
import PokemonDetail from "./pages/PokemonDetail";
import Team from "./pages/Team";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        {/* <Route path="battle" element={<PokemonBattle />} /> */}
        <Route path="battle2" element={<PokemonBattle2 />} />
        <Route path="pkdetail/:id" element={<PokemonDetail />} />
        <Route
          path="login"
          element={
            <RequireNoAuth>
              <Login />
            </RequireNoAuth>
          }
        />

        <Route
          path="register"
          element={
            <RequireNoAuth>
              <Register />
            </RequireNoAuth>
          }
        />

        <Route
          path="team"
          element={
            <RequireAuth>
              <Team />
            </RequireAuth>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
