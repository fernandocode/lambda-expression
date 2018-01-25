export interface LambdaExpressionMetadata extends LambdaExpressionMetadataBase {
    expressionLeft: string;
    expressionRight: string;
}

export interface LambdaPropertiesMetadata extends LambdaExpressionMetadataBase {
    propertiesLeft: string[];
    propertiesRight: string[];
}

export interface LambdaColumnMetadata extends LambdaExpressionMetadataBase {
    columnLeft: string;
    columnRight: string;
}

export interface LambdaExpressionMetadataBase{
    operator: string;
    alias: string;
}