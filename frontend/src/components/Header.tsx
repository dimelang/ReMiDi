import { PillBottle, Tablets, Pill } from 'lucide-react'
export default function Header() {
    return (
        <div className="flex flex-row gap-2 items-center">
            <PillBottle strokeWidth={1} size={64} absoluteStrokeWidth={false} className='rotate-90 text-[#065084] dark:text-[#78B9B5]' />
            <div className='flex flex-row self-end gap-1'>
                <Tablets strokeWidth={2} size={36} absoluteStrokeWidth={false} className='-rotate-45 text-[#065084] dark:text-[#78B9B5]' />
                <Pill strokeWidth={2} size={32} absoluteStrokeWidth={false} className='text-[#065084] dark:text-[#78B9B5]' />
            </div>
            <h1 className='ml-2 text-5xl font-semibold text-[#065084] dark:text-[#78B9B5] font-poppins'>SideEffect Analyzer</h1>
        </div>
    );
}