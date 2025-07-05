import { NextApiRequest, NextApiResponse } from "next";
import invoiceModel from "./invoice.model";
import repairerModel from "../repairer/repairer.model";
import customerModel from "../customer/customer.model";
import deviceModel from "../device/device.model";

// Get all invoices
async function getInvoices(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { status, startDate, endDate, customer, limit = 50, skip = 0 } = req.query;
    
    let query: any = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by date range
    if (startDate && endDate) {
      query.issueDate = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }
    
    // Filter by customer
    if (customer) {
      query.customer = customer;
    }
    
    const invoices = await invoiceModel
      .find(query)
      .populate('customer', 'name phone')
      .populate('device', 'name model imei')
      .populate('repairer', 'status problem charge')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string));
    
    const total = await invoiceModel.countDocuments(query);
    
    return res.status(200).json({ 
      success: true, 
      invoices, 
      pagination: {
        total,
        limit: parseInt(limit as string),
        skip: parseInt(skip as string),
        hasMore: (parseInt(skip as string) + parseInt(limit as string)) < total
      }
    });
  } catch (err) {
    console.error('Error fetching invoices:', err);
    return res.status(400).json({ success: false, error: err });
  }
}

// Get single invoice by ID
async function getInvoiceById(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    
    const invoice = await invoiceModel
      .findById(id)
      .populate('customer', 'name phone')
      .populate('device', 'name model imei color')
      .populate('repairer', 'status problem charge entryDate expectedDeliveryDate deliveryDate notes');
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    
    return res.status(200).json({ success: true, invoice });
  } catch (err) {
    console.error('Error fetching invoice:', err);
    return res.status(400).json({ success: false, error: err });
  }
}

// Create new invoice
async function createInvoice(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { repairerId, lineItems, taxRate, discount, discountType, notes, terms, dueDate } = req.body;
    
    // Find the repairer to get customer and device info
    const repairer = await repairerModel
      .findById(repairerId)
      .populate('customer')
      .populate('device');
    
    if (!repairer) {
      return res.status(400).json({ success: false, message: "Repairer not found" });
    }
    
    // Generate invoice number
    const invoiceNumber = await invoiceModel.generateInvoiceNumber();
    
    // Calculate due date if not provided (30 days from now)
    const invoiceDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    // Create line items with calculated totals
    const calculatedLineItems = lineItems.map((item: any) => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));
    
    const newInvoice = await invoiceModel.create({
      invoiceNumber,
      repairer: repairer._id,
      customer: repairer.customer._id,
      device: repairer.device._id,
      dueDate: invoiceDueDate,
      lineItems: calculatedLineItems,
      taxRate: taxRate || 0.1,
      discount: discount || 0,
      discountType: discountType || 'percentage',
      notes,
      terms: terms || "Payment is due within 30 days of invoice date.",
    });
    
    // Populate the created invoice
    const populatedInvoice = await invoiceModel
      .findById(newInvoice._id)
      .populate('customer', 'name phone')
      .populate('device', 'name model imei')
      .populate('repairer', 'status problem charge');
    
    return res.status(201).json({ success: true, invoice: populatedInvoice });
  } catch (err) {
    console.error('Error creating invoice:', err);
    return res.status(400).json({ success: false, error: err });
  }
}

// Update invoice
async function updateInvoice(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    const updateData = req.body;
    
    // If updating line items, recalculate totals
    if (updateData.lineItems) {
      updateData.lineItems = updateData.lineItems.map((item: any) => ({
        ...item,
        total: item.quantity * item.unitPrice
      }));
    }
    
    const updatedInvoice = await invoiceModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('customer', 'name phone')
      .populate('device', 'name model imei')
      .populate('repairer', 'status problem charge');
    
    if (!updatedInvoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    
    return res.status(200).json({ success: true, invoice: updatedInvoice });
  } catch (err) {
    console.error('Error updating invoice:', err);
    return res.status(400).json({ success: false, error: err });
  }
}

