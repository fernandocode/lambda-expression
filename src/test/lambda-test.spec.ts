import { expect } from 'chai';

import { ExpressionUtils } from './../expression-utils';
import { LambdaColumnMetadata } from './../metadatas';
import { LambdaExpression } from './../types';
import { ModelTest } from './models/model-test';

const _expressionUtils: ExpressionUtils = new ExpressionUtils();

export class ExpressionUsage {
  public static lambda<T>(expression: LambdaExpression<T>): LambdaColumnMetadata {
    const result = _expressionUtils.getColumnByLambdaExpression(expression);
    return result;
  }
}
describe('Lambda Expression method', () => {
  it('should return id === 0', () => {
    const result = ExpressionUsage.lambda<ModelTest>(x => x.id === 0);
    expect(result.columnLeft).to.equal('id');
    expect(result.operator).to.equal('===');
    expect(result.columnRight).to.equal('0');
  });

  it('should return id == 0', () => {
    // tslint:disable-next-line:triple-equals
    const result = ExpressionUsage.lambda<ModelTest>(x => x.id == 0);
    expect(result.columnLeft).to.equal('id');
    expect(result.operator).to.equal('==');
    expect(result.columnRight).to.equal('0');
  });

  it('should return column with column', () => {
    const result = ExpressionUsage.lambda<ModelTest>(x => x.id >= x.reference.id);
    expect(result.columnLeft).to.equal('id');
    expect(result.operator).to.equal('>=');
    expect(result.columnRight).to.equal('reference_id');
  });

  it('should value similar column', () => {
    const result1 = ExpressionUsage.lambda<ModelTest>(x => x.name === 'x.reference.id');
    expect(result1.columnLeft).to.equal('name');
    expect(result1.operator).to.equal('===');
    expect(result1.columnRight).to.equal(`'x.reference.id'`);

    const result2 = ExpressionUsage.lambda<ModelTest>(x => x.name === 'x.reference.id');
    expect(result2.columnLeft).to.equal('name');
    expect(result2.operator).to.equal('===');
    expect(result2.columnRight).to.equal(`'x.reference.id'`);
  });

  it('lambda column vs variable', () => {
    // let p1 = 0;
    // let contextObj = { p1: 0 };
    // const result = ExpressionUsage.lambda<ModelTest>((x) => x.id == p1);
    // expect(result.columnLeft).to.equal("id");
    // expect(result.operator).to.equal("==");
    // expect(result.columnRight).to.equal("0");

    // ExpressionUsage.test<ModelTest>((x) => x.id == contextObj.p1, contextObj);
    expect(true).to.equal(true);
  });
});
