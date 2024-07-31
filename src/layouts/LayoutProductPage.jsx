import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'swiper/swiper-bundle.css';
import 'swiper/swiper.min.css';
import { irbReq } from '../api/irb';
import { getProductIdFromWebPage, insertAfter, readCookieValue } from '../lib/helpers';
import useStore from '../zustand/store';
import ProductPage from './ProductPage';
import SidebarRecommendation from './SidebarRecommendation';
import './styles/ProductPage.scss';
import Preview from '../components/preview';

function insertBefore(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode);
}

function previewBundle(bundles) {
  const miniRecs = document.querySelector('.products_productRoute__productCard__8rZLg form')
  const newRoot = document.createElement('div');
  newRoot.id = 'increasingly_preview_bundle';
  insertAfter(newRoot,miniRecs)
  // miniRecs.appendChild(newRoot);
  // console.log(miniRecs)
  const root = ReactDOM.createRoot(newRoot);

  // Rendering Preview
  root.render(
    <React.StrictMode>
      <Preview bundles={bundles} />
    </React.StrictMode>,
  );
}

function sidebarRecs() {
  const miniRecs = document.querySelector('.MiniCart_miniCart__recommendationWrapper__wyhGg');
  const newRoot = document.createElement('div');
  newRoot.id = 'increasingly_minicart';
  miniRecs.appendChild(newRoot);
  const root = ReactDOM.createRoot(newRoot);

  // Rendering Sidebar
  root.render(
    <React.StrictMode>
      <SidebarRecommendation />
    </React.StrictMode>,
  );
}

function LayoutProductPage() {
  const fetchBundle = useStore((store) => store.fetchBundle);
  const bundles = useStore((store) => store.bundles);

  const bundlesExist = useStore((store) => store.bundlesExist);
  const miniCartOpen = useStore((store) => store.miniCartOpen);

  useEffect(() => {
    const productID = getProductIdFromWebPage();
    const ivid = readCookieValue('ivid');
    const url = irbReq(productID, 'o9I0uK', ivid);
    const ENV = window.location.host === '127.0.0.1:5173' ? 'development' : url;

    fetchBundle(ENV, 'pdp');
  }, []);

  useEffect(() => {
    if (miniCartOpen) {
      sidebarRecs();
    }
  }, [miniCartOpen]);

  useEffect(() => {
    if (bundlesExist) {
      previewBundle(bundles);
    }
  }, [bundlesExist]);

  return (
    <section>
      {bundlesExist && <ProductPage bundles={bundles} />}
    </section>
  );
}

export default LayoutProductPage;
