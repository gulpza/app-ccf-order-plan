const PlanOrderDetail = ({ 
  showOrderDetail, 
  selectedOrder, 
  actualQuantityInput, 
  setActualQuantityInput,
  updateActualQuantity,
  setShowOrderDetail 
}) => {
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = (date.getFullYear() + 543); // Convert to Buddhist era
    return `${day}/${month}/${year}`;
  };

  // Get header background color based on status
  const getHeaderBackgroundColor = (status) => {
    const colorMap = {
      'รอส่ง': '#eada71ff',
      'ส่งแล้ว': '#4caf50',
      'ยกเลิก': '#ef5350'
    };
    return colorMap[status] || '#e4f4e2ff';
  };

  // Check if order can be edited (only "รอส่ง" status)
  const canEdit = selectedOrder?.status === 'รอส่ง';

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
              
              {/* Header Section - Same as PlanOrders */}
              <div className="container-fluid p-0">
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between py-3 px-4 position-relative">
                      {/* Logo - ด้านซ้าย */}
                      <div className="flex-shrink-0">
                        <i className="fas fa-leaf" style={{ fontSize: '2rem', color: '#2d5a3d' }}></i>
                      </div>
                      
                      {/* ข้อความกึ่งกลาง */}
                      <div className="position-absolute start-50 translate-middle-x text-center">
                        <h5 className="mb-0 fw-bold" style={{ color: '#2d5a3d' }}>กรอกน้ำหนักผัก</h5>
                      </div>
                      
                      {/* Close button */}
                      <div className="flex-shrink-0">
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowOrderDetail(false)}
                          style={{ fontSize: '1.2rem' }}
                        ></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Header Card */}
              <div className="container-fluid px-4 pb-3">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div 
                    className="card-header d-flex justify-content-between align-items-center p-3 border-0" 
                    style={{
                      background: getHeaderBackgroundColor(selectedOrder.status),
                      borderRadius: '12px 12px 0 0'
                    }}
                  >
                    {/* วันที่ส่ง - ด้านซ้าย */}
                    <div className="flex-shrink-0">
                      <h6 className="mb-0 fw-bold text-white" style={{fontSize: '1.1rem'}}>
                        {formatDate(selectedOrder.deliveryDate)}
                      </h6>
                    </div>
                    
                    {/* ประเภทผัก - ด้านขวา */}
                    <div className="flex-shrink-0">
                      <h6 className="mb-0 fw-bold text-white" style={{fontSize: '1.1rem'}}>
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
                            กรอกน้ำหนักส่งจริง (กก.)
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-lg"
                            value={actualQuantityInput}
                            onChange={(e) => setActualQuantityInput(e.target.value)}
                            placeholder="กรอกน้ำหนักส่งจริง"
                            min="0"
                            step="0.1"
                            style={{
                              borderRadius: '10px',
                              border: '2px solid #a8d5a3',
                              fontSize: '1.2rem',
                              padding: '12px 16px'
                            }}
                          />
                        </div>
                        
                        <div className="text-muted small mb-3">
                          <i className="fas fa-info-circle me-1"></i>
                          จำนวนแผน: {selectedOrder.plannedQuantity.toLocaleString()} กก.
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '3rem' }}></i>
                        <h6 className="text-muted">ข้อมูลนี้ไม่สามารถแก้ไขได้</h6>
                        <p className="text-muted small">
                          สถานะ: {selectedOrder.status}
                          {selectedOrder.actualQuantity && (
                            <><br />น้ำหนักส่งจริง: {selectedOrder.actualQuantity.toLocaleString()} กก.</>
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
                            fontSize: '1.1rem',
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
                              fontSize: '1.1rem'
                            }}
                            onClick={updateActualQuantity}
                            disabled={!actualQuantityInput}
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
    </>
  );
};

export default PlanOrderDetail;