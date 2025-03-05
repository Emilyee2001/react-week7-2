const baseUrl = import.meta.env.VITE_BASE_URL
const apiPath = import.meta.env.VITE_API_PATH
import { useEffect, useRef, useState } from 'react'
import { Modal } from 'bootstrap'
import axios from 'axios'

import { useDispatch } from 'react-redux'
import { showToast } from '../../redux/slice/toastSlice'

import Toast from './toast'

function ProductModal({
  productMode,
  tempProduct,
  getProductData,
  isOpen,
  setIsOpen,
}) {

  const dispatch = useDispatch();

  // 建立狀態
  const [modalData, setModalData] = useState(tempProduct);
  // 取DOM
  const productModalRef = useRef(null);
  // 取得的DOM new建立實例
  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false,
    })
  }, []);

  useEffect(() => {
    setModalData({
      ...tempProduct
    })
  }, [tempProduct]);

  useEffect(() => {
    if (isOpen) {
      const productModal = Modal.getInstance(productModalRef.current);
      productModal.show();
    }
  }, [isOpen])

  const handleCloseModal = () => {
    const productModal = Modal.getInstance(productModalRef.current);
    productModal.hide();
    setIsOpen(false);
  }
  // 處理產品modal input
  const handleProductModalInput = (e) => {
    const { value, name, type, checked } = e.target;
    setModalData({
      ...modalData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }
  // 處理modal 副圖區input
  const handleImagesInput = (e, index) => {
    const { value } = e.target;
    const newImages = [...modalData.imagesUrl];
    newImages[index] = value;
    setModalData({
      ...modalData,
      imagesUrl: newImages
    })
  }
  // 處理新增刪除圖片按鈕
  const handleAddDelImage = (mode) => {
    const newImages = [...modalData.imagesUrl]
    mode === 'add' ? newImages.push('') : newImages.pop();
    setModalData({
      ...modalData,
      imagesUrl: newImages
    })
  }
  // 新增產品API
  const createProduct = async () => {
    try {
      const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/admin/product`, {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
        }
      })
      dispatch(showToast({
        text: res.data.message,
        status: 'success'
      }))
      getProductData();
      handleCloseModal();
    } catch (error) {
      dispatch(showToast({
        text: error.response.data.message,
        status: 'error'
      }))
    }
  }
  // 編輯產品API
  const editProduct = async () => {
    try {
      const res = await axios.put(`${baseUrl}/v2/api/${apiPath}/admin/product/${modalData.id}`, {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
        }
      })
      dispatch(showToast({
        text: res.data.message,
        status: 'success'
      }))
      getProductData();
      handleCloseModal();
    } catch (error) {
      dispatch(showToast({
        text: error.response.data.message,
        status: 'error'
      }))
    }
  }
  // 處理確認新增or編輯產品
  const handleUpdateProduct = () => {
    productMode === 'create' ? createProduct() : editProduct();
  }
  // 處理上傳圖片
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file-to-upload', file);
    try {
      const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/admin/upload`, formData);
      const uploadedImageUrl = res.data.imageUrl;
      setModalData({
        ...modalData,
        imageUrl: uploadedImageUrl
      })
    } catch (error) {
      dispatch(showToast({
        text: error.response.data.message,
        status: 'error'
      }))
      document.querySelector('#fileInput').value = '';
    }
  }

  return (<>
    <div ref={productModalRef} id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4">{productMode === 'create' ? '新增產品' : '編輯產品'}</h5>
            <button onClick={handleCloseModal} type="button" className="btn-close" aria-label="Close"></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="mb-4">
                  <div className="mb-5">
                    <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                    <input
                      onChange={handleUploadImage}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileInput"
                    />
                  </div>
                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      onChange={handleProductModalInput}
                      value={modalData.imageUrl}
                      name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img
                    src={modalData.imageUrl || null}
                    alt={modalData.title}
                    className="img-fluid"
                  />
                </div>

                {/* 副圖 */}
                <p>副圖區</p>
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {modalData.imagesUrl?.map((image, index) => (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className="form-label"
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        onChange={(e) => { handleImagesInput(e, index) }}
                        value={image}
                        id={`imagesUrl-${index + 1}`}
                        type="text"
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
                      />
                      {image && (
                        <img
                          src={image || null}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid mb-2"
                        />
                      )}
                    </div>
                  ))}
                  <div className="btn-group w-100">
                    {modalData.imagesUrl.length < 5 && modalData.imagesUrl[modalData.imagesUrl.length - 1] !== '' && <button onClick={() => { handleAddDelImage('add') }} className="btn btn-outline-primary btn-sm w-100">新增圖片</button>}
                    {modalData.imagesUrl.length > 1 && <button onClick={() => { handleAddDelImage('delete') }} className="btn btn-outline-danger btn-sm w-100">刪除圖片</button>}

                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    onChange={handleProductModalInput}
                    value={modalData.title}
                    name="title"
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    分類
                  </label>
                  <input
                    onChange={handleProductModalInput}
                    value={modalData.category}
                    name="category"
                    id="category"
                    type="text"
                    className="form-control"
                    placeholder="請輸入分類"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="unit" className="form-label">
                    單位
                  </label>
                  <input
                    onChange={handleProductModalInput}
                    value={modalData.unit}
                    name="unit"
                    id="unit"
                    type="text"
                    className="form-control"
                    placeholder="請輸入單位"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      onChange={handleProductModalInput}
                      value={modalData.origin_price}
                      name="origin_price"
                      id="origin_price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入原價"
                      min={0}
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      onChange={handleProductModalInput}
                      value={modalData.price}
                      name="price"
                      id="price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入售價"
                      min={0}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    onChange={handleProductModalInput}
                    value={modalData.description}
                    name="description"
                    id="description"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    onChange={handleProductModalInput}
                    value={modalData.content}
                    name="content"
                    id="content"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入說明內容"
                  ></textarea>
                </div>

                <div className="form-check">
                  <input
                    onChange={handleProductModalInput}
                    // checked={modalData.is_enabled ? 1 : 0}
                    checked={modalData.is_enabled}
                    name="is_enabled"
                    type="checkbox"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top bg-light">
            <button onClick={handleCloseModal} type="button" className="btn btn-secondary">
              取消
            </button>
            <button onClick={handleUpdateProduct} type="button" className="btn btn-primary">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
    <Toast />
  </>)
}

export default ProductModal;