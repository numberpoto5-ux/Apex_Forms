import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, ShoppingCart, Sparkles, Camera, Video, CheckCircle, 
  Loader2, ArrowRight, Store, Box, ChevronDown, ChevronUp, Info, 
  UploadCloud, X, LayoutDashboard, Zap, Search, Brain, Building2, 
  Users, Home, Key, Database, RefreshCw, BarChart3, Globe
} from 'lucide-react';

// --- Types ---

type Industry = 'fashion' | 'real_estate' | 'service' | '';

interface FormData {
  // Shared / Protocol
  name: string;
  email: string;
  industry: Industry;
  
  // Fashion Specific
  brand: string;
  aesthetic: string;
  businessModel: string;
  categories: string[];
  customCategory: string;
  systemChoice: string;
  features: string[];
  visualChoice: string;
  uploadedFiles: string[];

  // Real Estate Specific
  brokerageType: string;
  assetClasses: string[];
  leadEngineChoice: string;
  aiLeadQualifier: boolean;
  crmAutomation: boolean;

  // Local Business Specific
  localNiche: string;
  conversionMetric: string;
  missedCallAI: boolean;
  reviewResponderAI: boolean;
  
  // Ecosystem (Shared Logic)
  selectionMode: 'bundles' | 'custom' | 'expert';
  selectedTier: string;
  customServices: string[];
}

// --- Initial State ---

const initialState: FormData = {
  name: '',
  email: '',
  industry: '',
  brand: '',
  aesthetic: '',
  businessModel: '',
  categories: [],
  customCategory: '',
  systemChoice: '',
  features: [],
  visualChoice: '',
  uploadedFiles: [],
  brokerageType: '',
  assetClasses: [],
  leadEngineChoice: '',
  aiLeadQualifier: false,
  crmAutomation: false,
  localNiche: '',
  conversionMetric: '',
  missedCallAI: false,
  reviewResponderAI: false,
  selectionMode: 'bundles',
  selectedTier: '',
  customServices: ['Core Systems Setup'],
};

// --- Components ---

