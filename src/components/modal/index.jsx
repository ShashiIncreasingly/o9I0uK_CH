import parse from 'html-react-parser';
import reduce from 'lodash/reduce';
import PropTypes, { func } from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Modal from 'react-modal';
import { useMediaQuery } from 'react-responsive';
import { v4 as uuidv4 } from 'uuid';
import {
  decodeEntity, formatter, getRecsButton, parseHTML,
} from '../../lib/helpers';

import Tracking from '../../api/tracking';
import useStore from '../../zustand/store';
import Ratings from '../atoms/Ratings';
import Gallery from './gallery';
import './modal.scss';

function ButtonSimple({
  productObject, addedProductIds, main, handleOpen, updateQty, qty, handleAddToStore, handleKeyUp, handleInput, handleQtyChange,
}) {
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });
  const removeFromStore = useStore((store) => store.removeFromStore);
  const handleSimpleClick = () => {
    if (addedProductIds.includes(productObject.ProductId)) {
      removeFromStore(productObject.ProductId);
    } else {
      handleAddToStore(productObject);
    }
  };
  if (!isMobileBelow && addedProductIds.includes(productObject.ProductId)) {
    return (
      <>
        <button type="button" aria-label="Decrease" className={`inc_product_qty_minus ${qty === 1 ? 'inc_single' : ''}`} onClick={(e) => updateQty('decrease', e.target)} />
        <div className="inc_product_qty_input_block">
          <DebounceInput
            debounceTimeout={300}
            type="number"
            min="1"
            max="20"
            maxLength={2}
            minLength={1}
            name="product_qty"
            onKeyUp={(e) => handleKeyUp(e)}
            onKeyDown={(e) => handleInput(e)}
            onChange={(e) => handleQtyChange(e)}
            value={qty}

          />
          <span>ADDED</span>
        </div>
        <button type="button" aria-label="Increase" className="inc_product_qty_plus" onClick={(e) => updateQty('increase', e.target)} />
      </>
    );
  } if (!isMobileBelow && !addedProductIds.includes(productObject.ProductId)) {
    return (
      <button type="button" className={`inc_modal_select_button ${main && 'main'} ${addedProductIds.includes(productObject.ProductId) ? 'selected' : 'not_selected'} ${!addedProductIds.includes(productObject.ProductId) && 'inc_no_edit'}`} onClick={() => handleSimpleClick()}>
        <span>
          Add To Bundle
        </span>
      </button>
    );
  } if (isMobileBelow) {
    return (
      <>
        <button type="button" aria-label="Decrease" className={`inc_product_qty_minus ${qty == 1 ? 'inc_single' : ''}`} onClick={(e) => updateQty('decrease', e.target)} />
        <div className="inc_product_qty_input_block">
          <DebounceInput
            debounceTimeout={300}
            type="number"
            min="1"
            max="20"
            maxLength={2}
            minLength={1}
            name="product_qty"
            onKeyUp={(e) => handleKeyUp(e)}
            onKeyDown={(e) => handleInput(e)}
            onChange={(e) => handleQtyChange(e)}
            value={qty}

          />
          <span>ADDED</span>
        </div>
        <button type="button" aria-label="Increase" className="inc_product_qty_plus" onClick={(e) => updateQty('increase', e.target)} />
      </>
    );
  }
}

function RecsButton({ handleAddToStore, productObject, currentAddToCartId }) {

  return (
    <>
      <button className={`inc_modal_select_button false not_selected inc_no_edit ${currentAddToCartId == productObject.ProductId && 'adding'}`} disabled={currentAddToCartId == productObject.ProductId} onClick={() => handleAddToStore(productObject)}>Add To Bag</button>
    </>
  )
}

function TickboxSimple({
  productObject, addedProductIdsTickBox, main, handleOpen, updateQty, qty, handleAddToStore, handleKeyUp, handleInput, handleQtyChange,
}) {
  return (
    <>
      <button type="button" aria-label="Decrease" module="tickbox" className={`inc_product_qty_minus ${qty === 1 ? 'inc_single' : ''}`} onClick={(e) => updateQty('decrease', e.target)} />
      <div className="inc_product_qty_input_block">
        <DebounceInput
          debounceTimeout={300}
          type="number"
          min="1"
          max="20"
          maxLength={2}
          minLength={1}
          name="product_qty"
          module="tickbox"
          onKeyUp={(e) => handleKeyUp(e)}
          onKeyDown={(e) => handleInput(e)}
          onChange={(e) => handleQtyChange(e)}
          value={qty}

        />
        <span>ADDED</span>
      </div>
      <button type="button" aria-label="Increase" module="tickbox" className="inc_product_qty_plus" onClick={(e) => updateQty('increase', e.target)} />
    </>
  );
}

