import { LambdaColumnMetadata, LambdaExpressionMetadata, LambdaPropertiesMetadata } from "./metadatas";
import { Expression, LambdaExpression } from "./types";

export class ExpressionUtils {

    constructor(private _defaultSeparator: string = "_") {

    }

    public getValueByExpression<T>(instance: T, expression: Expression<T>) {
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
        if (property.indexOf(".") > -1) {
            return this.getValueByProperties(instance, property.split("."));
        }
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

    public getPropertiesByExpressionString(expression: string, alias: string | undefined = void 0): string[] {
        if (this.hasExpression(expression, alias)) {
            const propertiesReferences = expression.split(".");
            if (propertiesReferences.length && this.hasExpression(expression, alias)) {
                propertiesReferences.shift();
            } // remove alias
            return propertiesReferences;
        }
        return [expression];
    }

    public getColumnByLambdaExpression<T>(expression: LambdaExpression<T>): LambdaColumnMetadata {
        const propertiesMetadada = this.getPropertiesByLambdaExpression(expression);
        return {
            alias: propertiesMetadada.alias,
            columnLeft: this.getColumnByProperties(propertiesMetadada.propertiesLeft),
            columnRight: this.getColumnByProperties(propertiesMetadada.propertiesRight),
            operator: propertiesMetadada.operator,
        };
    }

    public getExpressionByLambdaExpression<T>(
        expression: LambdaExpression<T>
    ): LambdaExpressionMetadata {
        let splitInitExpression = expression.toString().split("return");
        if (!splitInitExpression) {
            splitInitExpression = expression.toString().split("{");
        }
        const strAfterReturn = splitInitExpression[1].trim();
        const strExpression = strAfterReturn.split(";")[0].split(" ");

        if (strExpression.length !== 3) {
            throw new Error(`Lambda expression '${expression.toString()}'
            not supported! Use simple expression with '{expressionLeft} {operador} {expressionRight}'`);
        }
        return {
            alias: this.getAlias(splitInitExpression[0]),
            expressionLeft: strExpression[0],
            expressionRight: strExpression[2],
            operator: strExpression[1],
        };
    }

    private getPropertiesByLambdaExpression<T>(expression: LambdaExpression<T>): LambdaPropertiesMetadata {
        const expressionMetadada = this.getExpressionByLambdaExpression(expression);
        return {
            alias: expressionMetadada.alias,
            operator: expressionMetadada.operator,
            propertiesLeft: this.getPropertiesByExpressionString(expressionMetadada.expressionLeft, expressionMetadada.alias),
            propertiesRight: this.getPropertiesByExpressionString(expressionMetadada.expressionRight, expressionMetadada.alias),
        };
    }

    private getAlias(startExpression: string): string {
        // https://stackoverflow.com/a/17779833/2290538
        const regexBetweenParentheses = /\(([^)]+)\)/;
        const resultRegex = regexBetweenParentheses.exec(startExpression);
        return resultRegex && resultRegex.length > 1 ? resultRegex[1] : "";
    }

    private hasAlias(value: string, alias: string | undefined): boolean {
        if (!alias) {
            return true;
        }
        return value.indexOf(`${alias}.`) > -1;
    }

    private hasBetweenQuotes(value: string): boolean {
        // let regexBetweenQuotes = /"[^"]*"/;
        const regexBetweenQuotes = /^(["'])(.*)\1$/;
        return regexBetweenQuotes.test(value);
    }

    private hasExpression(value: string, alias: string | undefined): boolean {
        return !this.hasBetweenQuotes(value) && this.hasAlias(value, alias);
    }
}