export default function App() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialState);

  // Sync step for industry flow
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const updateForm = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    setFormData((prev: any) => {
      const array = prev[field] as string[];
      if (array.includes(item)) {
        if (field === 'customServices' && item === 'Core Systems Setup') return prev;
        return { ...prev, [field]: array.filter((i) => i !== item) };
      }
      return { ...prev, [field]: [...array, item] };
    });
  };

  const submitToWebhook = async () => {
    setIsSubmitting(true);
    try {
      await fetch('https://echo010-n8n.hf.space/webhook/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          apex_version: "2.0-Elite"
        })
      });
      setStep(100); // Terminal success state
    } catch (error) {
      console.error('Submission failed', error);
      setStep(100);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Dynamic Flow Logic ---

  const renderCurrentStep = () => {
    // Step 1: Industry Selection (Global)
    if (step === 1) return <Step1_IndustryProtocol />;

    if (formData.industry === 'fashion') return renderFashionFlow();
    if (formData.industry === 'real_estate') return renderRealEstateFlow();
    if (formData.industry === 'service') return renderServiceFlow();
    
    return <div className="text-gray-900">Flow for this industry is in architect mode...</div>;
  };

  const renderServiceFlow = () => {
    switch(step) {
      case 2: return <LB_Step2_Sector />;
      case 3: return <LB_Step3_Objective />;
      case 4: return <LB_Step4_Architecture />;
      case 5: return <LB_Step5_AILocal />;
      case 6: return <EcosystemSelection />;
      case 7: return <FinalReview />;
      case 100: return <SuccessScreen />;
      default: return null;
    }
  };

  const renderRealEstateFlow = () => {
    switch(step) {
      case 2: return <RE_Step2_Identity />;
      case 3: return <RE_Step3_Portfolio />;
      case 4: return <RE_Step4_LeadEngine />;
      case 5: return <Step_ApexAIRing />;
      case 6: return <EcosystemSelection />;
      case 7: return <FinalReview />;
      case 100: return <SuccessScreen />;
      default: return null;
    }
  };

  const renderFashionFlow = () => {
    switch(step) {
      case 2: return <Fashion_Step2_BusinessModel />;
      case 3: return <Fashion_Step3_Architecture />;
      case 4: return <Fashion_Step4_CustomerJourney />;
      case 5: return <Fashion_Step5_Features />;
      case 6: return <Fashion_Step6_VisualStrategy />;
      case 7: return <EcosystemSelection />;
      case 8: return <FinalReview />;
      case 100: return <SuccessScreen />;
      default: return null;
    }
  };

  const getMaxSteps = () => {
    if (formData.industry === 'fashion') return 8;
    if (formData.industry === 'real_estate') return 7;
    if (formData.industry === 'service') return 7;
    return 8;
  };

  const progress = (step / getMaxSteps()) * 100;

  // --- Shared / Local Components ---

  const Step1_IndustryProtocol = () => (
    <StepContainer id="protocol">
      <Header 
        title="Initialize Your Digital Ecosystem." 
        subtitle="Welcome to Apex. While our engineers craft the fastest storefronts on the web, our true power lies in AI-driven business automation. Tell us your industry, and we will architect your blueprint." 
      />
      <div className="space-y-6 max-w-[600px] mx-auto w-full">
        <InputField label="Full Name" value={formData.name} onChange={(v: string) => updateForm('name', v)} placeholder="Lead Architect / Principal" />
        <InputField label="Best Email Address" type="email" value={formData.email} onChange={(v: string) => updateForm('email', v)} placeholder="contact@apex.com" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
          <ProtocolCard 
            title="E-Commerce" icon={ShoppingCart}
            selected={formData.industry === 'fashion'}
            onClick={() => updateForm('industry', 'fashion')}
          />
          <ProtocolCard 
            title="Real Estate" icon={Building2}
            selected={formData.industry === 'real_estate'}
            onClick={() => updateForm('industry', 'real_estate')}
          />
          <ProtocolCard 
            title="Services" icon={Zap}
            selected={formData.industry === 'service'}
            onClick={() => updateForm('industry', 'service')}
          />
        </div>
      </div>
      <NavigationButtons nextStep={nextStep} valid={formData.name !== '' && formData.email !== '' && formData.industry !== ''} hideBack />
    </StepContainer>
  );

  // --- Local Business Flow Steps ---

  const LB_Step2_Sector = () => (
    <StepContainer id="lb-sector">
      <Header title="Identify Your Sector." subtitle="Different industries require different conversion triggers. What is your primary business model?" />
      <div className="max-w-[700px] mx-auto w-full mb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {["Automotive", "Food & Beverage", "Home Services", "Health & Wellness", "Professional Services"].map(s => (
            <button
              key={s}
              onClick={() => { updateForm('localNiche', s); nextStep(); }}
              className={`px-4 py-4 rounded-2xl text-[12px] font-black uppercase tracking-tighter border-2 transition-all active:scale-95
                ${formData.localNiche === s ? 'bg-black border-black text-white shadow-xl' : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative group">
          <label className="block text-[10px] font-black tracking-widest text-gray-300 uppercase mb-3 ml-1 transition-colors group-focus-within:text-black italic">Other / Not Listed</label>
          <input 
            type="text" value={["Automotive", "Food & Beverage", "Home Services", "Health & Wellness", "Professional Services"].includes(formData.localNiche) ? '' : formData.localNiche} 
            onChange={e => updateForm('localNiche', e.target.value)}
            className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-black transition-all text-lg placeholder:text-gray-200 shadow-sm"
            placeholder="Specifiy your niche..."
          />
        </div>
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={formData.localNiche !== ''} />
    </StepContainer>
  );

  const LB_Step3_Objective = () => (
    <StepContainer id="lb-objective">
      <Header title="Define Your Primary Objective." subtitle="If a hundred people visit your new digital storefront today, what is the #1 action they must take?" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CardSelection 
          icon={RefreshCw} title="Direct Phone Calls"
          description="Optimized to make viewers call my business instantly from their mobile devices."
          pros="Maximizes immediate inquiries."
          selected={formData.conversionMetric === 'call'}
          onClick={() => { updateForm('conversionMetric', 'call'); nextStep(); }}
        />
        <CardSelection 
          icon={Globe} title="Appointments"
          description="I need them to fill out a form or select a time slot on my calendar."
          pros="Perfect for service booking."
          selected={formData.conversionMetric === 'book'}
          onClick={() => { updateForm('conversionMetric', 'book'); nextStep(); }}
        />
        <CardSelection 
          icon={Search} title="Walk-Ins"
          description="I need them to look at my menu and drive directly to my physical location."
          pros="Geo-targeted local traffic."
          selected={formData.conversionMetric === 'walk'}
          onClick={() => { updateForm('conversionMetric', 'walk'); nextStep(); }}
        />
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={formData.conversionMetric !== ''} />
    </StepContainer>
  );

  const LB_Step4_Architecture = () => (
    <StepContainer id="lb-arch">
      <Header title="Web Architecture Decision" subtitle="Most local businesses use outdated software. Apex build custom, lightweight funnels that outrank competitors." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-[800px] mx-auto w-full">
        <CardSelection 
          icon={Zap} title="Apex Local Dominator"
          badge="Highly Recommended"
          description="Blazing-fast static site. Zero bloat, instant loading, favored by Google's SEO algorithm."
          pros="Dominates local search."
          selected={formData.leadEngineChoice === 'dominator'}
          onClick={() => { updateForm('leadEngineChoice', 'dominator'); nextStep(); }}
        />
        <CardSelection 
          icon={Globe} title="Traditional Multi-Page"
          description="A heavier website with multiple informational pages (About, Team, History)."
          pros="Informative but slower."
          selected={formData.leadEngineChoice === 'standard'}
          onClick={() => { updateForm('leadEngineChoice', 'standard'); nextStep(); }}
        />
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={formData.leadEngineChoice !== ''} />
    </StepContainer>
  );

  const LB_Step5_AILocal = () => (
    <StepContainer id="lb-ai">
      <Header title="Activate Apex AI Local?" subtitle="The website brings traffic; AI ensures you never lose the lead. Never miss a client again." />
      <div className="max-w-[700px] mx-auto w-full mb-8">
        <div className="p-10 rounded-[50px] bg-white border border-gray-100 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <ToggleOption 
              title="AI Missed-Call Text Back"
              desc="Apex AI instantly sends an SMS if you miss a call: 'Hi, we are on the other line! How can we help?'"
              selected={formData.missedCallAI}
              onToggle={() => updateForm('missedCallAI', !formData.missedCallAI)}
            />
            <ToggleOption 
              title="AI Google Review Responder"
              desc="Automatically reply to Google Maps reviews to skyrocket your local ranking on autopilot."
              selected={formData.reviewResponderAI}
              onToggle={() => updateForm('reviewResponderAI', !formData.reviewResponderAI)}
            />
          </div>
        </div>
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={true} />
    </StepContainer>
  );

  // --- Real Estate Flow Steps ---

  const RE_Step2_Identity = () => (
    <StepContainer id="re-identity">
      <Header title="Real Estate Sector Identified." subtitle="Let’s map out your market position. Are you operating as an independent agent or building a brokerage?" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[700px] mx-auto w-full mb-6">
        <CardSelection 
          icon={Users} title="Independent Agent"
          description="I am building my personal brand and generating my own leads."
          selected={formData.brokerageType === 'solo'}
          onClick={() => { updateForm('brokerageType', 'solo'); nextStep(); }}
        />
        <CardSelection 
          icon={Building2} title="Agency / Brokerage"
          description="I manage a team of agents and need a centralized distribution system."
          selected={formData.brokerageType === 'brokerage'}
          onClick={() => { updateForm('brokerageType', 'brokerage'); nextStep(); }}
        />
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={formData.brokerageType !== ''} />
    </StepContainer>
  );

  const RE_Step3_Portfolio = () => (
    <StepContainer id="re-portfolio">
      <Header title="Primary Asset Class?" subtitle="This helps our AI understand the demographic for target lead generation." />
      <div className="max-w-[700px] mx-auto w-full mb-10">
        <div className="flex flex-wrap justify-center gap-3">
          {["Luxury Residential", "Standard Residential", "Commercial RE", "Investment", "Prop Management"].map(asset => (
            <button
              key={asset}
              onClick={() => toggleArrayItem('assetClasses', asset)}
              className={`px-6 py-4 rounded-2xl text-[13px] font-bold border transition-all duration-200 active:scale-95
                ${formData.assetClasses.includes(asset) ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}
            >
              {asset}
            </button>
          ))}
        </div>
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={formData.assetClasses.length > 0} />
    </StepContainer>
  );

  const RE_Step4_LeadEngine = () => (
    <StepContainer id="re-engine">
      <Header title="Lead Generation Architecture" subtitle="A website should not be a brochure; it must be a conversion engine." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CardSelection 
          icon={Zap} title="Vercel Agent Funnel"
          badge="High Performance"
          description="A lightning-fast, custom-coded page designed purely to capture leads."
          pros="Max conversion, zero clutter."
          selected={formData.leadEngineChoice === 'vercel'}
          onClick={() => { updateForm('leadEngineChoice', 'vercel'); nextStep(); }}
        />
        <CardSelection 
          icon={Search} title="Full IDX Portal"
          description="A complex site allowing users to search every property on the market."
          pros="Requires heavy API integration."
          selected={formData.leadEngineChoice === 'mls'}
          onClick={() => { updateForm('leadEngineChoice', 'mls'); nextStep(); }}
        />
        <CardSelection 
          icon={Brain} title="Apex Strategic Choice"
          description="Analyze my market focus and deploy the most profitable architecture."
          selected={formData.leadEngineChoice === 'expert'}
          onClick={() => { updateForm('leadEngineChoice', 'expert'); nextStep(); }}
          isExpert
        />
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={formData.leadEngineChoice !== ''} />
    </StepContainer>
  );

  const Step_ApexAIRing = () => (
    <StepContainer id="apex-ring">
      <Header title="Integrate The Apex AI Engine?" subtitle="The Apex System (formerly Zulari) is our flagship 24/7 Inside Sales Agent (ISA) product." />
      <div className="max-w-[700px] mx-auto w-full mb-8">
        <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
             <RefreshCw className="w-8 h-8 text-gray-100 animate-spin-slow opacity-50" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tight text-gray-900 italic">Advanced ISA Engine</h3>
            <div className="space-y-4">
              <ToggleOption 
                title="Apex AI Real-Time Qualifier"
                desc="Instantly engage leads via SMS, ask qualifying questions, and book viewings."
                selected={formData.aiLeadQualifier}
                onToggle={() => updateForm('aiLeadQualifier', !formData.aiLeadQualifier)}
              />
              <ToggleOption 
                title="Automated CRM Pipeline"
                desc="Native sync to Follow Up Boss, GHL, or Hubspot via proprietary n8n nodes."
                selected={formData.crmAutomation}
                onToggle={() => updateForm('crmAutomation', !formData.crmAutomation)}
              />
            </div>
          </div>
        </div>
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={true} />
    </StepContainer>
  );

  const EcosystemSelection = () => (
    <StepContainer id="ecosystem">
      <Header title="Finalize Your Apex Blueprint" subtitle="Choose a pre-built system, customize your stack, or utilize our concierge engineers." />
      
      <div className="flex justify-center mb-8 px-2">
        <div className="flex bg-gray-100 p-1.5 rounded-full w-full max-w-[600px] overflow-x-auto no-scrollbar scroll-smooth">
          {(['bundles', 'custom', 'expert'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => updateForm('selectionMode', mode)}
              className={`flex-1 py-3 px-4 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95
                ${formData.selectionMode === mode 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'}`}
            >
              {mode === 'bundles' ? 'Pre-Built' : mode === 'custom' ? 'Custom' : 'Concierge'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {formData.selectionMode === 'bundles' && (
          <motion.div key="bund" initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <TierCard 
              title={formData.industry === 'real_estate' ? "Digital Agent" : formData.industry === 'service' ? "Digital Footprint" : "Foundation"}
              goal={formData.industry === 'service' ? "A rapid, high-speed modern presence." : "Establish premium presence instantly."}
              features={formData.industry === 'real_estate' ? ["Vercel Landing Page", "Custom Domain", "Basic Lead Form"] : formData.industry === 'service' ? ["Vercel Landing Page", "Tap-to-Call Buttons", "Mobile Optimized", "Contact Form"] : ["Mobile Web Store", "WhatsApp Link", "Domain Setup"]}
              selected={formData.selectedTier === 't1'}
              onClick={() => updateForm('selectedTier', 't1')}
            />
            <TierCard 
              title={formData.industry === 'real_estate' ? "Conversion Engine" : formData.industry === 'service' ? "Local Authority" : "Brand Launchpad"}
              goal={formData.industry === 'service' ? "Rank higher on Google Maps and capture traffic." : "Capture and engage leads instantly."}
              features={formData.industry === 'real_estate' ? ["Tier 1 + SMS Welcome", "Pixel Tracking", "Bio-Link Setup"] : formData.industry === 'service' ? ["Tier 1 + Local SEO", "Menu/Service Integration", "High-Converting Form"] : ["Tier 1 + Social Sync", "Email Welcome Flow", "Brand Assets"]}
              selected={formData.selectedTier === 't2'}
              onClick={() => updateForm('selectedTier', 't2')}
            />
            <TierCard 
              title={formData.industry === 'service' ? "Apex Business Machine" : "Apex Flagship"}
              badge="Elite"
              recommended
              goal={formData.industry === 'service' ? "Never lose a local lead again." : "A fully autonomous qualification machine."}
              features={formData.industry === 'real_estate' ? ["Tier 2 + AI Engine", "24/7 Text ISA", "Auto-Viewings"] : formData.industry === 'service' ? ["Tier 2 + AI Missed-Call AI", "AI Website Chatbot", "Automated Load Alerts"] : ["Tier 2 + SEO Engine", "Daily Blog Posts", "AI Support"]}
              selected={formData.selectedTier === 't3'}
              onClick={() => updateForm('selectedTier', 't3')}
            />
          </motion.div>
        )}

        {formData.selectionMode === 'custom' && (
          <motion.div key="cust" initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y: 0 }} className="max-w-[800px] mx-auto w-full mb-10 grid grid-cols-1 md:grid-cols-2 gap-3">
            {(formData.industry === 'real_estate' 
              ? ['Web Architecture', 'AI Lead Agent', 'CRM Automation', 'SEO Content', 'Video Integration'] 
              : formData.industry === 'service'
                ? ['Vercel Web Build', 'Menu/Catalog Digitization', 'Missed-Call AI', 'AI Review Management']
                : ['Digital Storefront', 'AI Content', 'Social Engine', 'Daily SEO Blog', 'AI Support']).map(svc => (
              <CustomServiceToggle 
                key={svc} title={svc} selected={formData.customServices.includes(svc)}
                onToggle={() => toggleArrayItem('customServices', svc)}
              />
            ))}
          </motion.div>
        )}

        {formData.selectionMode === 'expert' && (
          <motion.div key="exp" initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y: 0 }} className="max-w-[700px] mx-auto w-full text-center py-16 px-8 border-2 border-dashed border-gray-200 rounded-[40px] bg-white">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-black">The Apex Concierge</h3>
            <p className="text-gray-500 text-lg leading-relaxed mb-10 italic">"Let our Lead Engineers design a custom automation and web architecture specifically for your {formData.industry === 'real_estate' ? 'Brokerage' : 'Business'}."</p>
            <button onClick={nextStep} className="bg-black text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">Launch Protocol</button>
          </motion.div>
        )}
      </AnimatePresence>
      {formData.selectionMode !== 'expert' && <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={formData.selectedTier !== '' || formData.customServices.length > 0} />}
    </StepContainer>
  );

  const FinalReview = () => (
    <StepContainer id="final">
      <div className="flex flex-col items-center text-center justify-center max-w-[600px] mx-auto w-full flex-grow py-10">
        <h2 className="text-[42px] font-black tracking-tighter uppercase mb-6 text-black">Deploy Blueprint</h2>
        <div className="bg-white border-2 border-gray-100 rounded-[40px] p-10 mb-12 text-left w-full shadow-2xl">
          <p className="text-[17px] text-gray-600 leading-relaxed italic">
            "By deploying, you initiate the Apex synchronization protocols. Our engineers will verify your architecture within 12 hours. Welcome to the elite tier of business automation."
          </p>
        </div>
        <div className="flex gap-6 w-full sm:w-auto">
          <button onClick={prevStep} className="flex-1 sm:flex-none px-8 py-5 text-gray-400 text-xs font-black uppercase tracking-widest hover:text-black">Review</button>
          <button 
            onClick={submitToWebhook}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none px-12 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.25em] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-center"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-3"/> : 'Deploy'}
          </button>
        </div>
      </div>
    </StepContainer>
  );

  // --- Fashion Flow Snippets ---
  const Fashion_Step2_BusinessModel = () => (
    <StepContainer id="f-biz">
      <Header title="Operating Model" subtitle="Are you Retail or Wholesale?" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[700px] mx-auto mb-10">
        <CardSelection title="Retail / B2C" description="Selling directly to individual consumers." selected={formData.businessModel === 'retail'} onClick={() => {updateForm('businessModel', 'retail'); nextStep()}} icon={Users} />
        <CardSelection title="Bulk / Wholesale" description="Focusing on B2B volume transactions." selected={formData.businessModel === 'wholesale'} onClick={() => {updateForm('businessModel', 'wholesale'); nextStep()}} icon={Box} />
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={formData.businessModel !== ''} />
    </StepContainer>
  );

  const Fashion_Step3_Architecture = () => (
    <StepContainer id="f-arch">
      <Header title="Digital Shelves" subtitle="Navigation menu architecture." />
      <div className="max-w-[700px] mx-auto flex flex-wrap justify-center gap-3 mb-10 px-4">
        {["Women's Dresses", "Women's Tops", "Men's Fashion", "Accessories", "Custom Order"].map(c => (
           <button key={c} onClick={() => toggleArrayItem('categories', c)} className={`px-6 py-4 rounded-full text-sm font-bold border transition-all ${formData.categories.includes(c) ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-500'}`}>{c}</button>
        ))}
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={formData.categories.length > 0} />
    </StepContainer>
  );

  const Fashion_Step4_CustomerJourney = () => (
    <StepContainer id="f-journey">
      <Header title="Tech Stack" subtitle="Select your checkout model." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <CardSelection icon={MessageCircle} title="WhatsApp Funnel" description="Zero fees, lightning speed." selected={formData.systemChoice === 'wa'} onClick={() => {updateForm('systemChoice','wa'); nextStep()}} />
        <CardSelection icon={ShoppingCart} title="Integrated Cart" description="Automated payments & shipping." selected={formData.systemChoice === 'cart'} onClick={() => {updateForm('systemChoice', 'cart'); nextStep()}} />
        <CardSelection icon={Sparkles} title="Expert Blueprint" description="Let Apex Architects Decide." selected={formData.systemChoice === 'exp'} onClick={() => {updateForm('systemChoice', 'exp'); nextStep()}} isExpert />
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={formData.systemChoice !== ''} />
    </StepContainer>
  );

  const Fashion_Step5_Features = () => (
    <StepContainer id="f-features">
      <Header title="Premium Systems" subtitle="Bespoke operational features." />
      <div className="max-w-[700px] mx-auto space-y-4 mb-10 px-4">
        <ToggleOption title="Advanced Size Filtering" selected={formData.features.includes('size')} onToggle={() => toggleArrayItem('features', 'size')} />
        <ToggleOption title="Custom Measurement Forms" selected={formData.features.includes('meas')} onToggle={() => toggleArrayItem('features', 'meas')} />
        <ToggleOption title="AI Fashion Stylist" selected={formData.features.includes('ai')} onToggle={() => toggleArrayItem('features', 'ai')} />
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={true} />
    </StepContainer>
  );

  const Fashion_Step6_VisualStrategy = () => (
    <StepContainer id="f-vis">
      <Header title="Visual Pipeline" subtitle="Luxury rendering preferences." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <CardSelection icon={Camera} title="High-Res Stills" selected={formData.visualChoice === 'img'} onClick={() => updateForm('visualChoice', 'img')} />
        <CardSelection icon={Video} title="Cinematic Teasers" selected={formData.visualChoice === 'vid'} onClick={() => updateForm('visualChoice', 'vid')} />
        <CardSelection icon={Sparkles} title="Mixed Media" selected={formData.visualChoice === 'exp'} onClick={() => updateForm('visualChoice', 'exp')} isExpert />
      </div>
      <NavigationButtons nextStep={nextStep} prevStep={prevStep} valid={formData.visualChoice !== ''} />
    </StepContainer>
  );

  const SuccessScreen = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center justify-center py-24 px-6">
      <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-10 shadow-2xl">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-[48px] font-black tracking-tighter uppercase mb-4 text-black leading-tight">Systems Online.</h2>
      <p className="text-[20px] text-gray-400 max-w-[550px] font-medium">Protocol synchronization in progress. Our lead engineers are reviewing your {formData.industry === 'real_estate' ? 'Real Estate' : 'Fashion'} blueprint.</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans selection:bg-black/10 flex justify-center items-center py-0 sm:py-12">
      <div className="w-full max-w-[1100px] h-full min-h-screen sm:min-h-0 sm:h-auto bg-white sm:rounded-[60px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-6 md:p-12 lg:p-20 flex flex-col relative overflow-hidden">
        {step < 50 && (
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gray-50">
            <motion.div 
              className="h-full bg-black"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: "circOut" }}
            />
          </div>
        )}
        <header className="mb-16 flex justify-between items-center px-4">
          <div className="font-black text-3xl tracking-[-0.08em] uppercase flex items-center gap-2 italic">
            APEX<span className="bg-black text-white px-2.5 py-0.5 rounded-lg text-[10px] not-italic font-black tracking-widest ml-1 shadow-lg">v2.1</span>
          </div>
          {step < 10 && (
             <div className="hidden sm:block text-[11px] font-black tracking-[0.4em] text-gray-300 uppercase">Architecture Proto-0{step}</div>
          )}
        </header>

        <div className="flex-grow flex flex-col relative w-full pb-10">
          <AnimatePresence mode="wait">
             {renderCurrentStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Internal UI Primitives ---

function StepContainer({ children, id }: { children: React.ReactNode, id: string }) {
  return (
    <motion.div key={id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full h-full flex flex-col">
      {children}
    </motion.div>
  )
}

function Header({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="text-center mb-12 md:mb-20 px-4">
      <h2 className="text-[42px] md:text-[64px] font-black tracking-[-0.08em] leading-[0.9] uppercase mb-8 text-black">{title}</h2>
      <p className="text-[17px] md:text-[20px] text-gray-400 max-w-[800px] mx-auto leading-relaxed font-medium">{subtitle}</p>
    </div>
  )
}

function InputField({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="w-full relative group">
      <label className="block text-[11px] font-black tracking-[0.2em] text-gray-300 uppercase mb-4 ml-1 transition-colors group-focus-within:text-black">{label}</label>
      <input 
        type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-white border-2 border-gray-100 rounded-2xl px-8 py-6 focus:outline-none focus:border-black transition-all text-xl placeholder:text-gray-200 shadow-sm"
        placeholder={placeholder}
      />
    </div>
  )
}

function ProtocolCard({ title, icon: Icon, selected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 md:p-8 rounded-[32px] border-2 cursor-pointer transition-all flex flex-col items-center gap-5 text-center active:scale-95
        ${selected ? 'bg-black border-black text-white shadow-2xl' : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200'}`}
    >
      <Icon className={`w-10 h-10 ${selected ? 'text-white' : 'text-gray-200'}`} strokeWidth={1.5} />
      <span className="text-[11px] font-black uppercase tracking-widest leading-none">{title}</span>
    </div>
  )
}

function CardSelection({ icon: Icon, title, badge, description, pros, selected, onClick, isExpert }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-8 md:p-10 rounded-[44px] border-2 transition-all cursor-pointer flex flex-col min-h-[320px] relative overflow-hidden group active:scale-[0.98]
        ${selected ? 'bg-black text-white border-black shadow-2xl' : 'bg-white text-gray-500 border-gray-50 hover:border-gray-200'}
      `}
    >
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-10 ring-1 transition-all ${selected ? 'bg-white/10 text-white ring-white/20' : 'bg-gray-50 ring-gray-100 text-gray-300'}`}>
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter leading-none">{title}</h3>
      {badge && <div className="text-[10px] font-black bg-gray-100 text-gray-900 px-3 py-1 rounded-full inline-block w-fit mb-4 tracking-tighter uppercase">{badge}</div>}
      <p className={`text-[15px] leading-relaxed mb-8 font-medium ${selected ? 'text-gray-400' : 'text-gray-400'}`}>{description}</p>
      {pros && <div className={`text-[11px] font-black mt-auto pt-5 border-t italic tracking-wide ${selected ? 'border-white/10 text-white' : 'border-gray-50 text-gray-300'}`}>– {pros}</div>}
      {isExpert && <Brain className="absolute -bottom-10 -right-10 w-40 h-40 opacity-[0.05] pointer-events-none" />}
    </div>
  )
}

function ToggleOption({ title, desc, selected, onToggle }: any) {
  return (
    <div onClick={onToggle} className={`flex items-start gap-6 p-8 rounded-[36px] border-2 cursor-pointer transition-all active:scale-[0.99] ${selected ? 'border-black bg-black text-white shadow-xl' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}>
       <div className={`mt-1 h-7 w-12 shrink-0 rounded-full flex items-center p-1 transition-all ${selected ? 'bg-white' : 'bg-gray-200'}`}>
          <div className={`h-5 w-5 rounded-full transition-all transform ${selected ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white shadow-sm'}`} />
       </div>
       <div>
         <h4 className="text-base font-black uppercase tracking-tight mb-2 leading-none">{title}</h4>
         {desc && <p className={`text-sm leading-relaxed font-medium ${selected ? 'text-gray-400' : 'text-gray-400'}`}>{desc}</p>}
       </div>
    </div>
  )
}

function CustomServiceToggle({ title, selected, onToggle }: any) {
  return (
    <div onClick={onToggle} className={`p-8 rounded-[30px] border-2 cursor-pointer transition-all flex justify-between items-center active:scale-[0.98] ${selected ? 'border-black bg-black text-white shadow-lg' : 'border-gray-50 bg-white hover:border-gray-200'}`}>
       <span className="text-[13px] font-black uppercase tracking-widest">{title}</span>
       <div className={`h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all ${selected ? 'border-white bg-white text-black' : 'border-gray-200 text-transparent'}`}>
          <CheckCircle className="w-5 h-5" strokeWidth={3} />
       </div>
    </div>
  )
}

function TierCard({ title, badge, goal, features, selected, onClick, recommended }: any) {
  return (
    <div onClick={onClick} className={`p-10 rounded-[50px] border-2 cursor-pointer flex flex-col transition-all relative active:scale-[0.98] ${selected ? 'bg-black text-white border-black shadow-[0_40px_80px_-10px_rgba(0,0,0,0.3)]' : 'bg-white text-gray-900 border-gray-50 shadow-sm hover:border-gray-200'}`}>
      {badge && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white border border-white/20 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em]">
        {badge}
      </div>}
      <h3 className="text-2xl font-black uppercase mb-6 text-center tracking-tighter leading-none italic">{title}</h3>
      <p className={`text-[12px] font-bold italic mb-10 text-center pb-8 border-b leading-relaxed ${selected ? 'border-white/10 text-gray-400' : 'border-gray-50 text-gray-400'}`}>{goal}</p>
      <ul className="space-y-6 mb-10 flex-grow">
        {features.map((f: string) => (
          <li key={f} className="flex items-start gap-4 text-[14px] leading-snug font-medium">
            <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${selected ? 'text-white' : 'text-black'}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button className={`py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] transition-all ${selected ? 'bg-white text-black' : 'bg-gray-100 text-gray-400 hover:text-black hover:bg-gray-200'}`}>
        {selected ? 'Active System' : 'Allocate'}
      </button>
    </div>
  )
}

function NavigationButtons({ nextStep, prevStep, valid, hideBack = false }: any) {
  return (
    <div className="mt-auto pt-12 flex flex-col sm:flex-row justify-between items-center w-full px-4 gap-6">
       {!hideBack ? (
         <button onClick={prevStep} className="order-2 sm:order-1 text-[12px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-black transition-colors py-2 px-6">Previous Architecture</button>
       ) : <div className="hidden sm:block order-1" />}
       <button 
         onClick={nextStep} disabled={!valid}
         className="order-1 sm:order-2 group w-full sm:w-auto flex items-center justify-center gap-5 px-16 py-6 bg-black text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-10 cursor-pointer"
       >
         {valid ? 'Synchronize' : 'Awaiting Input'}
         <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
       </button>
    </div>
  )
}