function ButtonConfig({
  productObject, addedProductIds, main, handleOpen,
}) {
  return (
    <button type="button" className={`inc_modal_select_button ${main && 'main'} ${addedProductIds.includes(productObject.ProductId) ? 'selected' : 'not_selected'} ${!addedProductIds.includes(productObject.ProductId) && 'inc_no_edit'}`} onClick={() => handleOpen('Button', true)}>
      {addedProductIds.includes(productObject.ProductId)
        ? (
          <span>
            Added
          </span>
        ) : (
          <span>
            Add To Bundle
          </span>
        )}

      {/* <span title={selectedText}>{selectedText}</span> */}
    </button>
  );
}


const root = document.querySelector('#increasingly_root');
Modal.setAppElement(root);

function ModalBlock({
  productObject, activeAttributes, activeMainImage, price, activeOptions,
  updateActiveAttribute, main, type, qty, setQty, handleCart, activeID,
  modalIsOpen, setIsOpen, mini, handleOpen,
}) {
  const addedProductIds = useStore((store) => store.addedProductIds);
  const addedProductIdsTickBox = useStore((store) => store.addedProductIdsTickBox);
  const addSingleToClient = useStore((store) => store.addSingleToClient);

  const addToCartLoader = useStore((store) => store.addToCartLoader);
  const addToCart = useStore((store) => store.addToCart);
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });
  const recommendation = useStore((store) => store.recommendation);
  const cartBundles = useStore((store) => store.cartBundles);

  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedText, setSelectedText] = useState('Add To Bundle');
  const [buttonText, setButtonText] = useState('Add to Bundle');
  const [alert, showAlert] = useState(false);
  const [currentATC, setCurrentATC] = useState(null);
  const [imageGallery, setImageGallery] = useState(productObject.OtherImageList || []);
  const [description, setDescription] = useState(null);
  const descriptionRef = useRef(null);
  const removeFromStore = useStore((store) => store.removeFromStore);
  const handleCurrentAddToCartId = useStore((store) => store.handleCurrentAddToCartId);
  const [mobileActivated,setMobileActivated] = useState(isMobileBelow)
  const currentAddToCartId = useStore((store) => store.currentAddToCartId);

  const timeoutRef = useRef(null);

  function closeModal() {
    clearTimeout(timeoutRef.current);
    setIsOpen(false);
    document.body.style.overflow = '';
    document.querySelector('html').style.overflow = '';
    showAlert(false);
  }

  const handleAddToStore = () => {
    if (type === 'pdp' || type === 'tickbox') {
      handleCart(price.activePrice, price.specialPrice, null, 'action', null, type);
      closeModal();
    } else if (type === 'recs') {
      Tracking.bestSellerAddToCart(
        recommendation.CategoryRecommendations[0].ProductId,
        productObject.ProductId,
        addedProductIds,
        recommendation,
        'single',
      );

      addSingleToClient(productObject.ProductId, qty, type, productObject.Field1);
      handleCurrentAddToCartId(productObject.ProductId)
    } else if (type === 'cart') {
      Tracking.addToCartTracking(
        cartBundles.ProductsDetail[0].ProductId,
        productObject.ProductId,
        addedProductIds,
        cartBundles,
        'single',
      );
      addSingleToClient(activeID, qty, type);
    }
    setCurrentATC(productObject.ProductId);

  };
  
  function afterOpenModal() {
    // references are now sync'd and can be accessed.\
    document.querySelector('body').style.overflow = 'hidden';
    document.querySelector('html').style.overflow = 'hidden';
  }

  const handleInput = (e) => {
    
    if (e.keyCode == 190) e.preventDefault();
    if (e.target.value.length > 2) e.preventDefault();
  };

  const handleKeyUp = (e) => {
    // console.log(e.target.value)
    let updatedQty = e.target.value;
    let checkforone = '';
    let inputTarget = e.target
    clearTimeout(checkforone);
    if (e.target.value.length === 0) {
      checkforone = setTimeout(() => {
        if (e.target.value.length === 0) {
          updatedQty = 1;
          setQty(updatedQty);
          e.target.value = updatedQty;
          clearTimeout(checkforone);
          if(inputTarget.getAttribute == undefined){
            inputTarget = inputTarget.target
          }
          if(inputTarget.getAttribute('module') != "tickbox"){
            handleCart(price.activePrice, price.specialPrice, updatedQty, 'qty');
          }
        } else {
          clearTimeout(checkforone);
        }
      }, 500);
    } else {
      clearTimeout(checkforone);
    }
   
  };

  const handleQtyChange = (e) => {
    let updatedQty = e.target.value;
    let inputTarget = e.target
    if (e.target.value.length === 0) {
      updatedQty = 1;
      setQty(updatedQty);
      e.target.value = 1;
    } else if (e.target.value > 99) {
      updatedQty = 99;
      setQty(updatedQty);
    } else if (e.target.value <= 0) {
      updatedQty = 1;
      setQty(updatedQty);
    }
    setQty(updatedQty);
    if(inputTarget.getAttribute == undefined){
      inputTarget = inputTarget.target
    }
    if(inputTarget.getAttribute('module') != "tickbox"){
      if (document.querySelector('.inc_modal_parent_block input')) {
        document.querySelector('.inc_modal_parent_block input').value = updatedQty;
      }
      handleCart(price.activePrice, price.specialPrice, updatedQty, 'qty');
    }
  };

  const updateQty = (qtyType, targetQty) => {
    let updated = qty;
    if (qtyType === 'increase' && qty < 100) {
      updated = Number(qty) + 1;
      if (qty != 99) {
        setQty(updated);
      }
    } else if (qtyType === 'decrease' && qty > 1) {
      updated = Number(qty) - 1;
      setQty(updated);
    } else {
      if (qty > 1 && qty < 100) {
        updated = Number(qty) + 1;
      }
      setQty(updated);
    }
    if(targetQty.getAttribute == undefined){
      targetQty = targetQty.target
    }
    if(targetQty.getAttribute('module') != "tickbox"){
      if (qtyType === 'decrease' && qty == 1) {
        removeFromStore(productObject.ProductId)
      } else {
        handleCart(price.activePrice, price.specialPrice, updated, 'qty');
      }
    }
  };

  function updatedSelectText() {
    let options = '';
    Object.values(activeOptions).forEach((value) => {
      if (options === '') {
        options = value.replace(/&nbsp;/g, '');
      } else {
        options += ` / ${value.replace(/&nbsp;/g, '')}`;
      }
    });
    if (addedProductIds.includes(productObject.ProductId)) {
      setSelectedText(options);
    }
  }

  const handleUpdateAttributes = (childProductId, optionText, idx, childPrdID, frontEndLabel) => {
    updateActiveAttribute(childProductId, optionText, idx, childPrdID, frontEndLabel);
  };

  const handleAlert = () => {
    const alerttimeout = setTimeout(() => {
      showAlert(false);
      closeModal();
    }, 5000);
    timeoutRef.current = alerttimeout;
  };

  const handleActivTab = (tab) => {
    setActiveTab(tab);
  };

  const sendClickTrackDelayed = (ProductId, ProductUrl, typeModule, e) => {
    e.preventDefault();
    console.log("click tracking",ProductId)
    Tracking.sendBundleClickTracking(ProductId, null, typeModule);

    setTimeout(() => {
      window.location.href = `${ProductUrl}`;
    }, 1500);
  };
 
  useEffect(() => {
    updatedSelectText();
    if (type !== 'pdp' && type !== 'tickbox') {
      setButtonText(getRecsButton());
    } else if (addedProductIds.includes(productObject.ProductId) || (addedProductIdsTickBox.includes(productObject.ProductId) && type === 'tickbox')) {
      setButtonText('Update');
    } else if (!addedProductIdsTickBox.includes(productObject.ProductId) && type === 'tickbox') {
      setButtonText('Add to Bag');
    } else if (!addedProductIds.includes(productObject.ProductId)) {
      setButtonText('Add to Bundle');
    }
  }, [activeOptions, addedProductIds, type, addedProductIdsTickBox]);

  // Handle Button Text Change
  useEffect(() => {
    if (addToCartLoader && type !== 'pdp') {
      setButtonText('Adding...');
    }
  }, [addToCartLoader && type !== 'pdp' && currentATC === productObject.ProductId]);

  useEffect(() => {
    if (addToCart === true && currentATC === productObject.ProductId) {
      if (type === 'cart') return window.location.reload();
      setButtonText(getRecsButton());
      showAlert(true);
      handleAlert();
    }
  }, [addToCart === true && type !== 'pdp' && currentATC === productObject.ProductId]);

  useEffect(() => {
    setActiveTab('Overview');
  }, [modalIsOpen]);

  useEffect(() => {
    if (activeAttributes) {
      setImageGallery(activeAttributes[0].attributeValues[0].childProductOtherImageUrl || []);
      const attributeCount = activeAttributes.length;
      const subCount = reduce(
        activeAttributes.map(
          (child) => child.attributeValues.length,
        ),
        (sum, n) => sum + n,
        0,
      );
      if (subCount === attributeCount && !main) {
        if (!addedProductIds.includes(productObject.ProductId)) {
          setSelectedText('Add To Bundle');
        }
      }
    }
  }, [activeAttributes]);

  useEffect(() => {
    if (productObject.Description) {
      if (productObject.Description !== ""){

        const stringifiedHtml = productObject.Description.replaceAll('\n','<br/>')
        setDescription(stringifiedHtml);
      }
    }
  }, [productObject.Description]);

  useEffect(() => {
    if (mobileActivated !== isMobileBelow){
      // console.log("Changed")
      setMobileActivated(isMobileBelow)
    }
  }, [isMobileBelow])
  

  return (
    <div className="inc_modal_block" key={productObject.ProductID} data-productid={productObject.ProductId}>
      {(type == "pdp") && <ButtonSimple productObject={productObject} addedProductIds={addedProductIds} main={main} handleOpen={handleOpen} updateQty={updateQty} qty={qty} handleAddToStore={handleAddToStore} handleKeyUp={handleKeyUp} handleInput={handleInput} handleQtyChange={handleQtyChange} />}
      {(type == "tickbox") && <TickboxSimple productObject={productObject} addedProductIdsTickBox={addedProductIdsTickBox} main={main} handleOpen={handleOpen} updateQty={updateQty} qty={qty} handleAddToStore={handleAddToStore} handleKeyUp={handleKeyUp} handleInput={handleInput} handleQtyChange={handleQtyChange} />}
      {type == 'recs' && <RecsButton handleAddToStore={handleAddToStore} productObject={productObject} currentAddToCartId={currentAddToCartId} />}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={() => afterOpenModal()}
        onRequestClose={() => closeModal()}
        preventScroll

      >
        <div className="inc_modal_parent_block">
          <button type="button" aria-label="Close" className="inc_product_header_close_button" onClick={() => closeModal()} />
          <div className="inc_product_modal_header_main_block ">
            <p className="inc_product_modal_header_manufacturer">{productObject.CategoryName}</p>
            <a className="inc_product_header_main_title_block" onClick={(e) => sendClickTrackDelayed(productObject.ProductId, productObject.ProductUrl.replace('https://www.opi.com', window.location.origin), type, e)} href={productObject.ProductUrl.replace('https://www.opi.com', window.location.origin)} title={productObject.ProductName} rel="noopener noreferrer">{productObject.ProductName}</a>
            <Ratings rating={productObject.Rating} ratingCount={productObject.RatingCount} type="modal" />
            <div className="inc_product_header_tabs">
              <div role="button" aria-label="Tab Overview" tabIndex={0} className={activeTab === 'Overview' ? 'inc_product_header_tab inc_active' : 'inc_product_header_tab'} onClick={() => handleActivTab('Overview')} onKeyDown={() => handleActivTab('Overview')}>Overview</div>
              {description && <div role="button" aria-label="Tab Description" tabIndex={0} className={activeTab === 'Description' ? 'inc_product_header_tab inc_active' : 'inc_product_header_tab'} onClick={() => handleActivTab('Description')} onKeyDown={() => handleActivTab('Description')}>Description</div> }
              <a target="_blank" onClick={(e) => Tracking.sendBundleClickTracking(productObject.ProductId, null, type)} href={productObject.ProductUrl.replace('https://www.opi.com', window.location.origin)} className="inc_product_header_tab inc_product_header_new_tab" rel="noreferrer">Open In A New Tab</a>
            </div>
          </div>
          <div className={`inc_product_modal_content ${imageGallery.length == 1 ? 'inc_single' : 'inc_multiple'}`}>
            <div className="inc_product_modal_left">
              {activeTab === 'Description' && <div ref={descriptionRef} className="inc_product_modal_description">{description && parse(description)}</div>}
              {activeTab === 'Overview' && (
                <div className="inc_product_modal_gallery">
                  {activeMainImage && (
                    <Gallery
                      images={imageGallery}
                      activeMainImage={activeMainImage}
                      ProductId={productObject.ProductId}
                      ProductUrl={productObject.ProductUrl}
                      type={type}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="inc_product_modal_right">
              {
                isMobileBelow ? (
                  <>
                    <p className="inc_product_header_manufacturer">{productObject.CategoryName}</p>
                    <a className="inc_product_header_main_title_block"  onClick={(e) => sendClickTrackDelayed(productObject.ProductId, productObject.ProductUrl.replace('https://www.opi.com', window.location.origin), type, e)}  href={productObject.ProductUrl.replace('https://www.opi.com', window.location.origin)} title={productObject.ProductName} rel="noopener noreferrer">{productObject.ProductName}</a>
                    <Ratings rating={productObject.Rating} ratingCount={productObject.RatingCount} type="modal" />
                  </>
                ) : ('')
              }
              <div className="inc_product_modal_price">
                {price.specialPrice == null || price.specialPrice === 0 || price.specialPrice === price.activePrice ? (
                  <>
                    {' '}
                    <div className="inc_product_modal_regular_price ">{formatter.format(price.activePrice)}</div>
                  </>
                ) : (
                  <>
                    <div className="inc_product_modal_active_price">{formatter.format(price.specialPrice)}</div>
                    <div className="inc_product_modal_regular_price strikethrough">{formatter.format(price.activePrice)}</div>
                  </>
                )}
              </div>
              <div className="inc_modal_attributes_block">
                {activeAttributes?.filter(
                  (attr) => attr.attributeValues.length !== 0,
                ).map((attr, idx) => (
                  <div className={`inc_modal_attributes_item_${idx}`} key={uuidv4()}>
                    <div className="inc_modal_attribute_title">{attr.frontEndLabel}</div>
                    <div className="inc_modal_attribute_value_block">
                      {attr.attributeValues?.map((value) => (
                        <button
                          type="button"
                          aria-label="Attribute"
                          data-id={value.childProductId}
                          onClick={() => handleUpdateAttributes(
                            value.childProductId,
                            value.optionText,
                            idx,
                            value.childProductId,
                            attr.frontEndLabel,
                          )}
                          key={value.childProductId}
                          className={`${activeOptions[attr.frontEndLabel]}` === value.optionText ? `inc_modal_attribute_values inc_active ${attr.frontEndLabel.replace(/\s/g, '').toLowerCase()}` : `inc_modal_attribute_values ${attr.frontEndLabel.replace(/\s/g, '').toLowerCase()}`}
                        >
                          {' '}
                          {decodeEntity(value.optionText)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="inc_modal_qty">
                <button type="button" aria-label="Decrease" module={type} className={`inc_modal_qty_minus ${qty == 1 ? 'inc_single' : ''}`} onClick={(e) => updateQty('decrease', e)} />
                <div className="inc_modal_qty_input_block">
                  <DebounceInput
                    debounceTimeout={300}
                    type="number"
                    min="1"
                    max="20"
                    maxLength={2}
                    minLength={1}
                    name="product_qty"
                    module={type}
                    onKeyUp={(e) => handleKeyUp(e)}
                    onKeyDown={(e) => handleInput(e)}
                    onChange={(e) => handleQtyChange(e)}
                    value={qty}
                  />
                </div>
                <button type="button" aria-label="Increase" module={type} className="inc_modal_qty_plus" onClick={(e) => updateQty('increase', e)} />
              </div>
              <button type="button" className="inc_modal_button" onClick={() => handleAddToStore(productObject)}>{buttonText}</button>
              {isMobileBelow && !mini && (
                <div className="inc_modal_full_deatils">
                  <a  onClick={(e) => sendClickTrackDelayed(productObject.ProductId, productObject.ProductUrl.replace('https://www.opi.com', window.location.origin), type, e)} href={productObject.ProductUrl.replace('https://www.opi.com', window.location.origin)}>
                    <span>
                      View Full Details
                    </span>
                  </a>
                </div>
              )}
              {alert && (
                <div className="inc_product_message_alert_block ">
                  {' '}
                  <div className="inc_product_message_alert_text">Added to your basket</div>
                  {' '}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

ModalBlock.propTypes = {
  activeAttributes: PropTypes.array,
  activeMainImage: PropTypes.string.isRequired,
  price: PropTypes.object.isRequired,
  activeOptions: PropTypes.object.isRequired,
  updateActiveAttribute: PropTypes.func.isRequired,
  main: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  attributeType: PropTypes.string.isRequired,
  qty: PropTypes.number.isRequired,
  setQty: PropTypes.func.isRequired,
  activeID: PropTypes.string,
  handleCart: PropTypes.func.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  mini: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
};

ButtonSimple.propTypes = {
  main: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  addedProductIds: PropTypes.array.isRequired,
};
TickboxSimple.propTypes = {
  main: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
};

ButtonConfig.propTypes = {
  productObject: PropTypes.objectOf(PropTypes.productObject).isRequired,
  main: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  addedProductIds: PropTypes.array.isRequired,
};

export default ModalBlock;
