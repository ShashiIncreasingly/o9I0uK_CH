import { clientConfig } from '../zustand/store';

export function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


export const getCurrencyCode = () => 'GBP';

// export const formatter = new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: getCurrencyCode(),
//   minimumFractionDigits: 2,
//   maximumFractionDigits: 2,
// });

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: getCurrencyCodeFormatter(),
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function getCurrencyCodeFormatter() {
  const currentHref = window.location.href;

  if (currentHref.includes('/en-CH/')) {
      return 'CHF'; // Swiss Franc
  } else {
      return 'GBP'; // British Pound
  }
}

export const sortArray = (array) => {
  const sorting = ['empty_header_0', 'Foliage Type', 'Color_size', 'Size', 'Size_', 'Leather', 'Castors', 'Size_', 'Length', 'Height', 'Width', 'Light Type', 'Diameter', 'Colour', 'Color', 'Set Size', 'spec_width'];
  const hidden = ['spec_width'];
  const result = [];
  sorting.map((key) => {
    if (!hidden.includes(key)) {
      const post = array.filter((item) => item.frontEndLabel == key)[0];
      if (post) {
        result.push(post);
      }
    }
  });
  return result;
};

export const parseStringAndRemoveAfterQuestionMark = (inputString) => {
  // Find the index of the '?' character in the string
  const questionMarkIndex = inputString.indexOf('?');

  // If '?' is found in the string, slice the string up to that index
  // Otherwise, return the original string
  if (questionMarkIndex !== -1) {
      return inputString.slice(0, questionMarkIndex);
  } else {
      // If no '?' is found, return the original string
      return inputString;
  }
}

export const detectPageView = () => {

  let page_view = false
  if (typeof dataLayer !== 'undefined'){
    dataLayer.forEach((item) => {
     
      if (item.event === "page_viewed") {
        if (parseStringAndRemoveAfterQuestionMark(item.PagePath) === parseStringAndRemoveAfterQuestionMark(window.location.pathname).replace('/en-GB', '')) {
          user = item.UserType
          page_view = true
        } else if (item.PagePath.split('?')[0] === window.location.pathname.split('en-GB')[1]) {
          user = item.UserType
          page_view = true
        } else if (item.PagePath.split('?')[0] === window.location.pathname.split('en-CH')[1]) {
          user = item.UserType
          page_view = true
        }
      }
    })
  }

 
  return page_view;
}

export const readCookieValue = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (const s in ca) {
    if (Object.prototype.hasOwnProperty.call(ca, s)) {
      let c = ca[s];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
  }
  return null;
};// IRB Req (PDP)
export const getCountryCode = () => {
  let user = "Anonymous"
  let page_view = false
  if (typeof dataLayer !== 'undefined'){
   
    dataLayer.forEach((item) => {
     
      if (item.event === "page_viewed") {
        if (parseStringAndRemoveAfterQuestionMark(item.PagePath) === parseStringAndRemoveAfterQuestionMark(window.location.pathname).replace('/en-GB', '')) {
          user = item.UserType
          page_view = true
        } else if (item.PagePath.split('?')[0] === window.location.pathname.split('en-GB')[1]) {
          user = item.UserType
          page_view = true
        } else if (item.PagePath.split('?')[0] === window.location.pathname.split('en-CH')[1]) {
          user = item.UserType
          page_view = true
        }
      }
    })
  }

  let apiKey = 'o9I0uK';
  if (user == "Professional") {
    apiKey = 'o9I0TrauK';
  }
  if (window.location.href.includes('/en-CH/')) {
    apiKey = 'o9I09ch';
  }
  // console.log("User:", user)
  // console.log("apiKey", apiKey)
  return apiKey;
};
export const getProductIdFromWebPage = () => {
  let PRODUCTID = '';
  if (document.querySelector('body')) {
    const readClientPayload = JSON.parse(document.body.getAttribute('inc_payload'));
    if (readClientPayload) {
      PRODUCTID = readClientPayload.productIds;
    }
  }
  return PRODUCTID;
};

export const getCartPageProductIds = (env) => {
  const PRODUCTID = ['22850011004'];
  return PRODUCTID;
};
export function decodeEntity(inputStr) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = inputStr;
  let { value } = textarea;

  if (value.includes('empty')) {
    for (let i = 0; i <= 10; i += 1) {
      const pattern = `_empty_header_0${i}`;
      value = value.replace(pattern.toString(), '');
      if (!value.includes('empty')) {
        break;
      }
    }
  }

  function unicodeToChar(text) {
    return text.replace(
      /\\u[\dA-F]{4}/gi,
      (match) => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)),
    );
  }

  value = unicodeToChar(value);

  value = value.replace(/\\/g, '');
  return value;
}

