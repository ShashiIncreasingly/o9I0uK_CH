import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { irbReq, irbReqTickbox } from '@/api/irb';
import oosproduct from '@/api/oos';
import Preview from '@/components/preview';
import { getProductIdFromWebPage, insertAfter, readCookieValue } from '@/lib/helpers';
import useStore, { clientConfig } from '@/zustand/store';
import 'swiper/swiper-bundle.css';
import 'swiper/swiper.min.css';
import DynamicRecs from './modules/DynamicRecs';
import FBT from './modules/FBT';
import Tickbox from './modules/Tickbox';
import Tracking from '../../api/tracking';

function previewBundle(bundles) {
  const miniRecs = document.querySelector('.products_productRoute__productCard__8rZLg form');
  if (!miniRecs) return;
  if (document.querySelector('#increasingly_preview_bundle')) {
    document.querySelector('#increasingly_preview_bundle').remove();
  }
  const newRoot = document.createElement('div');
  newRoot.id = 'increasingly_preview_bundle';
  insertAfter(newRoot, miniRecs);
  const root = ReactDOM.createRoot(newRoot);

  
  // Rendering Preview
  root.render(
    <React.StrictMode>
      <Preview bundles={bundles} />
    </React.StrictMode>,
  );
}

function tickBoxBundlePreview(bundlesTickbox) {
  const miniRecs = document.querySelector('.ProductForm_productForm__addToCartRow__0sH2Y');
  if (!miniRecs) return;
  if (document.querySelector('#inc_tickbox_bundle_wrapper')) {
    document.querySelector('#inc_tickbox_bundle_wrapper').remove();
  }
  const newRoot = document.createElement('div');
  newRoot.id = 'inc_tickbox_bundle_wrapper';
  newRoot.classList.add('inc_tickbox_bundle_wrapper')
  miniRecs.insertAdjacentElement("afterend", newRoot);
  const root = ReactDOM.createRoot(newRoot);

  
  // Rendering Preview
  root.render(
    <React.StrictMode>
      <Tickbox tickBoxBundles={bundlesTickbox} />
    </React.StrictMode>,
  );
}

function ProductPage() {
  const fetchBundle = useStore((store) => store.fetchBundle);
  const bundles = useStore((store) => store.bundles);
  const bundlesTickbox = useStore((store) => store.tickboxBundles);
  const recommendation = useStore((store) => store.recommendation);

  const bundlesExist = useStore((store) => store.bundlesExist);
  const tickboxExist = useStore((store) => store.tickboxExist);
  const recsExist = useStore((store) => store.recsExist);
  const addTickboxToClient = useStore((store) => store.addTickboxToClient);
  const tickBox = useStore((store) => store.tickBox);
  const storeCheck = useStore((store) => store);

  useEffect(() => {
    const productID = getProductIdFromWebPage();
    const ivid = readCookieValue('ivid');
    let apiKey = "o9I0uK"
    if(window.location.pathname.includes('/en-CH/')){
      apiKey = "o9I09ch"
      document.querySelector('html').classList.add('inc_ch')
    }
    const url = irbReq(productID, apiKey, ivid);
    const urlTickbox = irbReqTickbox(productID, apiKey, ivid);
    const ENV = url;
    const ENVT = urlTickbox;
    // if (document.querySelector('#inc_tickbox_bundle_wrapper')) {
    //   document.querySelector('#inc_tickbox_bundle_wrapper').remove();
    // }
    // if(document.querySelector('.ProductForm_productForm__addToCartRow__0sH2Y') != null){
    //   let tickboxEl = document.createElement('div')
    //   tickboxEl.id = "inc_tickbox_bundle_wrapper"
    //   tickboxEl.classList.add('inc_tickbox_bundle_wrapper')
    //   let tickbox_bundle_placement = document.querySelector('.ProductForm_productForm__addToCartRow__0sH2Y')
    //   tickbox_bundle_placement.insertAdjacentElement("afterend", tickboxEl);
    // }
    const oosButton = document.querySelector('.Button_button__v0_QK');
    if (oosButton) {
      if (oosButton.textContent.toLowerCase() === 'notify me when back in stock') {
        oosproduct();
        clientConfig.outOfStock = true;
      }else if (oosButton.textContent.toLowerCase() === 'buy now at wellastore') {
        oosproduct();
        clientConfig.outOfStock = true;
      }
    }
    if (window.location.host === '127.0.0.1:5173' || window.location.host === 'localhost:5173') {
      fetchBundle('development', 'pdp');
    } else {
      if(!clientConfig.outOfStock){
        fetchBundle(ENVT, 'tickbox');
      }
      setTimeout(function(){
        fetchBundle(ENV, 'pdp');
      }, 500)
    }
  }, []);

  useEffect(() => {
    if (bundlesExist) {
      previewBundle(bundles);
    }
  }, [bundlesExist === true]);

  useEffect(() => {
    if (tickboxExist) {
      tickBoxBundlePreview(bundlesTickbox);
    }
  }, [tickboxExist === true]);
  
  useEffect(() => {
    const formButtonSelector = 'form .Button_button__v0_QK[type="submit"]';
    const mainProductCTA = document.querySelector(formButtonSelector);
  
    if (mainProductCTA != null) {
      // Define the event handler function
      const handleClickTickbox = () => {
        if (tickBox.length !== 0) {
          if(document.querySelector('.inc_tickbox_block .inc_product_qty_input_block input') != null){
            let tickboxQTY = document.querySelector('.inc_tickbox_block .inc_product_qty_input_block input').value;
            tickBox[0].qtyAdded = tickboxQTY
          }
          setTimeout(function(){
            Tracking.addToCartTracking(
              bundlesTickbox.ProductsDetail[0].ProductId,
              tickBox[0].ProductId,
              tickBox[0].ProductId,
              bundlesTickbox,
              'single',
              'tickbox',
            );
            addTickboxToClient(tickBox[0].ProductId, tickBox[0].qtyAdded, 'tickbox', tickBox[0].Field1);
          },2500)
        }
      };
  
      // Remove previous event listener if it exists
      mainProductCTA.removeEventListener('click', handleClickTickbox);
  
      // Add the new event listener
      mainProductCTA.addEventListener('click', handleClickTickbox);
  
      // Cleanup function to remove the event listener when component unmounts or dependencies change
      return () => {
        mainProductCTA.removeEventListener('click', handleClickTickbox);
      };
    }
  }, [tickBox.length !== 0]);

  return (
    <>
      {/* {tickboxExist && (
        document.querySelector('.inc_tickbox_bundle_wrapper') && 
        ReactDOM.createRoot(document.querySelector('.inc_tickbox_bundle_wrapper'))
          .render(<Tickbox tickBoxBundles={bundlesTickbox} />)
      )} */}
      {bundlesExist && <FBT bundles={bundles} />}
      {recsExist && <DynamicRecs bundles={recommendation} />}
    </>
  );
}

export default ProductPage;
