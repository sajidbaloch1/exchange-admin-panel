import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";

//const Switcherlayout = React.lazy(() => import("./components/switcherlayout"));
//App
const App = React.lazy(() => import("./components/app"));

//Dashboard
const Dashboard = React.lazy(() => import("./components/Dashboard/Dashboard"));

//User
const UserList = React.lazy(() => import("./components/User/UserList/UserList"));

const CategoryList = React.lazy(() => import("./components/Category/CategoryList/CategoryList"));
const CategoryForm = React.lazy(() => import("./components/Category/CategoryForm/CategoryForm"));

const CurrencyList = React.lazy(() => import("./components/Currency/CurrencyList/CurrencyList"));
const CurrencyForm = React.lazy(() => import("./components/Currency/CurrencyForm/CurrencyForm"));

const SuperAdminList = React.lazy(() => import("./components/User/SuperAdminList/SuperAdminList"));
const SuperAdminForm = React.lazy(() => import("./components/User/SuperAdminForm/SuperAdminForm"));
const AdminList = React.lazy(() => import("./components/User/AdminList/AdminList"));

const UserForm = React.lazy(() => import("./components/User/UserForm/UserForm"));

//custom Pages
const Login = React.lazy(() => import("./components/Login/Login"));

//Errorpages
const Errorpage400 = React.lazy(() => import("./components/ErrorPages/ErrorPages/400/400"));
const Errorpage401 = React.lazy(() => import("./components/ErrorPages/ErrorPages/401/401"));
const Errorpage403 = React.lazy(() => import("./components/ErrorPages/ErrorPages/403/403"));
const Errorpage500 = React.lazy(() => import("./components/ErrorPages/ErrorPages/500/500"));
const Errorpage503 = React.lazy(() => import("./components/ErrorPages/ErrorPages/503/503"));

const ProtectedRoutes = React.lazy(() => import("./components/ProtectedRoutes"));
const PublicRoutes = React.lazy(() => import("./components/PublicRoutes"));

const Loaderimg = () => {
  return (
    <div id="global-loader">
      <img
        src={require("./assets/images/loader.svg").default}
        className="loader-img"
        alt="Loader"
      />
    </div>
  );
};
const Root = () => {
  useEffect(() => {

    //Switcherdata.localStorageBackUp();
    //Switcherdata.HorizontalHoverMenu();
  }, []);
  return (
    <Fragment>
      <BrowserRouter>
        <React.Suspense fallback={Loaderimg()}>
          <AuthProvider>

            <Routes>
              <Route path="/" element={<ProtectedRoutes />}>
                <Route
                  path={`${process.env.PUBLIC_URL}/`}
                  element={<App />}
                >
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/dashboard`}
                    element={<Dashboard />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/currency-list`}
                    element={<CurrencyList />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/currency-add`}
                    element={<CurrencyForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/currency-edit/:id`}
                    element={<CurrencyForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/category-list`}
                    element={<CategoryList />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/category-add`}
                    element={<CategoryForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/category-edit/:id`}
                    element={<CategoryForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/super-admin-list`}
                    element={<SuperAdminList />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/super-admin-add`}
                    element={<SuperAdminForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/admin-list`}
                    element={<AdminList />}
                  />
                  {/* <Route
                    path={`${process.env.PUBLIC_URL}/master-list`}
                    element={<UserList />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/client-list`}
                    element={<UserList />}
                  /> */}
                  <Route
                    path={`${process.env.PUBLIC_URL}/user-add`}
                    element={<UserForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/user-edit/:id`}
                    element={<UserForm />}
                  />
                </Route>

              </Route>

              <Route path="/" element={<PublicRoutes />}>
                <Route
                  path={`${process.env.PUBLIC_URL}/login`}
                  element={<Login />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/errorpage401`}
                  element={<Errorpage401 />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/errorpage403`}
                  element={<Errorpage403 />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/errorpage500`}
                  element={<Errorpage500 />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/errorpage503`}
                  element={<Errorpage503 />}
                />

              </Route>
              <Route path="*" element={<Errorpage400 />} />

            </Routes>

          </AuthProvider>

        </React.Suspense>
      </BrowserRouter>
    </Fragment>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
