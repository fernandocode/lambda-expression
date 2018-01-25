import { LambdaExpressionMetadata } from './../metadatas';
import { ModelTest } from "./models/model-test";
import { expect } from "chai";
import { ExpressionUtils } from "../expression-utils";
import { LambdaExpression, Expression } from "../types";
import { LambdaColumnMetadata } from '../main';

const _expressionUtils: ExpressionUtils = new ExpressionUtils();
const _expressionUtilsCustomSeparador: ExpressionUtils = new ExpressionUtils("-");

export class ExpressionUsage {

    public static expression<T>(expression: Expression<T>): string {
        return _expressionUtils.getColumnByExpression(expression);
    }

    public static lambda<T>(expression: LambdaExpression<T>): LambdaColumnMetadata {
        let result = _expressionUtils.getColumnByLambdaExpression(expression);
        return result;
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

describe("Lambda Expression method", () => {

    it("should return id == 0", () => {
        const result = ExpressionUsage.lambda<ModelTest>((x) => x.id == 0);
        expect(result.columnLeft).to.equal("id");
        expect(result.operator).to.equal("==");
        expect(result.columnRight).to.equal("0");
    });

    it("should return column with column", () => {
        const result = ExpressionUsage.lambda<ModelTest>((x) => x.id >= x.reference.id);
        expect(result.columnLeft).to.equal("id");
        expect(result.operator).to.equal(">=");
        expect(result.columnRight).to.equal("reference_id");
    });

    it("should value similar column", () => {
        const result1 = ExpressionUsage.lambda<ModelTest>((x) => x.name == "x.reference.id");
        expect(result1.columnLeft).to.equal("name");
        expect(result1.operator).to.equal("==");
        expect(result1.columnRight).to.equal(`"x.reference.id"`);

        const result2 = ExpressionUsage.lambda<ModelTest>((x) => x.name == 'x.reference.id');
        expect(result2.columnLeft).to.equal("name");
        expect(result2.operator).to.equal("==");
        expect(result2.columnRight).to.equal(`'x.reference.id'`);
    });


    // it("should test", () => {
    //     const result = ExpressionUsage.lambda<ModelTest>((x) => x.id >= x.reference.id);
    //     expect(result.columnLeft).to.equal("x.id");
    //     expect(result.operator).to.equal(">=");
    //     expect(result.columnRight).to.equal("x.reference.id");

    //     console.log(_expressionUtils.getColumnByLambdaExpression<ModelTest>((x) => x.id >= x.reference.id));
    //     console.log(_expressionUtils.getColumnByLambdaExpression<ModelTest>((x) => x.id >= 0));

    //     const propertyRight = _expressionUtils.getPropertiesByExpressionString(result.expressionRight);
    //     console.log(propertyRight);
    //     console.log(_expressionUtils.getColumnByProperties(propertyRight));
    // });

});
