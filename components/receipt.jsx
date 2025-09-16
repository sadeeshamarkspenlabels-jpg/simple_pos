export default function ThermalReceipt({ sale }) {
  return (
    <div className="receipt mx-auto print:w-[80mm] w-[80mm] p-2 text-xs font-mono">
      {/* Shop Header */}
      <h1 className="text-center font-bold text-base">My Shop</h1>
      <p className="text-center">123 Main Street</p>
      <p className="text-center">Tel: 077-1234567</p>
      <hr className="border-dashed border-gray-400 my-2" />

      <div className=" my-4">
        {/* Sale Info */}
        <p>Bill No: {sale._id.slice(-6)}</p>
        <p>Cashier: {sale.cashier}</p>
        <p>Date: {new Date(sale.createdAt).toLocaleString()}</p>
        <hr className="border-dashed border-gray-400 my-2" />
      </div>

      <div className=" mx-auto my-4">
        <div className=" grid grid-cols-5 text-[13px] font-bold mb-2">
          <h3>Code</h3>
          <h3>Name</h3>
          <h3>Qty</h3>
          <h3>Rate</h3>
          <h3>Price</h3>
        </div>
        {/* Items */}
        {sale.items.map((item, i) => (
          <div key={i} className="grid grid-cols-5">
            <h3>{item.pId}</h3>
            <h3>{item.name}</h3>
            <h3>{item.quantity}</h3>
            <h3>{item.price}</h3>
            <h3>{(item.price * item.quantity).toFixed(2)}</h3>
          </div>
        ))}
      </div>

      <hr className="border-dashed border-gray-400 my-2" />

      {/* Totals */}
      <p className="text-right font-bold">
        Total:{" "}
        {sale.items
          .reduce((sum, i) => sum + i.price * i.quantity, 0)
          .toFixed(2)}
      </p>

      {/* Footer */}
      <p className="text-center mt-4">Thank you! Come again 🙏</p>
    </div>
  );
}
