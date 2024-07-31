import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import './index.css';
import { addVisitorID, detectPageView, getCountryCode } from './lib/helpers';

function getPageType() {
  // Check Page Type
  if (window.location.pathname.includes('/products/')) {
    return 'ProductPage';
  }
  if (
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === 'localhost' ||
    window.location.host === 'localhost:5173'
  ) {
    return 'ProductPage';
  }

  // Else Not A Correct Page
  return false;
}

function checkProProductOnGuest() {
  let allow = true;
  if (getCountryCode() === 'o9I0uK') {
    const proButton = document.querySelector(
      '.Button_button__v0_QK.Button_button--outlined__h8bv2'
    );
    if (proButton) {
      if (proButton.innerText === 'LOGIN AS A PRO') {
        allow = false;
      }
    }
  }

  return allow;
}

const pageType = getPageType();

const createIncreasinglyRoot = () => {
  if (pageType === 'ProductPage') {
    // Client Side Element
    const readClientPayload = JSON.parse(document.body.getAttribute('inc_payload'));

    if (readClientPayload) {
      const currentClientPDPRoot = document.querySelector(`#${readClientPayload.source}`);
      // Check if it exist
      if (currentClientPDPRoot) {
        currentClientPDPRoot.innerHTML = '';
        const newRoot = document.createElement('div');
        newRoot.id = 'increasingly_opi_root';
        currentClientPDPRoot.appendChild(newRoot);
        return true;
      }
    } else {
      return true;
    }
  }
  return 'development';
};

function checkWebsite() {
  let enable = false;
    // Wesbsite Check
    enable = true;
  
  return enable;
}

function render() {
  if (checkWebsite()) {
    if (pageType) {
      if (createIncreasinglyRoot() && checkProProductOnGuest()) {
        addVisitorID();
        const incRoot = document.getElementById('increasingly_opi_root');
        if (incRoot) {
          const root = ReactDOM.createRoot(incRoot);
          if (incRoot.innerHTML === '') {
            root.render(<App pageType={pageType} />);
          }
        }
      }
    }
  }
}

const check = setInterval(() => {
  
  if (detectPageView()) {
    clearInterval(check);
    render();
    console.log('Detected DataLayer');
  }
}, 100);

setTimeout(() => {
  clearInterval(check);
}, 3000);
