import Image from "next/image";

export default function ThermalReceipt({ sale }) {
  return (
    <div className="receipt mx-auto print:w-[80mm] w-[80mm] p-2 text-[12px] font-mono">
      {/* Shop Header */}
      <div className=" flex justify-center">
        <img src="/bill.svg" alt="" className="w-[100px] h-[100px]" />
      </div>
      <div>
        <h1 className="text-center font-bold text-base">PRADEEP FOOD CENTRE</h1>
        <h1 className="text-center font-bold text-base">ERANDAWALA,</h1>
        <h1 className="text-center font-bold text-base">KURUWITA</h1>
      </div>
      {/* <p className="text-center">123 Main Street</p> */}
      <p className="text-center">Tel: 045-2263129</p>
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
      <div className=" flex justify-between">
        <p className="text-right font-bold">Total:</p>
        <p className="text-right font-bold">
          {sale.items
            .reduce((sum, i) => sum + i.price * i.quantity, 0)
            .toFixed(2)}
        </p>
      </div>

      {/* Footer */}
      <p className="text-center mt-4 font-bold">Thank you! Come again</p>
      <p className="text-center text-[10px] mt-2">
        Developed by Markspenlabels
      </p>
    </div>
  );
}
