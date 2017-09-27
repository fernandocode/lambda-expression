"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("../../src/main");
var ExpressionUsage = (function () {
    function ExpressionUsage() {
        this._expressionUtils = new main_1.ExpressionUtils();
    }
    ExpressionUsage.prototype.expression = function (exp) {
        console.log(this._expressionUtils.getColumnByExpression(exp));
    };
    ExpressionUsage.prototype.test = function () {
        this.expression(function (x) { return x.id; }); // id
        this.expression(function (x) { return x.description; }); // description
        this.expression(function (x) { return x.date; }); // date
        this.expression(function (x) { return x.isValid; }); // isValid
        this.expression(function (x) { return x.reference.name; }); // reference_name
    };
    return ExpressionUsage;
}());
exports.ExpressionUsage = ExpressionUsage;
var ModelTest = (function () {
    function ModelTest() {
    }
    return ModelTest;
}());
var ReferencesModelTest = (function () {
    function ReferencesModelTest() {
    }
    return ReferencesModelTest;
}());
new ExpressionUsage().test();
