import React from 'react';
import { Building2, MapPin, Users, Target, Mail, Phone, ExternalLink, MessageCircle } from 'lucide-react';
import { WebsiteAnalysisResponse } from '../types/api';

interface AnalysisResultsProps {
  result: WebsiteAnalysisResponse;
  onStartConversation: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onStartConversation }) => {
  const { company_info, extracted_answers, analysis_timestamp } = result;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
        <div className="text-sm text-gray-500">
          {new Date(analysis_timestamp).toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Company Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Company Overview</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Industry:</span>
                <p className="text-gray-900">{company_info.industry}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Company Size:</span>
                <p className="text-gray-900">{company_info.company_size}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Location:</span>
                <p className="text-gray-900">{company_info.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Target Audience:</span>
                <p className="text-gray-900">{company_info.target_audience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products & USP */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Products & Value</h3>
          
          <div>
            <span className="font-medium text-gray-700">Core Products/Services:</span>
            <ul className="mt-2 space-y-1">
              {company_info.core_products_services.map((product, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-900">{product}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-medium text-gray-700">Unique Selling Proposition:</span>
            <p className="mt-2 text-gray-900 bg-blue-50 p-3 rounded-lg">
              {company_info.unique_selling_proposition}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      {(company_info.contact_info.email || company_info.contact_info.phone || company_info.contact_info.social_media) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Contact Information</h3>
          <div className="flex flex-wrap gap-4">
            {company_info.contact_info.email && (
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-gray-900">{company_info.contact_info.email}</span>
              </div>
            )}
            {company_info.contact_info.phone && (
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-900">{company_info.contact_info.phone}</span>
              </div>
            )}
            {company_info.contact_info.social_media?.linkedin && (
              <a
                href={company_info.contact_info.social_media.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {company_info.contact_info.social_media?.twitter && (
              <a
                href={company_info.contact_info.social_media.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-sky-50 text-sky-700 px-3 py-2 rounded-lg hover:bg-sky-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Twitter</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Custom Questions */}
      {extracted_answers.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Custom Questions</h3>
          <div className="space-y-4">
            {extracted_answers.map((qa, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Q: {qa.question}</h4>
                <p className="text-gray-700">A: {qa.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Conversation Button */}
      <div className="flex justify-center">
        <button
          onClick={onStartConversation}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Start Conversation</span>
        </button>
      </div>
    </div>
  );
};