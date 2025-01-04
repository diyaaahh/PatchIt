import React from 'react'
import PotholeDescriptionCard from '../components/potholeDescription'

export default function ReportedPothole() {

  const potholes = [
    {
      id: 1,
      place: 'Baneshowr',
      description: 'Large pothole identified in the main Baneshwor intersection causing traffic disruption and posing risks to vehicles. Immediate attention required for repair to prevent accidents and ensure smooth traffic flow.',
      priority: 'High',
      status: 'Work in Progress',
      image: '/api/placeholder/400/320'
    }

  ];

  return (
    <div className="space-y-4 p-4">
      {potholes.map((pothole) => (
        <PotholeDescriptionCard
          key={pothole.id}
          place={pothole.place}
          description={pothole.description}
          priority={pothole.priority}
          status={pothole.status}
          image={pothole.image}
        />
      ))}
    </div>
  )
}