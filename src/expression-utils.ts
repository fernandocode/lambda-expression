import { LambdaColumnMetadata, LambdaExpressionMetadata, LambdaPropertiesMetadata } from "./metadatas";
import { Expression, LambdaExpression } from "./types";

export class ExpressionUtils {

    constructor(private _defaultSeparator: string = "_") {

    }

    public getValueByExpression<T>(instance: any, expression: Expression<T>) {
        return expression(instance);
    }

    public getValueByProperties(instance: any, properties: string[]) {
        let result = instance;
        properties.forEach((property) => {
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
        const strBeforeSemicon = strAfterReturn.split(" ")[0].split(";")[0];
        return this.getPropertiesByExpressionString(strBeforeSemicon);
    }

    private getPropertiesByExpressionString(expression: string): string[] {
        const propertiesReferences = expression.split(".");
        if (propertiesReferences.length) {
            propertiesReferences.shift();
        } // remove alias
        return propertiesReferences;
    }

    private getColumnByLambdaExpression<T>(expression: LambdaExpression<T>): LambdaColumnMetadata {
        const propertiesMetadada = this.getPropertiesByLambdaExpression(expression);
        return {
            columnLeft: this.getColumnByProperties(propertiesMetadada.propertiesLeft),
            columnRight: this.getColumnByProperties(propertiesMetadada.propertiesRight),
            operator: propertiesMetadada.operator,
        };
    }

    private getPropertiesByLambdaExpression<T>(expression: LambdaExpression<T>): LambdaPropertiesMetadata {
        const expressionMetadada = this.getExpressionByLambdaExpression(expression);
        return {
            operator: expressionMetadada.operator,
            propertiesLeft: this.getPropertiesByExpressionString(expressionMetadada.expressionLeft),
            propertiesRight: this.getPropertiesByExpressionString(expressionMetadada.expressionRight),
        };
    }

    private getExpressionByLambdaExpression<T>(expression: LambdaExpression<T>)
        : LambdaExpressionMetadata {
        let strAfterReturn = expression.toString().split("return")[1].trim();
        if (!strAfterReturn) {
            strAfterReturn = expression.toString().split("{")[1].trim();
        }
        const strExpression = strAfterReturn.split(";")[0].split(" ");

        if (strExpression.length !== 3) {
            throw new Error(`Lambda expression '${expression.toString()}'
            not supported! Use simple expression with '{expressionLeft} {operador} {expressionRight}'`);
        }
        return {
            expressionLeft: strExpression[0],
            expressionRight: strExpression[2],
            operator: strExpression[1],
        };
    }
}
