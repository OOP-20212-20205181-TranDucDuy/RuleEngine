import 'acorn';
import {
    AssignmentExpression,
    BinaryExpression,
    BlockStatement,
    CallExpression,
    ConditionalExpression,
    ExpressionStatement,
    Identifier,
    IfStatement,
    Literal,
    MemberExpression,
    Node,
    ObjectExpression,
    Pattern,
    Program,
    ReturnStatement,
    VariableDeclaration,
    VariableDeclarator
} from 'acorn';
import { IStatement, IVariableDeclaration, EStatement, IIfElseStatement, IReturnStatement, ISendMailStatement } from './rule-chain.interface';
import { Injectable } from '@nestjs/common';
@Injectable()
export class Visitor {
    visitNodes(nodes: Node[]): any {
        return nodes.map(node => this.visitNode(node));
    }
    visitNode(node: Node): any {
        console.log(node.type, "\n");
        switch (node.type) {
            case 'Program': return this.visitProgram(node as Program);
            case 'VariableDeclaration': return this.visitVariableDeclaration((node as VariableDeclaration).declarations[0] as VariableDeclarator);
            case 'IfStatement': return this.visitIfStatement(node as IfStatement);
            case 'ExpressionStatement': return this.visitExpressionStatement((node as ExpressionStatement).expression as Node);
            case 'BlockStatement': return this.visitNodes((node as BlockStatement).body);
            case 'Identifier': return this.visitIdentifier(node as Identifier);
            case 'Literal': return (node as Literal).value;
            default: return { type: 'UNKNOWN' } as IStatement;
        }
    }
    visitProgram(node: Program): any {
        return this.visitNodes(node.body);
    }
    visitVariableDeclaration(node: VariableDeclarator): IVariableDeclaration {
        return {
            type: EStatement.VARIABLE_DECLARATION,
            key: this.visitPattern(node.id as Pattern),
            value: node.init ? this.visitExpressionStatement(node.init as Node) : null,
        } as IVariableDeclaration;
    }
    visitPattern(node: Pattern): any {
        switch (node.type) {
            case 'Identifier': return this.visitIdentifier(node as Identifier);
            case 'MemberExpression': return this.visitMemberExpression(node as MemberExpression);
        }
    }
    visitIfStatement(node: IfStatement): IIfElseStatement {
        return {
            type: 'IF_ELSE',
            condition: this.visitExpressionStatement(node.test as Node),
            true: this.visitNode(node.consequent as Node),
            false: this.visitNode(node.alternate as Node),
        } as IIfElseStatement;
    }
    visitReturnStatement(node: ReturnStatement): IReturnStatement {
        return {
            type: 'RETURN_STATEMENT',
            value: node.argument ? this.visitExpressionStatement(node.argument as Node) : null,
        } as IReturnStatement;
    }
    visitExpressionStatement(node: Node): any {
        switch (node.type) {
            case 'ConditionalExpression': return this.visitConditionalExpression(node as ConditionalExpression);
            case 'CallExpression': return this.visitCallExpression(node as CallExpression);
            case 'MemberExpression': return this.visitMemberExpression(node as MemberExpression);
            case 'BinaryExpression': return this.visitBinaryExpression(node as BinaryExpression);
            case 'Identifier': return this.visitIdentifier(node as Identifier);
            case 'Literal': return (node as Literal).value;
            case 'ReturnStatement': return this.visitReturnStatement(node as ReturnStatement);
            case 'AssignmentExpression': return this.visitAssignmentExpression(node as AssignmentExpression);
        }
    }
    visitAssignmentExpression(expression: AssignmentExpression): any {
        if(expression.operator === '='){
            return {
                type: 'VARIABLE_DECLARATION',
                key: this.visitNode(expression.left as Node),
                value: this.visitExpressionStatement(expression.right as Node),
            } as IVariableDeclaration;
        }
        else {
            return {
                type: 'UNKNOWN',
            } as IStatement;
        }
    }
    
    visitCallExpression(node: CallExpression): any {
        if (node.callee.type === 'Identifier') {
            switch (node.callee.name) {
                case 'sendMail': return {
                    type: 'SEND_MAIL',
                    email: this.visitExpressionStatement(node.arguments[0] as Node) as string,
                    code: this.visitExpressionStatement(node.arguments[1] as Node) as string,
                    service_name: this.visitExpressionStatement(node.arguments[2] as Node) as string,
                    action_by: this.visitExpressionStatement(node.arguments[3] as Node) as string,
                    info: this.visitExpressionStatement(node.arguments[4] as Node) as string,
                } as ISendMailStatement;
                case 'callApi': return {
                    type: 'CALL_API',
                    url: this.visitExpressionStatement(node.arguments[0] as Node) as string,
                    method: this.visitExpressionStatement(node.arguments[1] as Node) as string,
                    body: this.visitExpressionStatement(node.arguments[2] as Node) as string,
                    header: this.visitExpressionStatement(node.arguments[3] as Node) as string,
                };
                case 'setRedis': return {
                    type: 'SET_REDIS',
                    key: this.visitExpressionStatement(node.arguments[0] as Node) as string,
                    value: this.visitExpressionStatement(node.arguments[1] as Node) as string,
                    expireAt: this.visitExpressionStatement(node.arguments[2] as Node) as string,
                };
                case 'publishMessage': return {
                    type: 'PUBLISH_MESSAGE',
                    topic: this.visitExpressionStatement(node.arguments[0] as Node) as string,
                    broker: this.visitExpressionStatement(node.arguments[1] as Node) as string,
                    username: this.visitExpressionStatement(node.arguments[2] as Node) as string,
                    password: this.visitExpressionStatement(node.arguments[3] as Node) as string,
                    dataValue: this.visitExpressionStatement(node.arguments[4] as Node) as string,
                };
            }
        }
    }
    visitBinaryExpression(expression: BinaryExpression): any {
        return (this.visitExpressionStatement(expression.left as Node)) as string + ' ' + expression.operator as string + ' '
            + (this.visitExpressionStatement(expression.right as Node)) as string;
    }
    visitIdentifier(node: Identifier): string {
        return node.name;
    }
    visitMemberExpression(expression: MemberExpression): any {
        let oStr = expression.object.type === 'Identifier' ? expression.object.name :
            (expression.object.type === 'Literal' ? expression.object.value : this.visitMemberExpression(expression.object as MemberExpression));
        let pStr = expression.property.type === 'Identifier' ? expression.property.name :
            (expression.property.type === 'Literal' ? expression.property.value : this.visitMemberExpression(expression.property as MemberExpression));
        return oStr + '.' + pStr;
    }
    visitConditionalExpression(expression: ConditionalExpression): any {
        console.log("ConditionalExpression\n");
        return {
            type: 'IF_ELSE',
            condition: this.visitExpressionStatement(expression.test as Node),
            true: this.visitExpressionStatement(expression.consequent as Node),
            false: this.visitExpressionStatement(expression.alternate as Node),
        } as IIfElseStatement;
    }
    
}
