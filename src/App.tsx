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

interface FlowCtx {
  formData: FormData;
  updateForm: (field: keyof FormData, value: any) => void;
  toggleArrayItem: (field: keyof FormData, item: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitToWebhook: () => void;
  isSubmitting: boolean;
}

// --- Main App Component ---

export default function App() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialState);

  // Sync step for industry flow
  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => prev + 1);
  };
  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => prev - 1);
  };

  const updateForm = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    setFormData((prev: any) => {
      const array = prev[field] as string[];
      if (array.includes(item)) {
        if (field === 'customServices' && item === 'Core Systems Setup') return prev;
        return { ...prev, [field]: array.filter((i: string) => i !== item) };
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const ctx: FlowCtx = { formData, updateForm, toggleArrayItem, nextStep, prevStep, submitToWebhook, isSubmitting };

  const getMaxSteps = () => {
    if (formData.industry === 'fashion') return 8;
    if (formData.industry === 'real_estate') return 7;
    if (formData.industry === 'service') return 7;
    return 8;
  };

  const progress = (step / getMaxSteps()) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans selection:bg-black/10 flex justify-center items-center py-0 sm:py-12 md:py-16">
      <div className="w-full max-w-[1100px] min-h-screen sm:min-h-[85vh] bg-white sm:rounded-[48px] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.06)] border sm:border-black/[0.04] p-6 pt-10 md:p-12 lg:p-[72px] flex flex-col relative overflow-hidden">
        
        {/* Progress Bar (Sticky to top) */}
        {step < 50 && (
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-black/[0.03]">
            <motion.div 
              className="h-full bg-[#111111]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
        )}

        <header className="mb-12 md:mb-16 flex justify-between items-center z-10 relative">
          <div className="font-black text-2xl tracking-[-0.05em] uppercase flex items-center gap-2">
            APEX<span className="bg-[#111111] text-white px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-black tracking-widest shadow-lg">v2.1</span>
          </div>
          {step < 10 && (
             <div className="hidden sm:block text-[11px] font-bold tracking-[0.3em] text-black/[0.3] uppercase transition-all">
               Architecture <span className="text-[#111111]">Proto-0{step}</span>
             </div>
          )}
        </header>

        <div className="flex-grow flex flex-col relative w-full pb-8 md:pb-10 h-full">
          {/* Use wait + exitBeforeEnter logic with stable component execution to avoid lag */}
          <AnimatePresence mode="wait" initial={false}>
             {step === 1 && <Step1_IndustryProtocol key="s1" ctx={ctx} />}
             
             {formData.industry === 'service' && step === 2 && <LB_Step2_Sector key="lb2" ctx={ctx} />}
             {formData.industry === 'service' && step === 3 && <LB_Step3_Objective key="lb3" ctx={ctx} />}
             {formData.industry === 'service' && step === 4 && <LB_Step4_Architecture key="lb4" ctx={ctx} />}
             {formData.industry === 'service' && step === 5 && <LB_Step5_AILocal key="lb5" ctx={ctx} />}

             {formData.industry === 'real_estate' && step === 2 && <RE_Step2_Identity key="re2" ctx={ctx} />}
             {formData.industry === 'real_estate' && step === 3 && <RE_Step3_Portfolio key="re3" ctx={ctx} />}
             {formData.industry === 'real_estate' && step === 4 && <RE_Step4_LeadEngine key="re4" ctx={ctx} />}
             {formData.industry === 'real_estate' && step === 5 && <Step_ApexAIRing key="re5" ctx={ctx} />}

             {formData.industry === 'fashion' && step === 2 && <Fashion_Step2_BusinessModel key="f2" ctx={ctx} />}
             {formData.industry === 'fashion' && step === 3 && <Fashion_Step3_Architecture key="f3" ctx={ctx} />}
             {formData.industry === 'fashion' && step === 4 && <Fashion_Step4_CustomerJourney key="f4" ctx={ctx} />}
             {formData.industry === 'fashion' && step === 5 && <Fashion_Step5_Features key="f5" ctx={ctx} />}
             {formData.industry === 'fashion' && step === 6 && <Fashion_Step6_VisualStrategy key="f6" ctx={ctx} />}

             {((formData.industry === 'service' && step === 6) || (formData.industry === 'real_estate' && step === 6) || (formData.industry === 'fashion' && step === 7)) && <EcosystemSelection key="sys" ctx={ctx} />}
             {((formData.industry === 'service' && step === 7) || (formData.industry === 'real_estate' && step === 7) || (formData.industry === 'fashion' && step === 8)) && <FinalReview key="rev" ctx={ctx} />}

             {step === 100 && <SuccessScreen key="succ" ctx={ctx} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Step Components (Extracted outside App to prevent full re-renders and lag) ---

const Step1_IndustryProtocol: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="protocol">
      <Header 
        title="Initialize Ecosystem" 
        subtitle="Welcome to Apex. While others build simple websites, our true power lies in AI-driven business automation. Select your sector." 
      />
      <div className="space-y-6 max-w-[600px] mx-auto w-full">
        <InputField label="Full Name" value={ctx.formData.name} onChange={v => ctx.updateForm('name', v)} placeholder="Lead Architect / Principal" />
        <InputField label="Best Email Address" type="email" value={ctx.formData.email} onChange={v => ctx.updateForm('email', v)} placeholder="contact@apex.com" />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <ProtocolCard 
            title="E-Commerce" icon={ShoppingCart}
            selected={ctx.formData.industry === 'fashion'}
            onClick={() => ctx.updateForm('industry', 'fashion')}
          />
          <ProtocolCard 
            title="Real Estate" icon={Building2}
            selected={ctx.formData.industry === 'real_estate'}
            onClick={() => ctx.updateForm('industry', 'real_estate')}
          />
          <ProtocolCard 
            title="Local Business" icon={Zap}
            selected={ctx.formData.industry === 'service'}
            onClick={() => ctx.updateForm('industry', 'service')}
          />
        </div>
      </div>
      <NavigationButtons nextStep={ctx.nextStep} valid={ctx.formData.name !== '' && ctx.formData.email !== '' && ctx.formData.industry !== ''} hideBack />
    </StepContainer>
  );
}

// --- Local Business Flow Steps ---

const LB_Step2_Sector: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="lb-sector">
      <Header title="Identify Your Sector" subtitle="Different industries require different conversion triggers. What is your primary business model?" />
      <div className="max-w-[700px] mx-auto w-full mb-8">
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {["Automotive", "Food & Beverage", "Home Services", "Health & Wellness", "Professional Services"].map(s => (
            <button
              key={s}
              onClick={() => { ctx.updateForm('localNiche', s); ctx.nextStep(); }}
              className={`px-6 py-4 rounded-full text-[13px] font-bold tracking-tight border transition-all duration-300 active:scale-[0.98]
                ${ctx.formData.localNiche === s ? 'bg-[#111111] border-[#111111] text-white shadow-xl' : 'bg-white border-black/[0.08] text-black/[0.60] hover:border-black/[0.2] hover:text-black hover:bg-gray-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative group max-w-[500px] mx-auto">
          <label className="block text-[11px] font-bold tracking-widest text-black/[0.3] uppercase mb-4 ml-1 transition-colors group-focus-within:text-black">Other / Not Listed</label>
          <input 
            type="text" value={["Automotive", "Food & Beverage", "Home Services", "Health & Wellness", "Professional Services"].includes(ctx.formData.localNiche) ? '' : ctx.formData.localNiche} 
            onChange={e => ctx.updateForm('localNiche', e.target.value)}
            className="w-full bg-white border border-black/[0.08] rounded-2xl px-6 py-5 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-base sm:text-lg placeholder:text-black/[0.2] shadow-sm"
            placeholder="Specify your niche..."
          />
        </div>
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={ctx.formData.localNiche !== ''} />
    </StepContainer>
  );
}

const LB_Step3_Objective: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="lb-o">
      <Header title="Primary Objective" subtitle="If a hundred people visit your digital storefront today, what is the #1 core action they must take?" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto w-full mb-8">
        <CardSelection 
          icon={RefreshCw} title="Direct Calls"
          description="Optimized to make viewers call my business instantly from mobile."
          selected={ctx.formData.conversionMetric === 'call'}
          onClick={() => { ctx.updateForm('conversionMetric', 'call'); ctx.nextStep(); }}
        />
        <CardSelection 
          icon={Globe} title="Appointments"
          description="I need them to fill out a form or select a time slot on my calendar."
          selected={ctx.formData.conversionMetric === 'book'}
          onClick={() => { ctx.updateForm('conversionMetric', 'book'); ctx.nextStep(); }}
        />
        <CardSelection 
          icon={Search} title="Walk-Ins"
          description="I need them to look at my menu and drive directly to my physical location."
          selected={ctx.formData.conversionMetric === 'walk'}
          onClick={() => { ctx.updateForm('conversionMetric', 'walk'); ctx.nextStep(); }}
        />
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={ctx.formData.conversionMetric !== ''} />
    </StepContainer>
  );
}

const LB_Step4_Architecture: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="lb-a">
      <Header title="Architecture Decision" subtitle="Most local businesses use outdated software. Apex builds custom funnels that outrank competitors." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto w-full mb-8">
        <CardSelection 
          icon={Zap} title="Local Dominator"
          badge="High Velocity"
          description="Blazing-fast static site. Zero bloat, instant loading, heavily favored by Google."
          pros="Dominates local search."
          selected={ctx.formData.leadEngineChoice === 'dominator'}
          onClick={() => { ctx.updateForm('leadEngineChoice', 'dominator'); ctx.nextStep(); }}
        />
        <CardSelection 
          icon={Globe} title="Traditional Multi-Page"
          description="A heavier website with multiple informational pages (About, Team, History)."
          pros="Informative but slower."
          selected={ctx.formData.leadEngineChoice === 'standard'}
          onClick={() => { ctx.updateForm('leadEngineChoice', 'standard'); ctx.nextStep(); }}
        />
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={ctx.formData.leadEngineChoice !== ''} />
    </StepContainer>
  );
}

const LB_Step5_AILocal: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="lb-ai">
      <Header title="Activate Apex AI?" subtitle="Your website drives the traffic; our AI ensures you never drop a lead." />
      <div className="max-w-[700px] mx-auto w-full mb-10">
        <div className="p-8 sm:p-12 rounded-[40px] bg-white border border-black/[0.08] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <ToggleOption 
              title="AI Missed-Call Text Back"
              desc="Apex AI instantly sends an SMS if you miss a call: 'Hi, we are on the other line! How can we help?'"
              selected={ctx.formData.missedCallAI}
              onToggle={() => ctx.updateForm('missedCallAI', !ctx.formData.missedCallAI)}
            />
            <ToggleOption 
              title="AI Google Review Responder"
              desc="Automatically reply to Google Maps reviews to skyrocket your local ranking."
              selected={ctx.formData.reviewResponderAI}
              onToggle={() => ctx.updateForm('reviewResponderAI', !ctx.formData.reviewResponderAI)}
            />
          </div>
        </div>
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={true} />
    </StepContainer>
  );
}

// --- Real Estate Flow Steps ---

const RE_Step2_Identity: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="re-id">
      <Header title="Sector Identified" subtitle="Let’s map out your market position. Are you operating as an independent agent or building a brokerage?" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto w-full mb-8">
        <CardSelection 
          icon={Users} title="Independent Agent"
          description="I am building my personal brand and generating my own leads."
          selected={ctx.formData.brokerageType === 'solo'}
          onClick={() => { ctx.updateForm('brokerageType', 'solo'); ctx.nextStep(); }}
        />
        <CardSelection 
          icon={Building2} title="Agency / Brokerage"
          description="I manage a team of agents and need a centralized distribution system."
          selected={ctx.formData.brokerageType === 'brokerage'}
          onClick={() => { ctx.updateForm('brokerageType', 'brokerage'); ctx.nextStep(); }}
        />
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={ctx.formData.brokerageType !== ''} />
    </StepContainer>
  );
}

const RE_Step3_Portfolio: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="re-port">
      <Header title="Primary Asset Class" subtitle="This helps our AI understand the demographic for target lead generation." />
      <div className="max-w-[800px] mx-auto w-full mb-12">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {["Luxury Residential", "Standard Residential", "Commercial RE", "Investment", "Prop Management"].map(asset => (
            <button
              key={asset}
              onClick={() => ctx.toggleArrayItem('assetClasses', asset)}
              className={`px-6 sm:px-8 py-5 rounded-full text-[13px] sm:text-[14px] font-bold transition-all duration-300 active:scale-[0.98] border
                ${ctx.formData.assetClasses.includes(asset) ? 'border-[#111111] bg-[#111111] text-white shadow-xl' : 'border-black/[0.08] bg-white text-black/[0.6] hover:bg-gray-50 hover:text-black'}`}
            >
              {asset}
            </button>
          ))}
        </div>
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={ctx.formData.assetClasses.length > 0} />
    </StepContainer>
  );
}

const RE_Step4_LeadEngine: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="re-LE">
      <Header title="Lead Architecture" subtitle="A website should not be a brochure; it must be an unstoppable conversion engine." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto w-full mb-8">
        <CardSelection 
          icon={Zap} title="Agent Funnel"
          badge="High Output"
          description="A lightning-fast, custom-coded page designed purely to capture localized leads."
          selected={ctx.formData.leadEngineChoice === 'vercel'}
          onClick={() => { ctx.updateForm('leadEngineChoice', 'vercel'); ctx.nextStep(); }}
        />
        <CardSelection 
          icon={Search} title="Full IDX Portal"
          description="A complex site allowing users to search every property on the MLS market."
          selected={ctx.formData.leadEngineChoice === 'mls'}
          onClick={() => { ctx.updateForm('leadEngineChoice', 'mls'); ctx.nextStep(); }}
        />
        <CardSelection 
          icon={Brain} title="Strategic Elite"
          description="Analyze my market focus and deploy the most profitable architectural stack."
          selected={ctx.formData.leadEngineChoice === 'expert'}
          onClick={() => { ctx.updateForm('leadEngineChoice', 'expert'); ctx.nextStep(); }}
          isExpert
        />
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={ctx.formData.leadEngineChoice !== ''} />
    </StepContainer>
  );
}

const Step_ApexAIRing: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="apex-ring">
      <Header title="Apex AI Engine Integration" subtitle="Our flagship 24/7 Inside Sales Agent (ISA) works tirelessly behind your storefront." />
      <div className="max-w-[700px] mx-auto w-full mb-10">
        <div className="p-8 sm:p-12 rounded-[40px] bg-white border border-black/[0.08] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6">
             <RefreshCw className="w-10 h-10 text-black/[0.04] animate-spin-slow" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-8 uppercase tracking-[-0.03em] text-[#111111]">Advanced ISA Systems</h3>
            <div className="space-y-4">
              <ToggleOption 
                title="AI Real-Time Qualifier"
                desc="Instantly engage leads via SMS, verify budgets, and schedule property viewings."
                selected={ctx.formData.aiLeadQualifier}
                onToggle={() => ctx.updateForm('aiLeadQualifier', !ctx.formData.aiLeadQualifier)}
              />
              <ToggleOption 
                title="Automated CRM Sync"
                desc="Native, instant sync to Follow Up Boss, GHL, or Hubspot pipelines."
                selected={ctx.formData.crmAutomation}
                onToggle={() => ctx.updateForm('crmAutomation', !ctx.formData.crmAutomation)}
              />
            </div>
          </div>
        </div>
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={true} />
    </StepContainer>
  );
}

// --- Fashion Flow Snippets ---

const Fashion_Step2_BusinessModel: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="f-biz">
      <Header title="Operating Model" subtitle="Select your primary fulfillment strategy." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto mb-10">
        <CardSelection title="Retail / B2C" description="High-volume direct-to-consumer pipelines." selected={ctx.formData.businessModel === 'retail'} onClick={() => {ctx.updateForm('businessModel', 'retail'); ctx.nextStep()}} icon={Users} />
        <CardSelection title="Bulk / Wholesale" description="Focusing on B2B volume transactions & partnerships." selected={ctx.formData.businessModel === 'wholesale'} onClick={() => {ctx.updateForm('businessModel', 'wholesale'); ctx.nextStep()}} icon={Box} />
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={ctx.formData.businessModel !== ''} />
    </StepContainer>
  );
}

const Fashion_Step3_Architecture: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="f-arch">
      <Header title="Digital Shelves" subtitle="Choose structural navigation categories." />
      <div className="max-w-[800px] mx-auto flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
        {["Women's RTW", "Couture", "Men's Luxury", "Accessories", "Bespoke Orders"].map(c => (
           <button key={c} onClick={() => ctx.toggleArrayItem('categories', c)} className={`px-6 sm:px-8 py-5 rounded-full text-[13px] sm:text-[14px] font-bold transition-all duration-300 active:scale-[0.98] border ${ctx.formData.categories.includes(c) ? 'bg-[#111111] border-[#111111] text-white shadow-xl' : 'bg-white border-black/[0.08] text-black/[0.6] hover:text-black hover:bg-gray-50'}`}>{c}</button>
        ))}
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={ctx.formData.categories.length > 0} />
    </StepContainer>
  );
}

const Fashion_Step4_CustomerJourney: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="f-journey">
      <Header title="Transaction Stack" subtitle="Define the client checkout interaction." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-[1000px] mx-auto">
        <CardSelection icon={MessageCircle} title="WhatsApp Funnel" description="Zero friction, instant high-touch concierge styling." selected={ctx.formData.systemChoice === 'wa'} onClick={() => {ctx.updateForm('systemChoice','wa'); ctx.nextStep()}} />
        <CardSelection icon={ShoppingCart} title="Integrated E-Cart" description="Globally automated payments & fulfillment processing." selected={ctx.formData.systemChoice === 'cart'} onClick={() => {ctx.updateForm('systemChoice', 'cart'); ctx.nextStep()}} />
        <CardSelection icon={Sparkles} title="Expert Blueprint" description="Let our architects decide the highest converting system." selected={ctx.formData.systemChoice === 'exp'} onClick={() => {ctx.updateForm('systemChoice', 'exp'); ctx.nextStep()}} isExpert />
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={ctx.formData.systemChoice !== ''} />
    </StepContainer>
  );
}

const Fashion_Step5_Features: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="f-features">
      <Header title="Premium Upgrades" subtitle="Select bespoke operational enhancements." />
      <div className="max-w-[700px] mx-auto space-y-4 mb-12">
        <ToggleOption title="Advanced Sizing Algorithm" selected={ctx.formData.features.includes('size')} onToggle={() => ctx.toggleArrayItem('features', 'size')} />
        <ToggleOption title="Bespoke Measurement Portals" selected={ctx.formData.features.includes('meas')} onToggle={() => ctx.toggleArrayItem('features', 'meas')} />
        <ToggleOption title="Apex AI Fashion Stylist" selected={ctx.formData.features.includes('ai')} onToggle={() => ctx.toggleArrayItem('features', 'ai')} />
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={true} />
    </StepContainer>
  );
}

const Fashion_Step6_VisualStrategy: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="f-vis">
      <Header title="Visual Pipeline" subtitle="Choose your luxury rendering style." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-[1000px] mx-auto">
        <CardSelection icon={Camera} title="High-Res Stills" selected={ctx.formData.visualChoice === 'img'} onClick={() => ctx.updateForm('visualChoice', 'img')} />
        <CardSelection icon={Video} title="Cinematic Video" selected={ctx.formData.visualChoice === 'vid'} onClick={() => ctx.updateForm('visualChoice', 'vid')} />
        <CardSelection icon={Sparkles} title="Mixed Media" selected={ctx.formData.visualChoice === 'exp'} onClick={() => ctx.updateForm('visualChoice', 'exp')} isExpert />
      </div>
      <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={ctx.formData.visualChoice !== ''} />
    </StepContainer>
  );
}

// --- Global Remaining Steps ---

const EcosystemSelection: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="ecosystem">
      <Header title="Finalize Blueprint" subtitle="Deploy a ready-made framework or command a bespoke architecture." />
      
      <div className="flex justify-center mb-10 px-2 mt-4">
        <div className="flex bg-[#F4F4F5] p-2 rounded-full w-full max-w-[500px] overflow-hidden drop-shadow-sm border border-black/[0.03]">
          {(['bundles', 'custom', 'expert'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => ctx.updateForm('selectionMode', mode)}
              className={`flex-1 py-3.5 px-3 rounded-full text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-95
                ${ctx.formData.selectionMode === mode 
                  ? 'bg-white text-black shadow-[0_4px_12px_rgba(0,0,0,0.06)]' 
                  : 'text-black/[0.4] hover:text-black/[0.8]'}`}
            >
              {mode === 'bundles' ? 'Bundles' : mode === 'custom' ? 'Custom' : 'Concierge'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {ctx.formData.selectionMode === 'bundles' && (
          <motion.div key="bund" initial={{ opacity:0, y: 10, filter: 'blur(5px)' }} animate={{ opacity:1, y: 0, filter: 'blur(0px)' }} exit={{opacity:0, y:-10}} transition={{duration:0.3}} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 max-w-[1100px] mx-auto w-full">
            <TierCard 
              title={ctx.formData.industry === 'real_estate' ? "Digital Agent" : ctx.formData.industry === 'service' ? "Footprint" : "Foundation"}
              goal={ctx.formData.industry === 'service' ? "A rapid, high-speed modern presence." : "Establish premium minimum viable presence."}
              features={ctx.formData.industry === 'real_estate' ? ["Vercel Landing Page", "Custom Domain", "Basic Lead Form"] : ctx.formData.industry === 'service' ? ["Vercel Landing Page", "Tap-to-[Call/Book]", "Contact DB"] : ["Mobile Web Store", "WhatsApp Link", "Domain Setup"]}
              selected={ctx.formData.selectedTier === 't1'}
              onClick={() => ctx.updateForm('selectedTier', 't1')}
            />
            <TierCard 
              title={ctx.formData.industry === 'real_estate' ? "Conversion Engine" : ctx.formData.industry === 'service' ? "Authority" : "Launchpad"}
              goal={ctx.formData.industry === 'service' ? "Rank high on local maps and capture traffic." : "Capture, verify, and engage leads instantly."}
              features={ctx.formData.industry === 'real_estate' ? ["Tier 1 + SMS Welcome", "Pixel Tracking", "Bio-Link Setup"] : ctx.formData.industry === 'service' ? ["Tier 1 + Local SEO", "Service Integrations", "Lead Filters"] : ["Tier 1 + Social Sync", "Email Welcome Flow", "Brand Assets"]}
              selected={ctx.formData.selectedTier === 't2'}
              onClick={() => ctx.updateForm('selectedTier', 't2')}
            />
            <TierCard 
              title={ctx.formData.industry === 'service' ? "Apex Machine" : "Apex Elite"}
              badge="Flagship"
              recommended
              goal={ctx.formData.industry === 'service' ? "Never lose a local inbound lead again." : "A fully autonomous growth machine."}
              features={ctx.formData.industry === 'real_estate' ? ["Tier 2 + AI Engine", "24/7 Text ISA", "Auto-Flow"] : ctx.formData.industry === 'service' ? ["Tier 2 + Tech Pipeline", "Missed-Call AI", "Loads Alerting"] : ["Tier 2 + AI Content", "Store Automation", "Concierge"]}
              selected={ctx.formData.selectedTier === 't3'}
              onClick={() => ctx.updateForm('selectedTier', 't3')}
            />
          </motion.div>
        )}

        {ctx.formData.selectionMode === 'custom' && (
          <motion.div key="cust" initial={{ opacity:0, y: 10, filter: 'blur(5px)' }} animate={{ opacity:1, y: 0, filter: 'blur(0px)' }} exit={{opacity:0, y:-10}} transition={{duration:0.3}} className="max-w-[800px] mx-auto w-full mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(ctx.formData.industry === 'real_estate' 
              ? ['Vercel Web Core', 'AI Conversions', 'CRM Relays', 'SEO Network', 'Media Streaming'] 
              : ctx.formData.industry === 'service'
                ? ['High-Velocity Core', 'Service Map Sync', 'Twilio Missed-Call', 'Review Autopilot']
                : ['E-Commerce Core', 'Checkout Tech', 'Social APIs', 'Search Rank AI', 'AI Support Team']).map(svc => (
              <CustomServiceToggle 
                key={svc} title={svc} selected={ctx.formData.customServices.includes(svc)}
                onToggle={() => ctx.toggleArrayItem('customServices', svc)}
              />
            ))}
          </motion.div>
        )}

        {ctx.formData.selectionMode === 'expert' && (
          <motion.div key="exp" initial={{ opacity:0, y: 10, filter: 'blur(5px)' }} animate={{ opacity:1, y: 0, filter: 'blur(0px)' }} exit={{opacity:0, y:-10}} transition={{duration:0.3}} className="max-w-[700px] mx-auto w-full text-center py-20 px-8 border border-black/[0.08] shadow-sm rounded-[40px] bg-white">
            <Brain className="w-16 h-16 text-black/[0.1] mx-auto mb-6" strokeWidth={1} />
            <h3 className="text-2xl font-black uppercase tracking-[-0.03em] mb-4 text-[#111111]">Apex Concierge Design</h3>
            <p className="text-black/[0.5] text-lg leading-relaxed mb-10">"Allow our master engineers to review competitors in your space and design an architectural bypass specifically for your operation."</p>
            <button onClick={ctx.nextStep} className="bg-[#111111] text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-[12px] md:text-[13px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all">Proceed to Commute</button>
          </motion.div>
        )}
      </AnimatePresence>
      {ctx.formData.selectionMode !== 'expert' && <NavigationButtons nextStep={ctx.nextStep} prevStep={ctx.prevStep} valid={ctx.formData.selectedTier !== '' || ctx.formData.customServices.length > 0} />}
    </StepContainer>
  );
}

const FinalReview: React.FC<{ ctx: FlowCtx }> = ({ ctx }) => {
  return (
    <StepContainer id="final">
      <div className="flex flex-col items-center text-center justify-center max-w-[700px] mx-auto w-full flex-grow py-12">
        <h2 className="text-[48px] md:text-[64px] font-black tracking-[-0.05em] uppercase mb-6 text-[#111111] leading-none">Deploy Systems</h2>
        <div className="bg-white border text-center border-black/[0.06] rounded-[40px] p-10 md:p-14 mb-12 w-full shadow-[0_30px_60px_-20px_rgba(0,0,0,0.05)]">
          <p className="text-[18px] md:text-[20px] text-black/[0.6] leading-relaxed font-medium">
            "By deploying, you initiate the Apex synchronization sequence. Our senior engineers will ingest your architecture within 12 hours. Welcome to the elite tier."
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <button onClick={ctx.prevStep} className="order-2 sm:order-1 px-10 py-5 text-black/[0.4] text-[12px] font-bold uppercase tracking-widest hover:text-black transition-colors">Review Structure</button>
          <button 
            onClick={ctx.submitToWebhook}
            disabled={ctx.isSubmitting}
            className="order-1 sm:order-2 px-16 py-6 bg-[#111111] text-white rounded-[20px] text-[13px] font-black uppercase tracking-[0.3em] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-center"
          >
            {ctx.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Execute Deployment'}
          </button>
        </div>
      </div>
    </StepContainer>
  );
}

const SuccessScreen: React.FC<{ ctx?: FlowCtx }> = () => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{type:'spring', duration:1}} className="flex flex-col items-center text-center justify-center py-20 md:py-32 px-6">
      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring', damping:15, delay:0.2}} className="w-28 h-28 bg-[#111111] rounded-full flex items-center justify-center mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
      </motion.div>
      <motion.h2 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.3}} className="text-[52px] md:text-[72px] font-black tracking-[-0.05em] uppercase mb-4 text-[#111111] leading-none">Command Received.</motion.h2>
      <motion.p initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.4}} className="text-[20px] text-black/[0.5] max-w-[550px] font-medium leading-relaxed">System architecture synchronization in progress. Our lead architects will establish comms shortly.</motion.p>
    </motion.div>
  );
}

// --- Internal UI Primitives ---

function StepContainer({ children, id }: { children: React.ReactNode, id: string }) {
  return (
    <motion.div 
      key={id} 
      initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }} 
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} 
      exit={{ opacity: 0, filter: 'blur(8px)', y: -20, position:'absolute', width:'100%' }} 
      transition={{ type: 'spring', stiffness: 350, damping: 30 }} 
      className="w-full flex-grow flex flex-col items-center relative"
    >
      <div className="w-full max-w-full flex-grow flex flex-col">
        {children}
      </div>
    </motion.div>
  )
}

function Header({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="text-center mb-12 md:mb-20 px-2 mt-4 sm:mt-8 relative w-full">
      <h2 className="text-[38px] sm:text-[52px] md:text-[68px] font-black tracking-[-0.04em] leading-[1.05] mb-6 text-[#111111]">{title}</h2>
      <p className="text-[17px] md:text-[20px] text-black/[0.5] max-w-[800px] mx-auto leading-relaxed font-medium tracking-tight">{subtitle}</p>
    </div>
  )
}

function InputField({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="w-full relative group">
      <label className="block text-[11px] font-bold tracking-widest text-black/[0.3] uppercase mb-4 ml-1 transition-colors group-focus-within:text-black">{label}</label>
      <input 
        type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-black/[0.08] rounded-2xl px-6 py-5 sm:px-8 sm:py-6 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-base sm:text-xl placeholder:text-black/[0.2] shadow-sm appearance-none"
        placeholder={placeholder}
      />
    </div>
  )
}

function ProtocolCard({ title, icon: Icon, selected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-8 md:p-10 rounded-[32px] sm:rounded-[40px] border cursor-pointer transition-all duration-300 flex flex-col items-center gap-6 text-center active:scale-[0.98]
        ${selected ? 'bg-[#111111] border-[#111111] text-white shadow-2xl' : 'bg-white border-black/[0.06] text-black/[0.4] hover:border-black/[0.15] hover:text-black hover:bg-[#FAFAFA]'}`}
    >
      <Icon className={`w-12 h-12 ${selected ? 'text-white' : 'text-current opacity-60'}`} strokeWidth={1.5} />
      <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-widest leading-none">{title}</span>
    </div>
  )
}

function CardSelection({ icon: Icon, title, badge, description, pros, selected, onClick, isExpert }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-8 md:p-10 rounded-[36px] sm:rounded-[44px] border transition-all duration-300 cursor-pointer flex flex-col min-h-[300px] sm:min-h-[340px] relative overflow-hidden group active:scale-[0.98]
        ${selected ? 'bg-[#111111] text-white border-[#111111] shadow-2xl' : 'bg-white text-black/[0.6] border-black/[0.06] hover:border-black/[0.15] hover:bg-[#FAFAFA]'}
      `}
    >
      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 sm:mb-10 ring-1 transition-all duration-300 ${selected ? 'bg-white/10 text-white ring-white/20 shadow-inner' : 'bg-black/[0.03] ring-black/[0.08] text-black/[0.4]'}`}>
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h3 className="text-[22px] sm:text-2xl font-black mb-4 uppercase tracking-[-0.03em] leading-tight text-current">{title}</h3>
      {badge && <div className="text-[10px] font-bold bg-[#111111]/10 text-[#111111] px-3.5 py-1.5 rounded-full inline-block w-fit mb-5 tracking-wide uppercase border border-black/[0.05]">{badge}</div>}
      <p className={`text-[15px] sm:text-base leading-relaxed mb-8 opacity-80 ${selected ? 'font-light' : 'font-medium'}`}>{description}</p>
      {pros && <div className={`text-[11px] font-bold mt-auto pt-6 border-t tracking-wide uppercase ${selected ? 'border-white/10 text-white/70' : 'border-black/[0.06] text-black/[0.4]'}`}>– {pros}</div>}
      {isExpert && <Brain className="absolute -bottom-12 -right-12 w-48 h-48 opacity-[0.03] pointer-events-none" />}
    </div>
  )
}

function ToggleOption({ title, desc, selected, onToggle }: any) {
  return (
    <div onClick={onToggle} className={`flex items-start gap-4 sm:gap-6 p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] border cursor-pointer transition-all duration-300 active:scale-[0.99] ${selected ? 'border-[#111111] bg-[#111111] text-white shadow-xl' : 'border-black/[0.06] bg-white hover:border-black/[0.15] hover:bg-[#FAFAFA]'}`}>
       <div className={`mt-1 shrink-0 flex items-center transition-all ${selected ? 'text-white' : 'text-black/[0.2]'}`}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${selected ? 'bg-white border-white text-black' : 'border-black/[0.2] bg-transparent text-transparent'}`}>
            <CheckCircle className="w-5 h-5 shrink-0" strokeWidth={3} />
          </div>
       </div>
       <div>
         <h4 className="text-[17px] sm:text-lg font-black tracking-[-0.02em] mb-2 leading-none">{title}</h4>
         {desc && <p className={`text-[14px] sm:text-[15px] leading-relaxed ${selected ? 'text-white/70 font-light' : 'text-black/[0.5] font-medium'}`}>{desc}</p>}
       </div>
    </div>
  )
}

function CustomServiceToggle({ title, selected, onToggle }: any) {
  return (
    <div onClick={onToggle} className={`p-6 sm:p-8 rounded-[28px] border cursor-pointer transition-all duration-300 flex justify-between items-center active:scale-[0.98] ${selected ? 'border-[#111111] bg-[#111111] text-white shadow-lg' : 'border-black/[0.06] bg-white hover:border-black/[0.15] hover:bg-[#FAFAFA]'}`}>
       <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-widest">{title}</span>
       <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-white bg-white text-[#111111]' : 'border-black/[0.1] text-transparent'}`}>
          <CheckCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
       </div>
    </div>
  )
}

