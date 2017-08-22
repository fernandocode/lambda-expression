# lambda-expression

Utility to analyze function (js) and arrow functions (ts), and create metadata of expressions, the initial scope is that it seeks to solve simple expressions. And later advance to encompass complex expressions.

Created use to Typescript

## Usage

First, install the package using npm:

    npm install lambda-expression --save

In Typescript:

    import { ExpressionUtils, Expression } from "lambda-expression";

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

## License

Apache 2.0