"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionUtils = (function () {
    function ExpressionUtils(_defaultColumnSeparator) {
        if (_defaultColumnSeparator === void 0) { _defaultColumnSeparator = "_"; }
        this._defaultColumnSeparator = _defaultColumnSeparator;
    }
    ExpressionUtils.prototype.getValueByExpression = function (instance, expression) {
        return expression(instance);
    };
    ExpressionUtils.prototype.getValueByProperties = function (instance, properties) {
        var _this = this;
        var result = instance;
        properties.forEach(function (property) {
            result = _this.getValue(result, property);
        });
        return result;
    };
    ExpressionUtils.prototype.getValue = function (instance, property) {
        if (instance) {
            return instance[property];
        }
        return void 0;
    };
    ExpressionUtils.prototype.getColumnByExpression = function (expression) {
        console.log("novo");
        return this.getColumnByProperties(this.getPropertiesByExpression(expression));
    };
    ExpressionUtils.prototype.getColumnByProperties = function (properties) {
        return properties.join(this._defaultColumnSeparator);
    };
    ExpressionUtils.prototype.getPropertiesByExpression = function (expression) {
        var strAfterReturn = expression.toString().split("return")[1].trim();
        if (!strAfterReturn) {
            strAfterReturn = expression.toString().split("{")[1].trim();
        }
        var strBeforeSemicon = strAfterReturn.split(" ")[0].split(";")[0];
        return this.getPropertiesByExpressionString(strBeforeSemicon);
    };
    ExpressionUtils.prototype.getPropertiesByExpressionString = function (expression) {
        var propertiesReferences = expression.split(".");
        if (propertiesReferences.length)
            propertiesReferences.shift(); // remove alias
        return propertiesReferences;
    };
    ExpressionUtils.prototype.getColumnByLambdaExpression = function (expression) {
        var propertiesMetadada = this.getPropertiesByLambdaExpression(expression);
        return {
            columnLeft: this.getColumnByProperties(propertiesMetadada.propertiesLeft),
            operator: propertiesMetadada.operator,
            columnRight: this.getColumnByProperties(propertiesMetadada.propertiesRight)
        };
    };
    ExpressionUtils.prototype.getPropertiesByLambdaExpression = function (expression) {
        var expressionMetadada = this.getExpressionByLambdaExpression(expression);
        return {
            propertiesLeft: this.getPropertiesByExpressionString(expressionMetadada.expressionLeft),
            operator: expressionMetadada.operator,
            propertiesRight: this.getPropertiesByExpressionString(expressionMetadada.expressionRight)
        };
    };
    ExpressionUtils.prototype.getExpressionByLambdaExpression = function (expression) {
        var strAfterReturn = expression.toString().split("return")[1].trim();
        if (!strAfterReturn) {
            strAfterReturn = expression.toString().split("{")[1].trim();
        }
        var strExpression = strAfterReturn.split(";")[0].split(" ");
        if (strExpression.length != 3) {
            throw "Lambda expression '" + expression.toString() + "' not supported! Use simple expression with '{expressionLeft} {operador} {expressionRight}'";
        }
        return {
            expressionLeft: strExpression[0],
            operator: strExpression[1],
            expressionRight: strExpression[2]
        };
    };
    return ExpressionUtils;
}());
exports.ExpressionUtils = ExpressionUtils;
