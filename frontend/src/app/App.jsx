import { useEffect, useState } from "react";
import AppRouter from "../routes/AppRouter";
import api from "../lib/api";
import { authStorage } from "../lib/auth-store";

export default function App() {
  const [user, setUser] = useState(authStorage.getUser());

  useEffect(() => {
    if (!authStorage.getToken()) {
      return;
    }

    api
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => {
        authStorage.clear();
        setUser(null);
      });
  }, []);

  const handleLogin = (nextUser) => setUser(nextUser);
  const handleLogout = () => {
    authStorage.clear();
    setUser(null);
  };

  return <AppRouter user={user} onLogin={handleLogin} onLogout={handleLogout} />;
}
