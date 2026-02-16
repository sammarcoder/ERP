import MgrnForm from '@/components/mgrn/MgrnForm'

export default function CreateMgrnPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Create MGRN</h1>
            <MgrnForm mode='create' />
        </div>
    )
}