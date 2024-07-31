

// Price Mismatch API
function incPriceMismatch(token, productId, old_product_price, old_special_price) {

  let isSpecialEl = document.querySelectorAll('.ProductForm_productForm__details__FvIyg p[data-test-id="productPrice"]').length
  let isSpecial = false
  if (isSpecialEl >= 2) isSpecial = true


  let data = {};
  const priceMismatchObj = {};
  priceMismatchObj.token = token
  priceMismatchObj.product_id = productId;

  let clientActivePrice = 0;
  let clientSpecialPrice = 0;
  // GET CLIENT PRICE
  if (isSpecial) {
    clientActiveElement = document.querySelectorAll('p[data-test-id="productPrice"]')[1]
    clientSpecialElement = document.querySelectorAll('p[data-test-id="productPrice"]')[0]
  } else {
    clientActiveElement = document.querySelectorAll('p[data-test-id="productPrice"]')[0]
    clientSpecialElement = null
  }

  if (clientSpecialElement == null) {
    clientActivePrice = clientActiveElement.innerText.replace(/^\D+/g, '').replace(',', '').toString();
    clientSpecialPrice = null;
  } else {
    clientActivePrice = clientActiveElement.innerText.replace(/^\D+/g, '').replace(',', '').toString();
    clientSpecialPrice = clientSpecialElement.innerText.replace(/^\D+/g, '').replace(',', '').toString();
  }
  priceMismatchObj.product_price = clientActivePrice;
  priceMismatchObj.special_price = clientSpecialPrice;

  // console.log(old_product_price, old_special_price)

  if (old_product_price === old_special_price) {
    old_special_price = null
  }

  priceMismatchObj.old_product_price = old_product_price
  priceMismatchObj.old_special_price = old_special_price


  priceMismatchObj.price_type = 'IncVAT';

  // console.log(priceMismatchObj);



  data = {
    eventData: window.btoa(JSON.stringify(priceMismatchObj)),
  };

  let mismatch = false;

  if (Number(priceMismatchObj.product_price) !== Number(priceMismatchObj.old_product_price) || Number(priceMismatchObj.special_price) !== Number(priceMismatchObj.old_special_price)) {
    mismatch = true;
  }

  let mismatchURL = 'https://gather.increasingly.com/ProductPriceDetails';


  if (mismatch) {
    // fetch(mismatchURL, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application.json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    //   cache: 'default',
    // });

    return true;
  }

  return false;
}
export default incPriceMismatch;
