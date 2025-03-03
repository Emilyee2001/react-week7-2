const baseUrl = import.meta.env.VITE_BASE_URL
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'

function LoginPage() {

  const navigate = useNavigate();

  // 建立狀態
  const [account, setAccount] = useState({
    username: '',
    password: ''
  })
  // 處理輸入帳號密碼
  const handleAccountInput = (e) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value
    })
  };
  // 處理登入
  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = account;
    {
      username && password ? accountLogin() :
        Swal.fire({
          text: "請輸入帳號密碼",
          icon: "warning"
        })
    }
  }
  // 登入API
  const accountLogin = async () => {
    try {
      const res = await axios.post(`${baseUrl}/v2/admin/signin`, account)
      const { token, expired } = res.data;
      document.cookie = `eToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      navigate('/admin');
    } catch (error) {
      Swal.fire({
        text: "登入失敗",
        icon: "error"
      })
    }
  }
  // 登入頁面戳API檢查是否登入，這樣重新整理就不需要重新輸入資料
  const checkUserLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
      navigate('/admin');
    } catch (error) {
      console.error('請重新登入');
    }
  }
  // 在登入畫面渲染時呼叫檢查登入的API
  useEffect(() => {
    const authToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)eToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common['Authorization'] = authToken;
    checkUserLogin();
  }, [])

  return (<>
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input onChange={handleAccountInput} type="email" className="form-control" id="username" placeholder="name@example.com" name="username" />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input onChange={handleAccountInput} type="password" className="form-control" id="password" placeholder="Password" name="password" />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary">登入</button>
      </form>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  </>)
}

export default LoginPage;