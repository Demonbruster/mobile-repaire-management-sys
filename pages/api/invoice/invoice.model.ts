import mongoose from "mongoose";

// TypeScript interfaces
interface ILineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface IBusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

interface IInvoice {
  invoiceNumber: string;
  repairer: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  device: mongoose.Types.ObjectId;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'check';
  paymentDate?: Date;
  paymentReference?: string;
  lineItems: ILineItem[];
  notes?: string;
  terms: string;
  businessInfo: IBusinessInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IInvoiceDocument extends IInvoice, mongoose.Document {}

interface IInvoiceModel extends mongoose.Model<IInvoiceDocument> {
  generateInvoiceNumber(): Promise<string>;
}

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  repairer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repairer",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  // Invoice details
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  // Financial details
  subtotal: {
    type: Number,
    required: true,
    default: 0,
  },
  taxRate: {
    type: Number,
    default: 0.1, // 10% default tax rate
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  // Payment details
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'digital_wallet', 'check'],
  },
  paymentDate: {
    type: Date,
  },
  paymentReference: {
    type: String,
  },
  // Line items for detailed billing
  lineItems: [{
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  }],
  // Additional details
  notes: {
    type: String,
  },
  terms: {
    type: String,
    default: "Payment is due within 30 days of invoice date.",
  },
  // Business details
  businessInfo: {
    name: {
      type: String,
      default: "Mobile Repair Shop",
    },
    address: {
      type: String,
      default: "123 Main Street, City, State 12345",
    },
    phone: {
      type: String,
      default: "+1 (555) 123-4567",
    },
    email: {
      type: String,
      default: "info@mobilerepair.com",
    },
    website: {
      type: String,
      default: "www.mobilerepair.com",
    },
    taxId: {
      type: String,
      default: "TAX123456789",
    },
  },
}, {
  timestamps: true,
});

// Pre-save middleware to calculate totals
invoiceSchema.pre('save', function(next) {
  // Calculate subtotal from line items
  this.subtotal = this.lineItems.reduce((sum, item) => sum + item.total, 0);
  
  // Calculate tax amount
  this.taxAmount = this.subtotal * this.taxRate;
  
  // Calculate discount amount
  let discountAmount = 0;
  if (this.discountType === 'percentage') {
    discountAmount = this.subtotal * (this.discount / 100);
  } else {
    discountAmount = this.discount;
  }
  
  // Calculate final total
  this.total = this.subtotal + this.taxAmount - discountAmount;
  
  next();
});

// Method to generate invoice number
invoiceSchema.statics.generateInvoiceNumber = async function() {
  const count = await this.countDocuments();
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  return `INV-${year}${month}-${String(count + 1).padStart(4, '0')}`;
};

export default (mongoose.models.Invoice as IInvoiceModel) || mongoose.model<IInvoiceDocument, IInvoiceModel>("Invoice", invoiceSchema);

export type { IInvoice, IInvoiceDocument, IInvoiceModel, ILineItem, IBusinessInfo }; 