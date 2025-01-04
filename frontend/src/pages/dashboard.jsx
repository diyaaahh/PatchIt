import { useAuth0 } from '@auth0/auth0-react'
import React,{useState} from 'react'
import Sidebar from '../components/sideBar'
import ReportedPothole from './reportedPothole'
import Analytics from '../flaskpages/analytics'
import LiveStream from '../flaskpages/cameraPage'

export default function Dashboard() {
    const [currentView, setCurrentView] = useState('reportedReports');

    const handleReportedReports = () => {
        setCurrentView('reportedReports');
    };

    const handleInprogressReports = () => {
        setCurrentView('inprogressReports');
    };

    const handleCompletesReports = () => {
        setCurrentView('completeReports');
    };

    const handleAnalytics = () => {
        setCurrentView('analytics');
    };

    const handleLiveDetection = () => {
        setCurrentView('livedetection');
    };


    const renderContent = () => {
        switch (currentView) {
            case 'reportedReports':
                return <ReportedPothole />
            case 'inprogressReports':
                return <ReportedPothole />
            case 'resolveddReports':
                return <ReportedPothole />
            case 'analytics':
                return <Analytics />
            case 'livedetection':
                return <LiveStream />
            default:
                return <ReportedPothole />
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden">
            <div className="flex h-full">
                <div className="h-full shadow-lg shadow-slate-900/20">
                    <Sidebar onReportedReports={handleReportedReports} onInprogressReports={handleInprogressReports} onResolvedReports={handleCompletesReports} onAnalytics={handleAnalytics} onLiveDetection={handleLiveDetection} />
                </div>

                <div className="flex-1 overflow-y-auto ml-10 mr-10 m-5">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}