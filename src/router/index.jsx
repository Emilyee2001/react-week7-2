import { createHashRouter } from "react-router";
// user
import FrontLayout from "../Layouts/FrontLayout";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ProductListPage from "../pages/ProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import LoginPage from '../pages/LoginPage';
// admin
import AdminLayout from "../Layouts/AdminLayout";
import AdminHomePage from "../pages/admin/AdminHomePage";
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
// not found
import NotFoundPage from "../pages/NotFoundPage";


const router = createHashRouter([
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'products',
        element: <ProductListPage />
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />
      },
      {
        path: 'cart',
        element: <CartPage />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <AdminHomePage />
      },
      {
        path: 'products',
        element: <AdminProductsPage />
      },
      {
        path: 'orders',
        element: <AdminOrdersPage />
      }
    ]
  },
  {
    path:'*',
    element: <NotFoundPage />
  }
]);

export default router;