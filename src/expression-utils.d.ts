import { Expression } from "./types";
export declare class ExpressionUtils {
    private _defaultSeparator;
    constructor(_defaultSeparator?: string);
    public getValueByExpression<T>(instance: any, expression: Expression<T>): any;
    public getValueByProperties(instance: any, properties: string[]): any;
    public getValue(instance: any, property: string): any;
    public getColumnByExpression<T>(expression: Expression<T>, separator?: string): string;
    public getColumnByProperties(properties: string[], separator?: string): string;
    public getPropertiesByExpression<T>(expression: Expression<T>): string[];
    private getPropertiesByExpressionString(expression);
    private getColumnByLambdaExpression<T>(expression);
    private getPropertiesByLambdaExpression<T>(expression);
    private getExpressionByLambdaExpression<T>(expression);
}
