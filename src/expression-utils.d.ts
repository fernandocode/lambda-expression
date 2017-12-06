import { Expression } from "./types";
export declare class ExpressionUtils {
    private _defaultSeparator;
    constructor(_defaultSeparator?: string);
    getValueByExpression<T>(instance: any, expression: Expression<T>): any;
    getValueByProperties(instance: any, properties: string[]): any;
    getValue(instance: any, property: string): any;
    getColumnByExpression<T>(expression: Expression<T>, separator?: string): string;
    getColumnByProperties(properties: string[], separator?: string): string;
    getPropertiesByExpression<T>(expression: Expression<T>): string[];
    private getPropertiesByExpressionString(expression);
    private getColumnByLambdaExpression<T>(expression);
    private getPropertiesByLambdaExpression<T>(expression);
    private getExpressionByLambdaExpression<T>(expression);
}
