import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import CreatePost from "./pages/post/CreatePost";
import AboutUs from "./pages/aboutUs/AboutUs";
import Post from "./pages/post/Post";
import Registration from "./pages/registration/Registration";
import Login from "./pages/login/Login";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import ChangePassword from "./pages/changePassword/ChangePassword";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import { AuthContext } from "./helpers/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    photo: null,
    status: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState((prev) => ({ ...prev, status: false }));
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            photo: response.data.photo,
            status: true,
          });
        }
      })
      .catch(() => {
        setAuthState({ username: "", id: 0, photo: null, status: false });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, photo: null, status: false });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Navbar logout={logout} />
          <Routes>
            <Route path="/" exact Component={Home} />
            <Route path="/createpost" exact Component={CreatePost} />
            <Route path="/aboutus" exact Component={AboutUs} />
            <Route path="/post/:id" exact Component={Post} />
            <Route path="/registration" exact Component={Registration} />
            <Route path="/login" exact Component={Login} />
            <Route path="/changepassword" exact Component={ChangePassword} />
            <Route path="/profile/:id" exact Component={Profile} />
            <Route path="/editprofile" exact Component={EditProfile} />
            <Route path="*" exact Component={PageNotFound} />
          </Routes>
          <Footer />
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;