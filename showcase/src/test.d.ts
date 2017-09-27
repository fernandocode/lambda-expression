import { Expression } from "../../src/main";
export declare class ExpressionUsage {
    private readonly _expressionUtils;
    constructor();
    expression<T>(exp: Expression<T>): void;
    test(): void;
}
