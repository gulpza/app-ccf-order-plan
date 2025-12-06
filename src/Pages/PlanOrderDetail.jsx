import React, { useState } from 'react';
import AppHeader from '../Components/AppHeader';
import { formatDate } from '../utils/dateUtils';
import { getHeaderBackgroundColor } from '../config/statusColors';

const PlanOrderDetail = ({ 
  showOrderDetail, 
  selectedOrder, 
  farmQuantityInput, 
  setfarmQuantityInput,
  updatefarmQuantity,
  setShowOrderDetail 
}) => {
  
  // State for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Check if order can be edited (only "รอส่ง" status)
  const canEdit = selectedOrder?.status === 'รอส่ง' || selectedOrder?.status === 'ส่งแล้ว' || selectedOrder?.status === 'รับแล้ว';

  // Handle save button click - show confirmation modal
  const handleSaveClick = () => {
    if (!farmQuantityInput || parseFloat(farmQuantityInput) <= 0) {
      alert('กรุณากรอกน้ำหนักที่ถูกต้อง');
      return;
    }
    setShowConfirmModal(true);
  };

  // Handle confirm save
  const handleConfirmSave = async () => {
    setSaving(true);
    try {
      await updatefarmQuantity();
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel confirmation
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  if (!selectedOrder) return null;

  return (
    <>
      {showOrderDetail && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down">
            <div className="modal-content" style={{ borderRadius: '12px' }}>
              
              {/* Header Section with Close Button */}
              <div className="container-fluid px-2 px-md-3 pt-2 mt-2">
                <div className="position-relative">
                  <div style={{ paddingLeft: '20px' }}>
                    <AppHeader title="กรอกน้ำหนักผัก" />
                  </div>
                  {/* Close button overlay */}
                  <div className="position-absolute top-0 end-0 pt-2 p-3">
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowOrderDetail(false)}
                      style={{ fontSize: '1.2rem' }}
                    ></button>
                  </div>
                </div>
              </div>

              {/* Order Header Card */}
              <div className="container-fluid px-4 pb-3">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div 
                    className="card-header d-flex justify-content-between align-items-center border-0 position-relative" 
                    style={{
                      background: getHeaderBackgroundColor(selectedOrder.status),
                      borderRadius: '12px 12px 0 0',
                      height: '40px',
                      padding: '8px 16px'
                    }}
                  >
                    {/* วันที่ส่ง - ด้านซ้าย */}
                    <div className="flex-shrink-2">
                      <h6 className="mb-0 fw-bold text-white " style={{fontSize: '1.2rem'}}>
                        {formatDate(selectedOrder.deliveryDate)}
                      </h6>
                    </div>
                    
                    {/* ประเภทผัก - ด้านขวา */}
                    <div className="flex-shrink-0">
                      <h6 className="mb-0 fw-bold text-white text-end pe-2" style={{fontSize: '1.2rem'}}>
                        {selectedOrder.vegetableType}
                      </h6>
                    </div>
                  </div>

                  {/* Body with input field */}
                  <div className="card-body p-4" style={{ background: '#ffffff' }}>
                    {canEdit ? (
                      <>
                        <div className="mb-4">
                          <label className="form-label fw-bold mb-3" style={{ fontSize: '1.1rem', color: '#2d5a3d' }}>
                            <i className="fas fa-weight me-2"></i>
                            กรอกน้ำหนักหน้าสวน (กก.)
                          </label>
                          <input
                            type="number"
                            inputMode="decimal"
                            pattern="[0-9]*(\.[0-9]{0,2})?"
                            autoFocus
                            className="form-control form-control-lg"
                            value={farmQuantityInput}
                            onChange={(e) => setfarmQuantityInput(e.target.value)}
                            placeholder="กรอกน้ำหนักหน้าสวน"
                            min="0"
                            step="0.01"
                            style={{
                              borderRadius: '10px',
                              border: '2px solid #a8d5a3',
                              fontSize: '1.2rem',
                              padding: '12px 16px'
                            }}
                          />
                        </div>
                        
                        <div className="text-muted small mb-3" style={{ fontSize: '1.2rem' }}>
                          <i className="fas fa-info-circle me-1" ></i>
                          จำนวนแผน: {Number(selectedOrder.plannedQuantity).toFixed(2)} กก.
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <i className="fas fa-solid fa-circle-xmark text-danger mb-3" style={{ fontSize: '3rem' }}></i>
                        <h5 className="text-muted">ข้อมูลนี้ไม่สามารถแก้ไขได้</h5>
                        <p className="text-muted small" style={{ fontSize: '1.2rem' }}>
                          สถานะ: {selectedOrder.status}
                          {selectedOrder.farmQuantity && (
                            <>
                            <br />น้ำหนักหน้าสวน: {Number(selectedOrder.farmQuantity).toFixed(2)} กก.
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer with buttons */}
                  <div 
                    className="card-footer border-0 p-4" 
                    style={{ 
                      background: '#f8f9faff',
                      borderRadius: '0 0 12px 12px'
                    }}
                  >
                    <div className="row g-3">
                      {/* ปุ่มกลับ - แสดงเสมอ */}
                      <div className={canEdit ? "col-6" : "col-12"}>
                        <button
                          type="button"
                          className="btn btn-outline-secondary w-100 fw-bold"
                          style={{
                            borderRadius: '12px',
                            padding: '0.75rem',
                            fontSize: '1.5rem',
                            border: '2px solid #6c757d'
                          }}
                          onClick={() => setShowOrderDetail(false)}
                        >
                          <i className="fas fa-arrow-left me-2"></i>
                          กลับ
                        </button>
                      </div>
                      
                      {/* ปุ่มบันทึก - แสดงเฉพาะเมื่อสถานะ "รอส่ง" */}
                      {canEdit && (
                        <div className="col-6">
                          <button
                            type="button"
                            className="btn w-100 fw-bold"
                            style={{ 
                              background: '#2d5a3d',
                              borderColor: '#2d5a3d',
                              color: 'white',
                              borderRadius: '12px',
                              padding: '0.75rem',
                              fontSize: '1.5rem'
                            }}
                            onClick={handleSaveClick}
                            disabled={!farmQuantityInput}
                          >
                            <i className="fas fa-save me-2"></i>
                            บันทึก
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content" style={{ borderRadius: '12px' }}>
              <div className="modal-body text-center py-4">
                <div className="mb-4">
                  <i className="fas fa-question-circle text-warning mb-3" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mb-0">ยืนยันการบันทึกข้อมูล?</h5>
                </div>
                
                <div className="row g-3">
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 fw-bold"
                      style={{
                        borderRadius: '10px',
                        padding: '0.75rem',
                        fontSize: '1.1rem'
                      }}
                      onClick={handleCancelConfirm}
                    >
                      ยกเลิก
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn w-100 fw-bold"
                      style={{ 
                        background: '#2d5a3d',
                        borderColor: '#2d5a3d',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        fontSize: '1.1rem'
                      }}
                      onClick={handleConfirmSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          กำลังบันทึก...
                        </>
                      ) : (
                        'ยืนยัน'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlanOrderDetail;