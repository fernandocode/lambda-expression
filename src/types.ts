export type Expression<T> = (t: T) => any;

// TODO: add Lambda expression in WhereBuilder
export type LambdaExpression<T> = (t: T) => boolean;
