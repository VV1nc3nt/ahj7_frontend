/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ (function() {

/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-return */
/* eslint-disable no-return-await */
/* eslint-disable quote-props */
/* eslint-disable no-use-before-define */
const ticketList = document.querySelector('.ticket-list');
const addTicketModalBtn = document.querySelector('.add-ticket');
const cancelTicketBtn = document.querySelector('.cancel-ticket');
const addTicketForm = document.querySelector('.add-ticket-form');
const modalWindow = document.querySelector('.ticket-modal');
const url = 'http://localhost:7070/';
window.addEventListener('DOMContentLoaded', renderAllTickets());
addTicketForm.addEventListener('submit', e => {
  e.preventDefault();
  postTicket();
});
addTicketModalBtn.addEventListener('click', () => {
  modalWindow.classList.toggle('hidden');
});
cancelTicketBtn.addEventListener('click', e => {
  e.preventDefault();
  modalWindow.classList.toggle('hidden');
});
function generateTickets(ticketsJson) {
  ticketsJson.forEach(value => {
    const ticketStatus = () => {
      if (value.status === 'true') {
        return '&#10003;';
      }
      return '';
    };
    ticketList.innerHTML += `<li class="ticket" id="${value.id}">
        <div class="ticket-wrapper">
          <span class="round" data-status="${value.status}">${ticketStatus()}</span>
          <div class="ticket-content">
            <p class="ticket-text">${value.name}</p>
            <span class="ticket-time">${value.created}</span>
          </div>
          <div class="ticket-btns">
            <button class="ticket-btn update-ticket">✎</button>
            <button class="ticket-btn delete-ticket">&#10008;</button>
          </div>
        </div>
      </li>`;
  });
  const deleteBtns = document.querySelectorAll('.delete-ticket');
  const updateTicketBtns = document.querySelectorAll('.update-ticket');
  const ticketBodies = document.querySelectorAll('.ticket-content');
  const ticketStatuses = document.querySelectorAll('.round');
  ticketStatuses.forEach(el => {
    el.addEventListener('click', () => {
      const id = el.parentNode.parentNode.id;
      const status = el.getAttribute('data-status');
      if (status === 'false') {
        updateTicketStatus(id, 'true');
        el.setAttribute('data-status', 'true');
        el.innerHTML += '&#10003;';
        return;
      }
      updateTicketStatus(id, 'false');
      el.setAttribute('data-status', 'false');
      el.textContent = '';
      return;
    });
  });
  ticketBodies.forEach(el => {
    el.addEventListener('click', () => {
      const id = el.parentNode.parentNode.id;
      getFullTicket(id);
    });
  });
  deleteBtns.forEach(el => {
    el.addEventListener('click', () => {
      const id = el.parentNode.parentNode.parentNode.id;

      // const ticketSystem = document.querySelector('ticket-system');

      ticketList.innerHTML += `<div class="cancel-modal">
        <p class="cancel-header">Confirm deletion?</p>
        <div class="cancel-wrapper">
          <button class="ticket-btn cancel-cancel">Cancel</button>
          <button class="ticket-btn cancel-ok">Ok</button>
        </div>
      </div>`;
      const cancelModal = document.querySelector('.cancel-modal');
      cancelModal.querySelector('.cancel-cancel').addEventListener('click', e => {
        e.preventDefault();
        cancelModal.remove();
      });
      cancelModal.querySelector('.cancel-ok').addEventListener('click', e => {
        e.preventDefault();
        cancelModal.remove();
        deleteTicket(id);
      });
    });
  });
  updateTicketBtns.forEach(el => {
    el.addEventListener('click', () => {
      const id = el.parentNode.parentNode.parentNode.id;
      getTicketPatch(id);
    });
  });
  return;
}
function renderFullTicket(fullTicket, id) {
  const ticket = document.getElementById(id);
  if (!ticket.contains(document.querySelector('.ticket-description'))) {
    const ticketDescription = document.createElement('p');
    ticketDescription.classList.add('ticket-description');
    ticketDescription.textContent = fullTicket[0].description;
    ticket.children[0].after(ticketDescription);
    return;
  }
  document.querySelector('.ticket-description').remove();
}
async function updateTicketStatus(id, status) {
  const data = new FormData();
  data.append('status', status);
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Methods: 'updateStatus',
      'id': id
    },
    body: data
  });
  return response.text();
}
async function postTicket() {
  const data = new FormData(addTicketForm);
  const response = await fetch(url, {
    method: 'POST',
    body: data
  });
  document.querySelector('#name').value = '';
  document.querySelector('#full_desc').value = '';
  if (!modalWindow.classList.contains('hidden')) {
    modalWindow.classList.toggle('hidden');
  }
  renderAllTickets();
  return await response.text();
}
async function deleteTicket(id) {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'id': id
    }
  });
  renderAllTickets();
  return await response.text();
}
async function getTicketPatch(id) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Methods: 'getTicket',
      'id': id
    }
  });
  const ticket = await response.json();
  ticketList.innerHTML += `<div class="ticket-modal">
    <p class="ticket-header">Change ticket</p>
    <form action="" class="add-ticket-form" method="POST" action="http://localhost:7070/">
      <label for="name"></label>
      <input type="text" name="name" class="name" id="name">
      <label for="full_desc" class="full-desc-label">Full description</label>
      <textarea name="full_desc" class="full-input" id="full_desc"></textarea>
      <div class="form-btns">
        <button class="cancel-ticket form-btn">Cancel</button>
        <button class="ok-ticket form-btn">Ok</button>
      </div>
    </form>
  </div>`;
  document.querySelector('#name').value = ticket[0].name;
  document.querySelector('#full_desc').value = ticket[0].description;
  document.querySelector('.cancel-ticket').addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('#name').value = '';
    document.querySelector('#full_desc').value = '';
    document.querySelector('.ticket-modal').remove();
    renderAllTickets();
    return;
  });
  document.querySelector('.ok-ticket').addEventListener('click', async e => {
    e.preventDefault();
    updateTicket(id);
    document.querySelector('#name').value = '';
    document.querySelector('#full_desc').value = '';
    document.querySelector('.ticket-modal').remove();
    renderAllTickets();
    return;
  });
}
async function getFullTicket(id) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Methods: 'getTicket',
      'id': id
    }
  });
  const fullTicket = await response.json();
  renderFullTicket(fullTicket, id);
}
async function updateTicket(id) {
  const data = new FormData();
  data.append('name', document.querySelector('#name').value);
  data.append('description', document.querySelector('#full_desc').value);
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'id': id
    },
    body: data
  });
  return response.text();
}
async function renderAllTickets() {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Methods: 'allTickets'
    }
  });
  ticketList.innerHTML = '';
  const ticketsJson = await response.json();
  generateTickets(ticketsJson);
}

/***/ }),

/***/ "./src/css/style.css":
/*!***************************!*\
  !*** ./src/css/style.css ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/style.css */ "./src/css/style.css");
/* harmony import */ var _js_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/app */ "./src/js/app.js");
/* harmony import */ var _js_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_js_app__WEBPACK_IMPORTED_MODULE_1__);


}();
/******/ })()
;
//# sourceMappingURL=main.js.map