import { ExpressionUtils, Expression } from "../../src/main";

export class ExpressionUsage {

    private readonly _expressionUtils: ExpressionUtils;

    constructor() {
        this._expressionUtils = new ExpressionUtils();
    }

    public expression<T>(exp: Expression<T>){
        console.log(this._expressionUtils.getColumnByExpression(exp));
    }

    public test(){
        this.expression<ModelTest>(x => x.id); // id
        this.expression<ModelTest>(x => x.description); // description
        this.expression<ModelTest>(x => x.date); // date
        this.expression<ModelTest>(x => x.isValid); // isValid
        this.expression<ModelTest>(x => x.reference.name); // reference_name
    }
}

class ModelTest{
    id: number;
    name: string;
    description: string;
    date: Date;
    isValid: boolean;
    reference: ReferencesModelTest;
}

class ReferencesModelTest{
    id: number;
    name: string;
}

new ExpressionUsage().test();