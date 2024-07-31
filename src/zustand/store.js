import create from 'zustand';
import { getAddToCartURLClient, getCountryCode } from '../lib/helpers';
import incPriceMismatch from '@/api/pricemismatch';

export const clientConfig = {
  client_id: 'o9I0uK',
  tracking_url: 'https://optimizedby.increasingly.co/ImportData',
  no_image: 'https://www.increasingly.co/Implementation/o9I0uK/images/no-image.png',
  outOfStock: false,
  recsProductIds: [],
  recsExist: false,
  dbProducts: 0,
};

const useStore = create((set, get) => ({
  bundles: {},
  recommendation: {},
  cartBundles: {},
  tickboxBundles: {},
  cart: [],
  tickBox: [],
  addedProductIds: [],
  addedProductIdsTickBox: [],
  total: {},
  recsProductIds: [],
  tickboxProductIds: "",
  saved: 0,
  totalCartQuantity: 0,
  addToCartLoader: false,
  addToCart: false,
  bundlesExist: false,
  recsExist: false,
  cartExist: false,
  tickboxExist : false,
  isProduction: false,
  addedFrom: null,
  outOfStock: false,
  isMobileOpen: true,
  miniCartOpen: false,
  bundleAvalaible: [],
  currentAddToCartId: null,
  failedCartId: null,
  failedCartIds: [],

  fetchBundle: async (url, type) => {
    const myHeaders = new Headers();
    myHeaders.append('Origin', window.location.origin);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    if (url === 'development') {
      if (type === 'pdp' || type === 'tickbox') {
        // This Section Is For Hardcoding During Local Development
        fetch('https://usaincreasingly.increasingly.co/Clients/opi-internal/bundles2.json')
          .then((response) => response.json())
          .then((data) => {
            set({
              bundles: data,
              bundlesExist: true,
              mainProduct: data.ProductsDetail[0],
            });
            const preAddCount = 3;

            const imagesDetails = [];
            for (let i = 0; i < preAddCount; i += 1) {
              if (data.ProductsDetail[0]) {
                // Price
                const product = data.ProductsDetail[i];
                let ID = product.ProductId;
                if (product.Attributes) {
                  product.Price = product.Attributes[0].attributeValues[0].childProductPrice;
                  product.SpecialPrice = product.Attributes[0]
                    .attributeValues[0]
                    .childProductSpecialPrice;
                  const { childProductId } = product.Attributes[0].attributeValues[0];
                  if (childProductId) {
                    ID = childProductId;
                  }
                }

                get().addToStore(product, 1, ID);
                imagesDetails.push(product);
              }
            }
            set({
              bundleAvalaible: [...imagesDetails],
            });
          });

        // fetch('https://usaincreasingly.increasingly.co/Clients/opi-internal/recs.json')
        //   .then((response) => response.json())
        //   .then((data) => {
        //     set({
        //       recommendation: data,
        //       recsExist: true,
        //       recsProductIds: [...data.CategoryRecommendations.map((product) => product.ProductId)],
        //     });

        //     // Update Config
        //     clientConfig.recsExist = true;
        //     clientConfig.dbProducts = data.CategoryRecommendations.length;

        //   });

        return;
      }
      if (type === 'cart') {
        // This Section Is For Hardcoding During Local Development
        fetch('https://usaincreasingly.increasingly.co/Clients/opi-vite/cart.json')
          .then((response) => response.json())
          .then((data) => {
            set({
              cartBundles: data,
              cartExist: true,
            });
          });

        return;
      }
    }
    // This Section Is For Production Data Flow.
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((bundles) => {
        // Check IF Recs Or PDP
        if (bundles.CategoryRecommendations) {
          set({
            recommendation: bundles,
            recsExist: true,
            isProduction: true,
            recsProductIds: [...bundles.CategoryRecommendations.map(
              (product) => product.ProductId,
            )],
          });
          clientConfig.recsExist = true;
          clientConfig.recsProductIds = [...bundles.CategoryRecommendations.map(
            (product) => product.ProductId,
          )];
          clientConfig.dbProducts = bundles.CategoryRecommendations.length;
        } else if (type === 'pdp') {
          if (bundles) {
            const token = getCountryCode();
            const productId = bundles.ProductsDetail[0].ProductId;
            const oldProductPrice = bundles.ProductsDetail[0].Price;
            const oldSpecialPrice = bundles.ProductsDetail[0].SpecialPrice;
            const mismatch = incPriceMismatch(token, productId, oldProductPrice, oldSpecialPrice);
            console.log('mismatch',mismatch)
            if (mismatch) {
              if (document.querySelector('#increasingly_preview_bundle')) {
                document.querySelector('#increasingly_preview_bundle').remove();
              }
              return
            };
              set((state) => {
                try{
                  console.log('tickboxProductIds',tickboxProductIds)
                  if(tickboxProductIds){
                    let newBundles = bundles.ProductsDetail.filter((item) => item.ProductId !== tickboxProductIds)
                    bundles.ProductsDetail = newBundles
                  }
                }
                catch(e){
                  console.log("tickbox error")
                }
                return {
                  bundles,
                  mainProduct: bundles.ProductsDetail[0],
                  bundlesExist: true,
                  isProduction: true,
                }
              });
            // }
            // set();
            const preAddCount = 3;
            for (let i = 0; i < preAddCount; i += 1) {
              if (bundles.ProductsDetail[0]) {
                const product = bundles.ProductsDetail[i];
                if (product) {
                  get().addToStore(product, 1, product.ProductId);
                }
              }
            }
          }

          const dbCount = bundles.ProductsDetail.length;
          clientConfig.dbProducts = dbCount - 1;
        } else if (type === 'cart') {
          set({
            cartBundles: bundles,
            cartExist: true,
            isProduction: true,
          });
        } else if (type === 'tickbox') {
          // set({
          //   tickboxBundles: bundles,
          //   tickboxExist: true,
          //   isProduction: true,
          // });
          if (bundles) {
            const token = getCountryCode();
            const productId = bundles.ProductsDetail[1]?.ProductId;
            tickboxProductIds = productId
            console.log('tickboxProductIds',tickboxProductIds)
            set({
              tickboxBundles: bundles,
              mainProduct: bundles.ProductsDetail[0],
              tickboxExist: true,
              isProduction: true,
            });
          }

          const dbCount = bundles.ProductsDetail.length;
          clientConfig.dbProducts = dbCount - 1;
        }
      }).catch((error) => {

      });
  },

  addToStore: (product, qty, activeId) => {
    set((state) => {
      const isPresent = state.cart.findIndex(
        (item) => item.ProductId === product.ProductId,
      );
      const newProduct = product;
      newProduct.qtyAdded = qty;
      newProduct.activeId = activeId;
      newProduct.Field1 = product.Field1;
      if (isPresent === -1) {
        return {
          ...state,
          cart: [...state.cart, newProduct],

        };
      }
      const newState = state;
      newState.cart[isPresent] = product;

      return {
        ...newState,
        cart: state.cart,

      };
    });
    get().calculateTotal();
    get().addProductId(product.ProductId);
  },

  removeFromStore: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.ProductId !== id),
    }));
    get().calculateTotal();
    get().removeProductId(id);
  },

  calculateTotal: () => {
    set((state) => {
      let currentTotal = 0;
      let currentSaved = 0;
      const totalCartQty = 0;
      if (state.cart.length !== 0) {
        currentTotal = state.cart
          .map(
            (item) => (item.SpecialPrice == null || item.SpecialPrice === 0
              ? item.Price * item.qtyAdded
              : item.SpecialPrice * item.qtyAdded),
          )
          .reduce((prev, next) => Number(prev) + Number(next));

        currentSaved = state.cart
          .map((item) => (
            item.SpecialPrice == null || item.SpecialPrice === 0
              ? 0 : (item.Price - item.SpecialPrice) * item.qtyAdded))
          .reduce((prev, next) => Number(prev) + Number(next));
      }

      return {
        total: currentTotal,
        saved: currentSaved,
        totalCartQuantity: state.cart.length,

      };
    });
  },

  addProductId: (id) => {
    set((state) => {
      const isPresent = state.addedProductIds.find((item) => item === id);

      if (!isPresent) {
        return {
          ...state,
          addedProductIds: [...state.addedProductIds, id],

        };
      }

      return {
        ...state,
        addedProductIds: state.addedProductIds,
      };
    });
  },

  removeProductId: (id) => {
    set((state) => {
      const updatedIds = state.addedProductIds.filter((item) => item !== id);
      return {
        ...state,
        addedProductIds: updatedIds,
      };
    });
  },

  addToClient: (products) => {
    set({ addToCartLoader: true, addedFrom: 'PDP' });
    const productsArray = [];
    let mainID = null;
    const readClientPayload = JSON.parse(document.body.getAttribute('inc_payload'));
    if (readClientPayload) {
      mainID = readClientPayload.productIds[0];
    }
    const failedIDS = [];
    products.map((product, idx) => {
      if (product.Field1 !== '') {
        productsArray.push({
          id: product.Field1,
          quantity: Number(product.qtyAdded),
        });
      } else if (idx === 0 && product.ProductId === mainID) {
        const currentField = document.querySelector('#variantSelect-main').value;
        productsArray.push({
          id: currentField,
          quantity: Number(product.qtyAdded),
        });
      } else if (product.Field1 == '') {
        failedIDS.push(product.ProductId);
      }
    });

    // console.log(productsArray);
    const event = new CustomEvent('increasinglyBundleAdd', {
      detail: {
        products: [...productsArray],
      },
    });

    if (failedIDS.length !== 0) {
      get().handleFailedCartIds(failedIDS);
    }
    window.dispatchEvent(event);
    if (productsArray.length === 0) {
      set({ addToCartLoader: false, addToCart: false });
    }

    const checkForSidebar = setInterval(() => {
      const clientBTN = document.querySelector('div[aria-label="cartDrawer"]');
      if (clientBTN) {
        set({ addToCartLoader: false, addToCart: true });
        clearInterval(checkForSidebar);
      }
    }, 500);

    setTimeout(() => {
      set({ addToCartLoader: false, addToCart: true });
      clearInterval(checkForSidebar);
      get().handleFailedCartIds([]);
    }, 5000);
  },

  addSingleToClient: (activeId, qtyAdded, type, fiedl1) => {
    // console.log({ field1: fiedl1, activeId });

    if (fiedl1 == '') {
      // console.log('EMPTY');
      get().handleFailedCartId(activeId);
    }
    const event = new CustomEvent('increasinglyBundleAdd', {
      detail: {
        products: [{
          id: fiedl1,
          quantity: Number(qtyAdded),
        }],
      },
    });
    // console.log(event);
    window.dispatchEvent(event);

    const checkForSidebar = setInterval(() => {
      const clientBTN = document.querySelector('div[aria-label="cartDrawer"]');
      if (clientBTN) {
        set({ addToCartLoader: false, addToCart: true });
        clearInterval(checkForSidebar);
        get().handleCurrentAddToCartId(-1);
      }
    }, 500);

    setTimeout(() => {
      set({ addToCartLoader: false, addToCart: true });
      clearInterval(checkForSidebar);
      get().handleCurrentAddToCartId(-1);
      get().handleFailedCartId(null);
    }, 5000);
  },
  addTickboxToClient: (activeId, qtyAdded, type, fiedl1) => {
    console.log({ field1: fiedl1, activeId });

    if (fiedl1 == '') {
      console.log('EMPTY');
      get().handleFailedCartId(activeId);
    }
    const event = new CustomEvent('increasinglyBundleAdd', {
      detail: {
        products: [{
          id: fiedl1,
          quantity: Number(qtyAdded),
        }],
      },
    });
    console.log(event);
    window.dispatchEvent(event);

    const checkForSidebar = setInterval(() => {
      const clientBTN = document.querySelector('div[aria-label="cartDrawer"]');
      if (clientBTN) {
        set({ addToCartLoader: false, addToCart: true });
        clearInterval(checkForSidebar);
        get().handleCurrentAddToCartId(-1);
        if(document.querySelector('.inc_tickbox_bundle_wrapper .inc_product_add_checkbox_img.checked') != null){
          document.querySelector('.inc_tickbox_bundle_wrapper .inc_product_add_checkbox_img.checked').click()
        }
      }
    }, 10);

    setTimeout(() => {
      set({ addToCartLoader: false, addToCart: true });
      clearInterval(checkForSidebar);
      get().handleCurrentAddToCartId(-1);
      get().handleFailedCartId(null);
      if(document.querySelector('.inc_tickbox_bundle_wrapper .inc_product_add_checkbox_img.checked') != null){
        document.querySelector('.inc_tickbox_bundle_wrapper .inc_product_add_checkbox_img.checked').click()
      }
    }, 15000);
  },

  handleFailedCartId: (value) => {
    set({ failedCartId: value });
  },
  handleFailedCartIds: (value) => {
    set({ failedCartIds: value });
  },
  handleOutOfStock: (value) => {
    set({ outOfStock: value });
  },

  handleClientMiniCart: (value) => {
    set({ miniCartOpen: true });
  },

  handleCurrentAddToCartId: (value) => {
    set({
      currentAddToCartId: value,
    });
  },
  
  addTickboxToStore: (product, qty, activeId) => {
    set((state) => {
      const isPresent = state.tickBox.findIndex(
        (item) => item.ProductId === product.ProductId,
      );
      const newProduct = product;
      newProduct.qtyAdded = qty;
      newProduct.activeId = activeId;
      newProduct.Field1 = product.Field1;
      if (isPresent === -1) {
        return {
          ...state,
          tickBox: [...state.tickBox, newProduct],

        };
      }
      const newState = state;
      newState.tickBox[isPresent] = product;

      return {
        ...newState,
        tickBox: state.tickBox,

      };
    });
    get().addProductIdTickbox(product.ProductId);
    
  },

  removeTickboxFromStore: (id) => {
    set((state) => ({
      tickBox: state.tickBox.filter((item) => item.ProductId !== id),
    }));
    get().removeProductIdTickbox(id);
  },
  addProductIdTickbox: (id) => {
    set((state) => {
      const isPresent = state.addedProductIdsTickBox.find((item) => item === id);

      if (!isPresent) {
        return {
          ...state,
          addedProductIdsTickBox: [...state.addedProductIdsTickBox, id],

        };
      }

      return {
        ...state,
        addedProductIdsTickBox: state.addedProductIdsTickBox,
      };
    });
  },
  removeProductIdTickbox: (id) => {
    set((state) => {
      const updatedIds = state.addedProductIdsTickBox.filter((item) => item !== id);
      return {
        ...state,
        addedProductIdsTickBox: updatedIds,
      };
    });
  },

}));

export default useStore;
