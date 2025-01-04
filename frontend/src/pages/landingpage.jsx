import React from 'react';
import { Camera, MapPin, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import potholesImage from '../assets/pothole.png';
import { useAuth0 } from '@auth0/auth0-react';

const LandingPage = () => {
  const { loginWithRedirect } = useAuth0(); 


  
  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-br from-[#3C4F76] to-[#2A3B5C]">
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-10" 
      style={{ backgroundImage: `url(${potholesImage})` }} 
    />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-white">
          Report Potholes,
          <span className="block mt-2">Improve Communities</span>
        </h1>
        <p className="text-xl text-[#E2E8F4] max-w-2xl mx-auto">
          Help make your community safer by reporting road hazards. 
          Quick, easy reporting with just a photo and description.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={() => loginWithRedirect()} className="px-8 py-4 bg-white text-[#3C4F76] rounded-lg font-semibold 
            hover:bg-[#E2E8F4] transition-all shadow-lg flex items-center gap-2 
            transform hover:translate-y-[-2px]">
            Start Reporting <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>

      {/* Features Section */}
      <div className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#3C4F76]">
              Three Simple Steps to Report
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Camera className="w-8 h-8" />,
                title: "Take a Photo",
                description: "Capture the pothole using your device's camera"
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Add Location",
                description: "Describe the location or use GPS coordinates"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Submit Report",
                description: "We'll forward your report to local authorities"
              }
            ].map((feature, index) => (
              <div key={index} 
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl 
                  transform hover:translate-y-[-4px] transition-all duration-300
                  border border-[#3C4F76]/10">
                <div className="text-[#3C4F76] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-[#3C4F76]">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-[#3C4F76]">
                Why Report Potholes?
              </h2>
              <div className="space-y-6">
                {[
                  "Prevent vehicle damage and accidents",
                  "Help prioritize road repairs",
                  "Improve community safety",
                  "Track repair progress"
                ].map((benefit, index) => (
                  <div key={index} 
                    className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-lg
                      border border-[#3C4F76]/10 hover:border-[#3C4F76]/30 transition-colors">
                    <CheckCircle className="w-6 h-6 text-[#3C4F76]" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <button className="px-8 py-4 bg-[#3C4F76] text-white rounded-lg 
                font-semibold hover:bg-[#2A3B5C] transition-all shadow-lg 
                inline-flex items-center gap-2 transform hover:translate-y-[-2px]">
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl
                border-8 border-white">
                <img 
                  src={potholesImage}
                  alt="Road maintenance" 
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#3C4F76] p-6 rounded-xl 
                shadow-xl text-white transform rotate-[-3deg]">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-[#E2E8F4]">Issues Reported</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#3C4F76] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[#E2E8F4]">© 2025 Pothole Reporter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
