'use client'
import { GetAllMembers, MemberResponse } from '@/action/member.action'
import ItemSelector from '@/components/custom/item-selector'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React, { useEffect } from 'react'

type Props = {}

const SalesInvoicesPage = (props: Props) => {
    const [members, setMembers] = React.useState<MemberResponse[]>([])
    const [selectedMember, setSelectedMember] = React.useState<any>({})
    useEffect(() => {
        async function fetchData() {
            setMembers(await GetAllMembers())
            //  setServices(await GetAllServices())
        }
        fetchData()
    }, [])
    return (
        <div className='max-w-xl w-full mx-auto space-y-6 p-4'>
            <div className='flex items-center justify-between'>
                <h1 className='text-xl font-semibold'>Sales</h1>
                <Link href={'/sales/new'}>
                    <Button>Create Sales</Button>
                </Link>
            </div>
            <Separator />
            {/* <DataTable dataRows={salesList} actionColumn={DeleteColumn} columns={columns} isLoading={isLoading} /> */}
            <div className="space-y-2">
                <Label>
                    Member <span className="text-destructive">*</span>
                </Label>
                {/* <ItemSelector data={members} valueKey="id" labelKey="name" onSelect={(value) => handleInputChange(value, "member_id")} placeholder="Select a member" searchPlaceholder="Search members..." onSelectGetRow={(row) => setSelected((prev) => ({ ...prev, member: row }))} /> */}
            </div>
        </div>
    )
}

export default SalesInvoicesPage