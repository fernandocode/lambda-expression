import { Expression, ExpressionUtils } from "../../src/main";
import { ModelTest } from "./models/model-test";

export class ExpressionUsage {

    private readonly _expressionUtils: ExpressionUtils;

    constructor() {
        this._expressionUtils = new ExpressionUtils();
    }

    public expression<T>(exp: Expression<T>) {
        // tslint:disable-next-line
        console.log(this._expressionUtils.getColumnByExpression(exp));
    }

    public test() {
        this.expression<ModelTest>((x) => x.id); // id
        this.expression<ModelTest>((x) => x.description); // description
        this.expression<ModelTest>((x) => x.date); // date
        this.expression<ModelTest>((x) => x.isValid); // isValid
        this.expression<ModelTest>((x) => x.reference.name); // reference_name
    }
}

new ExpressionUsage().test();
