import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@csticket/common';
import { TicketDoc } from "./ticket";

export { OrderStatus };

// An interface that describes the required properties to create an order
interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

// An interface that describes the properties a Order Document has
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number;
}

// An interface that describes the properties an Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
},
{
    toJSON: {
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
}
);

// using the updateIfCurrentPlugin, we configure mongodb to track the version
// of all the documents using a property named **version**
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

//the .statics method is used to dynamically add methods to mongoose model
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };