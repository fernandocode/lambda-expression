import {
  ExpressionMetadata,
  LambdaColumnMetadata,
  LambdaExpressionMetadata,
  LambdaPropertiesMetadata
} from './metadatas';
import { Expression, LambdaExpression } from './types';
import { REGEX_BETWEEN_PARENTHESIS, REGEX_BETWEEN_QUOTES } from './utils';

export class ExpressionUtils {
  constructor(private _defaultSeparator: string = '_') {}

  private getPropertiesByLambdaExpression<T>(expression: LambdaExpression<T>): LambdaPropertiesMetadata {
    const expressionMetadada = this.getExpressionByLambdaExpression(expression);
    return {
      alias: expressionMetadada.alias,
      operator: expressionMetadada.operator,
      propertiesLeft: this.getPropertiesByExpressionString(expressionMetadada.expressionLeft, expressionMetadada.alias),
      propertiesRight: this.getPropertiesByExpressionString(
        expressionMetadada.expressionRight,
        expressionMetadada.alias
      )
    };
  }

  private getAlias(startExpression: string): string {
    // https://stackoverflow.com/a/17779833/2290538
    const resultRegex = REGEX_BETWEEN_PARENTHESIS.exec(startExpression);
    return resultRegex && resultRegex.length > 1 ? resultRegex[1] : '';
  }

  private hasAlias(value: string, alias: string | undefined): boolean {
    if (!alias) {
      return true;
    }
    return value.indexOf(`${alias}.`) > -1;
  }

  private hasBetweenQuotes(value: string): boolean {
    return REGEX_BETWEEN_QUOTES.test(value);
  }

  private hasExpression(value: string, alias: string | undefined): boolean {
    return !this.hasBetweenQuotes(value) && this.hasAlias(value, alias);
  }

  public getValueByExpression<T>(instance: T, expression: Expression<T>) {
    return expression(instance);
  }

  public getValueByProperties(instance: any, properties: string[]) {
    let result = instance;
    properties.forEach(property => {
      result = this.getValue(result, property);
    });
    return result;
  }

  public getValue(instance: any, property: string) {
    if (property.indexOf('.') > -1) {
      return this.getValueByProperties(instance, property.split('.'));
    }
    if (instance) {
      return instance[property];
    }
    return void 0;
  }

  public getColumnByExpression<T>(expression: Expression<T>, separator: string = this._defaultSeparator): string {
    return this.getColumnByProperties(this.getPropertiesByExpression(expression), separator);
  }

  public getColumnByProperties(properties: string[], separator: string = this._defaultSeparator): string {
    return properties.join(separator);
  }

  public getPropertiesByExpression<T>(expression: Expression<T>): string[] {
    const lambdaExpression = this.getExpressionMetadata(expression).body;

    const properties = this.getPropertiesByExpressionString(lambdaExpression.split(' ')[0]);

    return properties;
  }

  private getExpressionMetadata<T>(expression: Expression<T> | LambdaExpression<T>): ExpressionMetadata {
    const expressionAsString = expression.toString();

    if (expressionAsString.search('=>') !== -1) {
      return this.getExpressionMetadataES2015(expressionAsString);
    } else if (expressionAsString.search('return') !== -1) {
      return this.getExpressionMetadataES5(expressionAsString);
    } else {
      throw Error(`Invalid expression: ${expressionAsString}`);
    }
  }

  private getExpressionMetadataES5(expressionAsString: string): ExpressionMetadata {
    const expressionMetadata = {} as ExpressionMetadata;

    const paramsRegEx = REGEX_BETWEEN_PARENTHESIS.exec(expressionAsString);

    expressionMetadata.params = paramsRegEx && paramsRegEx.length ? paramsRegEx[1] : '';

    expressionMetadata.body = expressionAsString.slice(
      expressionAsString.indexOf('return') + 7,
      expressionAsString.indexOf(';')
    );

    return expressionMetadata;
  }

  private getExpressionMetadataES2015(expressionAsString: string): ExpressionMetadata {
    const expressionMetadata = {} as ExpressionMetadata;

    const params = expressionAsString.slice(0, expressionAsString.indexOf(' =>'));

    expressionMetadata.params = REGEX_BETWEEN_PARENTHESIS.test(params) ? this.getAlias(params) : params;

    expressionMetadata.body = expressionAsString.slice(expressionAsString.indexOf('=>') + 3, expressionAsString.length);

    return expressionMetadata;
  }

  public getPropertiesByExpressionString(expression: string, alias: string | undefined = void 0): string[] {
    if (this.hasExpression(expression, alias)) {
      const propertiesReferences = expression.split('.');
      if (propertiesReferences.length && this.hasExpression(expression, alias)) {
        propertiesReferences.shift();
      } // remove alias
      return propertiesReferences;
    }
    return [expression];
  }

  public getColumnByLambdaExpression<T>(expression: LambdaExpression<T>): LambdaColumnMetadata {
    const propertiesMetadada = this.getPropertiesByLambdaExpression(expression);
    return {
      alias: propertiesMetadada.alias,
      columnLeft: this.getColumnByProperties(propertiesMetadada.propertiesLeft),
      columnRight: this.getColumnByProperties(propertiesMetadada.propertiesRight),
      operator: propertiesMetadada.operator
    };
  }

  public getExpressionByLambdaExpression<T>(expression: LambdaExpression<T>): LambdaExpressionMetadata {
    const lambdaExpressionMetadata = {} as LambdaExpressionMetadata;

    const { params, body } = this.getExpressionMetadata(expression);

    lambdaExpressionMetadata.alias = params;

    const strExpression = body.split(' ');

    if (strExpression.length !== 3) {
      throw new Error(`Lambda expression '${expression.toString()}'
            not supported! Use simple expression with '{expressionLeft} {operador} {expressionRight}'`);
    }

    [
      lambdaExpressionMetadata.expressionLeft,
      lambdaExpressionMetadata.operator,
      lambdaExpressionMetadata.expressionRight
    ] = strExpression;

    return lambdaExpressionMetadata;
  }
}
