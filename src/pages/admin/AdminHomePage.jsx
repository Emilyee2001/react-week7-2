const baseUrl = import.meta.env.VITE_BASE_URL
const apiPath = import.meta.env.VITE_API_PATH
import { useEffect, useState } from 'react'
import axios from 'axios'
import Pagination from '../../components/admin/Pagination'
import ProductModal from '../../components/admin/ProductModal'
import DelProductModal from '../../components/admin/DelProductModal'
import { useNavigate } from 'react-router'

function ProductPage() {
  const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
  };

  const navigate = useNavigate();

  // 建立狀態
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [productMode, setProductMode] = useState('create');
  const [pageInfo, setPageInfo] = useState({});
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);

  const checkUserLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
      getProductData();
    } catch (error) {
      console.error('請重新登入');
      navigate('/login/admin');
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
  }, [])

  // 取得產品資料API
  const getProductData = async (page = 1) => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/admin/products?page=${page}`)
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      console.error('取得資料失敗')
    }
  };

  // 處理modal打開
  const handleOpenModal = (mode, product) => {
    setProductMode(mode);
    document.querySelector('#fileInput').value = '';
    mode === 'create' ? setTempProduct(defaultModalState) : setTempProduct(product);
    setIsProductModalOpen(true);
  }

  // 處理新增或編輯成功失敗
  const handleResultAlert = (icon, text) => {
    Swal.fire({
      position: "top-end",
      icon,
      text,
      showConfirmButton: false,
      timer: 1500
    });
  }

  // 處理刪除產品打開關閉
  const handleOpenDeleteModal = (product) => {
    setTempProduct(product);
    setIsDelModalOpen(true);
  }

  return (<>
    <div className="container my-5">
      <h4>學習組#3 異國香料電商</h4>
      <div className="d-flex mb-3">
        <h1>產品列表</h1>
        <button onClick={() => { handleOpenModal('create', tempProduct) }} type="button" className='btn btn-primary btn-lg ms-auto'>新增產品</button>
      </div>
      <table className="table">
        <thead className='table-primary'>
          <tr>
            <th scope="col">產品名稱</th>
            <th scope="col">產品類別</th>
            <th scope="col">原價</th>
            <th scope="col">售價</th>
            <th scope="col">是否啟用</th>
            <th scope="col">編輯管理</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <th scope="row">{product.title}</th>
              <td>{product.category}</td>
              <td>{product.origin_price}</td>
              <td>{product.price}</td>
              <td>{product.is_enabled ? (<p className='text-success'>是</p>) : (<p className='text-danger'>否</p>)}</td>
              <td><div className="btn-group">
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => { handleOpenModal('edit', product) }}>編輯</button>
                <button onClick={() => { handleOpenDeleteModal(product) }} type="button" className="btn btn-outline-danger btn-sm">刪除</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <Pagination pageInfo={pageInfo} getProductData={getProductData} />
    </div>
    {/* 新增編輯產品modal */}
    <ProductModal
      productMode={productMode}
      tempProduct={tempProduct}
      getProductData={getProductData}
      isOpen={isProductModalOpen}
      setIsOpen={setIsProductModalOpen}
      handleResultAlert={handleResultAlert}
    />
    {/* 是否刪除產品modal */}
    <DelProductModal
      tempProduct={tempProduct}
      getProductData={getProductData}
      isOpen={isDelModalOpen}
      setIsOpen={setIsDelModalOpen}
      handleResultAlert={handleResultAlert}
    />
  </>)
}

export default ProductPage;