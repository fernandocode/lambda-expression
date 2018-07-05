import { ReferencesModelTest } from "./models/reference-model-test";
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
    it("should return reference-id with custom separator", () => {
        const result = _expressionUtilsCustomSeparador.getColumnByExpression<ModelTest>((x) => x.reference.id);
        expect(result).to.equal("reference-id");
    });

});

describe("Expression get value", () => {
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

    it("get description", () => {
        const result = _expressionUtils.getValue(instance, "description");
        expect(result).to.equal("Descrição");
    });

    it("get reference.id", () => {
        const result = _expressionUtils.getValue(instance, "reference.id");
        expect(result).to.equal(2);
    });

    it("get reference.name", () => {
        const result = _expressionUtils.getValue(instance, "reference.name");
        expect(result).to.equal("Reference");
    });

    it("get by expression reference.name", () => {
        const result = _expressionUtils.getValueByExpression(instance, x => x.reference.name);
        expect(result).to.equal("Reference");
    });

    it("get reference.abc not exist", () => {
        const result = _expressionUtils.getValue(instance, "reference.abc");
        expect(result).to.equal(void 0);
    });

});
