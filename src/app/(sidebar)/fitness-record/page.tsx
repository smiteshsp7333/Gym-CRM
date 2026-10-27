'use client'
import { GetAllMembers, MemberResponse } from '@/action/member.action'
import { AddSales, SalesInput } from '@/action/sales.action'
import { GetAllServices, ServiceResponse } from '@/action/service.action'
import { DatePickerDemo } from '@/components/custom/date-picker'
import ItemSelector from '@/components/custom/item-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useLoading } from '@/hooks/use-loading'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {}

const FitnessRecordPage = (props: Props) => {
    const [members, setMembers] = React.useState<MemberResponse[]>([])
    const [services, setServices] = React.useState<ServiceResponse[]>([])
    const [selected, setSelected] = React.useState({
        member: {},
        service: {}
    })
    const { showLoading, hideLoading } = useLoading()
    const [formState, setFormState] = React.useState<SalesInput>({
        member_id: '',
        service_id: '',
        description: '',
        discount: 0,
        amount: 0,
        paid: 0,
        startDate: ''
    })
    useEffect(() => {
        async function fetchData() {
            setMembers(await GetAllMembers())
            setServices(await GetAllServices())
        }
        fetchData()
    }, [])
    const handleInputChange = (
        e: any,
        field: keyof SalesInput
    ) => {
        setFormState((prev) => ({ ...prev, [field]: e }))
    }

    const handleOnSubmit = async () => {
        showLoading()
        if (formState.member_id === '' || formState.service_id === '' || formState.amount === 0 || formState.startDate === '' || formState.paid === null || formState.paid <= 0) {
            toast.error('Please fill all the required fields')
            return
        }
        if (formState.amount <= 0) {
            toast.error('Amount must be greater than zero')
            return
        }
        const response = await AddSales(formState)
        if (response.id) {
            toast.success('Sale added successfully')
            setFormState({
                member_id: '',
                service_id: '',
                description: '',
                discount: 0,
                amount: 0,
                paid: 0,
                startDate: ''
            })
            hideLoading()
            return
        }
        hideLoading()
        toast.error('Failed to add sale')

    }
    return (
        <div className="max-w-xl w-full mx-auto space-y-6 p-4">
            <div>
                <h1 className="text-3xl font-semibold">Create a new sale</h1>
                <p className="text-muted-foreground text-sm">Fields marked with <span className="text-destructive">*</span> are required</p>
            </div>
            <Separator className="" />
            <div className="space-y-2">
                <Label>
                    Member <span className="text-destructive">*</span>
                </Label>
                <ItemSelector data={members} valueKey="id" labelKey="name" onSelect={(value) => handleInputChange(value, "member_id")} placeholder="Select a member" searchPlaceholder="Search members..." onSelectGetRow={(row) => setSelected((prev) => ({ ...prev, member: row }))} />
            </div>
            <div className="space-y-2">
                <Label>
                    Start Date <span className="text-destructive">*</span>
                </Label>
                <DatePickerDemo
                    // defaultDate={formState.DOB}
                    onDateChange={(e) => handleInputChange(e, "startDate")}
                />
            </div>
            <div className="space-y-2">
                <Label>
                    Description
                </Label>
                <Input
                    placeholder="Description"
                    type="text"
                    // value={formState.address}
                    onChange={(e) => handleInputChange(e.target.value, "description")}
                />
            </div>
            <Separator />
            <div className="space-y-2">
                <Label>
                    Amount Charged
                </Label>
                <p>{formState.amount}</p>
            </div>
            <div className="space-y-2">
                <Label>
                    Discount
                </Label>
                <Input
                    placeholder="Discount"
                    type="number"
                    // value={formState.address}
                    defaultValue={0}
                    onChange={(e) => handleInputChange(Number(e.target.value), "discount")}
                />
            </div>
            <div className="space-y-2">
                <Label>
                    Amount Paid
                </Label>
                <Input
                    placeholder="Amount Paid"
                    type="number"
                    // value={formState.address}
                    onChange={(e) => handleInputChange(Number(e.target.value), "paid")}
                />
            </div>
            <Card>
                <CardContent>
                    Due Amount: {formState.amount - formState.paid - formState.discount}
                </CardContent>
            </Card>
            <Separator />
            <Button className="w-full md:w-fit px-8" onClick={handleOnSubmit}>
                Create
            </Button>
        </div>
    )
}

export default FitnessRecordPage