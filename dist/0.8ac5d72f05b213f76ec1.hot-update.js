"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 12:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(10);
const user_schema_1 = __webpack_require__(13);
const mongoose_2 = __webpack_require__(14);
const bcryptjs_1 = __webpack_require__(15);
let UsersService = class UsersService {
    constructor(UserModel) {
        this.UserModel = UserModel;
        this.getHashPassword = (password) => {
            const salt = (0, bcryptjs_1.genSaltSync)(10);
            const hash = (0, bcryptjs_1.hashSync)(password, salt);
            return hash;
        };
    }
    async create(createUserDto) {
        const hashPassword = this.getHashPassword(createUserDto.password);
        let user = await this.UserModel.create({
            email: createUserDto.email,
            password: hashPassword,
            name: createUserDto.name,
        });
        return user;
    }
    async findAll() {
        let user = await this.UserModel.find();
        return user;
    }
    async findOne(id) {
        try {
            let user = await this.UserModel.findOne({ _id: id });
            return user;
        }
        catch (e) {
            return 'not found user';
        }
    }
    async update(id, updateUserDto) {
        try {
            await this.UserModel.updateOne({ _id: updateUserDto.id }, { ...updateUserDto });
            return `This action updates a #${id} user`;
        }
        catch (e) {
            return 'not found user';
        }
    }
    async remove(id) {
        try {
            await this.UserModel.deleteOne({ _id: id });
            return `This action deletes a #${id} user`;
        }
        catch (e) {
            return 'not found user';
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UsersService);


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("9bfd01142b614f9a80c5")
/******/ })();
/******/ 
/******/ }
;