// Mark invoice as paid
async function markInvoicePaid(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    const { paymentMethod, paymentReference, paymentDate } = req.body;
    
    const updatedInvoice = await invoiceModel
      .findByIdAndUpdate(
        id,
        {
          status: 'paid',
          paymentMethod,
          paymentReference,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        },
        { new: true, runValidators: true }
      )
      .populate('customer', 'name phone')
      .populate('device', 'name model imei')
      .populate('repairer', 'status problem charge');
    
    if (!updatedInvoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    
    return res.status(200).json({ success: true, invoice: updatedInvoice });
  } catch (err) {
    console.error('Error marking invoice as paid:', err);
    return res.status(400).json({ success: false, error: err });
  }
}

// Delete invoice
async function deleteInvoice(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    
    const deletedInvoice = await invoiceModel.findByIdAndDelete(id);
    
    if (!deletedInvoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    
    return res.status(200).json({ success: true, message: "Invoice deleted successfully" });
  } catch (err) {
    console.error('Error deleting invoice:', err);
    return res.status(400).json({ success: false, error: err });
  }
}

// Get invoice statistics
async function getInvoiceStats(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        issueDate: {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string)
        }
      };
    }
    
    const [
      totalInvoices,
      paidInvoices,
      draftInvoices,
      overdueInvoices,
      totalRevenue,
      pendingRevenue
    ] = await Promise.all([
      invoiceModel.countDocuments(dateFilter),
      invoiceModel.countDocuments({ ...dateFilter, status: 'paid' }),
      invoiceModel.countDocuments({ ...dateFilter, status: 'draft' }),
      invoiceModel.countDocuments({ 
        ...dateFilter, 
        status: 'overdue',
        dueDate: { $lt: new Date() }
      }),
      invoiceModel.aggregate([
        { $match: { ...dateFilter, status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      invoiceModel.aggregate([
        { $match: { ...dateFilter, status: { $in: ['sent', 'overdue'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);
    
    const stats = {
      totalInvoices,
      paidInvoices,
      draftInvoices,
      overdueInvoices,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingRevenue: pendingRevenue[0]?.total || 0,
      collectionRate: totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0
    };
    
    return res.status(200).json({ success: true, stats });
  } catch (err) {
    console.error('Error fetching invoice stats:', err);
    return res.status(400).json({ success: false, error: err });
  }
}

// Generate invoice from completed repair
async function generateInvoiceFromRepair(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { repairerId } = req.body;
    
    const repairer = await repairerModel
      .findById(repairerId)
      .populate('customer')
      .populate('device');
    
    if (!repairer) {
      return res.status(400).json({ success: false, message: "Repairer not found" });
    }
    
    if (repairer.status !== 'completed' && repairer.status !== 'delivered') {
      return res.status(400).json({ 
        success: false, 
        message: "Can only generate invoice for completed or delivered repairs" 
      });
    }
    
    // Check if invoice already exists for this repair
    const existingInvoice = await invoiceModel.findOne({ repairer: repairerId });
    if (existingInvoice) {
      return res.status(400).json({ 
        success: false, 
        message: "Invoice already exists for this repair" 
      });
    }
    
    // Generate invoice number
    const invoiceNumber = await invoiceModel.generateInvoiceNumber();
    
    // Create default line items based on repair
    const lineItems = [
      {
        description: `${repairer.device.name} Repair - ${repairer.problem || 'Device Repair'}`,
        quantity: 1,
        unitPrice: repairer.charge || 0,
        total: repairer.charge || 0
      }
    ];
    
    const newInvoice = await invoiceModel.create({
      invoiceNumber,
      repairer: repairer._id,
      customer: repairer.customer._id,
      device: repairer.device._id,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      lineItems,
      status: 'sent'
    });
    
    const populatedInvoice = await invoiceModel
      .findById(newInvoice._id)
      .populate('customer', 'name phone')
      .populate('device', 'name model imei')
      .populate('repairer', 'status problem charge');
    
    return res.status(201).json({ success: true, invoice: populatedInvoice });
  } catch (err) {
    console.error('Error generating invoice from repair:', err);
    return res.status(400).json({ success: false, error: err });
  }
}

export {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  markInvoicePaid,
  deleteInvoice,
  getInvoiceStats,
  generateInvoiceFromRepair
}; 