const baseUrl = import.meta.env.VITE_BASE_URL
const apiPath = import.meta.env.VITE_API_PATH
import axios from 'axios'

import Pagination from '../../components/admin/Pagination'
import ProductModal from '../../components/admin/ProductModal'
import DelProductModal from '../../components/admin/DelProductModal'
import FullscreenLoading from '../../components/FullscreenLoading'

import { useEffect, useState } from 'react'

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

  // 建立狀態
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [productMode, setProductMode] = useState('create');
  const [pageInfo, setPageInfo] = useState({});
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isFullLoading, setIsFullLoading] = useState(false);

  useEffect(() => {
    getProductData();
  }, []);

  // 取得產品資料API
  const getProductData = async (page = 1) => {
    const authToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)eToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common['Authorization'] = authToken;
    setIsFullLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/admin/products?page=${page}`)
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      console.error('取得資料失敗')
    } finally {
      setIsFullLoading(false);
    }
  };

  // 處理modal打開
  const handleOpenModal = (mode, product) => {
    setProductMode(mode);
    document.querySelector('#fileInput').value = '';
    mode === 'create' ? setTempProduct(defaultModalState) : setTempProduct(product);
    setIsProductModalOpen(true);
  }

  // 處理刪除產品打開關閉
  const handleOpenDeleteModal = (product) => {
    setTempProduct(product);
    setIsDelModalOpen(true);
  }

  return (<>
    <div className="container my-3">
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
    />
    {/* 是否刪除產品modal */}
    <DelProductModal
      tempProduct={tempProduct}
      getProductData={getProductData}
      isOpen={isDelModalOpen}
      setIsOpen={setIsDelModalOpen}
    />
    {isFullLoading && <FullscreenLoading />}
  </>)
}

export default ProductPage;