'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "../ui/input"
import { useState, useMemo, ReactNode } from "react"
import { Search } from "lucide-react"

interface Props {
    dataRows: any[],
    columns: {
        accessorKey: string,
        header: string,
        headerClassName?: string,
        cellClassName?: string,
        cellContentGetRow?: (row: any) => React.ReactNode,
    }[],
    actionColumns?: {
        accessorKey: string,
        header: string,
        headerClassName?: string,
        cellClassName?: string,
        cellContent?: React.ReactNode,
        cellContentGetRow?: (row: any) => React.ReactNode,
        onClick?: (rowId: any) => void,
        onClickGetRow?: (row: any) => void
    }[],
    isLoading?: boolean,
    onItemClick?: (row: any) => void
}

export function DataTable({
    dataRows,
    columns,
    actionColumns,
    isLoading,
    onItemClick,
    ...props
}: Props) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredRows = useMemo(() => {
        if (!searchTerm) return dataRows

        return dataRows.filter(row => {
            return columns.some(column => {
                const value = row[column.accessorKey]
                const stringValue = value !== null && value !== undefined
                    ? String(value)
                    : ''
                return stringValue.toLowerCase().includes(searchTerm.toLowerCase())
            })
        })
    }, [dataRows, columns, searchTerm])

    const totalCols = columns.length + (actionColumns?.length || 0) + 1;

    return (
        <div className="space-y-4">
            <div className="relative max-w-md">
                <Input
                    className="h-10 ps-10 pe-4 rounded-full bg-[#12141c] border-white/10 text-white placeholder:text-slate-500 text-sm focus-visible:ring-[#ccff00] focus-visible:border-[#ccff00]/50 transition-all shadow-inner"
                    placeholder="Search across all records..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="text-slate-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3.5">
                    <Search className="size-4 text-slate-400" />
                </span>
            </div>
            <div className="overflow-hidden rounded-2xl bg-[#12141c] border border-white/[0.08] shadow-2xl shadow-black/40">
                <Table>
                    <TableHeader className="bg-white/[0.02] border-b border-white/[0.06]">
                        <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
                            <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 py-3.5 ps-4">No.</TableHead>
                            {
                                columns.map((column) => (
                                    <TableHead className={`text-[11px] font-semibold uppercase tracking-wider text-slate-400 py-3.5 ${column.headerClassName || ''}`} key={column.accessorKey}>
                                        {column.header}
                                    </TableHead>
                                ))
                            }
                            {
                                actionColumns && (
                                    actionColumns.map((column, index) => (
                                        <TableHead className={`text-[11px] font-semibold uppercase tracking-wider text-slate-400 py-3.5 ${column.headerClassName || ''}`} key={index}>
                                            {column.header}
                                        </TableHead>
                                    ))
                                )
                            }
                        </TableRow>
                    </TableHeader>
                    {
                        isLoading ? (
                            <TableBody>
                                {[1, 2, 3, 4, 5].map((idx) => (
                                    <TableRow key={idx} className="border-b border-white/[0.04]">
                                        <TableCell className="ps-4 py-3.5">
                                            <div className="h-4 w-5 bg-white/5 animate-pulse rounded" />
                                        </TableCell>
                                        {columns.map((col) => (
                                            <TableCell key={col.accessorKey} className="py-3.5">
                                                <div
                                                    className={`h-4 bg-white/[0.06] animate-pulse rounded-md ${
                                                        col.accessorKey === "name" ? "w-36" : "w-24"
                                                    }`}
                                                />
                                            </TableCell>
                                        ))}
                                        {actionColumns &&
                                            actionColumns.map((_, aIdx) => (
                                                <TableCell key={aIdx} className="py-3.5">
                                                    <div className="h-7 w-8 bg-white/[0.04] animate-pulse rounded-lg" />
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {filteredRows.length > 0 ? (
                                    filteredRows.map((row: any, index: number) => (
                                        <TableRow key={index} className="cursor-pointer border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group">
                                            <TableCell className="font-semibold text-xs text-slate-500 ps-4 tabular-nums">{index + 1}</TableCell>
                                            {
                                                columns.map((column) => (
                                                    <TableCell
                                                        key={column.accessorKey}
                                                        className={`text-sm text-slate-200 py-3.5 ${column.cellClassName || ''}`}
                                                        onClick={() => onItemClick && onItemClick(row)}
                                                    >
                                                        {column.cellContentGetRow ? column.cellContentGetRow(row) : row[column.accessorKey]}
                                                    </TableCell>
                                                ))
                                            }
                                            {
                                                actionColumns && (
                                                    actionColumns.map((column, index) => (
                                                        <TableCell className={column.cellClassName} key={index}>
                                                            <div onClick={() => {
                                                                column.onClick && column.onClick(row[column.accessorKey])
                                                                column.onClickGetRow && column.onClickGetRow(row)
                                                            }}>
                                                                {(column.cellContentGetRow) ? column.cellContentGetRow(row) : column.cellContent}
                                                            </div>
                                                        </TableCell>
                                                    ))
                                                )
                                            }
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={totalCols} className="text-center py-10 text-sm text-slate-500">
                                            No matching records found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )
                    }
                </Table>
            </div>
        </div>
    )
}
