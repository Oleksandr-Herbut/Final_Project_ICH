import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/loginPage/LoginPage";
import { RegisterPage } from "./pages/registerPage/RegisterPage";
import "./index.css";
import { ResetPage } from "./pages/resetPage/ResetPage";
import MenuBar from "./components/menuBar/MenuBar";
import { FC, ReactNode } from "react";
import { Footer } from "./components/footer/Footer";
import { HomePage } from "./pages/homePage/HomePage";
import { ProfilePage } from "./pages/profilePage/ProfilePage";
import ExplorePage from "./pages/explorePage/ExplorePage";
import PrivateRoutesUsers from "./routes/PrivateRoutes";
import EditProfilePage from "./pages/editProfilePage/EditProfilePage";
import { ToastContainer } from "react-toastify";
// import UserProfile from "./pages/otherProfilePage/OtherProfilePage";
import { useNavigate } from "react-router-dom";
import useIdleTimeout from "./utils/idleTimeout";
import useTokenRefresh from "./utils/tokenRefresh";
import  CombinedProfile  from "./pages/otherProfilePage/OtherProfilePage";
import  {CreatePostPage}  from "./pages/createPostPage/CreatePostPage";
import MessagesPage from "./pages/messagePage/MessagePage";
import PostPage from "./pages/postPage/PostPage";
import { ErrorPage } from "./pages/errorPage/ErrorPage";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div>
          <MenuBar />
        </div>
        <main>{children}</main>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

function App() {
  const navigate = useNavigate();
  const handleIdle = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useIdleTimeout(3600000, handleIdle); // 1 час (в мс)

  useTokenRefresh();

  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
      />
      <Routes>
        {/* Общие маршруты */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset" element={<ResetPage />} />

        <Route element={<PrivateRoutesUsers />}>
          {/* Пользовательские маршруты */}
          <Route
            path="/home"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <ProfilePage />
              </Layout>
            }
          />
          <Route
            path="/explore"
            element={
              <Layout>
                <ExplorePage />
              </Layout>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <Layout>
                <EditProfilePage />
              </Layout>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <Layout>
                <CombinedProfile />
              </Layout>
            }
          />
          <Route
            path="/create"
            element={
              <Layout>
                <CreatePostPage onClose={() => navigate("/home")} />
              </Layout>
            }
          />
          <Route
            path="/post/:postId"
            element={
              <Layout>
                <PostPage/>
              </Layout>
            }
          />
        </Route>
        <Route path="/messages"
        element={
          <Layout>
            <MessagesPage />
          </Layout>
        }
        />
        <Route path="*" 
        element={
          <Layout>
            <ErrorPage />
          </Layout>
        } />
      </Routes>
    </div>
  );
}

export default App;
