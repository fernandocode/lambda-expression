import { ModelTest } from "./models/model-test";
import { expect } from "chai";
import { ExpressionUtils } from "../expression-utils";
import { Expression } from "../types";

const _expressionUtils: ExpressionUtils = new ExpressionUtils();
const _expressionUtilsCustomSeparador: ExpressionUtils = new ExpressionUtils("-");

export class ExpressionUsage {

    public static expression<T>(expression: Expression<T>): string {
        return _expressionUtils.getColumnByExpression(expression);
    }
}

describe("Expression method", () => {

    it("should return id", () => {
        const result = ExpressionUsage.expression<ModelTest>((x) => x.id);
        expect(result).to.equal("id");
    });
    it("should return description", () => {
        const result = ExpressionUsage.expression<ModelTest>((x) => x.description);
        expect(result).to.equal("description");
    });
    it("should return date", () => {
        const result = ExpressionUsage.expression<ModelTest>((x) => x.date);
        expect(result).to.equal("date");
    });
    it("should return isValid", () => {
        const result = ExpressionUsage.expression<ModelTest>((x) => x.isValid);
        expect(result).to.equal("isValid");
    });
    it("should return reference_name", () => {
        const result = ExpressionUsage.expression<ModelTest>((x) => x.reference.name);
        expect(result).to.equal("reference_name");
    });
    it("should return reference_id", () => {
        const result = _expressionUtils.getColumnByExpression<ModelTest>((x) => x.reference.id);
        expect(result).to.equal("reference_id");
    });
    it("should return reference-id, with custom separator", () => {
        const result = _expressionUtilsCustomSeparador.getColumnByExpression<ModelTest>((x) => x.reference.id);
        expect(result).to.equal("reference-id");
    });

});
