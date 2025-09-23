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

  const getVegetableIcon = (vegetableType) => {
    // Return appropriate icon based on vegetable type
    const iconMap = {
      'กะหล่ำปลี': 'fas fa-leaf',
      'มะเขือเทศ': 'fas fa-circle',
      'แตงกวา': 'fas fa-seedling',
      'ผักกาดขาว': 'fas fa-leaf',
      'หอมใหญ่': 'fas fa-circle',
      'มันฝรั่ง': 'fas fa-square'
    };
    return iconMap[vegetableType] || 'fas fa-seedling';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'รอส่ง': {
        class: 'badge rounded-pill px-3 py-1',
        style: { backgroundColor: '#eada71ff', color: 'white', fontWeight: '600', fontSize: '0.9rem' },
        icon: 'fas fa-clock',
      },
      'ส่งแล้ว': {
        class: 'badge rounded-pill px-3 py-1',
        style: { backgroundColor: '#4caf50', color: 'white', fontWeight: '600', fontSize: '0.9rem' },
        icon: 'fas fa-check-circle',
      },
      'ยกเลิก': {
        class: 'badge rounded-pill px-3 py-1',
        style: { backgroundColor: '#ef5350', color: 'white', fontWeight: '600', fontSize: '0.9rem' },
        icon: 'fas fa-times-circle',
      }
    };
    
    const config = statusConfig[status] || statusConfig['รอส่ง'];
    return (
      <span className={config.class} style={config.style}>
        <i className={`${config.icon} me-1`} style={{ fontSize: '0.7rem' }}></i>
        {status}
      </span>
    );
  };

  if (!showOrderDetail || !selectedOrder) {
    return null;
  }

  return (
    <div 
      className="modal fade show" 
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowOrderDetail(false);
        }
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h6 className="modal-title">
              <i className={`${getVegetableIcon(selectedOrder.vegetableType)} me-2`}></i>
              รายละเอียดการสั่งซื้อ
              <div className="d-block d-md-none small mt-1">{selectedOrder.vegetableType}</div>
              <div className="d-none d-md-inline"> - {selectedOrder.vegetableType}</div>
            </h6>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowOrderDetail(false)}
            ></button>
          </div>
          <div className="modal-body p-2 p-md-4">
            <div className="row g-2 g-md-4">
              {/* Order Information - Mobile optimized */}
              <div className="col-12">
                <div className="card bg-light">
                  <div className="card-body p-2 p-md-3">
                    <h6 className="card-title text-primary mb-2 mb-md-3">
                      <i className="fas fa-info-circle me-2"></i>
                      ข้อมูลการสั่งซื้อ
                    </h6>
                    <div className="row g-2">
                      <div className="col-6 col-md-6">
                        <p className="mb-1 small"><strong>รหัส:</strong> #{selectedOrder.id}</p>
                        <p className="mb-1 small d-md-none"><strong>ผัก:</strong> {selectedOrder.vegetableType}</p>
                        <p className="mb-1 small d-none d-md-block"><strong>ประเภทผัก:</strong> {selectedOrder.vegetableType}</p>
                        <p className="mb-1 small"><strong>วันที่ส่ง:</strong> {formatDate(selectedOrder.deliveryDate)}</p>
                      </div>
                      <div className="col-6 col-md-6">
                        <p className="mb-1 small"><strong>จำนวนแผน:</strong> {selectedOrder.plannedQuantity.toLocaleString()} {selectedOrder.unit}</p>
                        <p className="mb-1 small"><strong>สถานะ:</strong> {getStatusBadge(selectedOrder.status)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actual Quantity Input - Mobile optimized */}
              <div className="col-12">
                <div className="card border-success">
                  <div className="card-header bg-success text-white p-2">
                    <h6 className="mb-0 small">
                      <i className="fas fa-edit me-2"></i>
                      อัพเดทจำนวนส่งจริง
                    </h6>
                  </div>
                  <div className="card-body p-2 p-md-3">
                    <div className="row align-items-end g-2">
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-bold small">
                          <i className="fas fa-weight me-1"></i>
                          จำนวนส่งจริง ({selectedOrder.unit})
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={actualQuantityInput}
                          onChange={(e) => setActualQuantityInput(e.target.value)}
                          placeholder="กรอกจำนวนที่ส่งจริง"
                          min="0"
                          step="1"
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="row text-center g-2">
                          <div className="col-6">
                            <small className="text-muted">จำนวนแผน</small>
                            <div className="fw-bold text-primary">
                              {selectedOrder.plannedQuantity.toLocaleString()}
                              <br />
                              <small>{selectedOrder.unit}</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">ส่งจริงปัจจุบัน</small>
                            <div className="fw-bold text-success">
                              {selectedOrder.actualQuantity ? 
                                selectedOrder.actualQuantity.toLocaleString() : 
                                'ยังไม่ระบุ'
                              }
                              {selectedOrder.actualQuantity && (
                                <>
                                  <br />
                                  <small>{selectedOrder.unit}</small>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {actualQuantityInput && (
                      <div className="mt-3 p-2 p-md-3 bg-light rounded">
                        <h6 className="text-primary mb-2 small">
                          <i className="fas fa-calculator me-1"></i>
                          สรุปการเปรียบเทียบ:
                        </h6>
                        <div className="row text-center g-1">
                          <div className="col-4">
                            <div className="text-muted small">แผน</div>
                            <div className="fw-bold text-primary small">
                              {selectedOrder.plannedQuantity.toLocaleString()}
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="text-muted small">ส่งจริง (ใหม่)</div>
                            <div className="fw-bold text-success small">
                              {parseInt(actualQuantityInput).toLocaleString()}
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="text-muted small">ส่วนต่าง</div>
                            <div className={`fw-bold small ${
                              parseInt(actualQuantityInput) >= selectedOrder.plannedQuantity 
                                ? 'text-success' 
                                : 'text-danger'
                            }`}>
                              {(parseInt(actualQuantityInput) - selectedOrder.plannedQuantity >= 0 ? '+' : '')}
                              {(parseInt(actualQuantityInput) - selectedOrder.plannedQuantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer bg-light p-2 p-md-3">
            <button
              type="button"
              className="btn btn-outline-secondary btn-md flex-grow-1 me-2"
              onClick={() => setShowOrderDetail(false)}
            >
              <i className="fas fa-times me-1"></i>
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-success btn-md flex-grow-1"
              onClick={updateActualQuantity}
              disabled={!actualQuantityInput}
            >
              <i className="fas fa-save me-1"></i>
              <span className="d-none d-md-inline">บันทึกจำนวนส่งจริง</span>
              <span className="d-md-none">บันทึก</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanOrderDetail;