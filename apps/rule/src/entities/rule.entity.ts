import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DataType } from '../enums/datatype.enum';
export class Param {
    @Prop({ required: true })
    key : string;

    @Prop({ required: true })
    value : string;

    @Prop({ required: true , type : DataType  })
    dataType : DataType;
}
// Define the User entity as a Mongoose schema
@Schema()
export class Rule extends Document {
  @Prop({ required: true })
  api: string;

  @Prop({ required: true, unique: true })
  input: Param[];
  
  @Prop({ required: true })
  logic: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

// Generate the Mongoose schema based on the User class
export const RuleSchema = SchemaFactory.createForClass(Rule);
