const baseUrl = import.meta.env.VITE_BASE_URL
import axios from 'axios'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Outlet, NavLink, useNavigate } from "react-router"

export default function AdminLayout() {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const routes = [
    {
      path: '/admin/products',
      name: '產品列表',
    },
    {
      path: '/admin/orders',
      name: '訂單管理'
    }
  ];

  const checkUserLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
      navigate('/admin/products');
    } catch (error) {
      console.error('請重新登入');
      navigate('/login');
    }
  };

  // 在登入畫面渲染時呼叫檢查登入的API
  useEffect(() => {
    const authToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)eToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common['Authorization'] = authToken;
    checkUserLogin();
  }, []);

  // 登出
  const adminLogout = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}/v2/logout`);
      navigate('/login');
    } catch (error) {
      console.error('登出失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (<>
    <header>
      <div className="bg-primary-800">
        <div className="container">
          <p className="text-center text-white py-2 fs-5">專題學習組#3 異國香料電商</p>
        </div>
      </div>
      <nav className="container py-3">
        <div className="d-flex gap-5 align-items-center">
          <Link>
            <img src="https://github.com/Emilyee2001/react-week5-1/blob/main/src/assets/images/logo.png?raw=true" style={{ width: '190px' }} alt="logo" />
          </Link>
          <ul className="d-flex gap-4">
            {routes.map(page => (
              <li key={page.path} className="fs-6 fw-semibold">
                <NavLink to={page.path}>{page.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <button onClick={() => adminLogout()} className={`btn btn-lg btn-gray-700 ms-auto ${isLoading && 'disabled'}`}>登出後台</button>
        </div>
      </nav>
    </header>
    <Outlet />
  </>)
}