// Custom Functions Specific For Client
export const convertSetAttribute = (attributes) => {
  let comboAttribute = false;
  const allAttributeNames = attributes.map((child) => child.attributeCode);
  if (allAttributeNames.includes('empty_header') || allAttributeNames.includes('empty_header_0')) {
    comboAttribute = true;
  }
  if (allAttributeNames.includes('Diameter')) {
    comboAttribute = true;
  }
  if (allAttributeNames.includes('Set Size')) {
    comboAttribute = true;
  }
  if (allAttributeNames.includes('Height') && allAttributeNames.includes('Length') && allAttributeNames.includes('Width')) {
    comboAttribute = true;
  }
  if (allAttributeNames.includes('Color') && allAttributeNames.includes('Length') && allAttributeNames.includes('Width')) {
    comboAttribute = true;
  }
  if (allAttributeNames.includes('Height') && allAttributeNames.includes('Width')) {
    comboAttribute = true;
  }
  return comboAttribute;
};

export const getCheckoutLinkClient = () => 'https://opi-storefront.vercel.app/en-GB/cart';

export const getAddToCartURLClient = () => 'https://opi-uki.myshopify.com/api/2022-10/graphql.json';

export const Base64 = {
  encode(e) {
    return window.btoa(e);
  },
  decode(e) {
    return window.atoa(e);
  },
};

export const handleFallbackImage = (e) => { e.target.src = clientConfig.no_image; };

export const getPageType = () => {
  if (window.location.pathname.includes('/products/')) {
    return 'PDP';
  } if (document.querySelector('.cart-container')) {
    return 'Cart';
  } if (window.location.pathname === '/') {
    return 'PDP';
  }

  return 'Invalid Page';
};

export const generateRandomString = (bits1) => (crypto.getRandomValues(
  new Uint32Array(1),
)[0] / 4294967295).toString(bits1).substring(2, 15)
  + (crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295).toString(bits1).substring(2, 15);

export const addVisitorID = () => {
  function generateUniqueINCVisitorId(len, bits) {
    const bits1 = bits || 36;
    let outStr = '';
    let newStr;
    while (outStr.length < len) {
      newStr = generateRandomString(bits1).toString().slice(2);
      outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return outStr;
  }
  let ivid = '';
  if (readCookieValue('ivid') != undefined) {
    ivid = readCookieValue('ivid');
  }
  let clientdomain = window.location.host;
  const arr = clientdomain.split('.');
  const d = new Date();
  let expires = `expires=${d.toUTCString()}`;
  if (ivid.length === 0) {
    ivid = generateUniqueINCVisitorId(42, 16);
    arr.shift();
    clientdomain = arr.join('.');
    if (arr === 'com') {
      clientdomain = window.location.host;
    }
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    expires = `expires=${d.toUTCString()}`;
    document.cookie = `ivid=${ivid};expires=${expires};domain=${clientdomain};path=/` + ';secure;';
  } else {
    arr.shift();
    clientdomain = arr.join('.');
    if (arr === 'com') {
      clientdomain = window.location.host;
    }
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    expires = `expires=${d.toUTCString()}`;
    document.cookie = `ivid=${ivid};expires=${expires};domain=${clientdomain};path=/` + ';secure;';
  }

  return ivid;
};

export const getCurrentFormattedTime = () => {
  const d = new Date();
  return (`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`);
};

export const getRecsButton = () => 'Add to Basket';

export const parseHTML = (htmlString) => {
  const domParser = new DOMParser();
  const htmlDom = domParser.parseFromString(htmlString, 'text/html');
  const readMore = htmlDom.querySelector('[ng-click]');
  if (readMore) {
    htmlDom.querySelector('[ng-click]').remove();
  }
  const stringifiedHtml = htmlDom.querySelector('html').innerHTML;
  return stringifiedHtml;
};


export const enviroment = () => {
  let env = 'development'
  let location = window.location.origin
  if (location === "https://feature--cwop-832-increasinglysection--opi-storefront.vercel.app" || location === "https://www.opi.com" || location == 'https://staging-opi-storefront.vercel.app') {
    env = 'production'
  }

  return env
}