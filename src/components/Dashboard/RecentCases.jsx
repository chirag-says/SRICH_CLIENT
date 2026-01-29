import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import api from '../../services/api'
import { HiArrowRight, HiCheckCircle, HiClock, HiExclamation } from 'react-icons/hi'

const RecentCases = () => {
    const { data: cases = [], isLoading } = useQuery({
        queryKey: ['recentCases'],
        queryFn: async () => {
            const response = await api.get('/clinical-cases?limit=5')
            return response.data.data
        },
        // Mock data for development
        placeholderData: [
            {
                _id: '1',
                caseNumber: 'SRISH-2601-0045',
                patientInfo: { initials: 'JD', ageGroup: '16.1-40y' },
                sessionDate: new Date().toISOString(),
                supervisorApproval: { status: 'Approved' }
            },
            {
                _id: '2',
                caseNumber: 'SRISH-2601-0044',
                patientInfo: { initials: 'AB', ageGroup: '2.1-5y' },
                sessionDate: new Date(Date.now() - 86400000).toISOString(),
                supervisorApproval: { status: 'Pending' }
            },
            {
                _id: '3',
                caseNumber: 'SRISH-2601-0043',
                patientInfo: { initials: 'XY', ageGroup: '>60y' },
                sessionDate: new Date(Date.now() - 172800000).toISOString(),
                supervisorApproval: { status: 'Revision Required' }
            }
        ]
    })

    const statusConfig = {
        Approved: {
            icon: HiCheckCircle,
            color: 'text-[var(--color-accent-green)]',
            bg: 'bg-[var(--color-accent-green)]/10'
        },
        Pending: {
            icon: HiClock,
            color: 'text-[var(--color-accent-yellow)]',
            bg: 'bg-[var(--color-accent-yellow)]/10'
        },
        'Revision Required': {
            icon: HiExclamation,
            color: 'text-[var(--color-accent-orange)]',
            bg: 'bg-[var(--color-accent-orange)]/10'
        },
        Rejected: {
            icon: HiExclamation,
            color: 'text-[var(--color-accent-red)]',
            bg: 'bg-[var(--color-accent-red)]/10'
        }
    }

    if (isLoading) {
        return (
            <div className="glass-card p-5">
                <h3 className="font-semibold mb-4">Recent Cases</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-16 rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Cases</h3>
                <Link
                    to="/clinical-cases"
                    className="text-xs text-[var(--color-accent-cyan)] hover:underline flex items-center gap-1"
                >
                    View all <HiArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="space-y-3">
                {cases.slice(0, 5).map((caseItem) => {
                    const status = caseItem.supervisorApproval?.status || 'Pending'
                    const config = statusConfig[status] || statusConfig.Pending
                    const StatusIcon = config.icon

                    return (
                        <Link
                            key={caseItem._id}
                            to={`/clinical-cases/${caseItem._id}`}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                        >
                            <div className={`p-2 rounded-lg ${config.bg}`}>
                                <StatusIcon className={`w-4 h-4 ${config.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{caseItem.caseNumber}</p>
                                <p className="text-xs text-[var(--color-navy-400)]">
                                    Patient: {caseItem.patientInfo?.initials} • {caseItem.patientInfo?.ageGroup}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-[var(--color-navy-400)]">
                                    {format(new Date(caseItem.sessionDate), 'MMM d')}
                                </p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default RecentCases
