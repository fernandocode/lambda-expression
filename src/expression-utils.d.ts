import { Expression } from "./types";
export declare class ExpressionUtils {
    private _defaultColumnSeparator;
    constructor(_defaultColumnSeparator?: string);
    getValueByExpression<T>(instance: any, expression: Expression<T>): any;
    getValueByProperties(instance: any, properties: string[]): any;
    getValue(instance: any, property: string): any;
    getColumnByExpression<T>(expression: Expression<T>): string;
    getColumnByProperties(properties: string[]): string;
    getPropertiesByExpression<T>(expression: Expression<T>): string[];
    private getPropertiesByExpressionString(expression);
    private getColumnByLambdaExpression<T>(expression);
    private getPropertiesByLambdaExpression<T>(expression);
    private getExpressionByLambdaExpression<T>(expression);
}
