"use client";

import React from "react";

export default function ModalOverlays() {
  const hideModal = (overlayId: string, modalId: string) => {
    if (typeof (window as any).UI !== 'undefined') {
      (window as any).UI.hideModal(overlayId, modalId);
    } else {
      const overlay = document.getElementById(overlayId);
      const modal = document.getElementById(modalId);
      if (overlay) overlay.style.display = 'none';
      if (modal) modal.classList.remove('is-active');
    }
  };

  return (
    <>
      <div 
        id="cart-modal-overlay" 
        className="modal-overlay" 
        onClick={() => hideModal('cart-modal-overlay', 'cart-modal')}
      ></div>
      <div 
        id="product-modal-overlay" 
        className="modal-overlay" 
        onClick={() => hideModal('product-modal-overlay', 'product-modal')}
      ></div>
    </>
  );
}
