'use client'
import { GetEnquiryByFollowupDate } from '@/action/enquiries.action'
import { getAllExpiringSalesInXDays, GetSalesEndingInXdays } from '@/action/sales.action'
import { DataTable } from '@/components/custom/data-table'
import { DatePickerDemo } from '@/components/custom/date-picker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLoading } from '@/hooks/use-loading'
import { format } from 'date-fns'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { GYM_BRANDING } from '@/config/branding'

type Props = {}

const columns = [
    {
        accessorKey: 'member_name',
        header: 'Name',
    },
    {
        accessorKey: 'endDate',
        header: 'End',
        cellClassName: 'capitalize',
    },
    {
        accessorKey: 'startDate',
        header: 'Start',
        cellClassName: 'capitalize',
    },
    {
        accessorKey: 'member_phone',
        header: 'Phone',
    },
    {
        accessorKey: 'service_name',
        header: 'Service',
    },
]
const SalesFollowupsPage = (props: Props) => {
    const [salesList, setSalesList] = React.useState<any[]>([])
    const [days, setDays] = useState(0)
    const [SelectedSale, setSelectedSale] = useState<any>(null)
    const [message, setMessage] = useState('')
    const { showLoading, hideLoading, isLoading } = useLoading()
    useEffect(() => {
        showLoading()
        fetchData()
    }, [])
    useEffect(() => {
        showLoading()
        fetchData()
    }, [days])

    async function fetchData() {
        if (days === -1) {
            const data = await GetSalesEndingInXdays(-1)
            setSalesList(data)
            hideLoading()
            return
        } else {
            const data = await getAllExpiringSalesInXDays(days)
            setSalesList(data)
            hideLoading()
            return
        }
        // console.log(await GetSalesEndingInXdays(-1))
    }

    const handleSaleSelected = (row: any) => {
        setSelectedSale(row);
        const msgexpired = `Hi ${row.member_name}, your ${row.service_name} membership has ended on ${(row.endDate)}. Please renew your membership to continue your fitness journey.%0A%0A- Team ${GYM_BRANDING.shortName}`
        const msg7days = `Hi ${row.member_name}, your ${row.service_name} membership is ending in 7 days (on ${(row.endDate)}). Please renew your membership.%0A%0A- Team ${GYM_BRANDING.shortName}`
        const msg5days = `Hi ${row.member_name}, your ${row.service_name} membership is ending in 5 days (on ${(row.endDate)}). Please renew your membership.%0A%0A- Team ${GYM_BRANDING.shortName}`
        const msgtoday = `Hi ${row.member_name}, your ${row.service_name} membership is ending today (on ${(row.endDate)}). Please renew your membership.%0A%0A- Team ${GYM_BRANDING.shortName}`
        const msgtomorrow = `Hi ${row.member_name}, your ${row.service_name} membership is ending tomorrow (on ${(row.endDate)}). Please renew your membership.%0A%0A- Team ${GYM_BRANDING.shortName}`
        if (days === -1) {
            setMessage(msgexpired)
        } else if (days === 7) {
            setMessage(msg7days)
        } else if (days === 5) {
            setMessage(msg5days)
        } else if (days === 0) {
            setMessage(msgtoday)
        } else if (days === 1) {
            setMessage(msgtomorrow)
        }
    }

    return (
        <div className="max-w-7xl w-full mx-auto space-y-6 px-4 lg:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                        Membership Renewal Follow-ups
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 tabular-nums">
                            {salesList.length} In Retention Radar
                        </span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Track athletes with expiring plans and trigger instant 1-click renewal WhatsApp reminders
                    </p>
                </div>
            </div>

            {SelectedSale && (
                <Card className="rounded-3xl bg-[#12141c] border border-white/[0.08] shadow-2xl p-6">
                    <CardHeader className="p-0 mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                    <span>Renewal Reminder for {SelectedSale.member_name}</span>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 font-medium">
                                        Plan: {SelectedSale.service_name}
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-400 mt-0.5">
                                    Ends on {SelectedSale.endDate} • Ready to send via WhatsApp
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                        <div className="p-4 rounded-2xl bg-[#090a0f] border border-white/[0.06] text-sm text-slate-200 leading-relaxed">
                            {decodeURIComponent(message.replace(/%0A/g, "\n"))}
                        </div>
                        <Link
                            href={`https://api.whatsapp.com/send?phone=91${SelectedSale?.member_phone}&text=${message}`}
                            target="_blank"
                        >
                            <Button className="rounded-full bg-[#25D366] text-black font-semibold text-xs px-6 hover:bg-[#20ba5a] shadow-md shadow-[#25D366]/20 flex items-center gap-2">
                                <span>Send WhatsApp Renewal Nudge</span>
                                <span>→</span>
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            <div className="flex items-center justify-between">
                <Tabs onValueChange={(e) => setDays(parseInt(e))} defaultValue="0" className="w-full sm:w-auto">
                    <TabsList className="bg-[#12141c] border border-white/[0.08] p-1 rounded-full">
                        <TabsTrigger value="0" className="rounded-full data-[state=active]:bg-[#ccff00] data-[state=active]:text-black data-[state=active]:font-semibold text-xs transition-all">
                            Ending Today
                        </TabsTrigger>
                        <TabsTrigger value="1" className="rounded-full data-[state=active]:bg-[#ccff00] data-[state=active]:text-black data-[state=active]:font-semibold text-xs transition-all">
                            Ending Tomorrow
                        </TabsTrigger>
                        <TabsTrigger value="5" className="rounded-full data-[state=active]:bg-[#ccff00] data-[state=active]:text-black data-[state=active]:font-semibold text-xs transition-all">
                            In 5 Days
                        </TabsTrigger>
                        <TabsTrigger value="7" className="rounded-full data-[state=active]:bg-[#ccff00] data-[state=active]:text-black data-[state=active]:font-semibold text-xs transition-all">
                            In 7 Days
                        </TabsTrigger>
                        <TabsTrigger value="-1" className="rounded-full data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:font-semibold text-xs transition-all">
                            Expired
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <DataTable dataRows={salesList} isLoading={isLoading} columns={columns} onItemClick={handleSaleSelected} />
        </div>
    )
}

export default SalesFollowupsPage

// https://api.whatsapp.com/send?phone=918698969798&text=Hello%20%0ABrother