import { LambdaColumnMetadata, LambdaPropertiesMetadata, LambdaExpressionMetadata } from './metadatas';
import { Expression, LambdaExpression } from "./types";

export class ExpressionUtils {

    constructor(private _defaultSeparator: string = "_") {

    }

    public getValueByExpression<T>(instance: any, expression: Expression<T>) {
        return expression(instance);
    }

    public getValueByProperties(instance: any, properties: string[]) {
        let result = instance;
        properties.forEach(property => {
            result = this.getValue(result, property);
        });
        return result;
    }

    public getValue(instance: any, property: string) {
        if (instance) {
            return instance[property];
        }
        return void 0;
    }

    public getColumnByExpression<T>(expression: Expression<T>, separator: string = this._defaultSeparator): string {
        return this.getColumnByProperties(this.getPropertiesByExpression(expression), separator);
    }

    public getColumnByProperties(properties: string[], separator: string = this._defaultSeparator): string {
        return properties.join(separator);
    }

    public getPropertiesByExpression<T>(expression: Expression<T>): string[] {
        let strAfterReturn = expression.toString().split("return")[1].trim();
        if (!strAfterReturn) {
            strAfterReturn = expression.toString().split("{")[1].trim();
        }
        let strBeforeSemicon = strAfterReturn.split(" ")[0].split(";")[0];
        return this.getPropertiesByExpressionString(strBeforeSemicon);
    }

    private getPropertiesByExpressionString(expression: string): string[] {
        let propertiesReferences = expression.split(".");
        if (propertiesReferences.length)
            propertiesReferences.shift(); // remove alias
        return propertiesReferences;
    }

    private getColumnByLambdaExpression<T>(expression: LambdaExpression<T>): LambdaColumnMetadata {
        let propertiesMetadada = this.getPropertiesByLambdaExpression(expression);
        return {
            columnLeft: this.getColumnByProperties(propertiesMetadada.propertiesLeft),
            operator: propertiesMetadada.operator,
            columnRight: this.getColumnByProperties(propertiesMetadada.propertiesRight)
        };
    }

    private getPropertiesByLambdaExpression<T>(expression: LambdaExpression<T>): LambdaPropertiesMetadata {
        let expressionMetadada = this.getExpressionByLambdaExpression(expression);
        return {
            propertiesLeft: this.getPropertiesByExpressionString(expressionMetadada.expressionLeft),
            operator: expressionMetadada.operator,
            propertiesRight: this.getPropertiesByExpressionString(expressionMetadada.expressionRight)
        };
    }

    private getExpressionByLambdaExpression<T>(expression: LambdaExpression<T>)
        : LambdaExpressionMetadata {
        let strAfterReturn = expression.toString().split("return")[1].trim();
        if (!strAfterReturn) {
            strAfterReturn = expression.toString().split("{")[1].trim();
        }
        let strExpression = strAfterReturn.split(";")[0].split(" ");

        if (strExpression.length != 3) {
            throw `Lambda expression '${expression.toString()}' not supported! Use simple expression with '{expressionLeft} {operador} {expressionRight}'`;
        }
        return {
            expressionLeft: strExpression[0],
            operator: strExpression[1],
            expressionRight: strExpression[2]
        };
    }
}