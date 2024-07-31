import { Base64, getCountryCode } from '../lib/helpers';

function oosproduct() {
  const readClientPayload = JSON.parse(document.body.getAttribute('inc_payload'));
  const prdid = readClientPayload.productIds[0];
  const productId = prdid;
  const qty = 0;
  const formatJsonData = JSON.stringify({
    token: getCountryCode(),
    product_id: productId,
    quantity: qty,
  });

  if (productId != null) {
    const data = {
      eventData: Base64.encode(formatJsonData),
    };
    const URL = 'https://gather.increasingly.com/ProductInventoryUpdate';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', URL, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) { // console.log(xhr.responseText)
        }
      }
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  }
}

export default oosproduct;
