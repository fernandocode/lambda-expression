// export * from './expression-utils';
// export * from './metadatas';
// export * from './types';

export type Expression<T> = (t: T) => any;

// TODO: add Lambda expression in WhereBuilder
export type LambdaExpression<T> = (t: T) => boolean;

export interface LambdaExpressionMetadata {
    expressionLeft: string;
    operator: string;
    expressionRight: string;
}

export interface LambdaPropertiesMetadata {
    propertiesLeft: string[];
    operator: string;
    propertiesRight: string[];
}

export interface LambdaColumnMetadata {
    columnLeft: string;
    operator: string;
    columnRight: string;
}

export class ExpressionUtils {

    constructor(private _defaultColumnSeparator: string = "_") {

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

    public getColumnByExpression<T>(expression: Expression<T>): string {
        return this.getColumnByProperties(this.getPropertiesByExpression(expression));
    }

    public getColumnByProperties(properties: string[]): string {
        return properties.join(this._defaultColumnSeparator);
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