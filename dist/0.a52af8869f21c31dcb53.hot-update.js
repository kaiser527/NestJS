"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 20:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const mapped_types_1 = __webpack_require__(22);
const create_user_dto_1 = __webpack_require__(17);
class UpdateUserDto extends (0, mapped_types_1.OmitType)(create_user_dto_1.CreateUserDto, [
    'password',
]) {
}
exports.UpdateUserDto = UpdateUserDto;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("5a01ae7fbe1f62984cc5")
/******/ })();
/******/ 
/******/ }
;