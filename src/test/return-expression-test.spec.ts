import { ModelTest } from "./models/model-test";
import { LambdaColumnMetadata } from "./../metadatas";
import { LambdaExpression, ReturnExpression } from "./../types";
import { ExpressionUtils } from "./../expression-utils";

import { expect } from "chai";
import { ReferencesModelTest } from "../../showcase/src/models/reference-model-test";

const _expressionUtils: ExpressionUtils = new ExpressionUtils();

export class ExpressionUsage<T> {

    constructor(private instance: T) {

    }

    public equals<R>(expression: ReturnExpression<R, T>, value: R): boolean {
        const result = _expressionUtils.getValueByExpression(this.instance, expression) === value;
        return result;
    }

    public equalsE<R>(expression1: ReturnExpression<R, T>, expression2: ReturnExpression<R, T>): boolean {
        const result = _expressionUtils.getValueByExpression(this.instance, expression1)
            === _expressionUtils.getValueByExpression(this.instance, expression2);
        return result;
    }
}
describe("Return Expression method", () => {
    const instance = {
        id: 1,
        name: "Test",
        description: "Descrição",
        date: new Date(),
        isValid: true,
        reference: {
            id: 2,
            name: "Reference"
        } as ReferencesModelTest
    } as ModelTest;

    const expression = new ExpressionUsage(instance);

    it("should return id == 0", () => {
        const result = expression.equals((x) => x.id, 0);
        expect(result).to.equal(false);
    });

    it("should return column with column", () => {
        const result = expression.equalsE((x) => x.id, x => x.reference.id);
        expect(result).to.equal(false);
    });

    it("lambda column vs variable", () => {
        const v = 1;
        const result = expression.equals((x) => x.id, v);
        expect(result).to.equal(true);
    });

});
