"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var expression_utils_1 = require("../expression-utils");
var _expressionUtils = new expression_utils_1.ExpressionUtils();
var _expressionUtilsCustomSeparador = new expression_utils_1.ExpressionUtils("-");
var ExpressionUsage = (function () {
    function ExpressionUsage() {
    }
    ExpressionUsage.expression = function (expression) {
        return _expressionUtils.getColumnByExpression(expression);
    };
    return ExpressionUsage;
}());
exports.ExpressionUsage = ExpressionUsage;
describe("Expression method", function () {
    it("should return id", function () {
        var result = ExpressionUsage.expression(function (x) { return x.id; });
        chai_1.expect(result).to.equal("id");
    });
    it("should return description", function () {
        var result = ExpressionUsage.expression(function (x) { return x.description; });
        chai_1.expect(result).to.equal("description");
    });
    it("should return date", function () {
        var result = ExpressionUsage.expression(function (x) { return x.date; });
        chai_1.expect(result).to.equal("date");
    });
    it("should return isValid", function () {
        var result = ExpressionUsage.expression(function (x) { return x.isValid; });
        chai_1.expect(result).to.equal("isValid");
    });
    it("should return reference_name", function () {
        var result = ExpressionUsage.expression(function (x) { return x.reference.name; });
        chai_1.expect(result).to.equal("reference_name");
    });
    it("should return reference_id", function () {
        var result = _expressionUtils.getColumnByExpression(function (x) { return x.reference.id; });
        chai_1.expect(result).to.equal("reference_id");
    });
    it("should return reference-id, with custom separator", function () {
        var result = _expressionUtilsCustomSeparador.getColumnByExpression(function (x) { return x.reference.id; });
        chai_1.expect(result).to.equal("reference-id");
    });
});
