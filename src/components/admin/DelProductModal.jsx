const baseUrl = import.meta.env.VITE_BASE_URL
const apiPath = import.meta.env.VITE_API_PATH
import { useEffect, useRef } from 'react'
import { Modal } from 'bootstrap'
import axios from 'axios'

function DelProductModal({
  tempProduct,
  getProductData,
  isOpen,
  setIsOpen,
  handleResultAlert
}) {
  // 取DOM
  const deleteModalRef = useRef(null);
  // 取得的DOM new建立實例
  useEffect(() => {
    new Modal(deleteModalRef.current, {
      backdrop: true
    })
  }, [])
  useEffect(() => {
    if(isOpen){
      const deleteModal = Modal.getInstance(deleteModalRef.current);
      deleteModal.show();
    }
  },[isOpen])
  // 刪除產品API
  const deleteProduct = async () => {
    try {
      const res = await axios.delete(`${baseUrl}/v2/api/${apiPath}/admin/product/${tempProduct.id}`);
      handleResultAlert('success', res.data.message);
      getProductData();;
      handleCloseDeleteModal();
    } catch (error) {
      handleResultAlert('error', error.response.data.message);
    }
  }
  const handleCloseDeleteModal = () => {
    const deleteModal = Modal.getInstance(deleteModalRef.current);
    deleteModal.hide();
    setIsOpen(false);
  }

  return (<>
    <div
      ref={deleteModalRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              onClick={handleCloseDeleteModal}
              type="button"
              className="btn btn-secondary"
            >
              取消
            </button>
            <button onClick={deleteProduct} type="button" className="btn btn-danger">
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default DelProductModal;