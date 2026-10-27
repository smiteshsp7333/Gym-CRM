'use client'
import { GetEnquiryByFollowupDate } from '@/action/enquiries.action'
import { GetMembersWithDOB } from '@/action/member.action'
import { DataTable } from '@/components/custom/data-table'
import { DatePickerDemo } from '@/components/custom/date-picker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Gift } from 'lucide-react'
import { GYM_BRANDING } from '@/config/branding'

type Props = {}

const columns = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
]
const BirthdaysPage = (props: Props) => {
    const [memberList, setMemberList] = React.useState<any[]>([])
    const [SelectedMember, setSelectedMember] = React.useState<any>(null)
    const [message, setMessage] = React.useState<string>('')
    const [date, setDate] = useState(format(new Date, 'dd-MM-yyyy'))
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    useEffect(() => {
        
        setIsLoading(true)
        fetchData()
    }, [])
    useEffect(() => {
        setIsLoading(true)
        fetchData()
    }, [date])
    const handleMemberChange = (row: any) => {
        setSelectedMember(row)
        const msg = `Hi ${row.name}, it's your Birthday today! Team ${GYM_BRANDING.shortName} wishes you a very Happy Birthday. Stay Healthy, Stay Strong! %0A%0A~ ${GYM_BRANDING.trainerName}`
        setMessage(msg)
    }

    async function fetchData() {
        const data = await GetMembersWithDOB(date)
        setMemberList(data)
        setIsLoading(false)
    }
  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Gift className="size-5 text-[#ccff00]" />
            Birthday Celebrations & Retention
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 tabular-nums">
              {memberList.length} Celebrating
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Send warm personalized WhatsApp birthday wishes to build long-term athlete loyalty
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DatePickerDemo defaultDate={date} onDateChange={(date) => setDate(date)} />
        </div>
      </div>

      {SelectedMember && (
        <Card className="rounded-3xl bg-[#12141c] border border-white/[0.08] shadow-2xl p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Send Wish to {SelectedMember.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 font-medium">
                    +91 {SelectedMember.phone?.toString()}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-0.5">
                  Pre-formatted WhatsApp greeting ready to send
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="p-4 rounded-2xl bg-[#090a0f] border border-white/[0.06] text-sm text-slate-200 leading-relaxed font-sans">
              {decodeURIComponent(message.replace(/%0A/g, "\n"))}
            </div>
            <Link
              href={`https://api.whatsapp.com/send?phone=91${SelectedMember?.phone}&text=${message}`}
              target="_blank"
            >
              <Button className="rounded-full bg-[#25D366] text-black font-semibold text-xs px-6 hover:bg-[#20ba5a] shadow-md shadow-[#25D366]/20 flex items-center gap-2">
                <span>Send WhatsApp Wish</span>
                <span>→</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <DataTable dataRows={memberList} isLoading={isLoading} columns={columns} onItemClick={handleMemberChange} />
    </div>
  )
}

export default BirthdaysPage