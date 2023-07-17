import {
  Refine,
  WelcomePage,
  Authenticated,
  AuthBindings,
} from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayout,
} from "@refinedev/mui";

import dataProvider from "@refinedev/simple-rest";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import axios, { AxiosRequestConfig } from "axios";
import {
  BlogPostList,
  BlogPostCreate,
  BlogPostEdit,
  BlogPostShow,
} from "pages/blog-posts";
import {
  CategoryList,
  CategoryCreate,
  CategoryEdit,
  CategoryShow,
} from "pages/categories";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header } from "./components/header";
import {
  Login,
  // MyProfile,
  // ProductDetails,
  // Orders,
  // CreateProduct,
  // EditProduct,

} from "pages/login";
import Home from "pages/Home";
import { CredentialResponse } from "interfaces/google";
import { parseJwt } from "utils/parse-jwt";

import { MuiInferencer } from "@refinedev/inferencer/mui";
import { ProductCreate, ProductEdit, ProductList, ProductShow } from "pages/products";
import { OrderList } from "pages/orders/list";
import { OrderShow } from "pages/orders/show";
//All Products

import  Allproducts  from 'pages/allproducts'
import  allOrders  from 'pages/allOrders'


// icons

import {
  ShoppingBagOutlined,
  Dashboard,
  DiamondOutlined
} from '@mui/icons-material';


const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;
// save user to mongodb...
      if(profileObj){
        const response = await fetch('http://localhost:8080/api/v1/users', {
          method: 'Post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            name: profileObj.name,
            email: profileObj.email,
            avatar: profileObj.picture,
          })
        })

        const data = await response.json();
        if(response.status === 200) {


        localStorage.setItem(
          "user",
          JSON.stringify({
            ...profileObj,
            avatar: profileObj.picture,
            userid: data._id
          })
        );

        localStorage.setItem("token", `${credential}`);

        return {
          success: true,
          redirectTo: "/",
        };
      }
      }

      return {
        success: false,
      };
    },
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: new Error("Not authenticated"),
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };

  const user = localStorage.getItem("user");
  const email = user ? JSON.parse(user).email : "";

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={dataProvider("http://localhost:8080/api/v1")}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={[
                // {
                //   name: "dashboard",
                //   list: Allproducts,
                //   icon: <Dashboard />

                // },
                {
                  name: "products",
                  list: Allproducts,
                  create: "/products/create",
                  edit: "/products/edit/:id",
                  show: "/products/show/:id",
                  icon: <DiamondOutlined />,
                  meta: {
                    canDelete: true,
                  },
                },
                ...(email === "gabrielcorreia94@gmail.com" ? [
                {
                  name: "orders",
                  list: allOrders,
                  // create: "/products/create",
                  // edit: "/products/edit/:id",
                  show: "/orders/show/:id",
                  icon: <ShoppingBagOutlined />,
                  meta: {
                    canDelete: true,
                  },
                },
              ]
              : [
                {
                  name: "orders",
                  //list: allOrders,
                  // create: "/products/create",
                  // edit: "/products/edit/:id",
                  show: "/orders/show/:id",
                  icon: <ShoppingBagOutlined />,
                  meta: {
                    canDelete: true,
                  },
                },
              ]),
                // {
                //   name: "blog_posts",
                //   list: "/blog-posts",
                //   create: "/blog-posts/create",
                //   edit: "/blog-posts/edit/:id",
                //   show: "/blog-posts/show/:id",
                //   meta: {
                //     canDelete: true,
                //   },
                // },
                // {
                //   name: "categories",
                //   list: "/categories",
                //   create: "/categories/create",
                //   edit: "/categories/edit/:id",
                //   show: "/categories/show/:id",
                //   meta: {
                //     canDelete: true,
                //   },
                // },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >

              <Routes>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayout Header={Header}>
                        <Outlet />
                      </ThemedLayout>
                    </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="dashboard" />}
                  />
                  <Route path="/blog-posts">
                    <Route index element={<BlogPostList />} />
                    <Route path="create" element={<BlogPostCreate />} />
                    <Route path="edit/:id" element={<BlogPostEdit />} />
                    <Route path="show/:id" element={<BlogPostShow />} />
                  </Route>
                  <Route path="/categories">
                    <Route index element={<CategoryList />} />
                    <Route path="create" element={<CategoryCreate />} />
                    <Route path="edit/:id" element={<CategoryEdit />} />
                    <Route path="show/:id" element={<CategoryShow />} />
                  </Route>
                  <Route path="/products">
                  <Route index element = {<ProductList />} />
                  <Route path="create" element={<ProductCreate />} />
                  <Route path="edit/:id" element={<ProductEdit />} />
                  <Route path="show/:id" element={<ProductShow />} />
                  </Route>
                  <Route path="/orders">
                  <Route index element = {<OrderList />} />
                  {/* <Route path="create" element={<ProductCreate />} />
                  <Route path="edit/:id" element={<ProductEdit />} />*/}
                  <Route path="show/:id" element={<OrderShow />} /> 
                  </Route>
                </Route>
                <Route
                  element={
                    <Authenticated fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>
                <Route
                  element={
                    <Authenticated>
                      <ThemedLayout Header={Header}>
                        <Outlet />
                      </ThemedLayout>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
function useAuth(): { user: any; } {
  throw new Error("Function not implemented.");
}

