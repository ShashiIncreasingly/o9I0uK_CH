import {
  getCountryCode, getCurrentFormattedTime, getPageType, getProductIdFromWebPage, readCookieValue,
} from '../lib/helpers';
import { clientConfig } from '../zustand/store';

const sendTrackingEvents = (importDataObj) => {
  const xhr = new XMLHttpRequest();
  const method = 'POST';
  const url = '//optimizedby.increasingly.co/ImportData'
  xhr.onreadystatechange = handleStateChange;
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  function handleStateChange() {
    if (xhr.readyState === 4 && xhr.status === 200) { // console.log(xhr.responseText)
    }
  }

  xhr.send(JSON.stringify(importDataObj));
};

export function bundleViewTracking() {

  const data = {
    eventData: String(window.btoa(JSON.stringify({
      event_data: {
        product_id: getProductIdFromWebPage(),
      },
      event_type: 'catalog_product_view',
      page_type: 'catalog_product_view',
      method: 'track',
      platform: '',
      token: getCountryCode(),
    }))),
    vid: readCookieValue('ivid'),
    time: getCurrentFormattedTime(),
    uri: document.location.href,
  };
  sendTrackingEvents(data);


}

const trackingEvents = (eventType, eventDataObj, pageTypeID, pageTypeModule) => {
  const importEventDataObj = {};
  const importDataObj = {};
  const pageType = getPageType();
  if(pageTypeModule == "tickbox"){
    pageTypeID = '109';
  }
  importEventDataObj.event_data = eventDataObj;
  switch (eventType) {
    case 'bundleProductClickTracking':
      importEventDataObj.event_type = 'bundle_product_click_tracking';
      importEventDataObj.page_type = pageTypeID.toString();
      if (window.innerWidth <= 800) {
        clientConfig.dbProducts = clientConfig.dbProducts >= 2 ? 2 : clientConfig.dbProducts
      }
      if (clientConfig.recsExist) {
        importEventDataObj.rt = '8';
        if (pageType === 'PDP') {
          if (clientConfig.outOfStock) {
            importEventDataObj.rpt = '1';
          } else if (clientConfig.recsExist) {
            importEventDataObj.rpt = '2';
          } else if (clientConfig.recsProductIds.includes(eventDataObj.product_id)) {
            importEventDataObj.rpt = '4';
          } else {
            importEventDataObj.rpt = '3';
          }
        }
      }
      if (pageType === 'PDP' && pageTypeID !== 210 && clientConfig.outOfStock == false) {
        if(pageTypeModule != "tickbox"){
          importEventDataObj.db = clientConfig.dbProducts.toString();
          console.log(clientConfig)
        }
      }
      importEventDataObj.is_logged = '0';
      importEventDataObj.method = 'track';
      if (pageType === '100' && !clientConfig.recsProductIds.includes(eventDataObj.product_id)) {
        if(pageTypeModule != "tickbox"){
          importEventDataObj.db = clientConfig.dbProducts.toString();
        }
      }
      if (clientConfig.recsExist) {
        delete importEventDataObj.db
      }
      break;
    case 'bundleAddToCart':
      importEventDataObj.event_type = 'bundle_add_to_cart';
      importEventDataObj.page_type = pageTypeID;
      importEventDataObj.is_logged = '0';
      importEventDataObj.method = 'track';
      break;
    default:
      break;
  }

  importEventDataObj.platform = '';
  importEventDataObj.token = getCountryCode();
  importDataObj.eventData = window.btoa(JSON.stringify(importEventDataObj));
  importDataObj.uri = window.location.href;
  importDataObj.vid = readCookieValue('ivid');
  sendTrackingEvents(importDataObj);
};

function getPageTypeId() {
  const pageType = getPageType();
  let pageTypeID = null;
  switch (pageType) {
    case 'PDP':
      pageTypeID = '100';
      break;
    case 'cartPage':
      pageTypeID = '103';
      break;
    default:
      break;
  }
  return pageTypeID;
}

// Bundle Product Click Tracking
function sendBundleClickTracking(productId, page_type_from_source, moduleType) {
  const pageType = getPageType();
  let pageTypeID = null;
  switch (pageType) {
    case 'PDP':
      pageTypeID = '100';
      break;
    case 'cartPage':
      pageTypeID = '103';
      break;
    default:
      break;
  }
  if (page_type_from_source) {
    pageTypeID = page_type_from_source
  }

  if(moduleType === "tickbox"){
    pageTypeID = '109';
  }
  
  const PrdCore = getProductIdFromWebPage();
  trackingEvents('bundleProductClickTracking', {
    product_id: productId,
    core_product_id: PrdCore.toString(),
  }, pageTypeID, moduleType);
}

