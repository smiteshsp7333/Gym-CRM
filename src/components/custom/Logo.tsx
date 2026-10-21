import { GYM_BRANDING } from '@/config/branding'
import Image from 'next/image'
import React from 'react'

type Props = {
    className?: string;
}

const Logo = ({ className = '' }: Props) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Image src={GYM_BRANDING.logoDark} width={100} height={50} alt={GYM_BRANDING.name} className='dark:hidden object-contain' />
            <Image src={GYM_BRANDING.logoLight} width={100} height={50} alt={GYM_BRANDING.name} className='hidden dark:block object-contain' />
        </div>
    )
}

export default Logo