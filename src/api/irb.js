import { getCountryCode } from '../lib/helpers';

export const irbReq = (productId, apiKey, ivid) => {
  let irbReqParams = '';
  const irbPATH = 'https://rapidload.increasingly.co/increasingly_bundles?irb/';
  irbReqParams = `product_ids=${productId}&category_id=&api_key=${getCountryCode()}&client_id=&page_type=catalog_product_view&fr=1&client_visitor_id=${ivid}`;
  const irbReqURL = decodeURI(irbPATH + window.btoa(irbReqParams));
  return irbReqURL;
  console.log(irbReqURL);
};

export const irbReqTickbox = (productId, apiKey, ivid) => {
  let irbReqParams = '';
  const irbPATH = 'https://rapidload.increasingly.co/increasingly_bundles?irb/';
  irbReqParams = `product_ids=${productId}&category_id=&api_key=${getCountryCode()}&client_id=&is_tbx=1&is_tbx_new=1&page_type=catalog_product_view&fr=1&no_of_bundles=1&client_visitor_id=${ivid}`;
  const irbReqURL = decodeURI(irbPATH + window.btoa(irbReqParams));
  return irbReqURL;
  console.log(irbReqURL);
};

export const irbReqCart = (productIds, ivid) => {
  let irbReqParams = '';
  const irbPATH = 'https://rapidload.increasingly.co/increasingly_bundles?irb/';
  irbReqParams = `product_ids=${productIds.toString()}& category_id=&api_key=${getCountryCode()}&page_type=checkout_cart_index&fr=1&client_visitor_id=${ivid}`;
  const irbReqURL = decodeURI(irbPATH + window.btoa(irbReqParams));
  return irbReqURL;
};