function makeTrackingApiCall(eventdata) {
  const URL = '//optimizedby.increasingly.co/ImportData';
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      if (xhr.responseText !== '' && xhr.responseText != null) {
        const resul = xhr.responseText;
        console.log(`track${resul}`);
      }
    }
  };
  xhr.open('POST', URL, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(eventdata);
}

// Add Bundle To Cart Tracking
function addToCartTracking(mainProductId, currentId, addedProductIds, Bundles, type, module) {
  const event_type = 'bundle_add_to_cart';
  let coreProductId = '';
  const productIdsforTracking = [];
  coreProductId = mainProductId;

  let pageType = '100';
  const allData = [];

  const bundleTracking = Bundles.Bundles;

  if (type === 'multiple') {
    // FOR PDP
    // If Only First Is Added
    if (mainProductId === currentId && addedProductIds.length === 1) {
      allData.push({
        id: parseInt(bundleTracking[0].BundleId, 10),
        product_ids: [mainProductId, mainProductId],
        product_id: coreProductId,
        bundle_pos: "1",
      });
    }
    // If Only First & Second Are Selected
    if (mainProductId === currentId && addedProductIds.length > 1) {
      for (let i = 1; i < addedProductIds.length; i += 1) {
        productIdsforTracking.push(mainProductId);
        allData.push({
          id: parseInt(bundleTracking[0].BundleId, 10),
          product_ids: [mainProductId, addedProductIds[i]],
          product_id: coreProductId,
          bundle_pos: i.toString(),
        });
      }
    }
    if (mainProductId !== currentId && addedProductIds.length > 1) {
      for (let i = 1; i < addedProductIds.length; i += 1) {
        productIdsforTracking.push(mainProductId);
        allData.push({
          id: parseInt(bundleTracking[0].BundleId, 10),
          product_ids: [mainProductId, addedProductIds[i]],
          product_id: coreProductId,
          bundle_pos: i.toString(),
        });
      }
    }

    let dbCount = 0
    dbCount = clientConfig.dbProducts
    if (window.innerWidth <= 800) {
      dbCount = clientConfig.dbProducts >= 2 ? 2 : clientConfig.dbProducts

    }
    const data = {
      eventData: window.btoa((JSON.stringify({
        event_data: {
          bundle_data: allData,
        },
        page_type: pageType.toString(),
        event_type,
        method: 'track',
        platform: '',
        token: getCountryCode(),
        mb: '1',
        db: dbCount.toString(),
      }))),
      vid: readCookieValue('ivid'),
      time: getCurrentFormattedTime(),
      uri: document.location.href,
    };
    makeTrackingApiCall(JSON.stringify(data));
  } else if (type === 'single') {
    const eventDataObj = {};
    const currentBundle = Bundles.Bundles.find((product) => product.ProductIds.includes(currentId));
    if (getPageType() === 'cartPage') {
      eventDataObj.bundle_data = {
        id: currentBundle.bundleId,
        product_ids: [currentBundle.ProductIds[0], currentId],
        product_id: currentId,
      };
    }else if(module == "tickbox"){
      pageType = '109';
      eventDataObj.bundle_data = {
        id: parseInt(bundleTracking[0].BundleId, 10),
        product_ids: [currentBundle.ProductIds[0], currentId],
        product_id: currentId,
      };
    } else {
      if(module == "tickbox"){
        pageType = '109';
      }
      eventDataObj.bundle_data = {
        id: currentBundle.bundleId,
        product_ids: [currentBundle.ProductIds[0], currentId],
        product_id: currentId,
      };
    }
    trackingEvents('bundleAddToCart', eventDataObj, getPageTypeId(), module);
  }
}

function bestSellerAddToCart(mainProductId, currentId, Bundles) {
  if ((!clientConfig.recsExist && Bundles.Bundles === 'undefined') || (Bundles.Bundles === undefined && getPageType() === 'PDP')) {
    // FOR RECS & Cart
    const eventData = {
      core_product_id: mainProductId,
      product_id: currentId,
    };
    let rptVal = '4';
    if (getPageType() === 'PDP') {
      if (clientConfig.outOfStock) {
        rptVal = '1';
      } else if (clientConfig.recsExist === true) {
        rptVal = '2';
      } else if (clientConfig.recsProductIds.includes(eventData.product_id)) {
        rptVal = '4';
      } else {
        rptVal = '3';
      }
    }
    const Data = {
      eventData: window.btoa((JSON.stringify({
        event_data: eventData,
        page_type: getPageTypeId(),
        event_type: 'bestseller_add_to_cart',
        method: 'track',
        platform: '',
        token: getCountryCode(),
        rt: '8',
        rpt: rptVal,

      }))),
      vid: readCookieValue('ivid'),
      time: getCurrentFormattedTime(),
      uri: document.location.href,
    };
    makeTrackingApiCall(JSON.stringify(Data));
  }
}
export default { sendBundleClickTracking, addToCartTracking, bestSellerAddToCart };
