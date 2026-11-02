'use client'
import React, { useEffect } from 'react'
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Button } from '@/components/ui/button';
import { ExpandedSalesResponse, GetSaleWithExpand } from '@/action/sales.action';
import { GYM_BRANDING } from '@/config/branding';

const Page = ({ params }: { params: any }) => {
    const unwrappedParams = React.use(params)
    const { sale_id } = unwrappedParams as { sale_id: string }
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <div className='max-w-5xl mx-auto px-4 py-4'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold mb-2'>{GYM_BRANDING.name} Sales Invoice</h1>
                <div className='mb-2 flex gap-2'>
                    <Button
                        onClick={reactToPrintFn}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Print Invoice
                    </Button>
                    <Button
                        onClick={()=>navigator.share({ 
                            title: `${GYM_BRANDING.name} Sales Invoice`, 
                            text: `Dear customer, your invoice for your recent membership purchase at ${GYM_BRANDING.name} is available below:\n\nLink: ${window.location.href}\n\n- Team ${GYM_BRANDING.shortName}`, 
                        })}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Share
                    </Button>
                </div>
            </div>
            <div className='border border-gray-200 rounded-lg shadow-sm text-sm md:scale-100'>
                <Invoice ref={contentRef} sale_id={sale_id} />
            </div>
        </div>
    )
}

export default Page

const Invoice = ({
    ref,
    sale_id
}: { ref: any, sale_id: string }) => {

    const [saleData, setSaleData] = React.useState<ExpandedSalesResponse>()
    useEffect(() => {
        async function fetchData() {
            // Check localStorage first for fresh sales
            try {
                const storedSales = JSON.parse(localStorage.getItem("gym_sales") || "[]");
                const localSale = storedSales.find((s: any) => s.id === sale_id);
                if (localSale) {
                    setSaleData({
                        id: localSale.id,
                        member_id: localSale.member_id || "mem-001",
                        service_id: localSale.service_id || "srv-001",
                        description: localSale.description || "Gym Membership Sale",
                        discount: localSale.discount || 0,
                        amount: localSale.amount || 8500,
                        paid: localSale.paid || 8500,
                        startDate: localSale.startDate || "15-01-2026",
                        endDate: localSale.endDate || "15-07-2026",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        member: {
                            id: localSale.member_id || "mem-001",
                            name: localSale.member_name || "Gym Member",
                            memberCode: "MEM-001",
                            email: "member@gymdemo.in",
                            phone: localSale.member_phone || "9820110025",
                            address: "100 Feet Road, Indiranagar, Bengaluru",
                        },
                        service: {
                            id: localSale.service_id || "srv-001",
                            name: localSale.service_name || "Gym Membership Plan",
                            price: localSale.amount || 8500,
                            duration: 6,
                        },
                    } as any);
                    return;
                }
            } catch {}

            const sale = await GetSaleWithExpand(sale_id)
            if (sale) {
                setSaleData(sale)
            }
        }
        fetchData()
    }, [sale_id])

    const invoiceData = {
        invoiceNumber: "INV-2025-0042",
        date: "May 6, 2025",
        gym: {
            name: GYM_BRANDING.name,
            address: GYM_BRANDING.fullAddress,
            contact: GYM_BRANDING.phone,
            email: GYM_BRANDING.email,
            website: ""
        },

        termsAndConditions: [
            `Membership is non-transferable and non-refundable. ${GYM_BRANDING.name} reserves the right to modify the terms of membership. Members must comply with all gym rules and regulations.`,
        ]
    };

    return (
        <div className='mx-auto bg-white text-black p-8' ref={ref}>
            <div className="flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <img src="/logo.png" alt="Logo" className="h-16 mb-4 object-contain rounded-xl" />
                        <h1 className="text-black text-lg">{invoiceData.gym.name}</h1>
                        <p className="text-gray-600">{invoiceData.gym.address}</p>
                        <p className="text-gray-600">Contact: {invoiceData.gym.contact}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-semibold">INVOICE</h2>
                        <p className="text-gray-600">#{new Date().getTime()}</p>
                        <p className="text-gray-600 w-40">Date: {saleData?.startDate}</p>
                    </div>
                </div>

                {/* Member Details */}
                <div className="mb-4">
                    <div className="">
                        <p className="">To,</p>
                        <p className="font-bold">{saleData?.member.name}</p>
                        <p className="">{saleData?.member.address}</p>
                        <p className="">Phone: {saleData?.member.phone}</p>
                    </div>
                </div>

                {/* Membership Details */}
                <div className="mb-4">
                    <h3 className="text-xl font-semibold border-b pb-2 ">Membership Details</h3>
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Service:</span>
                            <span className='text-lg font-semibold'>{saleData?.service.name} membership</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Period:</span>
                            <span className='font-bold'>{saleData?.startDate} to {saleData?.endDate}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="mb-4">
                    <h3 className="text-xl font-semibold border-b pb-2 mb-3">Payment Summary</h3>
                    <div className="ml-2">
                        <div className="flex justify-between py-2">
                            <span>Total Amount:</span>
                            <span>₹{saleData?.amount}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Discount:</span>
                            <span>-₹{saleData?.discount}</span>
                        </div>
                        <div className="flex justify-between py-2 font-semibold">
                            <span>Amount After Discount:</span>
                            <span>₹{saleData && (saleData?.amount - saleData?.discount)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Paid:</span>
                            <span>₹{saleData?.paid}</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-200 mt-2 pt-2">
                            <span>Balance Due:</span>
                            <span >
                                ₹{saleData && (saleData?.amount - saleData?.discount - saleData?.paid)}</span>
                        </div>
                    </div>
                </div>

                {/* Thank You Message */}
                <div className="text-center my-2 py-2 border-t border-b border-gray-200">
                    <p className="text-gray-600">Thank you for choosing {invoiceData.gym.name}! We appreciate your business and commitment to your fitness journey.</p>
                </div>
                {/* Terms and Conditions */}
                <div className="mb-8">
                    <h3 className="text-sm">Terms and Conditions</h3>
                    <ul className="text-xs text-gray-600">
                        {invoiceData.termsAndConditions.map((term, index) => (
                            <li key={index}>{term}</li>
                        ))}
                    </ul>
                </div>


                {/* Footer */}
                <div className="text-center text-sm text-gray-500 ">
                    <p>If you have any questions regarding this invoice, please contact us.</p>
                    <p>{invoiceData.gym.contact} | {invoiceData.gym.email}</p>
                </div>
            </div>
        </div>
    );
};
