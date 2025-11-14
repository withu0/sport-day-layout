import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templates, type PhotoTemplate } from '../data/templates';

function TemplateList() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleUseTemplate = (template: PhotoTemplate) => {
    setSelectedTemplate(template.id);
    // Navigate to photo editor with template ID
    navigate(`/editor/${template.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-4">
            <img 
              src="/Heirloominary_logo.avif" 
              alt="Heirloominary Logo" 
              className="header-logo"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-text-primary text-center mb-8">
          Photo Templates
        </h1>

        {/* Instructions */}
        <div className="text-center mb-8 max-w-4xl mx-auto">
          <p className="text-text-secondary mb-4">
            Print photos directly onto your Heirloominary records. Choose the template that works best with your photo count and orientation. We'll resize your photos, so there's no need to resize them in advance.
          </p>
          <p className="text-text-secondary">
            Once you select the template, a new tab will open where you can upload your photos and then print directly or save the layout as a PDF to print later.
          </p>
        </div>

        {/* TIP Banner */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
          <p className="text-text-primary text-sm">
            <strong>TIP:</strong> To print your story too, use our{' '}
            <a href="#" className="underline text-primary hover:text-primary-dark">
              unlined Record form
            </a>{' '}
            and set your word-processing margins to 0.75" on all sides. Great for longer stories you don't want to handwrite.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="bg-background flex justify-center items-center flex-col">
              {/* Template Preview */}
              <div className="template-preview-small mb-4">
                <div className="relative w-full template-preview-container">
                  <img
                    src={template.imagePath}
                    alt={`${template.title} preview`}
                    className="w-full h-auto rounded"
                    style={{ aspectRatio: '8.5/11' }}
                  />
                </div>
              </div>

              {/* Template Info */}
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {template.title}
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                {template.description}
              </p>

              {/* Use Template Button */}
              <button
                onClick={() => handleUseTemplate(template)}
                className={`py-2 px-4 rounded-sm text-[12px] transition-all duration-200 border border-border ${
                  selectedTemplate === template.id
                    ? 'bg-transparent text-text-primary border-text-primary'
                    : ''
                }`}
                disabled={selectedTemplate === template.id}
              >
                {selectedTemplate === template.id ? 'Opening...' : 'USE TEMPLATE'}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background-secondary border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-2">
            <p className="text-text-secondary text-sm">
              © 2025 Heirloominary. All rights reserved.
            </p>
            <div>
              <a 
                href="/demo" 
                className="text-primary hover:text-primary-dark text-sm underline"
              >
                View Smart Image Upload Demo
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TemplateList;