function TierCard({ title, badge, goal, features, selected, onClick, recommended }: any) {
  return (
    <div onClick={onClick} className={`p-8 sm:p-10 rounded-[40px] sm:rounded-[48px] border cursor-pointer flex flex-col transition-all duration-300 relative active:scale-[0.98] ${selected ? 'bg-[#111111] text-white border-[#111111] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]' : 'bg-white text-[#111111] border-black/[0.06] shadow-sm hover:border-black/[0.15] hover:bg-[#fafafa]'}`}>
      {badge && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#111111] text-white border border-white/20 text-[10px] sm:text-[11px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
        {badge}
      </div>}
      <h3 className="text-2xl sm:text-[28px] font-black uppercase mb-6 text-center tracking-[-0.04em] leading-none">{title}</h3>
      <p className={`text-[13px] font-medium mb-8 text-center pb-8 border-b leading-relaxed ${selected ? 'border-white/10 text-white/70' : 'border-black/[0.08] text-black/[0.5]'}`}>{goal}</p>
      <ul className="space-y-6 mb-10 flex-grow">
        {features.map((f: string) => (
          <li key={f} className="flex items-start gap-4 text-[14px] sm:text-[15px] leading-snug font-medium">
            <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selected ? 'text-white' : 'text-[#111111]'}`} strokeWidth={2} />
            <span className={selected ? "opacity-90" : "opacity-80"}>{f}</span>
          </li>
        ))}
      </ul>
      <button className={`py-5 rounded-2xl sm:rounded-3xl text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${selected ? 'bg-white text-[#111111] shadow-lg' : 'bg-black/[0.04] text-black/[0.4] hover:text-[#111111] hover:bg-black/[0.08]'}`}>
        {selected ? 'System Active' : 'Select Frame'}
      </button>
    </div>
  )
}

function NavigationButtons({ nextStep, prevStep, valid, hideBack = false }: any) {
  return (
    <div className="mt-auto pt-10 sm:pt-14 flex flex-col sm:flex-row justify-between items-center w-full px-2 sm:px-4 gap-6 relative z-10 w-full pb-4">
       {!hideBack ? (
         <button onClick={prevStep} className="order-2 sm:order-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.3em] text-black/[0.4] hover:text-[#111111] transition-colors py-4 px-6 w-full sm:w-auto text-center">Previous Phase</button>
       ) : <div className="hidden sm:block order-1" />}
       <button 
         onClick={nextStep} disabled={!valid}
         className="order-1 sm:order-2 group w-full sm:w-auto flex items-center justify-center gap-4 sm:gap-6 px-10 sm:px-14 py-6 sm:py-7 bg-[#111111] text-white rounded-[24px] text-[12px] sm:text-[13px] font-black uppercase tracking-[0.3em] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(0,0,0,0.15)] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
       >
         {valid ? 'Establish Link' : 'Awaiting Data'}
         <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
       </button>
    </div>
  )
}
